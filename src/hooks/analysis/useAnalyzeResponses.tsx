
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

  const analyzeResponses = async (
    responses: AssessmentResponse[], 
    assessmentId?: string
  ): Promise<PersonalityAnalysis> => {
    setIsAnalyzing(true);
    toast.info("Analyzing your responses with AI...", {
      id: "analyzing-toast",
      duration: 5000
    });

    try {
      // If no assessmentId is provided, generate one
      const finalAssessmentId = assessmentId || `assessment-${Date.now()}`;
      
      // Save responses to localStorage
      saveAssessmentToStorage(responses, finalAssessmentId);
      
      console.log("Starting AI analysis for responses:", responses.length);
      console.log("User logged in:", user ? "yes" : "no", "User ID:", user?.id || "none");
      console.log("Using assessment ID:", finalAssessmentId);
      
      // Call the Supabase Edge Function for AI analysis
      console.log("Calling analyze-responses edge function with assessment ID:", finalAssessmentId);
      const { data, error } = await supabase.functions.invoke("analyze-responses", {
        body: { 
          responses, 
          assessmentId: finalAssessmentId,
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
      
      console.log("Received AI analysis:", data.analysis.id);
      
      // Add user ID and assessment ID to the analysis if user is logged in
      let analysisWithUser = {
        ...data.analysis,
        assessmentId: finalAssessmentId
      };
      
      if (user) {
        analysisWithUser.userId = user.id;
        
        // Save analysis to Supabase
        try {
          console.log("Saving analysis to Supabase for user:", user.id);
          
          // Ensure the analysis data has the right format for Supabase
          const formattedData = {
            id: data.analysis.id,
            user_id: user.id,
            assessment_id: finalAssessmentId,
            result: data.analysis,
            overview: data.analysis.overview || '',
            traits: Array.isArray(data.analysis.traits) ? data.analysis.traits : [],
            intelligence: data.analysis.intelligence || { type: '', score: 0, description: '', domains: [] },
            intelligence_score: typeof data.analysis.intelligenceScore === 'number' ? data.analysis.intelligenceScore : 0,
            emotional_intelligence_score: typeof data.analysis.emotionalIntelligenceScore === 'number' ? data.analysis.emotionalIntelligenceScore : 0,
            cognitive_style: data.analysis.cognitiveStyle || '',
            value_system: Array.isArray(data.analysis.valueSystem) ? data.analysis.valueSystem : [],
            motivators: Array.isArray(data.analysis.motivators) ? data.analysis.motivators : [],
            inhibitors: Array.isArray(data.analysis.inhibitors) ? data.analysis.inhibitors : [],
            weaknesses: Array.isArray(data.analysis.weaknesses) ? data.analysis.weaknesses : [],
            growth_areas: Array.isArray(data.analysis.growthAreas) ? data.analysis.growthAreas : [],
            relationship_patterns: Array.isArray(data.analysis.relationshipPatterns) ? data.analysis.relationshipPatterns : 
              typeof data.analysis.relationshipPatterns === 'object' ? data.analysis.relationshipPatterns : [],
            career_suggestions: Array.isArray(data.analysis.careerSuggestions) ? data.analysis.careerSuggestions : [],
            learning_pathways: Array.isArray(data.analysis.learningPathways) ? data.analysis.learningPathways : [],
            roadmap: data.analysis.roadmap || ''
          };

          // Insert the formatted data
          const { error: analysisError } = await supabase
            .from('analyses')
            .insert(formattedData);
            
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
      } else {
        console.log("User not logged in, analysis will only be stored locally");
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
        const generatedAssessmentId = assessmentId || `assessment-${Date.now()}`;
        return module.generateMockAnalysis(generatedAssessmentId);
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
