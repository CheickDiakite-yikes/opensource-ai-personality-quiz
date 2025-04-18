
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { DeepInsightResponses } from "../types";
import { generateAnalysisFromResponses } from "../utils/analysis/analysisGenerator";
import { AnalysisData } from "../utils/analysis/types";
import { supabase } from "@/integrations/supabase/client";
import { useLocalStorage } from "@/hooks/useLocalStorage";

// Fix the re-export using "export type" for TypeScript's isolatedModules
export type { AnalysisData };

export const useDeepInsightResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [savedAnalyses, setSavedAnalyses] = useLocalStorage<AnalysisData[]>("deep_insight_analyses", []);
  
  // Effect to handle generating analysis from responses
  useEffect(() => {
    const generateAnalysis = async () => {
      try {
        // Retrieve responses from location state
        const responseData = location.state?.responses as DeepInsightResponses;
        
        if (!responseData) {
          setError("No assessment data found. Please complete the assessment first.");
          setLoading(false);
          // Redirect to quiz page if no data is found
          navigate("/deep-insight/quiz");
          return;
        }
        
        console.log("Generating analysis for responses:", responseData);
        setLoading(true);
        toast.loading("Analyzing your responses...", { id: "analysis-toast", duration: 60000 });
        
        try {
          // First, save responses to the database if the user is logged in
          let assessmentId = null;
          if (user) {
            try {
              const { data: assessmentData, error: saveError } = await supabase
                .from('deep_insight_assessments')
                .insert({
                  user_id: user.id,
                  responses: responseData,
                  completed_at: new Date().toISOString()
                })
                .select('id')
                .single();
              
              if (!saveError && assessmentData) {
                assessmentId = assessmentData.id;
                console.log("Saved assessment to database with ID:", assessmentId);
              } else {
                console.error("Error saving assessment:", saveError);
              }
            } catch (dbError) {
              console.error("Database error:", dbError);
            }
          }
          
          // Call the Edge Function for analysis
          console.log("Calling deep-insight-analysis edge function");
          
          const { data, error } = await supabase.functions.invoke('deep-insight-analysis', {
            method: 'POST',
            body: { responses: responseData }
          });
          
          if (error) {
            console.error("Edge function error:", error);
            throw new Error(`AI service error: ${error.message}`);
          }
          
          if (!data || !data.success) {
            console.error("Edge function failed:", data);
            throw new Error("AI analysis service unavailable");
          }
          
          console.log("Received analysis from edge function:", data.analysis);
          
          // Save analysis to database if user is logged in
          if (user && data.analysis) {
            try {
              const { error: analysisError } = await supabase
                .from('deep_insight_analyses')
                .insert({
                  user_id: user.id,
                  complete_analysis: data.analysis,
                  cognitive_patterning: data.analysis.cognitivePatterning,
                  emotional_architecture: data.analysis.emotionalArchitecture,
                  interpersonal_dynamics: data.analysis.interpersonalDynamics,
                  core_traits: data.analysis.coreTraits,
                  growth_potential: data.analysis.growthPotential,
                  response_patterns: data.analysis.responsePatterns,
                  overview: data.analysis.overview,
                  intelligence_score: data.analysis.intelligenceScore,
                  emotional_intelligence_score: data.analysis.emotionalIntelligenceScore,
                  raw_responses: responseData
                });
                
              if (analysisError) {
                console.error("Error saving analysis to database:", analysisError);
              } else {
                console.log("Analysis saved to database successfully");
              }
            } catch (dbError) {
              console.error("Database error when saving analysis:", dbError);
            }
          }
          
          setAnalysis(data.analysis);
          toast.success("Analysis generated successfully!", { id: "analysis-toast" });
          
        } catch (apiError) {
          console.error("API error, falling back to local analysis:", apiError);
          toast.error("AI analysis service unavailable. Falling back to local analysis generation.", { id: "analysis-toast" });
          
          // Fallback to local analysis generation
          const generatedAnalysis = generateAnalysisFromResponses(responseData);
          setAnalysis(generatedAnalysis);
        }
        
        setLoading(false);
        
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
        console.error("Error generating analysis:", errorMessage);
        setError("Failed to generate your analysis. Please try again later.");
        setLoading(false);
        toast.error("Something went wrong while generating your analysis.", { id: "analysis-toast" });
      }
    };
    
    generateAnalysis();
  }, [location.state, user, navigate]);
  
  // Function to save the analysis
  const saveAnalysis = async () => {
    try {
      if (!analysis) return;
      
      // Save to local storage
      const newSavedAnalyses = [...savedAnalyses, analysis];
      setSavedAnalyses(newSavedAnalyses);
      
      if (user) {
        console.log("Analysis saved for user:", user.id);
      }
      
      toast.success("Your analysis has been saved!");
      
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
    saveAnalysis
  };
};
