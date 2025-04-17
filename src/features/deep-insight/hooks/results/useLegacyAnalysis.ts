
import { useState, useEffect } from "react";
import { AnalysisData } from "../../utils/analysis/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useLegacyAnalysis = (isLegacy: boolean, queryParamId: string | null) => {
  const [legacyAnalysis, setLegacyAnalysis] = useState<AnalysisData | null>(null);
  const [isLegacyLoading, setIsLegacyLoading] = useState(false);
  const [legacyError, setLegacyError] = useState<Error | null>(null);

  useEffect(() => {
    if (isLegacy && queryParamId && !legacyAnalysis) {
      const fetchLegacyAnalysis = async () => {
        setIsLegacyLoading(true);
        setLegacyError(null);
        
        try {
          const { data, error } = await supabase.functions.invoke('get-public-analysis', {
            body: { id: queryParamId },
          });
          
          if (error) {
            console.error("Error fetching legacy analysis:", error);
            setLegacyError(new Error(`Error fetching legacy analysis: ${error.message || error}`));
            toast.error("Could not load legacy analysis", {
              description: "This analysis may be in an older format that is no longer supported"
            });
            return;
          }
          
          if (data) {
            console.log("Successfully loaded legacy analysis:", data);
            
            if (!data.interpersonalDynamics) {
              data.interpersonalDynamics = {
                attachmentStyle: "Your attachment style shows a balanced approach to relationships.",
                communicationPattern: "You communicate thoughtfully and prefer meaningful conversations.",
                conflictResolution: "You approach conflicts by seeking to understand different perspectives."
              };
            }
            
            if (!data.relationshipPatterns || Array.isArray(data.relationshipPatterns)) {
              data.relationshipPatterns = {
                strengths: Array.isArray(data.relationshipPatterns) ? data.relationshipPatterns : [],
                challenges: [],
                compatibleTypes: []
              };
            }
            
            setLegacyAnalysis(data as AnalysisData);
            toast.success("Legacy analysis loaded successfully");
          } else {
            console.error("No legacy analysis data found");
            setLegacyError(new Error("No analysis data found"));
            toast.error("Could not find the requested analysis", {
              description: "Try taking a new assessment to generate a current analysis"
            });
          }
        } catch (err) {
          console.error("Exception fetching legacy analysis:", err);
          setLegacyError(err instanceof Error ? err : new Error("An unknown error occurred"));
          toast.error("Error loading legacy analysis", {
            description: "There was a problem retrieving this analysis"
          });
        } finally {
          setIsLegacyLoading(false);
        }
      };
      
      fetchLegacyAnalysis();
    }
  }, [isLegacy, queryParamId, legacyAnalysis]);

  return {
    legacyAnalysis,
    isLegacyLoading,
    legacyError
  };
};
