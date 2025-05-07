
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper for logging steps in the function execution
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[GRANT-BONUS-CREDITS] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");
    
    // Parse request body
    const { targetUserId, creditsToAdd } = await req.json();
    
    if (!targetUserId || !creditsToAdd) {
      throw new Error("Target user ID and credits amount are required");
    }
    
    if (creditsToAdd <= 0) {
      throw new Error("Credits to add must be a positive number");
    }
    
    logStep("Granting bonus credits", { targetUserId, creditsToAdd });

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

    // Very basic admin check - in a real app, you'd want to check a roles table
    // For now just hardcode some admin emails for testing
    const adminEmails = ["admin@example.com"]; // Update this with real admin emails

    if (!adminEmails.includes(user.email || "")) {
      throw new Error("Unauthorized: Only administrators can grant bonus credits");
    }

    // Get current credits for the target user
    const { data: creditsData, error: creditsError } = await supabaseAdmin
      .from("assessment_credits")
      .select("*")
      .eq("user_id", targetUserId)
      .single();

    if (creditsError && creditsError.code !== "PGRST116") { // Not found error
      throw new Error(`Error fetching target user credits: ${creditsError.message}`);
    }

    // Update user's credits
    const currentCredits = creditsData?.credits_remaining || 0;
    const currentBonusCredits = creditsData?.bonus_credits || 0;
    const newTotalCredits = currentCredits + creditsToAdd;
    const newBonusCredits = currentBonusCredits + creditsToAdd;
    
    const { error: updateCreditsError } = await supabaseAdmin
      .from("assessment_credits")
      .upsert({
        user_id: targetUserId,
        credits_remaining: newTotalCredits,
        bonus_credits: newBonusCredits,
        updated_at: new Date().toISOString()
      }, { onConflict: "user_id" });

    if (updateCreditsError) {
      throw new Error(`Error updating user credits: ${updateCreditsError.message}`);
    }

    logStep("Bonus credits granted", { 
      targetUserId,
      previousCredits: currentCredits, 
      bonusAdded: creditsToAdd, 
      newTotalCredits: newTotalCredits,
      newBonusCredits: newBonusCredits
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Bonus credits granted successfully",
        targetUserId,
        previousCredits: currentCredits,
        bonusAdded: creditsToAdd,
        newTotalCredits: newTotalCredits
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
