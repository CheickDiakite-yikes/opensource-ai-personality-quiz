
import { useState, useEffect } from 'react';
import { AssessmentQuestion } from '@/utils/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';
import { deepInsightQuestions } from '@/utils/questionBank';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';

type DeepInsightResponses = Record<string, string>;

export const useDeepInsightState = () => {
  // Use the deepInsightQuestions from the question bank
  const questions = deepInsightQuestions;
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useLocalStorage<DeepInsightResponses>('deep_insight_responses', {});
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const { user } = useAuth();
  
  const navigate = useNavigate();

  // Current question is the one at the current index
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  // Calculate progress based on current question index
  useEffect(() => {
    const progressValue = ((currentQuestionIndex + 1) / totalQuestions) * 100;
    setProgress(progressValue);
  }, [currentQuestionIndex, totalQuestions]);

  // Check if there's a response for the current question
  const hasResponse = responses[currentQuestion.id] !== undefined;

  // Update a response for a specific question
  const handleOptionSelect = (option: string) => {
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
      // Create a loading toast that will be updated later
      toast.loading("Analyzing your responses...", { id: "analysis-toast" });
      
      // First save the responses to the database
      if (user) {
        try {
          const assessmentId = `deep-insight-${Date.now()}`;
          
          const { error: assessmentError } = await supabase
            .from('deep_insight_assessments')
            .insert({
              id: assessmentId,
              user_id: user.id,
              responses: responses
            });
            
          if (assessmentError) {
            console.error("Error saving assessment to database:", assessmentError);
          } else {
            console.log("Assessment saved successfully with ID:", assessmentId);
          }
        } catch (err) {
          console.error("Error saving assessment:", err);
        }
      }
      
      // Call our edge function to analyze the responses
      console.log("Sending responses to deep-insight-analysis function", responses);
      
      const { data, error } = await supabase.functions.invoke("deep-insight-analysis", {
        body: { responses }
      });
      
      if (error) {
        throw new Error(`Analysis failed: ${error.message}`);
      }
      
      if (!data || !data.analysis) {
        throw new Error("Invalid response from analysis function");
      }
      
      console.log("Analysis result:", data.analysis);
      
      // Save the analysis to the database
      if (user && data.analysis) {
        try {
          const { error: analysisError } = await supabase
            .from('deep_insight_analyses')
            .insert({
              user_id: user.id,
              complete_analysis: data.analysis,
              overview: data.analysis.overview || "Your analysis is being processed",
              core_traits: data.analysis.coreTraits || null,
              cognitive_patterning: data.analysis.cognitivePatterning || null,
              emotional_architecture: data.analysis.emotionalArchitecture || null,
              interpersonal_dynamics: data.analysis.interpersonalDynamics || null,
              growth_potential: data.analysis.growthPotential || null,
              intelligence_score: data.analysis.intelligenceScore || 0,
              emotional_intelligence_score: data.analysis.emotionalIntelligenceScore || 0
            });
            
          if (analysisError) {
            console.error("Error saving analysis to database:", analysisError);
          } else {
            console.log("Analysis saved successfully to database");
          }
        } catch (err) {
          console.error("Error saving analysis:", err);
        }
      }
      
      // Reset responses after successful submission
      setResponses({});
      setCurrentQuestionIndex(0);
      
      // Update the toast to show success
      toast.success("Analysis completed successfully!", { id: "analysis-toast" });
      
      // Navigate to results page
      navigate('/deep-insight/results');
    } catch (error) {
      console.error('Error submitting assessment:', error);
      setSubmissionError(error instanceof Error ? error.message : "An unexpected error occurred");
      toast.error("Failed to analyze responses", { 
        id: "analysis-toast",
        description: error instanceof Error ? error.message : "Please try again"
      });
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
