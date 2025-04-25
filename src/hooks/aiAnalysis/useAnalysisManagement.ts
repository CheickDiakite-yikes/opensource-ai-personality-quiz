
import { useState } from 'react';
import { PersonalityAnalysis } from '@/utils/types';
import { sortAnalysesByDate } from './utils';

export function useAnalysisManagement() {
  const [analysisHistory, setAnalysisHistory] = useState<PersonalityAnalysis[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<PersonalityAnalysis | null>(null);

  const getAnalysisHistory = (): PersonalityAnalysis[] => analysisHistory;

  const addToHistory = (analysis: PersonalityAnalysis): PersonalityAnalysis => {
    const existingIndex = analysisHistory.findIndex((a) => a.id === analysis.id);
    
    if (existingIndex >= 0) {
      // If the analysis already exists, update it
      const updatedHistory = [...analysisHistory];
      updatedHistory[existingIndex] = analysis;
      
      // Sort by date (newest first)
      const sortedHistory = sortAnalysesByDate(updatedHistory);
      setAnalysisHistory(sortedHistory);
      
      // Update current analysis if this is the one we're viewing
      if (currentAnalysis && currentAnalysis.id === analysis.id) {
        setCurrentAnalysis(analysis);
      }
      
      return analysis;
    } else {
      // If it's a new analysis, add it to history
      const newHistory = [analysis, ...analysisHistory];
      
      // Sort by date (newest first)
      const sortedHistory = sortAnalysesByDate(newHistory);
      setAnalysisHistory(sortedHistory);
      
      // Set as current analysis if there isn't one already
      if (!currentAnalysis) {
        setCurrentAnalysis(analysis);
      }
      
      return analysis;
    }
  };

  const setAllAnalyses = (analyses: PersonalityAnalysis[]) => {
    if (!analyses || analyses.length === 0) return;
    
    // Sort analyses by date and update the history
    const sortedAnalyses = sortAnalysesByDate(analyses);
    console.log("Setting all analyses in history state");
    setAnalysisHistory(sortedAnalyses);
    
    // Set the most recent analysis as the current one if none is set
    if (!currentAnalysis && sortedAnalyses.length > 0) {
      setCurrentAnalysis(sortedAnalyses[0]);
    }
  };

  return {
    analysisHistory,
    currentAnalysis,
    setCurrentAnalysis,
    getAnalysisHistory,
    addToHistory,
    setAllAnalyses
  };
}
