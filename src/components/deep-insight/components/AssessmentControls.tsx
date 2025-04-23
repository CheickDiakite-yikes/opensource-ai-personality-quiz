
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Send, Loader2 } from "lucide-react";

interface AssessmentControlsProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  hasResponse: boolean;
  isSubmitting: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

const AssessmentControls: React.FC<AssessmentControlsProps> = ({
  currentQuestionIndex,
  totalQuestions,
  hasResponse,
  isSubmitting,
  onPrevious,
  onNext,
  onSubmit,
}) => {
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  
  return (
    <div className="flex justify-between mt-8">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentQuestionIndex === 0 || isSubmitting}
        className="flex items-center"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Previous
      </Button>
      
      {!isLastQuestion ? (
        <Button 
          onClick={onNext}
          disabled={!hasResponse || isSubmitting}
          className="flex items-center"
        >
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <Button 
          onClick={onSubmit}
          disabled={!hasResponse || isSubmitting}
          className="flex items-center bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
        >
          {isSubmitting ? (
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
    </div>
  );
};

export default AssessmentControls;
