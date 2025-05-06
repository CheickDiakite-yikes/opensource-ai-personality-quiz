
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface AssessmentCredits {
  id: string;
  user_id: string;
  credits_remaining: number;
  bundle_purchases: number;
  bonus_credits: number;
  created_at: string;
  updated_at: string;
}

export const useAssessmentCredits = () => {
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState<AssessmentCredits | null>(null);
  const [hasCredits, setHasCredits] = useState(false);
  const { user } = useAuth();

  // Fetch the current user's credits
  const fetchCredits = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('assessment_credits')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error("Error fetching credits:", error);
        return;
      }

      setCredits(data);
      setHasCredits(data?.credits_remaining > 0);
    } catch (error) {
      console.error("Exception fetching credits:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Check if the user has enough credits
  const checkCredits = useCallback(() => {
    return hasCredits;
  }, [hasCredits]);

  // Use a credit (called when assessment is submitted)
  const useCredit = useCallback(async () => {
    if (!user || !credits || credits.credits_remaining <= 0) {
      return false;
    }

    try {
      const { error } = await supabase
        .from('assessment_credits')
        .update({ 
          credits_remaining: credits.credits_remaining - 1,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) {
        console.error("Error using credit:", error);
        toast.error("Failed to use assessment credit", {
          description: "Please try again or contact support"
        });
        return false;
      }

      // Update local state
      setCredits({
        ...credits,
        credits_remaining: credits.credits_remaining - 1
      });
      setHasCredits(credits.credits_remaining - 1 > 0);
      
      return true;
    } catch (error) {
      console.error("Exception using credit:", error);
      return false;
    }
  }, [user, credits]);

  // Load credits on component mount
  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  return {
    credits,
    hasCredits,
    loading,
    fetchCredits,
    checkCredits,
    useCredit
  };
};
