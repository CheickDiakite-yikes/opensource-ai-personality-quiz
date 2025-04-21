
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Brain, ChevronRight, Loader2 } from "lucide-react";
import BigMeQuestionCard from "./BigMeQuestionCard";
import { BigMeQuestion, BigMeResponse } from "@/utils/big-me/types";
import { toast } from "sonner";

// Initial set of questions - would be expanded to 50 in a real implementation
const BIG_ME_QUESTIONS: BigMeQuestion[] = [
  {
    id: "q1",
    category: "Personality",
    question: "When facing a difficult decision, I typically:",
    options: [
      "Analyze all available data before deciding",
      "Trust my gut feeling and intuition",
      "Consult with others to get different perspectives",
      "Consider how each option aligns with my values"
    ],
    allowCustomResponse: true
  },
  {
    id: "q2",
    category: "Emotional",
    question: "When I experience strong emotions, I usually:",
    options: [
      "Express them openly and directly",
      "Process them internally before responding",
      "Try to rationalize and understand them",
      "Share them only with close friends or family"
    ],
    allowCustomResponse: true
  },
  {
    id: "q3",
    category: "Cognitive",
    question: "When learning something new, I prefer to:",
    options: [
      "Read detailed instructions or theory first",
      "Watch demonstrations or videos",
      "Jump in and learn through trial and error",
      "Discuss concepts with others"
    ],
    allowCustomResponse: true
  }
];

const BigMeAssessmentPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<BigMeResponse[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user has already completed this assessment
    const checkExistingAnalysis = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('big_me_analyses')
          .select('id, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          toast.info("You already have a Big Me analysis. Taking the assessment again will create a new analysis.");
        }
      } catch (err) {
        console.error("Error checking for existing analysis:", err);
      }
    };
    
    checkExistingAnalysis();
  }, [user]);

  const handleSelectOption = (option: string) => {
    const updatedResponses = [...responses];
    const currentQuestion = BIG_ME_QUESTIONS[currentQuestionIndex];
    
    // Find if we already have a response for this question
    const existingIndex = updatedResponses.findIndex(r => r.questionId === currentQuestion.id);
    
    if (existingIndex >= 0) {
      // Update existing response
      updatedResponses[existingIndex] = {
        ...updatedResponses[existingIndex],
        selectedOption: option,
        customResponse: undefined,
        category: currentQuestion.category
      };
    } else {
      // Add new response
      updatedResponses.push({
        questionId: currentQuestion.id,
        selectedOption: option,
        category: currentQuestion.category
      });
    }
    
    setResponses(updatedResponses);
    
    // Move to next question if not at the end
    if (currentQuestionIndex < BIG_ME_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleCustomResponse = (response: string) => {
    const updatedResponses = [...responses];
    const currentQuestion = BIG_ME_QUESTIONS[currentQuestionIndex];
    
    // Find if we already have a response for this question
    const existingIndex = updatedResponses.findIndex(r => r.questionId === currentQuestion.id);
    
    if (existingIndex >= 0) {
      // Update existing response
      updatedResponses[existingIndex] = {
        ...updatedResponses[existingIndex],
        customResponse: response,
        selectedOption: undefined,
        category: currentQuestion.category
      };
    } else {
      // Add new response
      updatedResponses.push({
        questionId: currentQuestion.id,
        customResponse: response,
        category: currentQuestion.category
      });
    }
    
    setResponses(updatedResponses);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < BIG_ME_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("You must be logged in to submit the assessment");
      return;
    }
    
    // Check if all questions have been answered
    const unansweredQuestions = BIG_ME_QUESTIONS.filter(q => 
      !responses.some(r => r.questionId === q.id && (r.selectedOption || r.customResponse))
    );
    
    if (unansweredQuestions.length > 0) {
      toast.warning(`You have ${unansweredQuestions.length} unanswered questions. Please complete all questions before submitting.`);
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Add question text to responses for better context in analysis
      const enhancedResponses = responses.map(response => {
        const question = BIG_ME_QUESTIONS.find(q => q.id === response.questionId);
        return {
          ...response,
          question: question?.question || ""
        };
      });
      
      // Call the edge function to analyze responses
      const { data, error } = await supabase.functions.invoke('big-me-analysis', {
        body: {
          userId: user.id,
          responses: enhancedResponses
        }
      });
      
      if (error) throw new Error(error.message);
      
      if (!data || !data.success) {
        throw new Error(data?.message || "Unknown error during analysis");
      }
      
      toast.success("Your Big Me analysis is ready!");
      navigate(`/big-me/results/${data.analysisId}`);
    } catch (err) {
      console.error("Error submitting assessment:", err);
      setError(err instanceof Error ? err.message : "Failed to submit assessment");
      toast.error("There was a problem processing your assessment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = BIG_ME_QUESTIONS[currentQuestionIndex];
  const currentResponse = responses.find(r => r.questionId === currentQuestion?.id);
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-amber-500/20 flex items-center justify-center">
            <Brain size={32} className="text-amber-400" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#e67e22] to-[#f39c12] mb-2">
          Big Me Assessment
        </h1>
        <p className="text-xl text-muted-foreground mb-6">
          Discover your comprehensive personality profile through this in-depth assessment.
        </p>
        <div className="w-full max-w-lg mx-auto h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-amber-500 transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / BIG_ME_QUESTIONS.length) * 100}%` }}
          ></div>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Question {currentQuestionIndex + 1} of {BIG_ME_QUESTIONS.length}
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="bg-card border rounded-lg p-6 mb-6 shadow-sm">
        <BigMeQuestionCard
          question={currentQuestion}
          selectedOption={currentResponse?.selectedOption}
          customResponse={currentResponse?.customResponse}
          onSelectOption={handleSelectOption}
          onCustomResponse={handleCustomResponse}
        />
      </div>

      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0 || isSubmitting}
        >
          Previous
        </Button>
        
        {currentQuestionIndex < BIG_ME_QUESTIONS.length - 1 ? (
          <Button 
            onClick={goToNextQuestion}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            Next <ChevronRight size={16} />
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-amber-500 hover:bg-amber-600"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Complete Assessment"
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default BigMeAssessmentPage;
