
import { useState } from "react";
import { AssessmentResponse, PersonalityAnalysis } from "@/utils/types";
import { toast } from "sonner";
import { saveAssessmentToStorage } from "./useLocalStorage";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useAnalyzeResponses = (
  saveToHistory: (analysis: PersonalityAnalysis) => PersonalityAnalysis, 
  setAnalysis: (analysis: PersonalityAnalysis) => void
) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { user } = useAuth();

  const analyzeResponses = async (responses: AssessmentResponse[]): Promise<PersonalityAnalysis> => {
    setIsAnalyzing(true);
    toast.info("Analyzing your responses with AI...");

    try {
      // Save responses to localStorage and get assessment ID
      const assessmentId = saveAssessmentToStorage(responses);
      
      console.log("Sending responses to AI for analysis using o3-mini model...", responses);
      
      // Store assessment responses in Supabase if user is logged in
      if (user) {
        try {
          const { error: assessmentError } = await supabase
            .from('assessments')
            .insert({
              id: assessmentId,
              user_id: user.id,
              responses: responses
            });
            
          if (assessmentError) {
            console.error("Error saving assessment to Supabase:", assessmentError);
          }
        } catch (err) {
          console.error("Error saving assessment:", err);
        }
      }
      
      // Call the Supabase Edge Function for AI analysis
      const { data, error } = await supabase.functions.invoke("analyze-responses", {
        body: { 
          responses, 
          assessmentId 
        }
      });
      
      if (error) {
        console.error("Error calling analyze-responses function:", error);
        throw new Error(`Analysis failed: ${error.message}`);
      }
      
      if (!data || !data.analysis) {
        throw new Error("Invalid response from analysis function");
      }
      
      console.log("Received AI analysis from o3-mini model:", data.analysis);
      
      // Add user ID to the analysis if user is logged in
      let analysisWithUser = data.analysis;
      if (user) {
        analysisWithUser = {
          ...data.analysis,
          userId: user.id,
          assessmentId: assessmentId
        };
        
        // Save analysis to Supabase
        try {
          const { error: analysisError } = await supabase
            .from('analyses')
            .insert({
              id: data.analysis.id,
              user_id: user.id,
              assessment_id: assessmentId,
              result: data.analysis,
              overview: data.analysis.overview,
              traits: data.analysis.traits,
              intelligence: data.analysis.intelligence,
              intelligence_score: data.analysis.intelligenceScore,
              emotional_intelligence_score: data.analysis.emotionalIntelligenceScore,
              cognitive_style: data.analysis.cognitiveStyle,
              value_system: data.analysis.valueSystem,
              motivators: data.analysis.motivators,
              inhibitors: data.analysis.inhibitors,
              weaknesses: data.analysis.weaknesses,
              growth_areas: data.analysis.growthAreas,
              relationship_patterns: data.analysis.relationshipPatterns,
              career_suggestions: data.analysis.careerSuggestions,
              learning_pathways: data.analysis.learningPathways,
              roadmap: data.analysis.roadmap
            });
            
          if (analysisError) {
            console.error("Error saving analysis to Supabase:", analysisError);
          }
        } catch (err) {
          console.error("Error saving analysis:", err);
        }
      }
      
      // Save to history and update the current analysis
      const savedAnalysis = saveToHistory(analysisWithUser);
      setAnalysis(savedAnalysis);
      
      toast.success("AI Analysis complete!");
      return savedAnalysis;
    } catch (error) {
      console.error("Error analyzing responses:", error);
      toast.error("Failed to analyze responses. Using fallback analysis.");
      
      // Fallback to local mock analysis if the API fails
      const fallbackAnalysis = await import("./mockAnalysisGenerator").then(module => {
        const assessmentId = saveAssessmentToStorage(responses);
        return module.generateMockAnalysis(assessmentId);
      });
      
      const savedAnalysis = saveToHistory(fallbackAnalysis);
      setAnalysis(savedAnalysis);
      return savedAnalysis;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    isAnalyzing,
    analyzeResponses
  };
};
