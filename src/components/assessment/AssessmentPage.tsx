
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { questionBank } from "@/utils/questionBank";
import QuestionCard from "./QuestionCard";
import AssessmentProgress from "./AssessmentProgress";
import AssessmentHeader from "./AssessmentHeader";
import AssessmentProgressInfo from "./AssessmentProgressInfo";
import AssessmentControls from "./AssessmentControls";
import { useAssessmentState } from "./useAssessmentState";
import { useIsMobile } from "@/hooks/use-mobile";

const AssessmentPage: React.FC = () => {
  const allQuestions = questionBank;
  const isMobile = useIsMobile();
  
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
  } = useAssessmentState(allQuestions);
  
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
  
  return (
    <div className={`container max-w-3xl ${isMobile ? 'py-4' : 'py-8 md:py-12'} px-3 sm:px-4 md:px-6 min-h-screen flex flex-col`}>
      <AssessmentHeader />
      
      <motion.div
        variants={progressContainerVariants}
        initial="hidden"
        animate="visible"
        className={`${isMobile ? 'mb-4' : 'mb-6'}`}
      >
        <AssessmentProgressInfo 
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={allQuestions.length}
          categoryProgress={categoryProgress}
          completedQuestionsCount={completedQuestions.length}
        />
        
        <AssessmentProgress 
          currentQuestion={currentQuestionIndex}
          totalQuestions={allQuestions.length}
          completedQuestions={completedQuestions}
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
          isMobile={isMobile}
        />
      </AnimatePresence>
      
      <AssessmentControls
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={allQuestions.length}
        currentResponse={currentResponse}
        isAnalyzing={isAnalyzing}
        onPrevious={goToPreviousQuestion}
        onNext={goToNextQuestion}
        onSubmit={handleSubmitAssessment}
        isMobile={isMobile}
      />
    </div>
  );
};

export default AssessmentPage;
