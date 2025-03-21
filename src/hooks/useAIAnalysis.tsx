
import { useState } from "react";
import { AssessmentResponse, PersonalityAnalysis } from "@/utils/types";
import { useAnalyzeResponses } from "./analysis/useAnalyzeResponses";
import { saveAnalysisToHistory, getAnalysisById, getAnalysisHistory } from "./analysis/useLocalStorage";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { convertToPersonalityAnalysis } from "@/components/report/utils/dataConverters";
import { toast } from "sonner";

export const useAIAnalysis = () => {
  const [analysis, setAnalysis] = useState<PersonalityAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  // Use the useAnalyzeResponses hook to handle analysis operations
  const { isAnalyzing, analyzeResponses: processResponses } = useAnalyzeResponses(
    saveAnalysisToHistory,
    setAnalysis
  );
  
  // Wrapper function to analyze responses
  const analyzeResponses = (
    responses: AssessmentResponse[], 
    assessmentId?: string
  ): Promise<PersonalityAnalysis> => {
    return processResponses(responses, assessmentId);
  };
  
  // Get analysis by ID from local storage
  const getAnalysis = (id: string): PersonalityAnalysis | null => {
    return getAnalysisById(id);
  };
  
  // Set current analysis by ID
  const setCurrentAnalysis = (idOrAnalysis: string | PersonalityAnalysis): boolean => {
    try {
      if (typeof idOrAnalysis === 'string') {
        const foundAnalysis = getAnalysisById(idOrAnalysis);
        if (foundAnalysis) {
          setAnalysis(foundAnalysis);
          return true;
        }
        return false;
      } else {
        setAnalysis(idOrAnalysis);
        return true;
      }
    } catch (err) {
      console.error("Error setting current analysis:", err);
      return false;
    }
  };
  
  // Refresh analysis data from Supabase
  const refreshAnalysis = async (): Promise<void> => {
    if (!user) {
      // If user is not logged in, just load from local storage
      const analyses = getAnalysisHistory();
      if (analyses.length > 0) {
        setAnalysis(analyses[0]);
      }
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Refreshing analysis data from Supabase for user:", user.id);
      
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw new Error(`Error fetching analyses: ${error.message}`);
      }
      
      if (data && data.length > 0) {
        console.log(`Found ${data.length} analyses in Supabase`);
        
        // Convert to PersonalityAnalysis objects
        const analyses = data.map(item => convertToPersonalityAnalysis(item));
        
        // Save all analyses to local storage
        analyses.forEach(analysis => saveAnalysisToHistory(analysis));
        
        // Set the most recent analysis as current
        setAnalysis(analyses[0]);
        toast.success("Analysis data refreshed from your account");
      } else {
        console.log("No analyses found in Supabase");
        // No analyses found in Supabase, check local storage
        const localAnalyses = getAnalysisHistory();
        if (localAnalyses.length > 0) {
          setAnalysis(localAnalyses[0]);
        }
      }
    } catch (err: any) {
      console.error("Error refreshing analysis:", err);
      setError(err.message || "Error refreshing analysis data");
      toast.error("Could not refresh analysis data");
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    analysis,
    setAnalysis,
    isAnalyzing,
    isLoading,
    error,
    analyzeResponses,
    getAnalysis,
    getAnalysisHistory,
    setCurrentAnalysis,
    refreshAnalysis
  };
};
