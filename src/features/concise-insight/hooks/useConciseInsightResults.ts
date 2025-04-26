
import { useState, useEffect } from "react";
import { ConciseAnalysisResult } from "../types";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

export const useConciseInsightResults = (assessmentId?: string) => {
  const [analysis, setAnalysis] = useState<ConciseAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        // Reset state at the start of each fetch
        setLoading(true);
        setError(null);
        
        if (!assessmentId) {
          setError("No assessment ID provided");
          setLoading(false);
          return;
        }
        
        if (!user) {
          setError("You must be signed in to view results");
          navigate("/auth");
          return;
        }
        
        // Check if analysis already exists - improved logging
        console.log(`[useConciseInsightResults] Fetching existing analysis for ID: ${assessmentId}`);
        
        const { data: existingAnalysis, error: fetchError } = await supabase
          .from('concise_analyses')
          .select('*')
          .eq('assessment_id', assessmentId)
          .maybeSingle(); // Using maybeSingle instead of single to avoid errors when no record found
          
        if (fetchError) {
          console.error("[useConciseInsightResults] Error fetching existing analysis:", fetchError);
          throw fetchError;
        }
        
        // If analysis exists and has valid data, use it
        if (existingAnalysis && existingAnalysis.analysis_data) {
          console.log(`[useConciseInsightResults] Found existing analysis for ID ${assessmentId}:`, existingAnalysis.id);
          setAnalysis(existingAnalysis.analysis_data as unknown as ConciseAnalysisResult);
          setLoading(false);
          return;
        }
        
        console.log(`[useConciseInsightResults] No valid analysis found for ID ${assessmentId}, generating new analysis`);
        
        // Only if no valid analysis exists, get the assessment responses and generate a new one
        const { data: assessment, error: responseError } = await supabase
          .from('concise_assessments')
          .select('*')
          .eq('id', assessmentId)
          .eq('user_id', user.id)
          .single();
          
        if (responseError) {
          console.error("[useConciseInsightResults] Error fetching assessment:", responseError);
          throw responseError;
        }
        
        if (!assessment) {
          setError("Assessment not found");
          setLoading(false);
          return;
        }
        
        console.log(`[useConciseInsightResults] Found assessment, calling edge function for ID: ${assessmentId}`);
        
        // Call edge function to get analysis - only if no existing analysis was found
        const { data: analysisResult, error: analysisError } = await supabase.functions.invoke(
          'analyze-concise-responses',
          {
            body: { 
              assessmentId,
              responses: assessment.responses,
              userId: user.id
            }
          }
        );
        
        if (analysisError) {
          console.error("[useConciseInsightResults] Error generating analysis:", analysisError);
          throw analysisError;
        }
        
        if (!analysisResult) {
          throw new Error("No analysis result returned from the edge function");
        }
        
        console.log("[useConciseInsightResults] Analysis generated successfully");
        setAnalysis(analysisResult as ConciseAnalysisResult);
        
        // Save the newly generated analysis to the database
        try {
          const { error: saveError } = await supabase
            .from('concise_analyses')
            .upsert({
              assessment_id: assessmentId,
              user_id: user.id,
              analysis_data: analysisResult as unknown as Json
            });
            
          if (saveError) throw saveError;
          console.log("[useConciseInsightResults] Newly generated analysis saved to database");
        } catch (saveErr: any) {
          console.error("[useConciseInsightResults] Error saving new analysis", saveErr);
          toast.error("Analysis generated but couldn't be saved for future use");
        }
        
        setLoading(false);
        
      } catch (err: any) {
        console.error("[useConciseInsightResults] Error in fetchAnalysis:", err);
        setError(err.message || "An error occurred while fetching analysis");
        setLoading(false);
      }
    };
    
    if (assessmentId) {
      fetchAnalysis();
    } else {
      setLoading(false);
    }
  }, [assessmentId, navigate, user]);
  
  const saveAnalysis = async () => {
    if (!analysis || !user || !assessmentId) return;
    
    try {
      const { error } = await supabase
        .from('concise_analyses')
        .upsert({
          assessment_id: assessmentId,
          user_id: user.id,
          analysis_data: analysis as unknown as Json
        });
        
      if (error) throw error;
      
      toast.success("Analysis saved successfully");
    } catch (err: any) {
      console.error("[useConciseInsightResults] Error saving analysis", err);
      toast.error("Failed to save analysis");
    }
  };
  
  return { analysis, loading, error, saveAnalysis };
};
