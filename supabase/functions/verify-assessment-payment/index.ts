
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";
import Stripe from "https://esm.sh/stripe@14.5.0?dts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log("verify-assessment-payment function started");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight request");
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    console.log("Parsing request body");
    const { sessionId } = await req.json();
    
    if (!sessionId) {
      console.log("No sessionId provided in request");
      throw new Error("Missing session ID");
    }
    
    console.log(`Verifying payment for session: ${sessionId}`);
    
    // Check for required environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    
    if (!supabaseUrl) console.log("Missing SUPABASE_URL");
    if (!supabaseServiceKey) console.log("Missing SUPABASE_SERVICE_ROLE_KEY");
    if (!stripeKey) console.log("Missing STRIPE_SECRET_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey || !stripeKey) {
      throw new Error("Missing required environment variables");
    }
    
    console.log("Environment variables verified");
    console.log(`Stripe key format check: starts with ${stripeKey.substring(0, 3)}, length: ${stripeKey.length}`);
    
    if (!stripeKey.startsWith('sk_')) {
      console.error("Invalid key format: Stripe key should start with 'sk_'");
      throw new Error("Invalid Stripe key format: Secret key must start with 'sk_'");
    }
    
    // Initialize Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });
    
    console.log("Supabase client initialized");
    
    // Set up Stripe with proper error handling
    console.log("Initializing Stripe client");
    let stripe;
    try {
      stripe = new Stripe(stripeKey, {
        apiVersion: "2023-10-16", 
      });
      
      // Test the Stripe connection with a simple API call
      console.log("Testing Stripe connection");
      await stripe.paymentMethods.list({ customer: "nonexistent_customer", type: "card", limit: 1 }).catch(error => {
        // This will fail, but we just want to check if the API key works
        if (error.type === 'StripeAuthenticationError') {
          console.error("Stripe authentication error - invalid API key");
          throw new Error("Invalid Stripe API key: Authentication failed");
        }
      });
      
      console.log("Stripe client initialized successfully");
    } catch (stripeInitError) {
      console.error("Error initializing Stripe:", stripeInitError);
      throw new Error("Failed to initialize payment provider: " + stripeInitError.message);
    }
    
    // Verify the checkout session with Stripe
    console.log("Retrieving checkout session from Stripe");
    let session;
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId);
      console.log(`Retrieved session with payment status: ${session.payment_status}`);
    } catch (retrieveError) {
      console.error("Error retrieving Stripe session:", retrieveError);
      
      // Check for specific error types
      if (retrieveError.type === 'StripeAuthenticationError') {
        throw new Error("Invalid Stripe API key: Authentication failed");
      } else if (retrieveError.type === 'StripeInvalidRequestError') {
        throw new Error(`Invalid session ID: ${retrieveError.message}`);
      }
      
      throw new Error(`Failed to retrieve payment session: ${retrieveError.message}`);
    }
    
    if (!session) {
      console.log("No session found with provided ID");
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Payment session not found" 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log(`Session payment status: ${session.payment_status}`);
    
    if (session.payment_status !== "paid") {
      console.log("Payment not completed");
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Payment not completed" 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Find the purchase record in our database
    console.log("Finding purchase record in database");
    const { data: purchase, error: purchaseError } = await supabase
      .from("assessment_purchases")
      .select("*")
      .eq("payment_session_id", sessionId)
      .single();
      
    if (purchaseError) {
      console.error("Error finding purchase record:", purchaseError);
      throw new Error(`Purchase record not found: ${purchaseError.message}`);
    }
    
    if (!purchase) {
      console.log("No purchase record found");
      throw new Error("Purchase record not found");
    }
    
    console.log(`Found purchase record for user: ${purchase.user_id}`);
    
    // Update the purchase status
    console.log("Updating purchase status to completed");
    const { error: updateError } = await supabase
      .from("assessment_purchases")
      .update({ status: "completed" })
      .eq("id", purchase.id);
      
    if (updateError) {
      console.error("Error updating purchase status:", updateError);
      throw new Error(`Failed to update purchase status: ${updateError.message}`);
    }
    
    // Update the user's credits
    console.log("Fetching user credits");
    const { data: credits, error: creditsError } = await supabase
      .from("assessment_credits")
      .select("*")
      .eq("user_id", purchase.user_id)
      .single();
      
    if (creditsError) {
      console.error("Error fetching user credits:", creditsError);
      throw new Error(`Failed to fetch user credits: ${creditsError.message}`);
    }
    
    // Calculate new credits value
    const newCreditsRemaining = (credits?.credits_remaining || 0) + purchase.credits;
    const newBundlePurchases = purchase.purchase_type === "bundle" 
      ? (credits?.bundle_purchases || 0) + 1 
      : (credits?.bundle_purchases || 0);
    
    console.log(`Updating credits: ${credits?.credits_remaining} -> ${newCreditsRemaining}`);
    console.log(`Updating bundle purchases: ${credits?.bundle_purchases} -> ${newBundlePurchases}`);
    
    // Update the credits record
    const { error: updateCreditsError } = await supabase
      .from("assessment_credits")
      .update({ 
        credits_remaining: newCreditsRemaining,
        bundle_purchases: newBundlePurchases,
        updated_at: new Date().toISOString()
      })
      .eq("user_id", purchase.user_id);
      
    if (updateCreditsError) {
      console.error("Error updating user credits:", updateCreditsError);
      throw new Error(`Failed to update user credits: ${updateCreditsError.message}`);
    }
    
    console.log("Credits updated successfully");
    
    return new Response(
      JSON.stringify({ 
        success: true,
        credits: newCreditsRemaining,
        message: "Payment verified and credits updated"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`Error in verify-assessment-payment: ${errorMessage}`);
    
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
