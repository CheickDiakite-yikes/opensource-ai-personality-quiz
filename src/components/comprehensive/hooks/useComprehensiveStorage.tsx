
import { useState, useEffect } from "react";
import { AssessmentQuestion } from "@/utils/types";
import { ComprehensiveResponse } from "./comprehensiveTypes";

export function useComprehensiveStorage(questionBank: AssessmentQuestion[]) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [completedQuestions, setCompletedQuestions] = useState<string[]>([]);
  const [responses, setResponses] = useState<Record<string, ComprehensiveResponse>>({});
  
  // Current question based on index
  const currentQuestion = questionBank[currentQuestionIndex];
  
  // Get the current response or create a new empty one
  const currentResponse = responses[currentQuestion.id] || { 
    questionId: currentQuestion.id, 
    selectedOption: "",
    customResponse: "",
    category: currentQuestion.category // Ensure category is always included
  };
  
  // Track if we're using a custom response
  const useCustomResponse = currentQuestion.allowCustomResponse && 
    (!currentResponse.selectedOption || currentResponse.selectedOption === "Other");
  
  // Initialize from local storage
  useEffect(() => {
    const storedData = localStorage.getItem("comprehensive_assessment_progress");
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        
        // Only restore if the data is for the same question set
        if (parsed && typeof parsed === "object") {
          if (parsed.responses) setResponses(parsed.responses);
          if (parsed.completedQuestions) setCompletedQuestions(parsed.completedQuestions);
          if (parsed.currentIndex !== undefined) setCurrentQuestionIndex(parsed.currentIndex);
        }
      } catch (e) {
        console.error("Error parsing stored assessment data", e);
      }
    }
  }, []);
  
  // Save progress to local storage
  useEffect(() => {
    if (Object.keys(responses).length > 0 || completedQuestions.length > 0) {
      localStorage.setItem("comprehensive_assessment_progress", JSON.stringify({
        responses,
        completedQuestions,
        currentIndex: currentQuestionIndex
      }));
    }
  }, [responses, completedQuestions, currentQuestionIndex]);
  
  return {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    currentQuestion,
    currentResponse,
    useCustomResponse,
    completedQuestions,
    setCompletedQuestions,
    responses,
    setResponses
  };
}
