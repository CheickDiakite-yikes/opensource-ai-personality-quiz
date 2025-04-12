
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { allQuestions } from "@/utils/questions";
import QuestionCard from "@/components/assessment/QuestionCard";
import AssessmentProgress from "@/components/assessment/AssessmentProgress";
import AssessmentHeader from "@/components/assessment/AssessmentHeader";
import AssessmentProgressInfo from "@/components/assessment/AssessmentProgressInfo";
import AssessmentControls from "@/components/assessment/AssessmentControls";
import { useAssessmentState } from "@/components/assessment/useAssessmentState";

const ComprehensiveAssessmentPage: React.FC = () => {
  const allComprehensiveQuestions = allQuestions.slice(0, 100); // Using all available questions for now
  
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
  
  return (
    <div className="container max-w-3xl py-8 md:py-12 px-4 md:px-6 min-h-screen flex flex-col">
      <AssessmentHeader />
      
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
        />
      </AnimatePresence>
      
      <AssessmentControls
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={allComprehensiveQuestions.length}
        currentResponse={currentResponse}
        isAnalyzing={isAnalyzing}
        onPrevious={goToPreviousQuestion}
        onNext={goToNextQuestion}
        onSubmit={handleSubmitAssessment}
      />
    </div>
  );
};

export default ComprehensiveAssessmentPage;
