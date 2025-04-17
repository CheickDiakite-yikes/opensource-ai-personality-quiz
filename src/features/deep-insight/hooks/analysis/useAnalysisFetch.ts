
import { supabase } from "@/integrations/supabase/client";
import { AnalysisData } from "../../utils/analysis/types";
import { v4 as uuidv4 } from "uuid";

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
      const { data, error } = await supabase.functions.invoke('get-public-analysis', {
        body: { id },
      });
      
      if (error || !data) return null;
      return data as AnalysisData;
    } 

    const { data, error } = await supabase
      .from("deep_insight_analyses")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) return null;
    return data.complete_analysis as AnalysisData;
  };

  return { fetchAnalysisById, ensureValidUUID, isLegacyId };
};
