
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";
import Stripe from "https://esm.sh/stripe@14.5.0?dts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log("create-assessment-payment function started");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight request");
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    console.log("Parsing request body");
    const { purchaseType = "single" } = await req.json();
    console.log(`Purchase type: ${purchaseType}`);
    
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
    console.log(`Stripe key starts with: ${stripeKey.substring(0, 3)}...`); // Partial logging for security

    // Initialize Supabase client with service role key for database operations
    const supabaseServer = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });
    
    console.log("Supabase server client initialized");
    
    // Initialize Supabase client with user's JWT for user identification
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.log("No Authorization header found");
      throw new Error("Missing Authorization header");
    }
    
    // Get authenticated user
    const token = authHeader.replace("Bearer ", "");
    console.log("Getting user from auth token");
    const { data: { user }, error: userError } = await supabaseServer.auth.getUser(token);
    
    if (userError) {
      console.error("User auth error:", userError);
      throw new Error("Unauthorized: " + userError.message);
    }
    
    if (!user) {
      console.log("No user found with token");
      throw new Error("Unauthorized");
    }
    
    console.log(`User authenticated: ${user.id}`);
    
    // Set up Stripe with proper error handling
    console.log("Initializing Stripe client");
    let stripe;
    try {
      // IMPORTANT: The prefix should be 'sk_' for secret keys, not 'rk_'
      if (stripeKey.startsWith('rk_')) {
        console.error("Invalid key format: Stripe key should start with 'sk_', not 'rk_'");
        throw new Error("Invalid Stripe key format");
      }
      
      stripe = new Stripe(stripeKey, {
        apiVersion: "2023-10-16",
      });
      console.log("Stripe client initialized successfully");
    } catch (stripeInitError) {
      console.error("Error initializing Stripe:", stripeInitError);
      throw new Error("Failed to initialize payment provider: " + stripeInitError.message);
    }
    
    // Set up pricing based on purchase type
    let amount = 299; // $2.99 for single purchase
    let credits = 1;
    let name = "Single Assessment Credit";
    
    if (purchaseType === "bundle") {
      amount = 799; // $7.99 for bundle purchase
      credits = 3;
      name = "Bundle: 3 Assessment Credits";
    }
    
    console.log(`Setting up pricing: ${amount} cents for ${credits} credits`);
    
    // Get origin for URLs
    const origin = req.headers.get("origin") || "http://localhost:3000";
    console.log(`Using origin for URLs: ${origin}`);
    
    // Create a Stripe Checkout session with detailed error handling
    let session;
    try {
      console.log("Creating Stripe checkout session");
      session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: name,
                description: purchaseType === "bundle" 
                  ? "Bundle of 3 Who Am I? assessment credits" 
                  : "Single Who Am I? assessment credit",
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${origin}/assessment-payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/assessment-intro`,
      });
      
      console.log(`Stripe session created with ID: ${session.id}`);
    } catch (checkoutError) {
      console.error("Stripe checkout creation error:", checkoutError);
      const errorMessage = checkoutError instanceof Error 
        ? checkoutError.message 
        : JSON.stringify(checkoutError);
      throw new Error("Failed to create checkout session: " + errorMessage);
    }
    
    // Record the pending purchase in our database
    try {
      console.log("Recording purchase in database");
      const { error: insertError } = await supabaseServer
        .from("assessment_purchases")
        .insert({
          user_id: user.id,
          amount: amount / 100, // Convert cents to dollars for storage
          payment_session_id: session.id,
          credits: credits,
          purchase_type: purchaseType,
          status: "pending"
        });
        
      if (insertError) {
        console.error("Error recording purchase:", insertError);
        // Continue anyway as we don't want to block the payment flow
      } else {
        console.log("Purchase recorded successfully");
      }
    } catch (dbError) {
      console.error("Database error when recording purchase:", dbError);
      // Continue with checkout even if recording fails
    }
    
    // Return checkout URL to client
    console.log("Returning checkout URL to client");
    return new Response(
      JSON.stringify({ 
        url: session.url,
        sessionId: session.id
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`Error in create-assessment-payment: ${errorMessage}`);
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
