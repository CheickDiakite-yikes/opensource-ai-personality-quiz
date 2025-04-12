
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AssessmentQuestion, AssessmentResponse, QuestionCategory } from "@/utils/types";

export const useAssessmentState = (questionBank: AssessmentQuestion[]) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [completedQuestions, setCompletedQuestions] = useState<string[]>([]);
  const [responses, setResponses] = useState<Record<string, AssessmentResponse>>({});
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  
  // Current question based on index
  const currentQuestion = questionBank[currentQuestionIndex];
  
  // Get the current response or create a new empty one
  const currentResponse = responses[currentQuestion.id] || { 
    questionId: currentQuestion.id, 
    selectedOption: "",
    customResponse: ""
  };
  
  // Track if we're using a custom response
  const useCustomResponse = currentQuestion.allowCustomResponse && 
    (!currentResponse.selectedOption || currentResponse.selectedOption === "Other");
  
  // Calculate category progress
  const categoryProgress = calculateCategoryProgress(questionBank, responses);
  
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
  const handleCustomResponseChange = (customResponse: string) => {
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
  
  // Navigation functions
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questionBank.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  // Submit assessment for analysis
  const handleSubmitAssessment = async () => {
    if (!user) {
      toast.error("Please log in to submit your assessment");
      return;
    }
    
    // Convert responses to the format expected by the backend
    const formattedResponses = Object.values(responses).map(response => ({
      questionId: response.questionId,
      answer: response.selectedOption === "Other" ? response.customResponse : response.selectedOption
    }));
    
    try {
      setIsAnalyzing(true);
      
      // Save assessment responses to Supabase
      const { data: assessmentData, error: assessmentError } = await supabase
        .from("comprehensive_assessments")
        .insert([{
          user_id: user.id,
          responses: formattedResponses
        }])
        .select('id')
        .single();
      
      if (assessmentError) throw new Error(assessmentError.message);
      
      if (!assessmentData?.id) {
        throw new Error("Failed to create assessment");
      }
      
      // Call Supabase Edge Function to analyze responses
      const { data, error } = await supabase.functions.invoke(
        "analyze-comprehensive-responses",
        {
          body: { 
            assessmentId: assessmentData.id,
            responses: formattedResponses
          }
        }
      );
      
      if (error) throw new Error(error.message);
      
      // Clear stored progress after successful submission
      localStorage.removeItem("comprehensive_assessment_progress");
      
      // Navigate to the comprehensive report page
      navigate(`/comprehensive-report/${data.analysisId}`);
      
      toast.success("Your comprehensive assessment has been analyzed!");
    } catch (error) {
      console.error("Error submitting assessment:", error);
      toast.error("Failed to submit assessment", { 
        description: error instanceof Error ? error.message : "Please try again later"
      });
      setIsAnalyzing(false);
    }
  };
  
  return {
    currentQuestionIndex,
    currentQuestion,
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

// Helper function to calculate progress for each category
const calculateCategoryProgress = (
  questions: AssessmentQuestion[], 
  responses: Record<string, AssessmentResponse>
): Record<QuestionCategory, number> => {
  // Initialize all categories with 0 progress
  const progress: Record<QuestionCategory, number> = Object.values(QuestionCategory).reduce(
    (acc, category) => ({ ...acc, [category]: 0 }),
    {} as Record<QuestionCategory, number>
  );
  
  // Count questions per category
  const totalPerCategory: Record<string, number> = {};
  const answeredPerCategory: Record<string, number> = {};
  
  questions.forEach(q => {
    totalPerCategory[q.category] = (totalPerCategory[q.category] || 0) + 1;
    
    if (responses[q.id]?.selectedOption || responses[q.id]?.customResponse) {
      answeredPerCategory[q.category] = (answeredPerCategory[q.category] || 0) + 1;
    }
  });
  
  // Calculate percentage for each category
  Object.keys(totalPerCategory).forEach(category => {
    progress[category as QuestionCategory] = (answeredPerCategory[category] || 0) / totalPerCategory[category] * 100;
  });
  
  return progress;
};
