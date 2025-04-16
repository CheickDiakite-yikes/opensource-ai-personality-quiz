
import React from "react";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { QuestionCard } from "@/features/deep-insight/components/QuestionCard";
import { QuizProgress } from "@/features/deep-insight/components/QuizProgress";
import { useDeepInsightQuiz } from "@/features/deep-insight/hooks/useDeepInsightQuiz";
import { deepInsightQuestions } from "@/features/deep-insight/data/questions";
import { Button } from "@/components/ui/button";

// Main component
const DeepInsightQuiz: React.FC = () => {
  const { user } = useAuth();
  const totalQuestions = deepInsightQuestions.length;
  
  const {
    currentQuestionIndex,
    responses,
    error,
    handleSubmitQuestion,
    handlePrevious,
    clearSavedProgress
  } = useDeepInsightQuiz(totalQuestions);
  
  const currentQuestion = deepInsightQuestions[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  
  // Calculate progress percentage for display
  const progressPercentage = ((Object.keys(responses).length / totalQuestions) * 100).toFixed(0);
  const hasPartialProgress = Object.keys(responses).length > 0;
  
  return (
    <motion.div 
      className="container max-w-4xl py-8 px-4 md:px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
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
              <p>You've completed {progressPercentage}% of the assessment.</p>
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
        />
      </div>
    </motion.div>
  );
};

export default DeepInsightQuiz;
