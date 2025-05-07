
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper for logging steps in the function execution
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
    
    // Parse request body
    const { paymentType } = await req.json();
    logStep("Payment type received", { paymentType });

    // Valid payment types
    const validPaymentTypes = ["single", "bundle"];
    if (!validPaymentTypes.includes(paymentType)) {
      throw new Error(`Invalid payment type: ${paymentType}. Must be one of: ${validPaymentTypes.join(", ")}`);
    }

    // Get Stripe key from environment
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not set in environment");
    }
    
    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    // Create Supabase client using the token for auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Authorization header is missing");
    }
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !userData.user) {
      throw new Error(userError ? `Authentication error: ${userError.message}` : "User not found");
    }
    
    const user = userData.user;
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    // Determine product details based on payment type
    let amount: number;
    let description: string;
    let credits: number;
    
    if (paymentType === "single") {
      amount = 299; // $2.99
      description = "Single Assessment";
      credits = 1;
    } else { // bundle
      amount = 799; // $7.99
      description = "Bundle of 3 Assessments";
      credits = 3;
    }

    logStep("Creating payment session", { amount, description, credits });

    // Generate a unique reference ID for this transaction
    const paymentSessionId = crypto.randomUUID();

    // Record the pending purchase in the database
    const { error: insertError } = await supabaseAdmin
      .from("assessment_purchases")
      .insert({
        user_id: user.id,
        amount: amount / 100, // Convert cents to dollars for DB storage
        credits: credits,
        purchase_type: paymentType,
        payment_session_id: paymentSessionId,
        status: "pending"
      });

    if (insertError) {
      throw new Error(`Error recording purchase: ${insertError.message}`);
    }

    logStep("Purchase recorded in database", { paymentSessionId });

    // Create Stripe Checkout Session
    const origin = req.headers.get("origin") || "http://localhost:5173";
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Who Am I? Assessment - ${description}`,
              description: `Purchase ${credits} assessment credit${credits > 1 ? 's' : ''}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/assessment-payment-success?session_id=${paymentSessionId}`,
      cancel_url: `${origin}/assessment`,
      client_reference_id: paymentSessionId,
      metadata: {
        userId: user.id,
        paymentType: paymentType,
        credits: credits.toString()
      }
    });

    logStep("Stripe session created", { 
      sessionId: session.id,
      url: session.url,
      paymentSessionId: paymentSessionId
    });

    // Return the Stripe checkout URL to redirect the user
    return new Response(
      JSON.stringify({
        url: session.url,
        paymentSessionId: paymentSessionId
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );
  } catch (error) {
    logStep("ERROR", { message: error.message });
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400
      }
    );
  }
});
