
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
        
        console.log(`[useConciseInsightResults] Fetching specific analysis for assessment ID: ${assessmentId}`);
        
        // For debugging - log all analyses that match this assessment ID
        const { data: allMatchingAnalyses } = await supabase
          .from('concise_analyses')
          .select('id, created_at, assessment_id')
          .eq('assessment_id', assessmentId)
          .order('created_at', { ascending: false });
          
        console.log(`[useConciseInsightResults] Found ${allMatchingAnalyses?.length || 0} total analyses matching assessment ID: ${assessmentId}`);
        
        // Get only the specific analysis that matches EXACTLY this assessment ID and user ID
        const { data: exactAnalyses, error: fetchError } = await supabase
          .from('concise_analyses')
          .select('*')
          .eq('assessment_id', assessmentId)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (fetchError) {
          console.error("[useConciseInsightResults] Error fetching analyses:", fetchError);
          throw fetchError;
        }
        
        // If we found matching analyses, use the most recent one
        if (exactAnalyses && exactAnalyses.length > 0) {
          const targetAnalysis = exactAnalyses[0]; // Most recent due to sorting
          console.log(`[useConciseInsightResults] Found exact match, using analysis with ID: ${targetAnalysis.id} from ${targetAnalysis.created_at}`);
          
          // Debug - log the first part of the analysis data to confirm it's unique
          if (targetAnalysis.analysis_data) {
            // Fix: Type check the analysis_data to ensure it's an object with an overview property
            const analysisData = targetAnalysis.analysis_data as Record<string, any>;
            const overview = analysisData.overview || 'No overview';
            console.log(`[useConciseInsightResults] Analysis overview starts with: ${overview.substring(0, 40)}...`);
          }
          
          setAnalysis(targetAnalysis.analysis_data as unknown as ConciseAnalysisResult);
          setLoading(false);
          return;
        } else {
          console.log(`[useConciseInsightResults] No exact analysis match found for ID: ${assessmentId}`);
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
        
        // Add a unique timestamp marker to ensure this analysis is distinguishable
        const enrichedResult = {
          ...analysisResult,
          _generatedAt: new Date().toISOString()
        } as ConciseAnalysisResult;
        
        setAnalysis(enrichedResult);
        
        // Save the newly generated analysis to the database
        try {
          const { error: saveError } = await supabase
            .from('concise_analyses')
            .insert({
              assessment_id: assessmentId,
              user_id: user.id,
              analysis_data: enrichedResult as unknown as Json
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
