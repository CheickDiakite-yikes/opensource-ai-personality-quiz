
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
  console.log(`[VERIFY-ASSESSMENT-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");
    
    // Parse request body
    const { paymentSessionId } = await req.json();
    
    if (!paymentSessionId) {
      throw new Error("Payment session ID is required");
    }
    
    logStep("Verifying payment", { paymentSessionId });

    // Get Stripe key from environment
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not set in environment");
    }
    
    // Initialize Supabase client with service role key for admin operations
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
    logStep("User authenticated", { userId: user.id });

    // Check if this payment session exists and belongs to the user
    const { data: purchaseData, error: purchaseError } = await supabaseAdmin
      .from("assessment_purchases")
      .select("*")
      .eq("payment_session_id", paymentSessionId)
      .eq("user_id", user.id)
      .single();

    if (purchaseError || !purchaseData) {
      throw new Error(purchaseError ? 
        `Error fetching purchase record: ${purchaseError.message}` : 
        "Purchase record not found");
    }

    // If the status is already completed, no need to process again
    if (purchaseData.status === "completed") {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Payment already verified and credits applied",
          credits: purchaseData.credits
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200
        }
      );
    }

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    // Look up the session in Stripe to verify payment
    // In a real production app, you'd use webhooks instead for more reliability
    const sessions = await stripe.checkout.sessions.list({
      limit: 1,
      client_reference_id: paymentSessionId,
    });

    logStep("Stripe sessions retrieved", { count: sessions.data.length });

    const session = sessions.data[0];
    if (!session) {
      throw new Error("Payment session not found in Stripe");
    }

    // Check payment status
    const paymentStatus = session.payment_status;
    const paymentSuccess = paymentStatus === "paid";

    logStep("Payment status", { status: paymentStatus, success: paymentSuccess });

    if (!paymentSuccess) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `Payment not completed. Status: ${paymentStatus}`
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200
        }
      );
    }

    // Update the purchase record to completed
    const { error: updatePurchaseError } = await supabaseAdmin
      .from("assessment_purchases")
      .update({ status: "completed" })
      .eq("payment_session_id", paymentSessionId);

    if (updatePurchaseError) {
      throw new Error(`Error updating purchase record: ${updatePurchaseError.message}`);
    }

    logStep("Purchase record updated to completed");

    // Get current credits for the user
    const { data: creditsData, error: creditsError } = await supabaseAdmin
      .from("assessment_credits")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (creditsError && creditsError.code !== "PGRST116") { // Not found error
      throw new Error(`Error fetching user credits: ${creditsError.message}`);
    }

    // Update user's credits
    const currentCredits = creditsData?.credits_remaining || 0;
    const purchaseCredits = purchaseData.credits;
    const newCredits = currentCredits + purchaseCredits;

    // Update bundle purchases count if this was a bundle purchase
    const currentBundlePurchases = creditsData?.bundle_purchases || 0;
    const newBundlePurchases = purchaseData.purchase_type === "bundle" ? 
      currentBundlePurchases + 1 : currentBundlePurchases;
    
    const { error: updateCreditsError } = await supabaseAdmin
      .from("assessment_credits")
      .upsert({
        user_id: user.id,
        credits_remaining: newCredits,
        bundle_purchases: newBundlePurchases,
        updated_at: new Date().toISOString()
      }, { onConflict: "user_id" });

    if (updateCreditsError) {
      throw new Error(`Error updating user credits: ${updateCreditsError.message}`);
    }

    logStep("Credits updated", { 
      previousCredits: currentCredits, 
      addedCredits: purchaseCredits, 
      newCredits: newCredits 
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Payment verified and credits applied",
        previousCredits: currentCredits,
        addedCredits: purchaseCredits,
        newTotalCredits: newCredits
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
