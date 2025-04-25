
import React, { useState } from "react";
import { ConciseInsightQuestion } from "../types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface QuestionCardProps {
  question: ConciseInsightQuestion;
  currentResponse: string;
  onSubmit: (questionId: string, answer: string) => void;
  onPrevious: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  error: string | null;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentResponse,
  onSubmit,
  onPrevious,
  isFirstQuestion,
  isLastQuestion,
  error
}) => {
  const [selectedOption, setSelectedOption] = useState<string>(currentResponse);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(question.id, selectedOption);
  };
  
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="shadow-lg border-2 border-primary/10">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            <span className="text-primary mr-2">
              {question.category === "core_traits" && "⬢ Core Traits"}
              {question.category === "emotional" && "❤ Emotional Intelligence"}
              {question.category === "cognitive" && "🧠 Cognitive Patterns"}
              {question.category === "social" && "👥 Social Dynamics"}
              {question.category === "values" && "✨ Values & Motivations"}
            </span>
            {question.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} id="question-form">
            <RadioGroup 
              value={selectedOption} 
              onValueChange={setSelectedOption}
              className="flex flex-col space-y-3"
            >
              {question.options.map((option, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <RadioGroupItem value={String.fromCharCode(97 + index)} id={`option-${index}`} />
                  <Label 
                    htmlFor={`option-${index}`} 
                    className="leading-relaxed cursor-pointer pb-2 pt-1"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {error && (
              <p className="text-sm text-destructive mt-2">{error}</p>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onPrevious}
            disabled={isFirstQuestion}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button 
            type="submit"
            form="question-form"
            disabled={!selectedOption}
          >
            {isLastQuestion ? 'Complete' : 'Next'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
