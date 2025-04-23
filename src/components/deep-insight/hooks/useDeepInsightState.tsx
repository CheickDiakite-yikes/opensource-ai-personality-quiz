
import { useState, useEffect } from 'react';
import { AssessmentQuestion } from '@/utils/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';
import { deepInsightQuestions } from '@/utils/questionBank';
import { useNavigate } from 'react-router-dom';

type DeepInsightResponses = Record<string, string>;

export const useDeepInsightState = () => {
  // Use the deepInsightQuestions from the question bank
  const questions = deepInsightQuestions;
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useLocalStorage<DeepInsightResponses>('deep_insight_responses', {});
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  // Current question is the one at the current index
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  // Calculate progress based on current question index, not response count
  useEffect(() => {
    // We add 1 to currentQuestionIndex because it's zero-based but we want to show progress starting from 1
    const progressValue = ((currentQuestionIndex + 1) / totalQuestions) * 100;
    setProgress(progressValue);
  }, [currentQuestionIndex, totalQuestions]);

  // Check if there's a response for the current question
  const hasResponse = responses[currentQuestion.id] !== undefined;

  // Update a response for a specific question
  const handleOptionSelect = (option: string) => {
    // Using direct object assignment which matches the DeepInsightResponses type
    const updatedResponses = {
      ...responses,
      [currentQuestion.id]: option
    };
    setResponses(updatedResponses);
  };

  // Handle previous question navigation
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Handle next question navigation
  const handleNext = () => {
    if (!hasResponse) {
      toast.error("Please select an option before proceeding");
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Handle final submission
  const handleSubmit = async () => {
    if (!hasResponse) {
      toast.error("Please select an option before submitting");
      return;
    }

    // Validate minimum number of responses
    if (Object.keys(responses).length < 5) {
      toast.error("Please complete at least 5 questions before submitting");
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      toast.info("Analyzing your responses...");
      
      // Here you would implement the API call to analyze responses
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset responses after successful submission
      setResponses({});
      setCurrentQuestionIndex(0);
      
      // Navigate to results page (you'll need to create this route)
      navigate('/deep-insight/results');
    } catch (error) {
      console.error('Error submitting assessment:', error);
      setSubmissionError(error instanceof Error ? error.message : "An unexpected error occurred");
      toast.error("Failed to submit assessment");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clear all responses and start fresh
  const resetResponses = () => {
    setResponses({});
    setCurrentQuestionIndex(0);
  };

  return {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    responses,
    updateResponse: handleOptionSelect,
    resetResponses,
    currentQuestion,
    hasResponse,
    progress,
    totalQuestions,
    isSubmitting,
    submissionError,
    handleOptionSelect,
    handlePrevious,
    handleNext,
    handleSubmit
  };
};

export default useDeepInsightState;
