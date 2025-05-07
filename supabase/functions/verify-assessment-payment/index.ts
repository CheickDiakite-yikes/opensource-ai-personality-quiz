
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { corsHeaders } from "../_shared/cors.ts";

// Helper logging function
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VERIFY-ASSESSMENT-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");
    
    // Get Stripe secret key
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      logStep("ERROR: Missing Stripe secret key");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Stripe secret key not configured",
          details: "STRIPE_SECRET_KEY environment variable is not set"
        }),
        {
          status: 200,  // We return 200 even for errors to allow the front-end to handle it
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    // Validate the Stripe key format
    const keyPrefix = stripeKey.slice(0, 3);
    let keyType = "unknown";
    
    if (!stripeKey.startsWith("sk_")) {
      logStep("ERROR: Invalid Stripe key format", { prefix: keyPrefix });
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Invalid Stripe key format",
          details: `Key should start with sk_, but starts with ${keyPrefix}`,
          keyType: keyPrefix
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    if (stripeKey.startsWith("sk_test_")) {
      keyType = "test";
    } else if (stripeKey.startsWith("sk_live_")) {
      keyType = "live";
    }
    
    logStep("Stripe key format validated", { type: keyType });

    // Check if debug mode is enabled
    const requestData = await req.json();
    const isDebug = requestData.debug === true;
    
    if (isDebug) {
      logStep("Debug mode enabled, returning key info");
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Stripe key format is valid",
          keyType: keyType,
          details: `Key prefix: ${keyPrefix}, Key type: ${keyType}`
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Initialize Stripe client
    try {
      const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
      
      // Perform a basic API call to verify the key works
      const customer = await stripe.customers.list({ limit: 1 });
      logStep("Stripe API call successful", { 
        customerCount: customer.data.length 
      });
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Stripe configuration is valid",
          keyType: keyType
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } catch (stripeError) {
      logStep("ERROR: Stripe API call failed", { 
        error: stripeError instanceof Error ? stripeError.message : String(stripeError)
      });
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Stripe API call failed",
          details: stripeError instanceof Error ? stripeError.message : String(stripeError),
          keyType: keyType
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

  } catch (error) {
    logStep("ERROR: Unexpected exception", { 
      error: error instanceof Error ? error.message : String(error)
    });
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Unexpected error verifying Stripe configuration",
        details: error instanceof Error ? error.message : String(error)
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
