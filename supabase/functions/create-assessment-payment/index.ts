
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "../_shared/cors.ts";

// Helper logging function for enhanced debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-ASSESSMENT-PAYMENT] ${step}${detailsStr}`);
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
      throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
    }
    
    // Validate that the Stripe key starts with sk_
    if (!stripeKey.startsWith("sk_")) {
      logStep("ERROR: Invalid Stripe key format", { format: stripeKey.substring(0, 3) + "..." });
      throw new Error("Invalid Stripe key format. Must start with sk_");
    }
    
    logStep("Stripe key validated");

    // Get request body
    const requestData = await req.json();
    const returnUrl = requestData.returnUrl || "https://example.com/assessment";
    logStep("Request data parsed", { returnUrl });

    // Authenticate user
    const client = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get the JWT from the Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      logStep("ERROR: Missing Authorization header");
      throw new Error("Missing Authorization header");
    }

    const jwt = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await client.auth.getUser(jwt);
    
    if (userError || !userData.user) {
      logStep("ERROR: Authentication failed", { error: userError?.message });
      throw new Error(`Authentication failed: ${userError?.message || "User not found"}`);
    }
    
    const user = userData.user;
    logStep("User authenticated", { id: user.id, email: user.email });

    // Initialize Stripe with secret key
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    logStep("Stripe client initialized");

    // Check if customer already exists
    let customerId;
    if (user.email) {
      const customers = await stripe.customers.list({
        email: user.email,
        limit: 1,
      });
      
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        logStep("Existing customer found", { customerId });
      }
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email || undefined,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Premium Personality Assessment",
              description: "In-depth psychological assessment with personalized insights",
            },
            unit_amount: 1999, // $19.99 in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: returnUrl,
      cancel_url: `${new URL(returnUrl).origin}/start-assessment?canceled=true`,
      client_reference_id: user.id,
      metadata: {
        user_id: user.id,
      },
    });
    
    logStep("Checkout session created", { 
      sessionId: session.id, 
      url: session.url,
      clientReferenceId: session.client_reference_id
    });

    // Return the checkout URL
    return new Response(
      JSON.stringify({ 
        url: session.url,
        session_id: session.id 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("ERROR in create-assessment-payment:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
