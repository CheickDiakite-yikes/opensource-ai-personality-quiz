
import { useNavigate } from "react-router-dom";
import { AssessmentResponse } from "@/utils/types";
import { toast } from "sonner";

export const useAssessmentNavigation = (
  currentQuestionIndex: number,
  setCurrentQuestionIndex: (index: number) => void,
  saveCurrentResponse: () => void,
  setupResponseForQuestion: (index: number) => void,
  currentResponse: AssessmentResponse,
  totalQuestions: number,
  handleSubmitAssessment: () => Promise<void>
) => {
  const navigate = useNavigate();
  
  const goToNextQuestion = () => {
    if (!currentResponse.selectedOption && !currentResponse.customResponse) {
      toast.error("Please select an option or provide a custom response");
      return;
    }
    
    saveCurrentResponse();
    
    if (currentQuestionIndex < totalQuestions - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setupResponseForQuestion(nextIndex);
    } else {
      handleSubmitAssessment();
    }
  };
  
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      saveCurrentResponse();
      
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
      setupResponseForQuestion(prevIndex);
    }
  };

  return {
    goToNextQuestion,
    goToPreviousQuestion
  };
};
