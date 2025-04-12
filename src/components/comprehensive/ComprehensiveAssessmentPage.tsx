
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { allComprehensiveQuestions } from "@/utils/comprehensiveQuestions";
import QuestionCard from "@/components/assessment/QuestionCard";
import AssessmentProgress from "@/components/assessment/AssessmentProgress";
import AssessmentProgressInfo from "@/components/assessment/AssessmentProgressInfo";
import AssessmentControls from "@/components/assessment/AssessmentControls";
import { useAssessmentState } from "@/components/comprehensive/useComprehensiveAssessmentState";

const ComprehensiveAssessmentPage: React.FC = () => {
  // Using dedicated comprehensive question bank with 100 questions
  const {
    currentQuestionIndex,
    currentQuestion,
    currentResponse,
    useCustomResponse,
    completedQuestions,
    categoryProgress,
    isAnalyzing,
    handleOptionSelect,
    handleCustomResponseChange,
    goToNextQuestion,
    goToPreviousQuestion,
    handleSubmitAssessment,
  } = useAssessmentState(allComprehensiveQuestions);
  
  const progressContainerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
  
  // Convert completedQuestions to numbers for AssessmentProgress
  const completedQuestionsIds = completedQuestions.map(id => parseInt(id.replace('comp-', '')));
  
  return (
    <div className="container max-w-3xl py-8 md:py-12 px-4 md:px-6 min-h-screen flex flex-col">
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-3">
          <img 
            src="/lovable-uploads/a6a49449-db76-4794-8533-d61d6a85d466.png" 
            alt="Who Am I Logo" 
            className="h-10 w-auto" 
          />
        </div>
        <h1 className="text-3xl font-bold">Comprehensive Assessment</h1>
        <p className="text-muted-foreground mt-2">
          Complete all 100 questions for an in-depth personality analysis
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          This detailed assessment offers a more accurate and personalized report
        </p>
      </div>
      
      <motion.div
        variants={progressContainerVariants}
        initial="hidden"
        animate="visible"
        className="mb-6"
      >
        <AssessmentProgressInfo 
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={allComprehensiveQuestions.length}
          categoryProgress={categoryProgress}
          completedQuestionsCount={completedQuestions.length}
        />
        
        <AssessmentProgress 
          currentQuestion={currentQuestionIndex}
          totalQuestions={allComprehensiveQuestions.length}
          completedQuestions={completedQuestionsIds}
          currentCategory={currentQuestion.category}
        />
      </motion.div>
      
      <AnimatePresence mode="wait">
        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          selectedOption={currentResponse.selectedOption}
          customResponse={currentResponse.customResponse}
          onOptionSelect={handleOptionSelect}
          onCustomResponseChange={handleCustomResponseChange}
          useCustomResponse={useCustomResponse}
        />
      </AnimatePresence>
      
      <AssessmentControls
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={allComprehensiveQuestions.length}
        currentResponse={{
          questionId: currentResponse.questionId,
          selectedOption: currentResponse.selectedOption,
          customResponse: currentResponse.customResponse,
          category: currentQuestion.category,
          timestamp: new Date()
        }}
        isAnalyzing={isAnalyzing}
        onPrevious={goToPreviousQuestion}
        onNext={goToNextQuestion}
        onSubmit={handleSubmitAssessment}
      />
    </div>
  );
};

export default ComprehensiveAssessmentPage;
