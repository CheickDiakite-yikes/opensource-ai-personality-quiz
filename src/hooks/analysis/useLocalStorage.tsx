import { PersonalityAnalysis, AssessmentResponse } from "@/utils/types";

export const loadAnalysisHistory = (): PersonalityAnalysis[] => {
  try {
    const savedHistory = localStorage.getItem('analysisHistory');
    if (savedHistory) {
      return JSON.parse(savedHistory);
    }
  } catch (error) {
    console.error("Error loading analysis history:", error);
  }
  return [];
};

export const saveAnalysisToHistory = (
  newAnalysis: PersonalityAnalysis, 
  currentHistory: PersonalityAnalysis[]
): PersonalityAnalysis => {
  try {
    // Generate a unique ID for this analysis
    const analysisWithId = {
      ...newAnalysis,
      id: `analysis-${Date.now()}`,
      createdAt: new Date()
    };
    
    // Add to the history array
    const updatedHistory = [analysisWithId, ...currentHistory];
    
    // Save to localStorage (keep only the last 10 analyses)
    localStorage.setItem('analysisHistory', JSON.stringify(updatedHistory.slice(0, 10)));
    
    return analysisWithId;
  } catch (error) {
    console.error("Error saving analysis to history:", error);
    return newAnalysis;
  }
};

export const saveAssessmentToStorage = (responses: AssessmentResponse[]): string => {
  try {
    // Generate a unique ID for this assessment
    const assessmentId = `assessment-${Date.now()}`;
    
    // Create the assessment object
    const assessment = {
      id: assessmentId,
      userId: 'current-user', // In a real app, this would be the actual user ID
      responses,
      completedAt: new Date()
    };
    
    // Save the assessment to localStorage
    const savedAssessments = localStorage.getItem('assessments') || '[]';
    const assessments = JSON.parse(savedAssessments);
    assessments.unshift(assessment);
    localStorage.setItem('assessments', JSON.stringify(assessments.slice(0, 10))); // Keep only the last 10 assessments
    
    return assessmentId;
  } catch (error) {
    console.error("Error saving assessment:", error);
    return `assessment-${Date.now()}`; // Fallback ID
  }
};
