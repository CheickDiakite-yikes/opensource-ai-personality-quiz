
import React, { useEffect, useState } from "react";
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
  const [formKey, setFormKey] = useState(0); // Add a key to force form re-rendering
  
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

  // Update form value when question or currentResponse changes
  useEffect(() => {
    if (question && question.id) {
      setValue(question.id, currentResponse || "");
      // Force re-render of the form when the question changes
      setFormKey(prevKey => prevKey + 1);
    }
  }, [question.id, currentResponse, setValue, question]);

  // Method to manually submit the current selection
  const processSubmit = (data: Record<string, string>) => {
    const selectedOption = data[question.id];
    console.log(`Submitting form for ${question.id}:`, selectedOption);
    
    if (!selectedOption) {
      console.error(`No option selected for question ${question.id}`);
      return;
    }
    
    try {
      onSubmit(question.id, selectedOption);
    } catch (error) {
      console.error(`Error submitting form for ${question.id}:`, error);
    }
  };

  // Only show test button on the first question and when not already testing
  const showTestModeButton = isFirstQuestion && !isAutoTesting;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">{question.question}</CardTitle>
        {question.description && (
          <CardDescription>{question.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <form id={`quiz-form-${formKey}`} onSubmit={handleSubmit(processSubmit)} key={formKey}>
          <Controller
            control={control}
            name={question.id}
            rules={{ required: "Please select an answer" }}
            render={({ field }) => (
              <RadioGroup
                onValueChange={(value) => {
                  console.log(`Radio selection: ${value} for question ${question.id}`);
                  field.onChange(value);
                }}
                value={field.value}
                className="flex flex-col space-y-3"
                disabled={isAutoTesting}
              >
                {question.options.map((option) => (
                  <label 
                    key={option.id}
                    className={`flex items-center space-x-3 space-y-0 rounded-md border p-4 ${isAutoTesting ? 'opacity-70' : 'hover:bg-muted/50 transition cursor-pointer'}`}
                  >
                    <input 
                      type="radio" 
                      className="form-radio" 
                      name={question.id} 
                      value={option.id}
                      checked={field.value === option.id}
                      onChange={() => {
                        field.onChange(option.id);
                        console.log(`Selected option ${option.id} for question ${question.id}`);
                      }}
                      disabled={isAutoTesting}
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
            
            {showTestModeButton && (
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
            form={`quiz-form-${formKey}`}
            disabled={isAutoTesting}
          >
            {isLastQuestion ? "Complete" : "Next"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
