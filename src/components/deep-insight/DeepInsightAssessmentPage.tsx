import React from "react";
import PageTransition from "@/components/ui/PageTransition";
import { useDeepInsightState } from "./hooks/useDeepInsightState";
import DeepInsightQuestionCard from "./DeepInsightQuestionCard";
import AssessmentProgress from "./components/AssessmentProgress";
import AssessmentHeader from "./components/AssessmentHeader";
import AssessmentControls from "./components/AssessmentControls";
import { AssessmentErrorHandler } from "../assessment/AssessmentErrorHandler";
import DeepInsightE2ETest from "./DeepInsightE2ETest";
import { Button } from "../ui/button";
import { useState } from "react";

const DeepInsightAssessmentPage: React.FC = () => {
  const [showTest, setShowTest] = useState(false);
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
        <div className="flex justify-between items-center mb-6">
          <AssessmentHeader />
          <Button 
            variant="outline"
            onClick={() => setShowTest(!showTest)}
          >
            {showTest ? 'Take Assessment' : 'Run E2E Test'}
          </Button>
        </div>
        
        {showTest ? (
          <DeepInsightE2ETest />
        ) : (
          <>
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
          </>
        )}
      </div>
    </PageTransition>
  );
};

export default DeepInsightAssessmentPage;
