
import { AnalysisData } from "../../utils/analysis/types";
import { toJsonObject } from "../../utils/analysis/types";

export const useAnalysisCache = () => {
  const cacheAnalysis = (data: AnalysisData) => {
    try {
      sessionStorage.setItem('deep_insight_analysis_cache', JSON.stringify(toJsonObject(data)));
    } catch (err) {
      console.error("Error caching analysis:", err);
    }
  };

  const loadCachedAnalysis = (): AnalysisData | null => {
    try {
      const cached = sessionStorage.getItem('deep_insight_analysis_cache');
      if (cached) {
        const parsedData = JSON.parse(cached);
        console.log("Found cached analysis");
        return parsedData as AnalysisData;
      }
    } catch (err) {
      console.error("Error loading cached analysis:", err);
    }
    return null;
  };
  
  const clearAnalysisCache = () => {
    try {
      sessionStorage.removeItem('deep_insight_analysis_cache');
      console.log("Analysis cache cleared");
    } catch (err) {
      console.error("Error clearing analysis cache:", err);
    }
  };

  return { cacheAnalysis, loadCachedAnalysis, clearAnalysisCache };
};
