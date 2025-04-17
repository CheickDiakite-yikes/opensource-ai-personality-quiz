
import React from "react";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { QuestionCard } from "@/features/deep-insight/components/QuestionCard";
import { QuizProgress } from "@/features/deep-insight/components/QuizProgress";
import { useDeepInsightQuiz } from "@/features/deep-insight/hooks/useDeepInsightQuiz";
import { deepInsightQuestions } from "@/features/deep-insight/data/questions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const DeepInsightQuiz: React.FC = () => {
  const { user } = useAuth();
  const totalQuestions = deepInsightQuestions.length;
  
  const {
    currentQuestionIndex,
    responses,
    error,
    isLoading,
    handleSubmitQuestion,
    handlePrevious,
    clearSavedProgress
  } = useDeepInsightQuiz(totalQuestions);
  
  // Calculate progress percentage for display
  const completedQuestions = Object.keys(responses).length;
  const progressPercentage = ((completedQuestions / totalQuestions) * 100).toFixed(0);
  const hasPartialProgress = completedQuestions > 0;
  
  // Only try to access currentQuestion when index is valid
  const currentQuestion = currentQuestionIndex < totalQuestions 
    ? deepInsightQuestions[currentQuestionIndex] 
    : null;
    
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  // Simple loading state without the initial timeout that was causing issues
  if (isLoading) {
    return (
      <div className="container max-w-4xl py-8 px-4 md:px-6 flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse flex space-x-2">
          <div className="h-3 w-3 bg-primary rounded-full"></div>
          <div className="h-3 w-3 bg-primary rounded-full"></div>
          <div className="h-3 w-3 bg-primary rounded-full"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container max-w-4xl py-8 px-4 md:px-6">
        <div className="bg-destructive/15 text-destructive rounded-md p-6">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Reload Quiz
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8 px-4 md:px-6">
      <div className="flex flex-col gap-8">
        <header className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            Deep Insight Assessment
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover your authentic self through this comprehensive personality assessment. 
            Answer thoughtfully to receive a detailed analysis of your inner workings.
          </p>
          
          {hasPartialProgress && (
            <div className="mt-4 text-sm text-muted-foreground">
              <p>You've completed {completedQuestions} of {totalQuestions} questions ({progressPercentage}%).</p>
              <p className="text-xs mt-1">All {totalQuestions} questions must be answered for a complete analysis.</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2" 
                onClick={clearSavedProgress}
              >
                Start Over
              </Button>
            </div>
          )}
        </header>
        
        {currentQuestion ? (
          <>
            <QuizProgress 
              currentQuestionIndex={currentQuestionIndex} 
              totalQuestions={totalQuestions}
              currentCategory={currentQuestion.category}
            />
            
            <QuestionCard 
              question={currentQuestion}
              currentResponse={responses[currentQuestion.id] || ""}
              onPrevious={handlePrevious}
              onSubmit={handleSubmitQuestion}
              isFirstQuestion={isFirstQuestion}
              isLastQuestion={isLastQuestion}
              error={error}
              isLoading={false}
            />
          </>
        ) : (
          <div className="text-center p-6 border rounded-lg">
            <h2 className="text-xl font-bold mb-2">No questions found</h2>
            <p className="text-muted-foreground">
              There was a problem loading the assessment questions.
            </p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Reload Quiz
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeepInsightQuiz;
