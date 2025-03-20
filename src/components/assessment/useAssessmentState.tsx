
import { useState, useEffect } from "react";
import { AssessmentQuestion, AssessmentResponse, QuestionCategory } from "@/utils/types";
import { useNavigate } from "react-router-dom";
import { useAIAnalysis } from "@/hooks/useAIAnalysis";
import { toast } from "sonner";

export const useAssessmentState = (allQuestions: AssessmentQuestion[]) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<AssessmentResponse[]>([]);
  const [currentResponse, setCurrentResponse] = useState<AssessmentResponse>({
    questionId: allQuestions[0].id,
    selectedOption: undefined,
    customResponse: undefined,
    category: allQuestions[0].category,
    timestamp: new Date()
  });
  const [useCustomResponse, setUseCustomResponse] = useState(false);
  const [completedQuestions, setCompletedQuestions] = useState<number[]>([]);
  const [categoryProgress, setCategoryProgress] = useState<Record<QuestionCategory, number>>({} as Record<QuestionCategory, number>);
  
  const { analyzeResponses, isAnalyzing } = useAIAnalysis();
  const navigate = useNavigate();
  
  const currentQuestion = allQuestions[currentQuestionIndex];

  // Calculate category progress
  useEffect(() => {
    const progress: Record<QuestionCategory, { completed: number, total: number }> = {} as Record<QuestionCategory, { completed: number, total: number }>;
    
    // Initialize all categories
    Object.values(QuestionCategory).forEach(category => {
      progress[category] = { completed: 0, total: 0 };
    });
    
    // Count total questions per category
    allQuestions.forEach(question => {
      progress[question.category].total += 1;
    });
    
    // Count completed questions per category
    responses.forEach(response => {
      const question = allQuestions.find(q => q.id === response.questionId);
      if (question && (response.selectedOption || response.customResponse)) {
        progress[question.category].completed += 1;
      }
    });
    
    // Convert to percentages
    const percentages: Record<QuestionCategory, number> = {} as Record<QuestionCategory, number>;
    Object.entries(progress).forEach(([category, data]) => {
      percentages[category as QuestionCategory] = data.total > 0 
        ? (data.completed / data.total) * 100 
        : 0;
    });
    
    setCategoryProgress(percentages);
  }, [responses, allQuestions]);

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
  
  const goToNextQuestion = () => {
    if (!currentResponse.selectedOption && !currentResponse.customResponse) {
      toast.error("Please select an option or provide a custom response");
      return;
    }
    
    saveCurrentResponse();
    
    if (currentQuestionIndex < allQuestions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      
      // Check if the next question already has a response
      const existingResponse = responses.find(
        (r) => r.questionId === allQuestions[nextIndex].id
      );
      
      if (existingResponse) {
        setCurrentResponse(existingResponse);
        setUseCustomResponse(!!existingResponse.customResponse);
      } else {
        setCurrentResponse({
          questionId: allQuestions[nextIndex].id,
          selectedOption: undefined,
          customResponse: undefined,
          category: allQuestions[nextIndex].category,
          timestamp: new Date()
        });
        setUseCustomResponse(false);
      }
    } else {
      handleSubmitAssessment();
    }
  };
  
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      saveCurrentResponse();
      
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
      
      const existingResponse = responses.find(
        (r) => r.questionId === allQuestions[prevIndex].id
      );
      
      if (existingResponse) {
        setCurrentResponse(existingResponse);
        setUseCustomResponse(!!existingResponse.customResponse);
      } else {
        setCurrentResponse({
          questionId: allQuestions[prevIndex].id,
          customResponse: undefined,
          selectedOption: undefined,
          category: allQuestions[prevIndex].category,
          timestamp: new Date()
        });
        setUseCustomResponse(false);
      }
    }
  };
  
  const handleSubmitAssessment = async () => {
    // Save the final response
    saveCurrentResponse();
    
    try {
      toast.info("Analyzing your responses...", {
        duration: 3000,
      });
      
      // In a real app, you would send this to your backend
      // For now we'll just pass it to our mock analysis function
      await analyzeResponses(responses);
      navigate("/report");
    } catch (error) {
      console.error("Error submitting assessment:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return {
    currentQuestionIndex,
    currentQuestion,
    responses,
    currentResponse,
    useCustomResponse,
    completedQuestions,
    categoryProgress,
    isAnalyzing,
    handleOptionSelect,
    handleCustomResponseChange,
    goToNextQuestion,
    goToPreviousQuestion,
    handleSubmitAssessment,
  };
};
