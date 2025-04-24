
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { deepInsightQuestions } from '@/utils/questionBank';
import { useLocalStorage } from '@/hooks/useLocalStorage';

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
      // More detailed loading toast
      const submissionToast = toast.loading("Analyzing your responses...", {
        description: "This may take a few moments",
        duration: Infinity
      });
      
      // First save the responses to the database
      if (user) {
        const assessmentId = `deep-insight-${Date.now()}`;
        
        const { error: assessmentError } = await supabase
          .from('deep_insight_assessments')
          .insert({
            id: assessmentId,
            user_id: user.id,
            responses: responses
          });
          
        if (assessmentError) {
          console.error("Error saving assessment:", assessmentError);
          toast.error("Failed to save assessment", {
            description: assessmentError.message
          });
          return;
        }
        
        try {
          // Call edge function to analyze responses
          const { data, error } = await supabase.functions.invoke("deep-insight-analysis", {
            body: { 
              responses,
              assessmentId 
            }
          });
          
          if (error) {
            throw new Error(`Analysis failed: ${error.message}`);
          }
          
          if (!data || !data.analysis) {
            throw new Error("No analysis data received");
          }

          console.log("Analysis data received:", data.analysis);
          
          // Prepare default values for any missing fields to prevent NULLs
          const defaultAnalysis = {
            overview: "Your personality analysis is being processed. Check back soon for your complete results.",
            core_traits: {
              primary: "Analytical Thinker",
              secondary: "Balanced Communicator",
              strengths: ["Logical reasoning", "Detail orientation"],
              challenges: ["May overthink", "Perfectionist tendencies"]
            },
            cognitive_patterning: {
              decisionMaking: "You take a thoughtful, measured approach to decisions.",
              learningStyle: "You learn best through structured, logical information."
            },
            emotional_architecture: {
              emotionalAwareness: "You have a balanced awareness of your emotions.",
              regulationStyle: "You tend to process emotions through logical analysis."
            },
            interpersonal_dynamics: {
              attachmentStyle: "You value independence while maintaining connections.",
              communicationPattern: "Your communication is clear and precise."
            },
            growth_potential: {
              developmentAreas: ["Finding balance between analysis and action"],
              recommendations: ["Practice mindfulness techniques to reduce overthinking"]
            }
          };

          // Merge the received data with defaults for any missing fields
          const analysisData = {
            user_id: user.id,
            assessment_id: assessmentId,
            complete_analysis: data.analysis,
            overview: data.analysis.overview || defaultAnalysis.overview,
            core_traits: data.analysis.core_traits || defaultAnalysis.core_traits,
            cognitive_patterning: data.analysis.cognitive_patterning || defaultAnalysis.cognitive_patterning,
            emotional_architecture: data.analysis.emotional_architecture || defaultAnalysis.emotional_architecture,
            interpersonal_dynamics: data.analysis.interpersonal_dynamics || defaultAnalysis.interpersonal_dynamics,
            growth_potential: data.analysis.growth_potential || defaultAnalysis.growth_potential,
            intelligence_score: data.analysis.intelligence_score || 70,
            emotional_intelligence_score: data.analysis.emotional_intelligence_score || 70,
            response_patterns: data.analysis.response_patterns || {
              primaryChoice: Object.keys(responses)[0],
              secondaryChoice: Object.keys(responses)[1]
            },
            // Add error tracking
            error_occurred: data.analysis.error_occurred || false,
            error_message: data.analysis.error_message || null
          };
          
          // Save the analysis to the database
          const { error: analysisError } = await supabase
            .from('deep_insight_analyses')
            .insert(analysisData);
          
          if (analysisError) {
            console.error("Error saving analysis:", analysisError);
            toast.error("Failed to save analysis", {
              description: analysisError.message
            });
            return;
          }
          
          // Update toast to success
          toast.dismiss(submissionToast);
          toast.success("Analysis completed successfully!", {
            description: "Redirecting to your results"
          });
          
          // Reset and navigate
          setResponses({});
          setCurrentQuestionIndex(0);
          navigate('/deep-insight/results');
          
        } catch (analysisError) {
          console.error('Analysis submission error:', analysisError);
          
          // Even if analysis fails, try to save what we have
          try {
            const fallbackAnalysis = {
              user_id: user.id,
              assessment_id: assessmentId,
              complete_analysis: { status: "processing" },
              overview: "Your analysis is still being processed. Please check back in a few minutes.",
              core_traits: {
                primary: "Analytical Thinker",
                secondary: "Balanced Communicator",
                strengths: ["Logical reasoning"],
                challenges: ["Perfectionism"]
              },
              intelligence_score: 70,
              emotional_intelligence_score: 70,
              error_occurred: true,
              error_message: analysisError instanceof Error ? analysisError.message : "Unknown error"
            };
            
            await supabase.from('deep_insight_analyses').insert(fallbackAnalysis);
            
            toast.error("Analysis processing is incomplete", {
              description: "We'll continue working on your results. Redirecting to partial results."
            });
            
            // Navigate to results anyway - the page will show partial results
            setResponses({});
            setCurrentQuestionIndex(0);
            navigate('/deep-insight/results');
            
          } catch (fallbackError) {
            console.error('Fallback save failed:', fallbackError);
            toast.error("Analysis submission failed", {
              description: "Please try again later"
            });
          }
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error("Unexpected error occurred", {
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
