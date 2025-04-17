
import { supabase } from "@/integrations/supabase/client";
import { AnalysisData } from "../../utils/analysis/types";
import { v4 as uuidv4 } from "uuid";
import { ensureAnalysisStructure } from "../../utils/analysis/ensureAnalysisStructure";

export const useAnalysisFetch = () => {
  const ensureValidUUID = (id: string): string => {
    try {
      const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (regex.test(id)) {
        return id;
      }
      return uuidv4();
    } catch (error) {
      return uuidv4();
    }
  };

  const isLegacyId = (id: string): boolean => {
    return id.startsWith('analysis-') || !id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  };

  const fetchAnalysisById = async (id: string): Promise<AnalysisData | null> => {
    if (isLegacyId(id)) {
      try {
        const { data, error } = await supabase.functions.invoke('get-public-analysis', {
          body: { id },
        });
        
        if (error || !data) return null;
        
        // Properly cast and validate the response data
        const analysisData = data as unknown as AnalysisData;
        
        // Ensure the data has the correct structure
        ensureAnalysisStructure(analysisData);
        
        return analysisData;
      } catch (error) {
        console.error("Error fetching legacy analysis:", error);
        return null;
      }
    } 

    try {
      const { data, error } = await supabase
        .from("deep_insight_analyses")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error || !data) return null;
      
      // Ensure we're getting the right type
      const analysisData = data.complete_analysis as unknown as AnalysisData;
      
      // Validate the structure
      ensureAnalysisStructure(analysisData);
      
      return analysisData;
    } catch (error) {
      console.error("Error fetching analysis directly:", error);
      return null;
    }
  };

  return { fetchAnalysisById, ensureValidUUID, isLegacyId };
};
