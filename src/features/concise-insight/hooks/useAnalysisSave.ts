
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ConciseAnalysisResult } from "../types";

export const useAnalysisSave = (analysisId?: string) => {
  const saveAnalysis = useCallback(async (analysis: ConciseAnalysisResult, userId: string) => {
    if (!analysis || !userId || !analysisId) return;
    
    try {
      let assessmentId = analysisId;
      
      if (analysisId.includes('-') && analysisId.length > 30) {
        const { data } = await supabase
          .from('concise_analyses')
          .select('assessment_id')
          .eq('id', analysisId)
          .single();
          
        if (data?.assessment_id) {
          assessmentId = data.assessment_id;
        }
      }
      
      const { error } = await supabase
        .from('concise_analyses')
        .insert({
          assessment_id: assessmentId,
          user_id: userId,
          analysis_data: analysis as any
        });
        
      if (error) throw error;
      
      toast.success("Analysis saved successfully");
    } catch (err: any) {
      console.error("[useAnalysisSave] Error saving analysis:", err);
      toast.error("Failed to save analysis");
      throw err;
    }
  }, [analysisId]);

  return { saveAnalysis };
};

