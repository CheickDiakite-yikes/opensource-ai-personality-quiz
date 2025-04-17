
import { useState } from "react";
import { AnalysisData } from "../../utils/analysis/types";

export const useAnalysisState = () => {
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [loadedFromCache, setLoadedFromCache] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  return {
    analysis,
    setAnalysis,
    isLoading,
    setIsLoading,
    error,
    setError,
    loadedFromCache,
    setLoadedFromCache,
    retryCount,
    setRetryCount
  };
};
