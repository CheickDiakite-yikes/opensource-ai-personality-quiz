
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
      const assessmentId = `assessment-${Date.now()}`;
      
      // Save responses to localStorage
      saveAssessmentToStorage(responses);
      console.log(`Saved ${responses.length} responses to localStorage`);
      
      console.log(`Sending ${responses.length} responses to AI for analysis using gpt-4o model...`);
      
      // Log detailed response distribution
      const categoryDistribution = responses.reduce((acc: Record<string, number>, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + 1;
        return acc;
      }, {});
      
      console.log("Response distribution by category:", 
        Object.entries(categoryDistribution)
          .map(([category, count]) => `${category}: ${count} (${Math.round((count/responses.length)*100)}%)`)
          .join(', ')
      );
      
      // Check for empty responses that might cause issues
      const emptyResponses = responses.filter(r => 
        (!r.selectedOption || r.selectedOption.trim() === "") && 
        (!r.customResponse || r.customResponse.trim() === "")
      );
      
      if (emptyResponses.length > 0) {
        console.warn(`Found ${emptyResponses.length} empty responses that may affect analysis quality`);
        console.warn("Empty response IDs:", emptyResponses.map(r => r.questionId).join(", "));
      }
      
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
            console.log(`Saving assessment ${assessmentId} to Supabase...`);
            
            const { error: assessmentError } = await supabase
              .from('assessments')
              .insert({
                id: assessmentId,
                user_id: user.id,
                responses: jsonResponses
              });
              
            if (assessmentError) {
              console.error("Error saving assessment to Supabase:", assessmentError);
              console.error("Error details:", JSON.stringify(assessmentError));
              console.warn(`Failed to save assessment: ${assessmentError.message}`);
            } else {
              savedToSupabase = true;
              console.log("Successfully saved assessment to Supabase with ID:", assessmentId);
            }
          } else {
            console.log(`Assessment ${assessmentId} already exists in Supabase, skipping save`);
          }
        } catch (err) {
          console.error("Error saving assessment:", err);
          console.error("Error stack:", err instanceof Error ? err.stack : "No stack available");
          // Continue with analysis even if saving fails
        }
      }
      
      if (!savedToSupabase) {
        console.warn("Assessment was not saved to Supabase, continuing with local analysis");
      }
      
      // Call the Supabase Edge Function for AI analysis with timeout handling
      const functionTimeout = 120000; // Increase timeout to 120 seconds (2 minutes) since GPT-4 analysis can take time
      console.log(`Setting timeout for analysis function to ${functionTimeout/1000} seconds`);
      
      // Create a timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Analysis request timed out after ${functionTimeout/1000} seconds`));
        }, functionTimeout);
      });
      
      // Call Supabase function with detailed request info
      console.log(`Calling Supabase analyze-responses function with assessment ID ${assessmentId}`);
      console.time('analyze-responses-call');
      
      const functionPromise = supabase.functions.invoke("analyze-responses", {
        body: { 
          responses, 
          assessmentId 
        }
      });
      
      // Race between function call and timeout
      const result = await Promise.race([functionPromise, timeoutPromise]);
      console.timeEnd('analyze-responses-call');
      console.log("Supabase function analyze-responses completed");
      
      if (!result) {
        console.error("Empty result from Supabase function");
        throw new Error("Empty response from Supabase function");
      }
      
      if (result.error) {
        console.error("Supabase function error:", result.error);
        throw new Error(`Supabase function error: ${result.error}`);
      }
      
      if (!result.data || !result.data.analysis) {
        console.error("Invalid response structure from analysis function:", JSON.stringify(result));
        throw new Error("Invalid response from analysis function - missing analysis data");
      }
      
      console.log("Received AI analysis from gpt-4o model:", result.data.analysis.id);
      console.log("Analysis overview length:", result.data.analysis.overview?.length || 0);
      console.log("Analysis traits count:", result.data.analysis.traits?.length || 0);
      
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
          
          console.log("Saving analysis to Supabase with ID:", result.data.analysis.id);
          
          // Create a clean insert object with proper null handling
          const insertObject = {
            id: result.data.analysis.id,
            user_id: user.id,
            assessment_id: assessmentId,
            result: jsonAnalysis,
            overview: result.data.analysis.overview,
            traits: jsonAnalysis.traits || [],
            intelligence: jsonAnalysis.intelligence || null,
            intelligence_score: result.data.analysis.intelligenceScore || 0,
            emotional_intelligence_score: result.data.analysis.emotionalIntelligenceScore || 0,
            cognitive_style: jsonAnalysis.cognitiveStyle || null,
            value_system: jsonAnalysis.valueSystem || [],
            motivators: jsonAnalysis.motivators || [],
            inhibitors: jsonAnalysis.inhibitors || [],
            weaknesses: jsonAnalysis.weaknesses || [],
            shadow_aspects: jsonAnalysis.shadowAspects || [], 
            growth_areas: jsonAnalysis.growthAreas || [],
            relationship_patterns: jsonAnalysis.relationshipPatterns || null,
            career_suggestions: jsonAnalysis.careerSuggestions || [],
            learning_pathways: jsonAnalysis.learningPathways || [],
            roadmap: result.data.analysis.roadmap || ""
          };
          
          console.log("Saving analysis to Supabase structure:", Object.keys(insertObject).join(", "));
          
          const { error: analysisError } = await supabase
            .from('analyses')
            .insert(insertObject);
            
          if (analysisError) {
            console.error("Error saving analysis to Supabase:", analysisError);
            console.error("Error details:", JSON.stringify(analysisError));
            console.warn(`Database error: ${analysisError.message}`);
          } else {
            console.log("Successfully saved analysis to Supabase with ID:", result.data.analysis.id);
          }
        } catch (err) {
          console.error("Error saving analysis:", err);
          console.error("Error stack:", err instanceof Error ? err.stack : "No stack available");
          console.warn(`Failed to save analysis: ${err instanceof Error ? err.message : String(err)}`);
        }
      }
      
      // Save to history and update the current analysis
      console.log("Saving analysis to local history");
      const savedAnalysis = saveToHistory(analysisWithUser);
      setAnalysis(savedAnalysis);
      
      toast.success("AI Analysis complete!", {
        description: "Your personality profile is ready to view"
      });
      
      return savedAnalysis;
    } catch (error) {
      console.error("Error analyzing responses:", error);
      console.error("Error stack:", error instanceof Error ? error.stack : "No stack available");
      toast.error(`Analysis failed: ${error instanceof Error ? error.message : "Unknown error"}. Using fallback analysis.`);
      
      // Fallback to local mock analysis if the API fails
      console.log("Using fallback mock analysis generator");
      const fallbackAnalysis = await import("./mockAnalysisGenerator").then(module => {
        const assessmentId = `fallback-${uuidv4()}`;
        return module.generateMockAnalysis(assessmentId);
      });
      
      console.log("Generated fallback analysis with ID:", fallbackAnalysis.id);
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
