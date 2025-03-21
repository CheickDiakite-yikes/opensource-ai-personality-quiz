
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
    toast.info("Analyzing your responses with AI...", {
      id: "analyzing-toast",
      duration: 5000
    });

    try {
      // Save responses to localStorage and get assessment ID
      const assessmentId = saveAssessmentToStorage(responses);
      
      console.log("Sending responses to AI for analysis...");
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
              description: assessmentError.message,
              duration: 5000
            });
          } else {
            console.log("Successfully saved assessment to Supabase with ID:", assessmentId);
          }
        } catch (err) {
          console.error("Error saving assessment:", err);
        }
      }
      
      // Call the Supabase Edge Function for AI analysis
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
      
      console.log("Received AI analysis");
      
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
          // Prepare analysis for insertion
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
            toast.error("Could not save your analysis data to your profile, but we've saved it locally", {
              description: analysisError.message,
              duration: 5000
            });
          } else {
            console.log("Successfully saved analysis to Supabase with ID:", data.analysis.id);
            toast.success("Analysis saved to your profile");
          }
        } catch (err) {
          console.error("Error saving analysis:", err);
        }
      }
      
      // Save to history and update the current analysis
      const savedAnalysis = saveToHistory(analysisWithUser);
      setAnalysis(savedAnalysis);
      
      toast.success("AI Analysis complete!", {
        id: "analyzing-toast",
        duration: 3000
      });
      return savedAnalysis;
    } catch (error: any) {
      console.error("Error analyzing responses:", error);
      toast.error("Failed to analyze responses. Using fallback analysis.", {
        id: "analyzing-toast",
        duration: 3000
      });
      
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
