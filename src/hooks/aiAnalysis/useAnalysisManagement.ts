
import { useCallback } from 'react';
import { saveAnalysisToHistory } from '../analysis/useLocalStorage';
import { AIAnalysisState, AIAnalysisActions } from './types';
import { PersonalityAnalysis } from '@/utils/types';

// Function to sort analyses by date, with newest first
const sortAnalysesByDate = (analyses: PersonalityAnalysis[]): PersonalityAnalysis[] => {
  if (!analyses || !Array.isArray(analyses)) return [];
  
  return [...analyses].sort((a, b) => {
    const dateA = new Date(a.createdAt || '');
    const dateB = new Date(b.createdAt || '');
    return dateB.getTime() - dateA.getTime(); // Newest first
  });
};

// Hook for managing analysis state
export const useAnalysisManagement = (
  state: AIAnalysisState,
  actions: AIAnalysisActions
) => {
  const { analysisHistory, setAnalysis, setAnalysisHistory } = { ...state, ...actions };

  // Function to save analysis to history
  const saveToHistory = useCallback((newAnalysis: PersonalityAnalysis) => {
    const savedAnalysis = saveAnalysisToHistory(newAnalysis, analysisHistory);
    // Update the history state - always keep sorted by date
    setAnalysisHistory(prev => sortAnalysesByDate([savedAnalysis, ...prev.filter(a => a.id !== savedAnalysis.id)]));
    return savedAnalysis;
  }, [analysisHistory, setAnalysisHistory]);

  // Utility functions for history management
  const getAnalysisHistory = useCallback(() => {
    return analysisHistory;
  }, [analysisHistory]);

  const setCurrentAnalysis = useCallback((analysisId: string) => {
    const selected = analysisHistory.find(item => item.id === analysisId);
    if (selected) {
      setAnalysis(selected);
      return true;
    }
    return false;
  }, [analysisHistory, setAnalysis]);

  return {
    saveToHistory,
    getAnalysisHistory,
    setCurrentAnalysis
  };
};
