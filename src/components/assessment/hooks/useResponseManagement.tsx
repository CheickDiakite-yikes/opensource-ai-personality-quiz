
import { useState } from "react";
import { AssessmentQuestion, AssessmentResponse } from "@/utils/types";
import { toast } from "sonner";

export const useResponseManagement = (
  allQuestions: AssessmentQuestion[]
) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<AssessmentResponse[]>([]);
  const [completedQuestions, setCompletedQuestions] = useState<number[]>([]);
  const [useCustomResponse, setUseCustomResponse] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<AssessmentResponse>({
    questionId: allQuestions[0].id,
    selectedOption: undefined,
    customResponse: undefined,
    category: allQuestions[0].category,
    timestamp: new Date()
  });

  const currentQuestion = allQuestions[currentQuestionIndex];

  const handleOptionSelect = (option: string) => {
    setCurrentResponse({
      ...currentResponse,
      questionId: currentQuestion.id,
      selectedOption: option,
      customResponse: undefined,
      category: currentQuestion.category,
      timestamp: new Date()
    });
    setUseCustomResponse(false);
  };
  
  const handleCustomResponseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentResponse({
      ...currentResponse,
      questionId: currentQuestion.id,
      selectedOption: undefined,
      customResponse: e.target.value,
      category: currentQuestion.category,
      timestamp: new Date()
    });
    setUseCustomResponse(true);
  };
  
  const saveCurrentResponse = () => {
    const existingResponseIndex = responses.findIndex(
      (r) => r.questionId === currentQuestion.id
    );
    
    if (existingResponseIndex >= 0) {
      const updatedResponses = [...responses];
      updatedResponses[existingResponseIndex] = currentResponse;
      setResponses(updatedResponses);
    } else {
      setResponses([...responses, currentResponse]);
    }
    
    // Mark question as completed if not already
    if (!completedQuestions.includes(currentQuestionIndex)) {
      setCompletedQuestions([...completedQuestions, currentQuestionIndex]);
    }
  };

  // This function sets up the current response based on a question index
  const setupResponseForQuestion = (questionIndex: number) => {
    const existingResponse = responses.find(
      (r) => r.questionId === allQuestions[questionIndex].id
    );
    
    if (existingResponse) {
      setCurrentResponse(existingResponse);
      setUseCustomResponse(!!existingResponse.customResponse);
    } else {
      setCurrentResponse({
        questionId: allQuestions[questionIndex].id,
        selectedOption: undefined,
        customResponse: undefined,
        category: allQuestions[questionIndex].category,
        timestamp: new Date()
      });
      setUseCustomResponse(false);
    }
  };

  // Function to initialize or update current response from external data
  const initializeFromExistingResponses = (
    responseData: AssessmentResponse[], 
    questionIndex: number
  ) => {
    const restoredQuestion = allQuestions[questionIndex];
    const existingResponse = responseData.find(
      (r) => r.questionId === restoredQuestion.id
    );
    
    if (existingResponse) {
      setCurrentResponse(existingResponse);
      setUseCustomResponse(!!existingResponse.customResponse);
    } else {
      setCurrentResponse({
        questionId: restoredQuestion.id,
        selectedOption: undefined,
        customResponse: undefined,
        category: restoredQuestion.category,
        timestamp: new Date()
      });
    }
  };

  return {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    currentQuestion,
    responses,
    setResponses,
    completedQuestions,
    setCompletedQuestions,
    currentResponse,
    useCustomResponse,
    handleOptionSelect,
    handleCustomResponseChange,
    saveCurrentResponse,
    setupResponseForQuestion,
    initializeFromExistingResponses
  };
};
