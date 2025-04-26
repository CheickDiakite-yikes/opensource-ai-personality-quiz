
import { useState, useEffect } from "react";
import { ConciseAnalysisResult } from "../types";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

export const useConciseInsightResults = (assessmentId?: string) => {
  const [analysis, setAnalysis] = useState<ConciseAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        
        if (!assessmentId) {
          setError("No assessment ID provided");
          setLoading(false);
          return;
        }
        
        if (!user) {
          setError("You must be signed in to view results");
          navigate("/auth");
          return;
        }
        
        // Check if analysis already exists
        const { data: existingAnalysis, error: fetchError } = await supabase
          .from('concise_analyses')
          .select('*')
          .eq('assessment_id', assessmentId)
          .single();
          
        if (fetchError && fetchError.code !== 'PGRST116') {
          throw fetchError;
        }
        
        if (existingAnalysis) {
          console.log("Found existing analysis:", existingAnalysis);
          // Fix the type error by checking if analysis_data exists first
          if ('analysis_data' in existingAnalysis) {
            // Cast the JSON data to the expected ConciseAnalysisResult type with type assertion
            setAnalysis(existingAnalysis.analysis_data as unknown as ConciseAnalysisResult);
            setLoading(false);
            return;
          }
        }
        
        // If no analysis exists, get the assessment responses
        const { data: assessment, error: responseError } = await supabase
          .from('concise_assessments')
          .select('*')
          .eq('id', assessmentId)
          .eq('user_id', user.id)
          .single();
          
        if (responseError) {
          throw responseError;
        }
        
        if (!assessment) {
          setError("Assessment not found");
          setLoading(false);
          return;
        }
        
        console.log("Generating analysis for assessment:", assessmentId);
        
        // Call edge function to get analysis - only if no existing analysis was found
        const { data: analysisResult, error: analysisError } = await supabase.functions.invoke(
          'analyze-concise-responses',
          {
            body: { 
              assessmentId,
              responses: (assessment as any).responses,
              userId: user.id  // Pass the user ID to the edge function
            }
          }
        );
        
        if (analysisError) {
          throw analysisError;
        }
        
        console.log("Analysis generated:", analysisResult);
        setAnalysis(analysisResult as ConciseAnalysisResult);
        
        // Save the newly generated analysis to the database
        try {
          const { error: saveError } = await supabase
            .from('concise_analyses')
            .upsert({
              assessment_id: assessmentId,
              user_id: user.id,
              analysis_data: analysisResult as unknown as Json
            });
            
          if (saveError) throw saveError;
          console.log("Newly generated analysis saved to database");
        } catch (saveErr: any) {
          console.error("Error saving new analysis", saveErr);
          toast.error("Analysis generated but couldn't be saved for future use");
        }
        
        setLoading(false);
        
      } catch (err: any) {
        console.error("Error fetching analysis", err);
        setError(err.message || "An error occurred while fetching analysis");
        setLoading(false);
      }
    };
    
    if (assessmentId) {
      fetchAnalysis();
    } else {
      setLoading(false);
    }
  }, [assessmentId, navigate, user]);
  
  const saveAnalysis = async () => {
    if (!analysis || !user) return;
    
    try {
      if (!assessmentId) {
        toast.error("No assessment ID available");
        return;
      }
      
      const { error } = await supabase
        .from('concise_analyses')
        .upsert({
          assessment_id: assessmentId,
          user_id: user.id,
          analysis_data: analysis as unknown as Json
        });
        
      if (error) throw error;
      
      toast.success("Analysis saved successfully");
    } catch (err: any) {
      console.error("Error saving analysis", err);
      toast.error("Failed to save analysis");
    }
  };
  
  return { analysis, loading, error, saveAnalysis };
};
