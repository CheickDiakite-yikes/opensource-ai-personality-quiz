
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
      console.log("User logged in:", user ? "yes" : "no", "User ID:", user?.id || "none");
      
      // Store assessment responses in Supabase if user is logged in
      if (user) {
        console.log("User is logged in, saving assessment to Supabase for user:", user.id);
        try {
          // We need to convert AssessmentResponse[] to a JSON-compatible format
          // by using JSON.stringify and then parsing it back to handle Date objects
          const jsonResponses = JSON.parse(JSON.stringify(responses));
          
          const { error: assessmentError } = await supabase
            .from('assessments')
            .insert({
              id: assessmentId,
              user_id: user.id,
              responses: jsonResponses
            });
            
          if (assessmentError) {
            console.error("Error saving assessment to Supabase:", assessmentError);
            toast.error("Could not save your assessment data, but continuing with analysis", {
              description: assessmentError.message
            });
          } else {
            console.log("Successfully saved assessment to Supabase with ID:", assessmentId);
          }
        } catch (err) {
          console.error("Error saving assessment:", err);
        }
      }
      
      // Call the Supabase Edge Function for AI analysis with debugging
      console.log("Calling analyze-responses edge function with user ID:", user?.id || "none");
      const { data, error } = await supabase.functions.invoke("analyze-responses", {
        body: { 
          responses, 
          assessmentId,
          userId: user?.id || null 
        }
      });
      
      if (error) {
        console.error("Error calling analyze-responses function:", error);
        throw new Error(`Analysis failed: ${error.message}`);
      }
      
      if (!data || !data.analysis) {
        console.error("Invalid response from analysis function:", data);
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
          console.log("Saving analysis to Supabase for user:", user.id);
          // Convert all JSON fields to their string representation to ensure compatibility
          const jsonAnalysis = JSON.parse(JSON.stringify(data.analysis));
          
          const { error: analysisError } = await supabase
            .from('analyses')
            .insert({
              id: data.analysis.id,
              user_id: user.id,
              assessment_id: assessmentId,
              result: jsonAnalysis,
              overview: data.analysis.overview,
              traits: jsonAnalysis.traits,
              intelligence: jsonAnalysis.intelligence,
              intelligence_score: data.analysis.intelligenceScore,
              emotional_intelligence_score: data.analysis.emotionalIntelligenceScore,
              cognitive_style: jsonAnalysis.cognitiveStyle,
              value_system: jsonAnalysis.valueSystem,
              motivators: jsonAnalysis.motivators,
              inhibitors: jsonAnalysis.inhibitors,
              weaknesses: jsonAnalysis.weaknesses,
              growth_areas: jsonAnalysis.growthAreas,
              relationship_patterns: jsonAnalysis.relationshipPatterns,
              career_suggestions: jsonAnalysis.careerSuggestions,
              learning_pathways: jsonAnalysis.learningPathways,
              roadmap: data.analysis.roadmap
            });
            
          if (analysisError) {
            console.error("Error saving analysis to Supabase:", analysisError);
            toast.error("Could not save your analysis data to your profile, but we've saved it locally", {
              description: analysisError.message
            });
          } else {
            console.log("Successfully saved analysis to Supabase with ID:", data.analysis.id);
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
