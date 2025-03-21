
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
    console.log("Assessment saved to localStorage with ID:", assessmentId);
    return assessmentId;
  } catch (error) {
    console.error("Error saving assessment to storage:", error);
    return `error-${Date.now()}`;
  }
};

// Function to load analysis history from localStorage
export const loadAnalysisHistory = (): PersonalityAnalysis[] => {
  try {
    console.log("Loading analysis history from localStorage");
    const savedData = localStorage.getItem('analysis-history');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      console.log("Loaded analysis history:", Array.isArray(parsedData) ? parsedData.length : 0, "items");
      return Array.isArray(parsedData) ? parsedData : [];
    }
  } catch (error) {
    console.error("Error loading analysis history:", error);
  }
  console.log("No analysis history found in localStorage");
  return [];
};

// Function to save a new analysis to history
export const saveAnalysisToHistory = (
  analysis: PersonalityAnalysis
): PersonalityAnalysis => {
  try {
    // Load existing history
    const existingHistory = loadAnalysisHistory();
    
    // Ensure the analysis has all required fields and correct types
    const formattedAnalysis: PersonalityAnalysis = {
      ...analysis,
      createdAt: typeof analysis.createdAt === 'string' 
        ? analysis.createdAt 
        : new Date().toISOString() // Convert Date to string if needed
    };
    
    console.log("Saving analysis to history:", formattedAnalysis.id);
    
    // Add to history (either update existing or add new)
    const updatedHistory = [
      formattedAnalysis,
      ...existingHistory.filter(item => item.id !== formattedAnalysis.id)
    ].slice(0, 10); // Keep only the 10 most recent analyses
    
    // Save to localStorage
    localStorage.setItem('analysis-history', JSON.stringify(updatedHistory));
    console.log("Updated analysis history in localStorage with", updatedHistory.length, "items");
    
    return formattedAnalysis;
  } catch (error) {
    console.error("Error saving analysis to history:", error);
    return analysis;
  }
};

// Function to get a specific analysis by ID
export const getAnalysisById = (analysisId: string): PersonalityAnalysis | null => {
  try {
    console.log("Getting analysis by ID:", analysisId);
    const history = loadAnalysisHistory();
    const result = history.find(item => item.id === analysisId);
    console.log("Analysis found:", result ? "yes" : "no");
    return result || null;
  } catch (error) {
    console.error("Error getting analysis by ID:", error);
    return null;
  }
};

// Function to delete an analysis from history
export const deleteAnalysisFromHistory = (analysisId: string): boolean => {
  try {
    console.log("Deleting analysis from history:", analysisId);
    const history = loadAnalysisHistory();
    const updatedHistory = history.filter(item => item.id !== analysisId);
    
    if (updatedHistory.length === history.length) {
      console.log("No analysis found with ID:", analysisId);
      return false; // Nothing was deleted
    }
    
    localStorage.setItem('analysis-history', JSON.stringify(updatedHistory));
    console.log("Analysis deleted, new history size:", updatedHistory.length);
    return true;
  } catch (error) {
    console.error("Error deleting analysis from history:", error);
    return false;
  }
};
