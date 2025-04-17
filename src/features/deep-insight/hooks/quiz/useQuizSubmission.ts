
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { DeepInsightResponses } from "../../types";
import { useDeepInsightStorage } from "../useDeepInsightStorage";

/**
 * Hook for handling quiz submission and navigation logic with optimized performance
 */
export const useQuizSubmission = (
  totalQuestions: number,
  responses: DeepInsightResponses,
  setResponses: React.Dispatch<React.SetStateAction<DeepInsightResponses>>,
  currentQuestionIndex: number,
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const navigate = useNavigate();
  const { saveResponses } = useDeepInsightStorage();
  
  // Handle submission of a single question - optimized for performance
  const handleSubmitQuestion = useCallback(async (data: Record<string, string>) => {
    try {
      const questionId = Object.keys(data)[0];
      const responseValue = data[questionId];
      
      // Validate response - PREVENT proceeding without an answer
      if (!responseValue || responseValue.trim() === '') {
        setError("Please select an answer before continuing");
        return false; // Added return value to indicate validation failure
      }
      
      setError(null);
      
      // Check if the response has actually changed before updating state
      if (responses[questionId] !== responseValue) {
        // Save response
        const updatedResponses = {
          ...responses,
          [questionId]: responseValue
        };
        
        setResponses(updatedResponses);
        
        // Save to storage asynchronously - don't block UI thread
        saveResponses(updatedResponses).catch(e => {
          console.error("Error saving responses:", e);
        });
      }
      
      // Move to next question or submit if done
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        return true; // Return success
      } else {
        // Submit all responses
        return await handleCompleteQuiz(responses);
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
      console.error("Error processing question:", errorMessage);
      setError("An error occurred. Please try again.");
      return false; // Return failure
    }
  }, [currentQuestionIndex, responses, saveResponses, totalQuestions, setResponses, setCurrentQuestionIndex, setError]);
  
  // Handle completion of the entire quiz - optimized for performance
  const handleCompleteQuiz = useCallback(async (finalResponses: DeepInsightResponses) => {
    try {
      // Verify we have all the responses
      if (Object.keys(finalResponses).length < totalQuestions) {
        const missingCount = totalQuestions - Object.keys(finalResponses).length;
        
        toast.error(`Missing ${missingCount} responses`, {
          description: "Please complete all questions for an accurate analysis"
        });
        
        // Find the first unanswered question
        for (let i = 0; i < totalQuestions; i++) {
          const questionExists = Object.keys(finalResponses).some(id => id.includes(`question-${i + 1}`));
          if (!questionExists) {
            setCurrentQuestionIndex(i);
            break;
          }
        }
        
        return false; // Return failure
      }
      
      // Show a more detailed toast message about the analysis process
      toast.success("Your Deep Insight assessment is complete!", {
        description: "Preparing your comprehensive personality analysis..."
      });
      
      // First ensure responses have been saved successfully
      await saveResponses(finalResponses);
      
      // Navigate directly to results page with fresh=true parameter to force new analysis generation
      navigate("/deep-insight/results?fresh=true");
      return true; // Return success
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
      console.error("Error completing quiz:", errorMessage);
      setError("Failed to complete the assessment. Please try again.");
      return false; // Return failure
    }
  }, [navigate, saveResponses, totalQuestions, setCurrentQuestionIndex, setError]);

  return {
    handleSubmitQuestion
  };
};
