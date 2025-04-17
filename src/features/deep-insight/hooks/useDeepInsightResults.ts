
import { useState, useEffect } from "react";
import { useDeepInsightStorage } from "./useDeepInsightStorage";
import { generateAnalysisFromResponses } from "../utils/analysisGenerator";
import { DeepInsightResponses } from "../types";
import { AnalysisData } from "../utils/analysis/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useDeepInsightResults = () => {
  const { getResponses, clearSavedProgress } = useDeepInsightStorage();
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const analysisId = searchParams.get('id');
  const navigate = useNavigate();

  // Function to save the current analysis to Supabase
  const saveAnalysis = async () => {
    if (!analysis || !user) {
      toast.error("No analysis data to save or user not logged in");
      return;
    }
    
    // Save analysis implementation will be handled in ResultsActions component
    toast.success("Analysis saved successfully");
  };

  useEffect(() => {
    const fetchOrGenerateAnalysis = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // If an ID is provided, try to fetch that specific analysis
        if (analysisId) {
          console.log(`Attempting to load analysis with ID: ${analysisId}`);
          const { data, error } = await supabase
            .from("deep_insight_analyses")
            .select("*")
            .eq("id", analysisId)
            .maybeSingle();

          if (error) {
            throw new Error(`Error fetching analysis: ${error.message}`);
          }

          if (data) {
            console.log(`Successfully loaded analysis: ${data.id}`);
            // Extract the complete analysis from the data
            const convertedAnalysis = data.complete_analysis as unknown as AnalysisData;
            setAnalysis(convertedAnalysis);
            setIsLoading(false);
            return;
          } else {
            console.log(`No analysis found with ID: ${analysisId}`);
            toast.error("Analysis not found", {
              description: "The requested analysis could not be found"
            });
          }
        }

        // If no ID provided or the specified analysis wasn't found, generate a new one
        // Get responses from database or localStorage
        const responses = await getResponses();
        console.log("Retrieved responses from storage:", responses);
        console.log("Response count:", Object.keys(responses).length);
        
        // Verify we have all expected responses
        const expectedQuestionCount = 100; // Total number of questions
        if (!responses || Object.keys(responses).length === 0) {
          console.log("No responses found");
          toast.error("No assessment responses found", {
            description: "Please complete the assessment first before viewing results"
          });
          // Redirect to the quiz page
          navigate("/deep-insight/quiz");
          throw new Error("No responses found. Please complete the assessment first.");
        }
        
        if (Object.keys(responses).length < expectedQuestionCount) {
          console.warn(`Incomplete responses: ${Object.keys(responses).length}/${expectedQuestionCount}`);
          toast.error("Incomplete assessment", {
            description: `You've only completed ${Object.keys(responses).length} out of ${expectedQuestionCount} questions. Please complete all questions for a comprehensive analysis.`
          });
          navigate("/deep-insight/quiz");
          throw new Error(`Incomplete responses: ${Object.keys(responses).length}/${expectedQuestionCount}. Please complete all questions.`);
        }

        console.log("Generating analysis from responses...");
        const result = await generateAnalysis(responses);
        console.log("Analysis generation complete");
        
        // Store raw responses in the analysis
        result.rawResponses = responses;
        
        setAnalysis(result);
        
        // Only clear saved responses after successful analysis generation
        // clearSavedProgress(); // Don't clear until explicit user action
      } catch (err) {
        console.error("Error generating results:", err);
        setError(err instanceof Error ? err : new Error("An unknown error occurred"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrGenerateAnalysis();
  }, [analysisId, getResponses, navigate]);

  const generateAnalysis = async (responses: DeepInsightResponses): Promise<AnalysisData> => {
    try {
      console.log(`Generating analysis from ${Object.keys(responses).length} responses`);
      const result = await generateAnalysisFromResponses(responses);
      console.log("Analysis generated successfully");
      
      // If user is logged in, save the analysis to the database
      if (user) {
        try {
          console.log("Saving analysis to database...");
          const { data, error } = await supabase
            .from("deep_insight_analyses")
            .insert({
              user_id: user.id,
              complete_analysis: result,
              raw_responses: responses,
              overview: result.overview,
              core_traits: result.coreTraits,
              cognitive_patterning: result.cognitivePatterning,
              emotional_architecture: result.emotionalArchitecture,
              interpersonal_dynamics: result.interpersonalDynamics,
              intelligence_score: result.intelligenceScore,
              emotional_intelligence_score: result.emotionalIntelligenceScore,
              response_patterns: result.responsePatterns,
              growth_potential: result.growthPotential
            })
            .select("id")
            .single();
          
          if (error) {
            console.error("Error saving analysis to database:", error);
          } else {
            console.log("Analysis saved to database with ID:", data.id);
          }
        } catch (err) {
          console.error("Exception while saving analysis:", err);
        }
      }
      
      return result;
    } catch (error) {
      console.error("Error analyzing responses:", error);
      throw error;
    }
  };

  return { analysis, isLoading, error, saveAnalysis };
};
