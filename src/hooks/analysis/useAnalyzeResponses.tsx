
import { useState } from "react";
import { AssessmentResponse, PersonalityAnalysis } from "@/utils/types";
import { toast } from "sonner";
import { saveAssessmentToStorage } from "./useLocalStorage";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { v4 as uuidv4 } from "uuid";

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
      // Generate a unique assessment ID
      const assessmentId = `assessment-${uuidv4()}`;
      
      // Save responses to localStorage
      saveAssessmentToStorage(responses);
      
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
      let savedToSupabase = false;
      if (user) {
        try {
          // We need to convert AssessmentResponse[] to a JSON-compatible format
          const jsonResponses = JSON.parse(JSON.stringify(responses));
          
          // Check if the assessment already exists
          const { data: existingAssessment } = await supabase
            .from('assessments')
            .select('id')
            .eq('id', assessmentId)
            .maybeSingle();
          
          if (!existingAssessment) {
            const { error: assessmentError } = await supabase
              .from('assessments')
              .insert({
                id: assessmentId,
                user_id: user.id,
                responses: jsonResponses
              });
              
            if (assessmentError) {
              console.error("Error saving assessment to Supabase:", assessmentError);
              throw new Error(`Failed to save assessment: ${assessmentError.message}`);
            } else {
              savedToSupabase = true;
              console.log("Successfully saved assessment to Supabase with ID:", assessmentId);
            }
          }
        } catch (err) {
          console.error("Error saving assessment:", err);
          // Continue with analysis even if saving fails
        }
      }
      
      if (!savedToSupabase) {
        console.warn("Assessment was not saved to Supabase, continuing with local analysis");
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
          
          // Create a clean insert object with proper null handling
          const insertObject = {
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
            shadow_aspects: jsonAnalysis.shadowAspects || [], 
            growth_areas: jsonAnalysis.growthAreas,
            relationship_patterns: jsonAnalysis.relationshipPatterns,
            career_suggestions: jsonAnalysis.careerSuggestions,
            learning_pathways: jsonAnalysis.learningPathways,
            roadmap: result.data.analysis.roadmap
          };
          
          console.log("Saving analysis to Supabase with the following structure:", Object.keys(insertObject).join(", "));
          
          const { error: analysisError } = await supabase
            .from('analyses')
            .insert(insertObject);
            
          if (analysisError) {
            console.error("Error saving analysis to Supabase:", analysisError);
            throw new Error(`Database error: ${analysisError.message}`);
          } else {
            console.log("Successfully saved analysis to Supabase with ID:", result.data.analysis.id);
          }
        } catch (err) {
          console.error("Error saving analysis:", err);
          throw new Error(`Failed to save analysis: ${err instanceof Error ? err.message : String(err)}`);
        }
      }
      
      // Save to history and update the current analysis
      const savedAnalysis = saveToHistory(analysisWithUser);
      setAnalysis(savedAnalysis);
      
      toast.success("AI Analysis complete!");
      return savedAnalysis;
    } catch (error) {
      console.error("Error analyzing responses:", error);
      toast.error(`Analysis failed: ${error instanceof Error ? error.message : "Unknown error"}. Using fallback analysis.`);
      
      // Fallback to local mock analysis if the API fails
      const fallbackAnalysis = await import("./mockAnalysisGenerator").then(module => {
        const assessmentId = `fallback-${uuidv4()}`;
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
