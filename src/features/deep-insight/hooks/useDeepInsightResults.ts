
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { DeepInsightResponses } from "../types";
import { PersonalityAnalysis } from "@/utils/types";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { generateAnalysisFromResponses } from "../utils/analysisGenerator";

export const useDeepInsightResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<PersonalityAnalysis | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  
  // Effect to handle generating analysis from responses
  useEffect(() => {
    const generateAnalysis = async () => {
      try {
        // Retrieve responses from location state
        const responseData = location.state?.responses;
        
        if (!responseData) {
          setError("No assessment data found. Please complete the assessment first.");
          setLoading(false);
          return;
        }
        
        setLoading(true);
        
        // Try to call the edge function with increased timeout and better error handling
        try {
          console.log("Attempting to call edge function for analysis");
          const { data: analysisData, error: functionError } = await supabase.functions.invoke(
            'analyze-deep-insight',
            {
              body: { responses: responseData },
              // Set a reasonable timeout
              abortSignal: AbortSignal.timeout(60000) // 60 seconds timeout
            }
          );

          if (functionError) {
            console.error('Error calling analyze-deep-insight:', functionError);
            throw new Error('Failed to generate analysis via edge function.');
          }

          if (!analysisData) {
            throw new Error('No analysis data returned from edge function');
          }
          
          console.log("Successfully received analysis from edge function:", analysisData);
          setAnalysis(analysisData);
          setLoading(false);
          return;
        } catch (edgeFunctionError) {
          console.error("Edge function error:", edgeFunctionError);
          console.log("Falling back to client-side analysis generation");
          
          // Fall back to client-side analysis generation
          const generatedAnalysis = generateAnalysisFromResponses(responseData);
          
          // Add timestamps and IDs
          generatedAnalysis.id = `deep-insight-${Date.now()}`;
          generatedAnalysis.createdAt = new Date().toISOString();
          
          console.log("Generated fallback analysis:", generatedAnalysis.id);
          setAnalysis(generatedAnalysis);
          setLoading(false);
        }
        
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
        console.error("Error generating analysis:", errorMessage);
        setError("Failed to generate your analysis. Please try again later.");
        setLoading(false);
        toast.error("Something went wrong while generating your analysis.");
      }
    };
    
    generateAnalysis();
  }, [location.state]);
  
  // Function to save the analysis and responses to Supabase
  const saveAnalysis = async () => {
    try {
      if (!analysis) {
        toast.error("No analysis to save");
        return;
      }
      
      if (!user) {
        toast.error("You must be logged in to save analysis");
        return;
      }
      
      setSaveSuccess(false);
      toast.loading("Saving your analysis...");
      
      // Get responses from location state
      const responseData = location.state?.responses;
      
      if (!responseData) {
        toast.error("No response data found to save");
        return;
      }
      
      // First, save the responses to deep_insight_assessments
      const assessmentId = `deep-insight-${Date.now()}`;
      const { error: assessmentError } = await supabase
        .from('deep_insight_assessments')
        .insert({
          id: assessmentId,
          user_id: user.id,
          responses: responseData as unknown as Json,
          completed_at: new Date().toISOString()
        });
        
      if (assessmentError) {
        console.error("Error saving assessment:", assessmentError);
        toast.error("Failed to save your assessment");
        return;
      }
      
      // Then save the analysis to deep_insight_analyses
      // Fix: Cast the analysis to Json type and use the correct insert format
      const { error: analysisError } = await supabase
        .from('deep_insight_analyses')
        .insert({
          user_id: user.id,
          title: "Deep Insight Analysis",
          overview: analysis.overview,
          complete_analysis: analysis as unknown as Json,
          core_traits: analysis.coreTraits as unknown as Json,
          cognitive_patterning: analysis.cognitivePatterning as unknown as Json,
          emotional_architecture: analysis.emotionalArchitecture as unknown as Json,
          interpersonal_dynamics: analysis.interpersonalDynamics as unknown as Json,
          growth_potential: analysis.growthPotential as unknown as Json,
          intelligence_score: analysis.intelligenceScore,
          emotional_intelligence_score: analysis.emotionalIntelligenceScore,
          response_patterns: analysis.responsePatterns as unknown as Json,
          raw_responses: responseData
        });
        
      if (analysisError) {
        console.error("Error saving analysis:", analysisError);
        toast.error("Failed to save your analysis");
        return;
      }
      
      // Success!
      setSaveSuccess(true);
      toast.success("Your analysis has been saved!");
      
      // Navigate to history page after a short delay
      setTimeout(() => {
        navigate('/deep-insight');
      }, 2000);
      
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
      console.error("Error saving analysis:", errorMessage);
      toast.error("Failed to save your analysis. Please try again.");
    }
  };
  
  return {
    analysis,
    loading,
    error,
    saveAnalysis,
    saveSuccess
  };
};
