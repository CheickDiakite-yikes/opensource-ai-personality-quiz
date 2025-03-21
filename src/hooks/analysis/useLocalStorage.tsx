import { AssessmentResponse, PersonalityAnalysis } from "@/utils/types";

const ASSESSMENT_RESPONSES_KEY = "assessment_responses";
const ANALYSIS_HISTORY_KEY = "analysis_history";

// Save assessment responses to localStorage
export const saveAssessmentToStorage = (
  responses: AssessmentResponse[],
  assessmentId: string = `assessment-${Date.now()}`
): string => {
  // Clean the responses for storage by converting Date objects to strings
  const cleanedResponses = responses.map(response => ({
    ...response,
    timestamp: response.timestamp instanceof Date 
      ? response.timestamp.toISOString() 
      : response.timestamp
  }));
  
  // Store the responses with the assessmentId
  const assessmentData = {
    id: assessmentId,
    responses: cleanedResponses,
    createdAt: new Date().toISOString()
  };
  
  try {
    // Get existing stored assessments or initialize empty array
    const storedAssessmentsString = localStorage.getItem(ASSESSMENT_RESPONSES_KEY);
    const storedAssessments = storedAssessmentsString ? JSON.parse(storedAssessmentsString) : [];
    
    // Add the new assessment, keeping only the most recent 5
    const updatedAssessments = [assessmentData, ...storedAssessments.slice(0, 4)];
    localStorage.setItem(ASSESSMENT_RESPONSES_KEY, JSON.stringify(updatedAssessments));
    
    console.log(`Assessment saved to localStorage with ID: ${assessmentId}`);
    return assessmentId;
  } catch (error) {
    console.error("Error saving assessment to localStorage:", error);
    return assessmentId;
  }
};

// Get assessment responses from localStorage by ID
export const getAssessmentFromStorage = (assessmentId: string): AssessmentResponse[] | null => {
  try {
    const storedAssessmentsString = localStorage.getItem(ASSESSMENT_RESPONSES_KEY);
    if (!storedAssessmentsString) return null;
    
    const storedAssessments = JSON.parse(storedAssessmentsString);
    const assessment = storedAssessments.find((a: any) => a.id === assessmentId);
    
    return assessment ? assessment.responses : null;
  } catch (error) {
    console.error("Error getting assessment from localStorage:", error);
    return null;
  }
};

// Save analysis to localStorage history
export const saveAnalysisToHistory = (analysis: PersonalityAnalysis): PersonalityAnalysis => {
  try {
    // Get existing stored analyses or initialize empty array
    const storedAnalysesString = localStorage.getItem(ANALYSIS_HISTORY_KEY);
    const storedAnalyses = storedAnalysesString ? JSON.parse(storedAnalysesString) : [];
    
    // Check if analysis with same ID already exists
    const existingIndex = storedAnalyses.findIndex((a: PersonalityAnalysis) => a.id === analysis.id);
    
    let updatedAnalyses;
    if (existingIndex >= 0) {
      // Replace existing analysis
      updatedAnalyses = [...storedAnalyses];
      updatedAnalyses[existingIndex] = analysis;
    } else {
      // Add new analysis, keeping only the most recent 5
      updatedAnalyses = [analysis, ...storedAnalyses.slice(0, 4)];
    }
    
    localStorage.setItem(ANALYSIS_HISTORY_KEY, JSON.stringify(updatedAnalyses));
    console.log(`Analysis saved to localStorage history with ID: ${analysis.id}`);
    return analysis;
  } catch (error) {
    console.error("Error saving analysis to localStorage:", error);
    return analysis;
  }
};

// Get all analyses from localStorage history
export const getAnalysisHistory = (): PersonalityAnalysis[] => {
  try {
    const storedAnalysesString = localStorage.getItem(ANALYSIS_HISTORY_KEY);
    return storedAnalysesString ? JSON.parse(storedAnalysesString) : [];
  } catch (error) {
    console.error("Error getting analysis history from localStorage:", error);
    return [];
  }
};

// Get specific analysis from localStorage history by ID
export const getAnalysisById = (analysisId: string): PersonalityAnalysis | null => {
  try {
    const storedAnalysesString = localStorage.getItem(ANALYSIS_HISTORY_KEY);
    if (!storedAnalysesString) return null;
    
    const storedAnalyses = JSON.parse(storedAnalysesString);
    return storedAnalyses.find((a: PersonalityAnalysis) => a.id === analysisId) || null;
  } catch (error) {
    console.error(`Error getting analysis with ID ${analysisId} from localStorage:`, error);
    return null;
  }
};
