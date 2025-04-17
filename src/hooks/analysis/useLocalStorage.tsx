
import { AssessmentResponse, PersonalityAnalysis } from "@/utils/types";

// Function to save assessment responses to localStorage
export const saveAssessmentToStorage = (responses: AssessmentResponse[]): string => {
  try {
    // Generate a unique ID for this assessment
    const assessmentId = `assessment-${Date.now()}`;
    
    // Save responses to localStorage
    const savedAssessments = localStorage.getItem('assessment-responses') || '{}';
    const assessments = JSON.parse(savedAssessments);
    
    assessments[assessmentId] = {
      responses,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('assessment-responses', JSON.stringify(assessments));
    return assessmentId;
  } catch (error) {
    console.error("Error saving assessment to storage:", error);
    return `error-${Date.now()}`;
  }
};

// Function to load analysis history from localStorage
export const loadAnalysisHistory = (): PersonalityAnalysis[] => {
  try {
    const savedData = localStorage.getItem('analysis-history');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      return Array.isArray(parsedData) ? parsedData : [];
    }
  } catch (error) {
    console.error("Error loading analysis history:", error);
  }
  return [];
};

// Function to save a new analysis to history
export const saveAnalysisToHistory = (
  analysis: PersonalityAnalysis, 
  existingHistory: PersonalityAnalysis[] = []
): PersonalityAnalysis => {
  try {
    // Ensure the analysis has all required fields and correct types
    const formattedAnalysis: PersonalityAnalysis = {
      ...analysis,
      createdAt: typeof analysis.createdAt === 'string' 
        ? analysis.createdAt 
        : new Date().toISOString() // Convert Date to string if needed
    };
    
    // Add to history (either update existing or add new)
    const updatedHistory = [
      formattedAnalysis,
      ...existingHistory.filter(item => item.id !== formattedAnalysis.id)
    ].slice(0, 10); // Keep only the 10 most recent analyses
    
    // Save to localStorage
    localStorage.setItem('analysis-history', JSON.stringify(updatedHistory));
    
    return formattedAnalysis;
  } catch (error) {
    console.error("Error saving analysis to history:", error);
    return analysis;
  }
};

// Function to get a specific analysis by ID
export const getAnalysisById = (analysisId: string): PersonalityAnalysis | null => {
  try {
    const history = loadAnalysisHistory();
    return history.find(item => item.id === analysisId) || null;
  } catch (error) {
    console.error("Error getting analysis by ID:", error);
    return null;
  }
};

// Function to delete an analysis from history
export const deleteAnalysisFromHistory = (analysisId: string): boolean => {
  try {
    const history = loadAnalysisHistory();
    const updatedHistory = history.filter(item => item.id !== analysisId);
    
    if (updatedHistory.length === history.length) {
      return false; // Nothing was deleted
    }
    
    localStorage.setItem('analysis-history', JSON.stringify(updatedHistory));
    return true;
  } catch (error) {
    console.error("Error deleting analysis from history:", error);
    return false;
  }
};
