
import { ComprehensiveResponse } from "./comprehensiveTypes";
import { AssessmentQuestion } from "@/utils/types";
import React from "react";

export function useComprehensiveResponses(
  currentQuestion: AssessmentQuestion,
  currentResponse: ComprehensiveResponse,
  responses: Record<string, ComprehensiveResponse>,
  setResponses: React.Dispatch<React.SetStateAction<Record<string, ComprehensiveResponse>>>,
  completedQuestions: string[],
  setCompletedQuestions: React.Dispatch<React.SetStateAction<string[]>>
) {
  // Handle option selection
  const handleOptionSelect = (option: string) => {
    const newResponses = { 
      ...responses,
      [currentQuestion.id]: { 
        ...currentResponse, 
        selectedOption: option,
        customResponse: option === "Other" ? currentResponse.customResponse : ""
      }
    };
    
    setResponses(newResponses);
    
    if (!completedQuestions.includes(currentQuestion.id)) {
      setCompletedQuestions([...completedQuestions, currentQuestion.id]);
    }
  };
  
  // Handle custom response changes
  const handleCustomResponseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const customResponse = e.target.value;
    const newResponses = { 
      ...responses,
      [currentQuestion.id]: { 
        ...currentResponse, 
        customResponse 
      }
    };
    
    setResponses(newResponses);
    
    if (customResponse && !completedQuestions.includes(currentQuestion.id)) {
      setCompletedQuestions([...completedQuestions, currentQuestion.id]);
    }
  };
  
  return {
    handleOptionSelect,
    handleCustomResponseChange
  };
}
