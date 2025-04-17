
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
        
        if (!responses || Object.keys(responses).length === 0) {
          console.log("No responses found");
          toast.error("No assessment responses found", {
            description: "Please complete the assessment first before viewing results"
          });
          // Redirect to the quiz page
          navigate("/deep-insight/quiz");
          throw new Error("No responses found. Please complete the assessment first.");
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
      return result;
    } catch (error) {
      console.error("Error analyzing responses:", error);
      throw error;
    }
  };

  return { analysis, isLoading, error, saveAnalysis };
};
