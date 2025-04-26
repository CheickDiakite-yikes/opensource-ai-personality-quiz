
import { useState } from "react";
import { ConciseAnalysisResult } from "../types";

export const useAnalysisState = () => {
  const [analysis, setAnalysis] = useState<ConciseAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  return {
    analysis,
    setAnalysis,
    loading,
    setLoading,
    error,
    setError,
  };
};

