
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
    const { sessionId } = await req.json();
    
    if (!sessionId) {
      throw new Error("Missing session ID");
    }
    
    // Check for required environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey || !stripeKey) {
      throw new Error("Missing required environment variables");
    }
    
    // Initialize Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });
    
    // Set up Stripe
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16", 
    });
    
    // Verify the checkout session with Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (!session || session.payment_status !== "paid") {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Payment not completed" 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Find the purchase record in our database
    const { data: purchase, error: purchaseError } = await supabase
      .from("assessment_purchases")
      .select("*")
      .eq("payment_session_id", sessionId)
      .single();
      
    if (purchaseError || !purchase) {
      throw new Error("Purchase record not found");
    }
    
    // Update the purchase status
    const { error: updateError } = await supabase
      .from("assessment_purchases")
      .update({ status: "completed" })
      .eq("id", purchase.id);
      
    if (updateError) {
      throw new Error(`Failed to update purchase status: ${updateError.message}`);
    }
    
    // Update the user's credits
    const { data: credits, error: creditsError } = await supabase
      .from("assessment_credits")
      .select("*")
      .eq("user_id", purchase.user_id)
      .single();
      
    if (creditsError) {
      throw new Error(`Failed to fetch user credits: ${creditsError.message}`);
    }
    
    // Calculate new credits value
    const newCreditsRemaining = (credits?.credits_remaining || 0) + purchase.credits;
    const newBundlePurchases = purchase.purchase_type === "bundle" 
      ? (credits?.bundle_purchases || 0) + 1 
      : (credits?.bundle_purchases || 0);
    
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
      throw new Error(`Failed to update user credits: ${updateCreditsError.message}`);
    }
    
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
