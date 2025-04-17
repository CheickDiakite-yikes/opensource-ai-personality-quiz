
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { DeepInsightResponses } from "../types";
import { generateAnalysisFromResponses } from "../utils/analysis/analysisGenerator";
import { PersonalityAnalysis } from "@/utils/types";

export const useDeepInsightResults = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<PersonalityAnalysis | null>(null);
  
  // Effect to handle generating analysis from responses
  useEffect(() => {
    const generateAnalysis = async () => {
      try {
        // Retrieve responses from location state
        const responseData = location.state?.responses;
        
        if (!responseData) {
          setError("No assessment data found. Please complete the assessment first.");
          setLoading(false);
          return;
        }
        
        // In a real app, we would call an API to analyze the responses
        // For now, we'll simulate a delay and generate a personalized analysis
        setLoading(true);
        
        // Simulate API call delay
        setTimeout(() => {
          const generatedAnalysis = generateAnalysisFromResponses(responseData);
          setAnalysis(generatedAnalysis);
          setLoading(false);
        }, 3000); // 3 second delay to simulate processing
        
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
      
      // In a real app, we would save to a database
      toast.success("Your analysis has been saved!");
      
      // If connected to Supabase, we would do something like:
      // await supabase
      //   .from('analyses')
      //   .insert({
      //     user_id: user?.id,
      //     result: analysis,
      //     // other fields...
      //   });
      
      console.log("Analysis saved for user:", user?.id);
      
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
