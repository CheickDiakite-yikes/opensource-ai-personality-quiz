
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AssessmentQuestion } from "@/utils/types";

interface DeepInsightQuestionCardProps {
  question: AssessmentQuestion;
  selectedOption: string;
  onOptionSelect: (option: string) => void;
}

const DeepInsightQuestionCard: React.FC<DeepInsightQuestionCardProps> = ({
  question,
  selectedOption,
  onOptionSelect,
}) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
  };

  return (
    <motion.div
      key={question.id}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full"
    >
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">{question.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedOption} className="space-y-4">
            {question.options.map((option, index) => (
              <div
                key={index}
                className={`flex items-start space-x-3 p-4 rounded-lg transition-colors ${
                  selectedOption === option
                    ? "bg-primary/10 border border-primary/30"
                    : "hover:bg-muted/50 border border-transparent"
                }`}
                onClick={() => onOptionSelect(option)}
              >
                <RadioGroupItem
                  value={option}
                  id={`option-${question.id}-${index}`}
                  checked={selectedOption === option}
                  className="mt-0.5"
                />
                <Label
                  htmlFor={`option-${question.id}-${index}`}
                  className="font-normal text-foreground leading-relaxed cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DeepInsightQuestionCard;
