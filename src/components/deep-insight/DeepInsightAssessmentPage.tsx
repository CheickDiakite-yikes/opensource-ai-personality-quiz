
import React from "react";
import { toast } from "sonner";
import PageTransition from "@/components/ui/PageTransition";
import { useDeepInsightState } from "./hooks/useDeepInsightState";
import DeepInsightQuestionCard from "./DeepInsightQuestionCard";
import AssessmentProgress from "./components/AssessmentProgress";
import AssessmentHeader from "./components/AssessmentHeader";
import AssessmentControls from "./components/AssessmentControls";
import { AssessmentErrorHandler } from "../assessment/AssessmentErrorHandler";

const DeepInsightAssessmentPage: React.FC = () => {
  const {
    currentQuestionIndex,
    currentQuestion,
    responses,
    totalQuestions,
    progress,
    isSubmitting,
    submissionError,
    handleOptionSelect,
    handlePrevious,
    handleNext,
    handleSubmit,
  } = useDeepInsightState();
  
  return (
    <PageTransition>
      <div className="container max-w-4xl py-8 md:py-12 px-4 md:px-6 min-h-screen flex flex-col">
        <AssessmentHeader />
        
        {submissionError && (
          <AssessmentErrorHandler 
            title="Submission Error"
            description={submissionError}
            onRetry={handleSubmit}
          />
        )}
        
        <AssessmentProgress 
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={totalQuestions}
          progress={progress}
          category={currentQuestion.category}
        />
        
        <DeepInsightQuestionCard
          question={currentQuestion}
          selectedOption={responses[currentQuestion.id] || ""}
          onOptionSelect={handleOptionSelect}
        />
        
        <AssessmentControls
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={totalQuestions}
          hasResponse={!!responses[currentQuestion.id]}
          isSubmitting={isSubmitting}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSubmit={handleSubmit}
        />
      </div>
    </PageTransition>
  );
};

export default DeepInsightAssessmentPage;
