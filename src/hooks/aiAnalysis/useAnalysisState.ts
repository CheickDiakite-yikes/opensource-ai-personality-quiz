
import { useState } from 'react';
import { PersonalityAnalysis } from "@/utils/types";
import { AIAnalysisState } from './types';

// This hook manages the core state of the analysis
export const useAnalysisState = (): AIAnalysisState & {
  setAnalysis: (analysis: PersonalityAnalysis | null) => void;
  setAnalysisHistory: (history: PersonalityAnalysis[]) => void;
  setIsLoading: (loading: boolean) => void;
  setLastRefresh: (date: Date) => void;
} => {
  const [analysis, setAnalysis] = useState<PersonalityAnalysis | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<PersonalityAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  return {
    analysis,
    analysisHistory,
    isLoading,
    lastRefresh,
    setAnalysis,
    setAnalysisHistory,
    setIsLoading,
    setLastRefresh
  };
};
