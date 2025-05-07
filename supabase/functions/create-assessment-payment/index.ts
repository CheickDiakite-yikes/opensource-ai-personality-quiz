
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
    let body;
    try {
      body = await req.json();
      logStep("Request body parsed", body);
    } catch (parseError) {
      logStep("Error parsing request body", { error: parseError.message });
      throw new Error(`Invalid request format: ${parseError.message}`);
    }
    
    const { paymentType } = body;
    
    if (!paymentType) {
      logStep("Missing payment type");
      throw new Error("Payment type is required");
    }
    logStep("Payment type received", { paymentType });

    // Valid payment types
    const validPaymentTypes = ["single", "bundle"];
    if (!validPaymentTypes.includes(paymentType)) {
      logStep("Invalid payment type", { paymentType, validTypes: validPaymentTypes });
      throw new Error(`Invalid payment type: ${paymentType}. Must be one of: ${validPaymentTypes.join(", ")}`);
    }

    // Get Stripe key from environment
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      logStep("Missing Stripe secret key");
      throw new Error("STRIPE_SECRET_KEY is not set in environment");
    }
    logStep("Stripe key found", { keyPreview: stripeKey.substring(0, 7) + '...' }); // Show just the beginning of the key for diagnostics
    
    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    
    if (!supabaseUrl || !supabaseServiceKey) {
      logStep("Missing Supabase credentials", { 
        hasUrl: !!supabaseUrl, 
        hasServiceKey: !!supabaseServiceKey 
      });
      throw new Error("Supabase credentials are not properly configured");
    }
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });
    logStep("Supabase admin client initialized");

    // Create Supabase client using the token for auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      logStep("Missing Authorization header");
      throw new Error("Authorization header is missing");
    }
    
    const token = authHeader.replace("Bearer ", "");
    logStep("Authenticating user with token");
    
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !userData.user) {
      logStep("Authentication failed", { error: userError?.message || "User not found" });
      throw new Error(userError ? `Authentication error: ${userError.message}` : "User not found");
    }
    
    const user = userData.user;
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Initialize Stripe
    let stripe;
    try {
      logStep("Initializing Stripe");
      stripe = new Stripe(stripeKey, {
        apiVersion: "2023-10-16",
        typescript: true,
      });
      logStep("Stripe initialized successfully");
    } catch (stripeInitError) {
      logStep("Stripe initialization failed", { error: stripeInitError.message });
      throw new Error(`Failed to initialize Stripe: ${stripeInitError.message}`);
    }

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
    logStep("Generated payment session ID", { paymentSessionId });

    // Record the pending purchase in the database
    try {
      logStep("Recording purchase in database");
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
        logStep("Error recording purchase", { error: insertError.message });
        throw new Error(`Error recording purchase: ${insertError.message}`);
      }
      logStep("Purchase recorded in database", { paymentSessionId });
    } catch (dbError) {
      logStep("Database operation failed", { error: dbError.message });
      throw new Error(`Database error: ${dbError.message}`);
    }

    // Create Stripe Checkout Session with timeout and error handling
    try {
      const origin = req.headers.get("origin") || "http://localhost:5173";
      
      logStep("Creating Stripe checkout session", { 
        origin,
        successRedirect: `${origin}/assessment-payment-success?session_id=${paymentSessionId}`,
        cancelRedirect: `${origin}/assessment`,
        mode: "payment"
      });
      
      // Create a promise with timeout for the Stripe API call
      const stripeSessionPromise = stripe.checkout.sessions.create({
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
      
      // Set a timeout for the Stripe API call (10 seconds)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Timeout while creating Stripe checkout session")), 10000);
      });
      
      // Race the Stripe API call against the timeout
      const session = await Promise.race([stripeSessionPromise, timeoutPromise]) as Stripe.Response<Stripe.Checkout.Session>;

      logStep("Stripe session created successfully", { 
        sessionId: session.id,
        url: session.url?.substring(0, 30) + "...", // Only log partial URL for security
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
    } catch (stripeError) {
      logStep("Stripe error creating checkout session", { 
        error: stripeError.message,
        type: stripeError.type,
        code: stripeError.code,
        stack: stripeError.stack
      });
      
      // Update the purchase record to failed
      try {
        await supabaseAdmin
          .from("assessment_purchases")
          .update({ status: "failed", error_message: stripeError.message })
          .eq("payment_session_id", paymentSessionId);
      } catch (updateError) {
        logStep("Failed to update purchase record after Stripe error", { error: updateError.message });
      }
      
      throw new Error(`Stripe error: ${stripeError.message}`);
    }
  } catch (error) {
    logStep("ERROR", { message: error.message, stack: error.stack });
    return new Response(
      JSON.stringify({ 
        error: error.message,
        errorCode: error.code || "unknown_error"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400
      }
    );
  }
});
