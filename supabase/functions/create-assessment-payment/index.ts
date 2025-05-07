
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
    const requestBody = await req.json();
    const { purchaseType = "single", debug = false, checkWebhook = false } = requestBody;
    
    console.log(`Request type: ${debug ? 'debug' : purchaseType}`);
    
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
    
    // Debug mode: just check if the Stripe key is valid and return info
    if (debug) {
      console.log("Running in debug mode to check Stripe key validity");
      console.log(`Stripe key format check: starts with ${stripeKey.substring(0, 3)}, length: ${stripeKey.length}`);
      
      if (!stripeKey.startsWith('sk_')) {
        console.error("Invalid key format: Stripe key should start with 'sk_'");
        return new Response(
          JSON.stringify({ 
            message: "Invalid Stripe key format: Secret key must start with 'sk_'",
            keyType: null 
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Initialize Stripe with the key to test connection
      try {
        console.log("Testing Stripe key validity with API call");
        const stripe = new Stripe(stripeKey, {
          apiVersion: "2023-10-16",
        });
        
        // Test the key with a simple API call
        await stripe.balance.retrieve();
        
        // Determine if we're in test or live mode
        const keyType = stripeKey.startsWith('sk_test') ? 'test' : 'live';
        console.log(`Stripe key valid (${keyType} mode)`);
        
        return new Response(
          JSON.stringify({ 
            message: `Stripe key is valid (${keyType.toUpperCase()} mode)`,
            keyType: keyType
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (stripeError) {
        console.error("Stripe key validation failed:", stripeError);
        
        // Check for specific error types
        if (stripeError.type === 'StripeAuthenticationError') {
          return new Response(
            JSON.stringify({ message: "Invalid Stripe API key: Authentication failed", keyType: null }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        return new Response(
          JSON.stringify({ message: `Stripe error: ${stripeError.message}`, keyType: null }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
    
    // Webhook check mode
    if (checkWebhook) {
      console.log("Checking webhook configuration");
      return new Response(
        JSON.stringify({ 
          webhookStatus: "Webhook endpoint check not implemented yet. Please configure manually in Stripe dashboard."
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Normal payment flow continues from here
    console.log(`Processing ${purchaseType} payment request`);
    console.log(`Stripe key format check: starts with ${stripeKey.substring(0, 3)}, length: ${stripeKey.length}`);
    
    if (!stripeKey.startsWith('sk_')) {
      console.error("Invalid key format: Stripe key should start with 'sk_'");
      throw new Error("Invalid Stripe key format: Secret key must start with 'sk_'");
    }

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
      
      // Check for specific error types and provide more helpful messages
      if (checkoutError.type === 'StripeAuthenticationError') {
        throw new Error("Invalid Stripe API key: Authentication failed");
      } else if (checkoutError.type === 'StripeConnectionError') {
        throw new Error("Could not connect to Stripe API: Network issue");
      }
      
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
