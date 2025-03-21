
import { useState, useEffect, useCallback } from "react";
import { AssessmentResponse, PersonalityAnalysis } from "@/utils/types";
import { useAnalyzeResponses } from "./analysis/useAnalyzeResponses";
import { saveAnalysisToHistory, getAnalysisById, getAnalysisHistory } from "./analysis/useLocalStorage";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { convertToPersonalityAnalysis } from "@/components/report/utils/dataConverters";
import { toast } from "sonner";

export const useAIAnalysis = () => {
  const [analysis, setAnalysis] = useState<PersonalityAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user, session } = useAuth();
  
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
  
  // Get analysis by ID from local storage or Supabase
  const getAnalysis = async (id: string): Promise<PersonalityAnalysis | null> => {
    // First check localStorage
    const localAnalysis = getAnalysisById(id);
    if (localAnalysis) {
      return localAnalysis;
    }
    
    // If not in localStorage and user is logged in, try Supabase
    if (user) {
      try {
        console.log("Fetching specific analysis from Supabase:", id);
        const { data, error } = await supabase
          .from('analyses')
          .select('*')
          .eq('id', id)
          .maybeSingle();
          
        if (error) {
          console.error("Error fetching analysis from Supabase:", error);
          return null;
        }
        
        if (data) {
          const analysisData = convertToPersonalityAnalysis(data);
          // Save to localStorage for future reference
          saveAnalysisToHistory(analysisData);
          return analysisData;
        }
      } catch (err) {
        console.error("Error retrieving analysis:", err);
      }
    }
    
    return null;
  };
  
  // Set current analysis by ID
  const setCurrentAnalysis = async (idOrAnalysis: string | PersonalityAnalysis): Promise<boolean> => {
    try {
      if (typeof idOrAnalysis === 'string') {
        // First check localStorage
        const foundAnalysis = getAnalysisById(idOrAnalysis);
        if (foundAnalysis) {
          setAnalysis(foundAnalysis);
          return true;
        }
        
        // If not in localStorage and user is logged in, try Supabase
        if (user) {
          console.log("Analysis not found in localStorage, checking Supabase:", idOrAnalysis);
          const { data, error } = await supabase
            .from('analyses')
            .select('*')
            .eq('id', idOrAnalysis)
            .maybeSingle();
            
          if (error) {
            console.error("Error fetching analysis from Supabase:", error);
            return false;
          }
          
          if (data) {
            const analysisData = convertToPersonalityAnalysis(data);
            // Save to localStorage for future reference
            saveAnalysisToHistory(analysisData);
            setAnalysis(analysisData);
            return true;
          }
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
  
  // Refresh analysis data from Supabase - using useCallback to prevent recreation
  const refreshAnalysis = useCallback(async (): Promise<void> => {
    if (!user) {
      // If user is not logged in, just load from local storage
      const analyses = getAnalysisHistory();
      if (analyses.length > 0) {
        setAnalysis(analyses[0]);
      }
      setIsLoading(false);
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
        console.log("Set most recent analysis:", analyses[0].id);
      } else {
        console.log("No analyses found in Supabase");
        // No analyses found in Supabase, check local storage
        const localAnalyses = getAnalysisHistory();
        if (localAnalyses.length > 0) {
          setAnalysis(localAnalyses[0]);
        } else {
          // If there are no analyses in storage, set analysis to null
          setAnalysis(null);
        }
      }
    } catch (err: any) {
      console.error("Error refreshing analysis:", err);
      setError(err.message || "Error refreshing analysis data");
      toast.error("Could not refresh analysis data");
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  // Automatically fetch analysis data from Supabase when component mounts or user changes
  useEffect(() => {
    if (user && session) {
      console.log("User is logged in, automatically fetching analysis data from Supabase");
      refreshAnalysis();
    } else {
      // Not logged in, check local storage
      const analyses = getAnalysisHistory();
      if (analyses.length > 0) {
        setAnalysis(analyses[0]);
      } else {
        // If there are no analyses in storage, set analysis to null
        setAnalysis(null);
      }
      setIsLoading(false);
    }
  }, [user, session, refreshAnalysis]);
  
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
