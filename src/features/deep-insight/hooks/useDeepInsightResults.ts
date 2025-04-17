
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { DeepInsightResponses } from "../types";
import { generateAnalysisFromResponses } from "../utils/analysis/analysisGenerator";
import { AnalysisData } from "../utils/analysis/types";
import { supabase } from "@/integrations/supabase/client";
import { saveAnalysisToHistory } from "@/hooks/analysis/useLocalStorage";

// Fix the re-export using "export type" for TypeScript's isolatedModules
export type { AnalysisData };

export const useDeepInsightResults = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  
  // Effect to handle generating analysis from responses
  useEffect(() => {
    const generateAnalysis = async () => {
      try {
        // Retrieve responses from location state
        const responseData = location.state?.responses as DeepInsightResponses;
        
        if (!responseData) {
          setError("No assessment data found. Please complete the assessment first.");
          setLoading(false);
          return;
        }
        
        console.log("Generating analysis for responses:", responseData);
        setLoading(true);
        
        try {
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
          setAnalysis(data.analysis);
          toast.success("Analysis generated successfully!");
          
        } catch (apiError) {
          console.error("API error, falling back to local analysis:", apiError);
          toast.error("AI analysis service unavailable. Falling back to local analysis generation.");
          
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
        toast.error("Something went wrong while generating your analysis.");
      }
    };
    
    generateAnalysis();
  }, [location.state]);
  
  // Function to save the analysis
  const saveAnalysis = async () => {
    try {
      if (!analysis) return;
      
      // Save to local storage regardless of user login status
      const savedAnalysis = saveAnalysisToHistory(analysis);
      
      if (!user) {
        // If not logged in, just save to local storage
        toast.success("Your analysis has been saved locally!");
        console.log("Analysis saved to local storage");
        return;
      }
      
      // For logged in users, we already save to Supabase in ResultsActions component
      // This function is called by ResultsActions after saving to Supabase
      console.log("Analysis saved for user:", user.id);
      
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
