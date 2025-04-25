
import React, { useEffect } from "react";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { QuestionCard } from "@/features/concise-insight/components/QuestionCard";
import { QuizProgress } from "@/features/concise-insight/components/QuizProgress";
import { useConciseInsightQuiz } from "@/features/concise-insight/hooks/useConciseInsightQuiz";
import { conciseInsightQuestions } from "@/features/concise-insight/data/questions";
import { Button } from "@/components/ui/button";

const ConciseInsightQuiz: React.FC = () => {
  const { user } = useAuth();
  const totalQuestions = conciseInsightQuestions.length;
  
  const {
    currentQuestionIndex,
    responses,
    error,
    handleSubmitQuestion,
    handlePrevious,
    clearSavedProgress
  } = useConciseInsightQuiz(totalQuestions);
  
  const currentQuestion = conciseInsightQuestions[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  
  // Calculate progress percentage for display
  const completedQuestions = Object.keys(responses).length;
  const progressPercentage = ((completedQuestions / totalQuestions) * 100).toFixed(0);
  const hasPartialProgress = completedQuestions > 0;

  // Debug current question and response
  useEffect(() => {
    if (currentQuestion) {
      console.log(`Current question (${currentQuestionIndex}):`, currentQuestion.id);
      console.log(`Current response for ${currentQuestion.id}:`, responses[currentQuestion.id]);
    }
  }, [currentQuestion, currentQuestionIndex, responses]);
  
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
            Concise Insight Assessment
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Answer thoughtfully to receive an accurate analysis of your personality.
            Each of these 25 questions has been carefully selected to provide maximum insight.
          </p>
          
          {hasPartialProgress && (
            <div className="mt-4 text-sm text-muted-foreground">
              <p>You've completed {completedQuestions} of {totalQuestions} questions ({progressPercentage}%).</p>
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
          currentCategory={currentQuestion?.category}
        />
        
        {currentQuestion && (
          <QuestionCard 
            question={currentQuestion}
            currentResponse={responses[currentQuestion.id] || ""}
            onPrevious={handlePrevious}
            onSubmit={handleSubmitQuestion}
            isFirstQuestion={isFirstQuestion}
            isLastQuestion={isLastQuestion}
            error={error}
          />
        )}
      </div>
    </motion.div>
  );
};

export default ConciseInsightQuiz;
