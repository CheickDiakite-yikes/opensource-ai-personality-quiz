
import { useState, useEffect } from "react";
import { ConciseAnalysisResult } from "../types";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

export const useConciseInsightResults = (analysisId?: string) => {
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
        
        if (!analysisId) {
          setError("No analysis ID provided");
          setLoading(false);
          return;
        }
        
        if (!user) {
          setError("You must be signed in to view results");
          navigate("/auth");
          return;
        }
        
        console.log(`[useConciseInsightResults] Fetching analysis for ID: ${analysisId}`);

        // First check if this is a direct analysis ID (UUID format)
        if (analysisId.includes('-') && analysisId.length > 30) {
          console.log(`[useConciseInsightResults] This appears to be a direct analysis ID: ${analysisId}`);
          
          // Fetch the specific analysis by its ID
          const { data: specificAnalysis, error: specificError } = await supabase
            .from('concise_analyses')
            .select('*')
            .eq('id', analysisId)
            .single();
            
          if (specificError) {
            console.error("[useConciseInsightResults] Error fetching specific analysis:", specificError);
            throw specificError;
          }
          
          if (specificAnalysis) {
            console.log(`[useConciseInsightResults] Found specific analysis with ID: ${specificAnalysis.id}`);
            
            // Handle type safely
            if (specificAnalysis.analysis_data) {
              // Ensure we're working with an object
              const analysisData = specificAnalysis.analysis_data as Record<string, any>;
              
              console.log(`[useConciseInsightResults] Analysis overview: ${
                typeof analysisData.overview === 'string' 
                  ? analysisData.overview.substring(0, 40) + "..." 
                  : "No overview available"
              }`);
              
              // Set the analysis data
              setAnalysis(analysisData as unknown as ConciseAnalysisResult);
              setLoading(false);
              return;
            } else {
              console.error("[useConciseInsightResults] Analysis data is missing or invalid");
              throw new Error("Analysis data is missing or invalid");
            }
          }
        }
        
        // If no analysis is found by direct ID, try to treat it as an assessment ID
        console.log(`[useConciseInsightResults] Trying to find analysis by assessment ID: ${analysisId}`);
        
        // Get the specific analysis that matches this assessment ID and user ID
        const { data: matchingAnalyses, error: fetchError } = await supabase
          .from('concise_analyses')
          .select('*')
          .eq('assessment_id', analysisId)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (fetchError) {
          console.error("[useConciseInsightResults] Error fetching analyses:", fetchError);
          throw fetchError;
        }
        
        // If we found matching analyses, use the most recent one
        if (matchingAnalyses && matchingAnalyses.length > 0) {
          const targetAnalysis = matchingAnalyses[0]; // Most recent due to sorting
          console.log(`[useConciseInsightResults] Found match by assessment ID, using analysis with ID: ${targetAnalysis.id}`);
          
          // Ensure we're working with an object
          if (targetAnalysis.analysis_data) {
            const analysisData = targetAnalysis.analysis_data as Record<string, any>;
            
            // Log for debugging
            if (typeof analysisData.overview === 'string') {
              console.log(`[useConciseInsightResults] Analysis overview starts with: ${analysisData.overview.substring(0, 40)}...`);
            }
            
            setAnalysis(analysisData as unknown as ConciseAnalysisResult);
            setLoading(false);
            return;
          }
        } else {
          console.log(`[useConciseInsightResults] No analysis matches found for assessment ID: ${analysisId}`);
        }
        
        // If no valid analysis found, get the assessment responses and generate a new one
        console.log(`[useConciseInsightResults] Attempting to find and generate analysis for assessment: ${analysisId}`);
        
        const { data: assessment, error: responseError } = await supabase
          .from('concise_assessments')
          .select('*')
          .eq('id', analysisId)
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
        
        console.log(`[useConciseInsightResults] Found assessment, calling edge function for ID: ${analysisId}`);
        
        // Call edge function to generate new analysis
        const { data: analysisResult, error: analysisError } = await supabase.functions.invoke(
          'analyze-concise-responses',
          {
            body: { 
              assessmentId: analysisId,
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
              assessment_id: analysisId,
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
    
    if (analysisId) {
      fetchAnalysis();
    } else {
      setLoading(false);
    }
  }, [analysisId, navigate, user]);
  
  const saveAnalysis = async () => {
    if (!analysis || !user || !analysisId) return;
    
    try {
      // Check if this is a UUID (direct analysis ID) or an assessment ID
      let assessmentId = analysisId;
      
      // If it's a UUID, we need to find the associated assessment ID
      if (analysisId.includes('-') && analysisId.length > 30) {
        const { data } = await supabase
          .from('concise_analyses')
          .select('assessment_id')
          .eq('id', analysisId)
          .single();
          
        if (data && data.assessment_id) {
          assessmentId = data.assessment_id;
        }
      }
      
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
