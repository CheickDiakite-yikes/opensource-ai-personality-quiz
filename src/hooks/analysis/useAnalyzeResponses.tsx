
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
      
      console.log(`Sending ${responses.length} responses to AI for analysis using gpt-4o model...`);
      console.log("Response distribution by category:", 
        Object.entries(
          responses.reduce((acc: Record<string, number>, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + 1;
            return acc;
          }, {})
        ).map(([category, count]) => `${category}: ${count}`).join(', ')
      );
      
      // Store assessment responses in Supabase if user is logged in
      if (user) {
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
          }
        } catch (err) {
          console.error("Error saving assessment:", err);
        }
      }
      
      // Call the Supabase Edge Function for AI analysis with timeout handling
      const functionTimeout = 60000; // 60 seconds timeout
      
      // Create a timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error("Analysis request timed out after 60 seconds"));
        }, functionTimeout);
      });
      
      // Call Supabase function
      const functionPromise = supabase.functions.invoke("analyze-responses", {
        body: { 
          responses, 
          assessmentId 
        }
      });
      
      // Race between function call and timeout
      const result = await Promise.race([functionPromise, timeoutPromise]);
      
      if (!result.data || !result.data.analysis) {
        throw new Error("Invalid response from analysis function");
      }
      
      console.log("Received AI analysis from gpt-4o model:", result.data.analysis);
      
      // Add user ID to the analysis if user is logged in
      let analysisWithUser = result.data.analysis;
      if (user) {
        analysisWithUser = {
          ...result.data.analysis,
          userId: user.id,
          assessmentId: assessmentId
        };
        
        // Save analysis to Supabase
        try {
          // Convert all JSON fields to their string representation to ensure compatibility
          const jsonAnalysis = JSON.parse(JSON.stringify(result.data.analysis));
          
          const { error: analysisError } = await supabase
            .from('analyses')
            .insert({
              id: result.data.analysis.id,
              user_id: user.id,
              assessment_id: assessmentId,
              result: jsonAnalysis,
              overview: result.data.analysis.overview,
              traits: jsonAnalysis.traits,
              intelligence: jsonAnalysis.intelligence,
              intelligence_score: result.data.analysis.intelligenceScore,
              emotional_intelligence_score: result.data.analysis.emotionalIntelligenceScore,
              cognitive_style: jsonAnalysis.cognitiveStyle,
              value_system: jsonAnalysis.valueSystem,
              motivators: jsonAnalysis.motivators,
              inhibitors: jsonAnalysis.inhibitors,
              weaknesses: jsonAnalysis.weaknesses,
              shadow_aspects: jsonAnalysis.shadowAspects, 
              growth_areas: jsonAnalysis.growthAreas,
              relationship_patterns: jsonAnalysis.relationshipPatterns,
              career_suggestions: jsonAnalysis.careerSuggestions,
              learning_pathways: jsonAnalysis.learningPathways,
              roadmap: result.data.analysis.roadmap
            });
            
          if (analysisError) {
            console.error("Error saving analysis to Supabase:", analysisError);
            throw new Error(`Database error: ${analysisError.message}`);
          }
        } catch (err) {
          console.error("Error saving analysis:", err);
          throw new Error(`Failed to save analysis: ${err.message}`);
        }
      }
      
      // Save to history and update the current analysis
      const savedAnalysis = saveToHistory(analysisWithUser);
      setAnalysis(savedAnalysis);
      
      toast.success("AI Analysis complete!");
      return savedAnalysis;
    } catch (error) {
      console.error("Error analyzing responses:", error);
      toast.error(`Analysis failed: ${error.message || "Unknown error"}. Using fallback analysis.`);
      
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
