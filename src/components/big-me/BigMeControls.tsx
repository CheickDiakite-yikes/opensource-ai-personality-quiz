
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";

interface BigMeControlsProps {
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  isSubmitting: boolean;
}

const BigMeControls: React.FC<BigMeControlsProps> = ({
  onPrevious,
  onNext,
  onSubmit,
  isFirstQuestion,
  isLastQuestion,
  isSubmitting,
}) => {
  return (
    <div className="flex justify-between">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstQuestion}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Previous
      </Button>
      
      {isLastQuestion ? (
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-2"
        >
          {isSubmitting ? "Submitting..." : "Submit Assessment"} {!isSubmitting && <Send className="h-4 w-4" />}
        </Button>
      ) : (
        <Button
          onClick={onNext}
          className="flex items-center gap-2"
        >
          Next <ArrowRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default BigMeControls;
