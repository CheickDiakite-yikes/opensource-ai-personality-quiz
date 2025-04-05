
import { PersonalityAnalysis } from "@/utils/types";

export interface AIAnalysisState {
  analysis: PersonalityAnalysis | null;
  analysisHistory: PersonalityAnalysis[];
  isLoading: boolean;
  lastRefresh: Date;
}

export interface AIAnalysisActions {
  setAnalysis: (analysis: PersonalityAnalysis | null) => void;
  setAnalysisHistory: (history: PersonalityAnalysis[] | ((prev: PersonalityAnalysis[]) => PersonalityAnalysis[])) => void;
  setIsLoading: (loading: boolean) => void;
  setLastRefresh: (date: Date) => void;
}
