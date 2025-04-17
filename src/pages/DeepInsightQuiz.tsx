
import React, { Suspense } from "react";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { QuestionCard } from "@/features/deep-insight/components/QuestionCard";
import { QuizProgress } from "@/features/deep-insight/components/QuizProgress";
import { useDeepInsightQuiz } from "@/features/deep-insight/hooks/useDeepInsightQuiz";
import { deepInsightQuestions } from "@/features/deep-insight/data/questions";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

// Loading skeleton component for better UX during loading states
const QuizLoadingSkeleton = () => (
  <div className="space-y-8">
    <div className="text-center">
      <Skeleton className="h-12 w-64 mx-auto mb-2" />
      <Skeleton className="h-4 w-full max-w-lg mx-auto mb-1" />
      <Skeleton className="h-4 w-3/4 mx-auto" />
    </div>
    
    <Skeleton className="h-2.5 w-full rounded-full" />
    
    <div className="space-y-4">
      <Skeleton className="h-16 w-full" />
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
      <div className="flex justify-between pt-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  </div>
);

// Main component
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
  
  // Only try to access currentQuestion when not loading
  const currentQuestion = !isLoading ? deepInsightQuestions[currentQuestionIndex] : null;
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  
  // Calculate progress percentage for display
  const completedQuestions = Object.keys(responses).length;
  const progressPercentage = ((completedQuestions / totalQuestions) * 100).toFixed(0);
  const hasPartialProgress = completedQuestions > 0;

  // Early loading state for better UX
  if (isLoading) {
    return (
      <motion.div 
        className="container max-w-4xl py-8 px-4 md:px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <QuizLoadingSkeleton />
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="container max-w-4xl py-8 px-4 md:px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
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
        
        {currentQuestion && (
          <>
            <QuizProgress 
              currentQuestionIndex={currentQuestionIndex} 
              totalQuestions={totalQuestions}
              currentCategory={currentQuestion.category}
            />
            
            <QuestionCard 
              key={`question-${currentQuestion.id}`}
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
        )}
      </div>
    </motion.div>
  );
};

export default DeepInsightQuiz;
