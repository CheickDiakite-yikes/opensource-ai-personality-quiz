
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { DeepInsightResponses } from "../types";
import { generateAnalysisFromResponses } from "../utils/analysis/analysisGenerator";
import { PersonalityAnalysis } from "@/utils/types";
import { supabase } from "@/integrations/supabase/client";

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
        
        // In a real app, we would call an API to analyze the responses
        // For now, we'll simulate a delay and generate a personalized analysis
        setLoading(true);
        
        // Simulate API call delay
        setTimeout(() => {
          const generatedAnalysis = generateAnalysisFromResponses(responseData);
          setAnalysis(generatedAnalysis);
          setLoading(false);
        }, 1500); // 1.5 second delay to simulate processing
        
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
          responses: responseData,
          completed_at: new Date().toISOString()
        });
        
      if (assessmentError) {
        console.error("Error saving assessment:", assessmentError);
        toast.error("Failed to save your assessment");
        return;
      }
      
      // Then save the analysis to deep_insight_analyses
      // Fix: Format the insert data as an array of objects, not as a single object
      const { error: analysisError } = await supabase
        .from('deep_insight_analyses')
        .insert([{  // Wrap the object in an array
          user_id: user.id,
          title: "Deep Insight Analysis",
          overview: analysis.overview,
          complete_analysis: analysis,
          core_traits: analysis.coreTraits,
          cognitive_patterning: analysis.cognitivePatterning,
          emotional_architecture: analysis.emotionalArchitecture,
          interpersonal_dynamics: analysis.interpersonalDynamics,
          growth_potential: analysis.growthPotential,
          intelligence_score: analysis.intelligenceScore,
          emotional_intelligence_score: analysis.emotionalIntelligenceScore,
          response_patterns: analysis.responsePatterns,
          raw_responses: responseData
        }]);
        
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
