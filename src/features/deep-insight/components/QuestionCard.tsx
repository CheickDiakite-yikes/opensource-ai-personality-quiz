import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { AlertCircle, Wand2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import { DeepInsightQuestion } from "../types";
import { useAutoTest } from "../hooks/useAutoTest";
import { deepInsightQuestions } from "../data/questions";

interface QuestionCardProps {
  question: DeepInsightQuestion;
  currentResponse: string;
  onPrevious: () => void;
  onSubmit: (questionId: string, selectedOption: string) => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  error: string | null;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentResponse,
  onPrevious,
  onSubmit,
  isFirstQuestion,
  isLastQuestion,
  error,
  currentQuestionIndex,
  setCurrentQuestionIndex,
}) => {
  const { control, handleSubmit, setValue, watch, formState } = useForm<Record<string, string>>({
    defaultValues: {
      [question.id]: currentResponse || ""
    }
  });

  const { isAutoTesting, startAutoTest } = useAutoTest(
    deepInsightQuestions,
    onSubmit,
    setCurrentQuestionIndex
  );

  // For debugging
  const watchedValue = watch(question.id);
  console.log(`Current form value for ${question.id}:`, watchedValue);
  console.log(`Current response prop for ${question.id}:`, currentResponse);

  // Update form value when question or currentResponse changes
  useEffect(() => {
    if (currentResponse) {
      console.log(`Setting form value for ${question.id} to:`, currentResponse);
      setValue(question.id, currentResponse);
    }
  }, [question.id, currentResponse, setValue]);

  const processSubmit = (data: Record<string, string>) => {
    // Make sure we're submitting the correct question ID
    const selectedOption = data[question.id];
    console.log(`Processing submission for question ${question.id} with value:`, selectedOption);
    onSubmit(question.id, selectedOption);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">{question.question}</CardTitle>
        {question.description && (
          <CardDescription>{question.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <form id="quiz-form" onSubmit={handleSubmit(processSubmit)}>
          <Controller
            control={control}
            name={question.id}
            rules={{ required: "Please select an answer" }}
            render={({ field }) => (
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="flex flex-col space-y-3"
              >
                {question.options.map((option) => (
                  <label 
                    key={option.id}
                    className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-muted/50 transition cursor-pointer"
                  >
                    <input 
                      type="radio" 
                      className="form-radio" 
                      name={question.id} 
                      value={option.id}
                      checked={field.value === option.id}
                      onChange={() => field.onChange(option.id)}
                    />
                    <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {option.text}
                    </span>
                  </label>
                ))}
              </RadioGroup>
            )}
          />
        </form>
        
        {error && (
          <div className="bg-destructive/15 text-destructive rounded-md p-3 flex items-center gap-2 mt-4">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex justify-between w-full items-center">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onPrevious}
              disabled={isFirstQuestion || isAutoTesting}
            >
              Previous
            </Button>
            
            {!isLastQuestion && (
              <Button 
                type="button"
                variant="elegant"
                onClick={startAutoTest}
                disabled={isAutoTesting || currentQuestionIndex > 0}
                className="flex items-center gap-2"
              >
                <Wand2 className="h-4 w-4" />
                Test Mode
              </Button>
            )}
          </div>
          
          <Button 
            type="submit" 
            form="quiz-form"
            disabled={isAutoTesting}
          >
            {isLastQuestion ? "Complete" : "Next"}
          </Button>
        </div>
        
        {error && (
          <div className="bg-destructive/15 text-destructive rounded-md p-3 flex items-center gap-2 mt-4">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
