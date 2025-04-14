
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { ComprehensiveAnalysis } from "@/utils/types";
import { toast } from "sonner";

export const useComprehensiveAnalysisFallback = (assessmentId: string | undefined) => {
  const [isPolling, setIsPolling] = useState(false);
  const [foundAnalysis, setFoundAnalysis] = useState<ComprehensiveAnalysis | null>(null);
  
  // Function to poll for analysis completion
  const pollForAnalysis = async (id: string, maxAttempts = 3) => {
    if (!id) return null;
    
    setIsPolling(true);
    let attempts = 0;
    
    try {
      // First, check if analysis already exists
      const { data: existingAnalysis } = await supabase
        .from('comprehensive_analyses')
        .select('*')
        .eq('assessment_id', id)
        .maybeSingle();
      
      if (existingAnalysis) {
        console.log("Found existing analysis for assessment:", id);
        setFoundAnalysis(existingAnalysis as unknown as ComprehensiveAnalysis);
        return existingAnalysis;
      }
      
      // If not found, try to trigger analysis and poll
      while (attempts < maxAttempts) {
        attempts++;
        console.log(`Polling for analysis of assessment ${id} - attempt ${attempts}/${maxAttempts}`);
        
        if (attempts === 1) {
          // On first attempt, try to trigger the analysis
          try {
            // Get the assessment data to pass to the analysis function
            const { data: assessmentData } = await supabase
              .from('comprehensive_assessments')
              .select('*')
              .eq('id', id)
              .single();
              
            if (assessmentData?.responses) {
              toast.loading("Attempting to analyze responses...", { id: "poll-analysis" });
              
              // Try to analyze the responses
              await supabase.functions.invoke(
                "analyze-comprehensive-responses",
                {
                  body: { 
                    assessmentId: id,
                    responses: assessmentData.responses
                  }
                }
              );
            }
          } catch (err) {
            console.error("Error triggering analysis:", err);
          }
        }
        
        // Wait before checking if analysis is complete
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Check if analysis exists now
        const { data: analysis } = await supabase
          .from('comprehensive_analyses')
          .select('*')
          .eq('assessment_id', id)
          .maybeSingle();
        
        if (analysis) {
          console.log("Analysis completed for assessment:", id);
          toast.success("Analysis completed!", { id: "poll-analysis" });
          setFoundAnalysis(analysis as unknown as ComprehensiveAnalysis);
          return analysis;
        }
        
        toast.loading(`Waiting for analysis to complete (${attempts}/${maxAttempts})...`, { id: "poll-analysis" });
      }
      
      toast.error("Could not retrieve analysis after multiple attempts", { id: "poll-analysis" });
      return null;
    } catch (error) {
      console.error("Error in pollForAnalysis:", error);
      toast.error("Error retrieving analysis", { id: "poll-analysis" });
      return null;
    } finally {
      setIsPolling(false);
    }
  };

  return {
    pollForAnalysis,
    isPolling,
    foundAnalysis
  };
};
