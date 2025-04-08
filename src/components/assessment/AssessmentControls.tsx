
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Send, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { AssessmentQuestion, AssessmentResponse } from "@/utils/types";

interface AssessmentControlsProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  currentResponse: AssessmentResponse;
  isAnalyzing: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

const AssessmentControls: React.FC<AssessmentControlsProps> = ({
  currentQuestionIndex,
  totalQuestions,
  currentResponse,
  isAnalyzing,
  onPrevious,
  onNext,
  onSubmit,
}) => {
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const hasResponse = !!currentResponse.selectedOption || !!currentResponse.customResponse;
  
  return (
    <motion.div 
      className="flex justify-between mt-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentQuestionIndex === 0 || isAnalyzing}
        className="flex items-center"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Previous
      </Button>
      
      {!isLastQuestion ? (
        <Button 
          onClick={onNext}
          disabled={!hasResponse || isAnalyzing}
          className="flex items-center"
        >
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <Button 
          onClick={onSubmit}
          disabled={!hasResponse || isAnalyzing}
          className="flex items-center bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              Submit <Send className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      )}
    </motion.div>
  );
};

export default AssessmentControls;
