
import React, { useState } from "react";
import { BigMeQuestion } from "@/utils/big-me/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface BigMeQuestionCardProps {
  question: BigMeQuestion;
  selectedOption?: string;
  customResponse?: string;
  onSelectOption: (option: string) => void;
  onCustomResponse: (response: string) => void;
}

const BigMeQuestionCard: React.FC<BigMeQuestionCardProps> = ({
  question,
  selectedOption,
  customResponse,
  onSelectOption,
  onCustomResponse,
}) => {
  const [showCustomInput, setShowCustomInput] = useState(Boolean(customResponse));

  const handleOptionChange = (option: string) => {
    if (option === "custom" && question.allowCustomResponse) {
      setShowCustomInput(true);
    } else {
      setShowCustomInput(false);
      onSelectOption(option);
    }
  };

  const handleCustomResponseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onCustomResponse(e.target.value);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-primary">{question.question}</h3>
        <p className="text-sm text-muted-foreground">
          {question.category} | Question {question.id}
        </p>
      </div>

      <RadioGroup
        value={selectedOption || ""}
        onValueChange={handleOptionChange}
        className="space-y-3"
      >
        {question.options.map((option, index) => (
          <div key={index} className="flex items-start space-x-2">
            <RadioGroupItem
              value={option}
              id={`option-${index}`}
              className="mt-1"
            />
            <Label
              htmlFor={`option-${index}`}
              className={cn(
                "text-base font-normal leading-relaxed cursor-pointer",
                selectedOption === option ? "text-primary font-medium" : "text-foreground"
              )}
            >
              {option}
            </Label>
          </div>
        ))}

        {question.allowCustomResponse && (
          <div className="flex items-start space-x-2">
            <RadioGroupItem
              value="custom"
              id="option-custom"
              className="mt-1"
              checked={showCustomInput}
            />
            <Label
              htmlFor="option-custom"
              className={cn(
                "text-base font-normal leading-relaxed cursor-pointer",
                showCustomInput ? "text-primary font-medium" : "text-foreground"
              )}
            >
              Other (please specify)
            </Label>
          </div>
        )}
      </RadioGroup>

      {showCustomInput && (
        <div className="mt-4">
          <Textarea
            placeholder="Share your own response..."
            className="min-h-24 resize-y"
            value={customResponse || ""}
            onChange={handleCustomResponseChange}
          />
        </div>
      )}
    </div>
  );
};

export default BigMeQuestionCard;
