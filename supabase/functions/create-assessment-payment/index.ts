
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";
import Stripe from "https://esm.sh/stripe@14.5.0?dts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { purchaseType = "single" } = await req.json();
    
    // Check for required environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey || !stripeKey) {
      throw new Error("Missing required environment variables");
    }

    // Initialize Supabase client with service role key for database operations
    const supabaseServer = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });
    
    // Initialize Supabase client with user's JWT for user identification
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing Authorization header");
    }
    
    // Get authenticated user
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseServer.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error("Unauthorized");
    }
    
    // Set up Stripe
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });
    
    // Set up pricing based on purchase type
    let amount = 299; // $2.99 for single purchase
    let credits = 1;
    let name = "Single Assessment Credit";
    
    if (purchaseType === "bundle") {
      amount = 799; // $7.99 for bundle purchase
      credits = 3;
      name = "Bundle: 3 Assessment Credits";
    }
    
    // Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
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
      success_url: `${req.headers.get("origin")}/assessment-payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/assessment-intro`,
    });
    
    // Record the pending purchase in our database
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
    }
    
    // Return checkout URL to client
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
