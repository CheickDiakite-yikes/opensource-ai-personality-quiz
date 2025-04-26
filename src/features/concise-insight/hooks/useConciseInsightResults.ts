
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
        
        // Use select() and filter() instead of maybeSingle() which was causing the error
        const { data: existingAnalyses, error: fetchError } = await supabase
          .from('concise_analyses')
          .select('*')
          .eq('assessment_id', assessmentId)
          .eq('user_id', user.id); // Added user_id filter to ensure we get only this user's analyses
          
        if (fetchError) {
          console.error("[useConciseInsightResults] Error fetching existing analyses:", fetchError);
          throw fetchError;
        }
        
        // If analyses exist and we found at least one valid result, use the most recent one
        if (existingAnalyses && existingAnalyses.length > 0) {
          console.log(`[useConciseInsightResults] Found ${existingAnalyses.length} existing analyses for ID ${assessmentId}`);
          
          // Sort by created_at to get the most recent analysis
          const mostRecentAnalysis = existingAnalyses.sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )[0];
          
          if (mostRecentAnalysis && mostRecentAnalysis.analysis_data) {
            console.log(`[useConciseInsightResults] Using most recent analysis (${mostRecentAnalysis.id}) from ${mostRecentAnalysis.created_at}`);
            setAnalysis(mostRecentAnalysis.analysis_data as unknown as ConciseAnalysisResult);
            setLoading(false);
            return;
          } else {
            console.log(`[useConciseInsightResults] Found analyses but none had valid data`);
          }
        } else {
          console.log(`[useConciseInsightResults] No existing analyses found for ID ${assessmentId}`);
        }
        
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
            .insert({
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
        .insert({
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
