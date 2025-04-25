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

  /**
   * Set the current analysis by ID or analysis object
   * @param analysisOrId - Either a PersonalityAnalysis object or an ID string
   * @returns The analysis that was set as current, or null if not found
   */
  const setAnalysisById = (analysisOrId: PersonalityAnalysis | string): PersonalityAnalysis | null => {
    // If it's already a full analysis object, just use it
    if (typeof analysisOrId !== 'string') {
      setCurrentAnalysis(analysisOrId);
      return analysisOrId;
    }
    
    // Otherwise, it's an ID string - find the analysis in history
    const id = analysisOrId;
    const found = analysisHistory.find((analysis) => analysis.id === id);
    
    if (found) {
      setCurrentAnalysis(found);
      return found;
    }
    
    console.log(`Analysis with ID ${id} not found in history`);
    return null;
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
    setCurrentAnalysis: setAnalysisById, // Replace with our enhanced version
    getAnalysisHistory,
    addToHistory,
    setAllAnalyses
  };
}
