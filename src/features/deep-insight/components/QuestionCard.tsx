
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import { DeepInsightQuestion } from "../types";
import { Skeleton } from "@/components/ui/skeleton";

interface QuestionCardProps {
  question: DeepInsightQuestion;
  currentResponse: string;
  onPrevious: () => void;
  onSubmit: (data: Record<string, string>) => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  error: string | null;
  isLoading?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentResponse,
  onPrevious,
  onSubmit,
  isFirstQuestion,
  isLastQuestion,
  error,
  isLoading = false,
}) => {
  const { control, handleSubmit, setValue, watch, formState } = useForm<Record<string, string>>({
    defaultValues: {
      [question.id]: currentResponse || ""
    }
  });

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
    const formattedData = {
      [question.id]: data[question.id]
    };
    console.log(`Processing submission for question ${question.id} with value:`, formattedData[question.id]);
    onSubmit(formattedData);
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </CardFooter>
      </Card>
    );
  }

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
      <CardFooter className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          disabled={isFirstQuestion}
        >
          Previous
        </Button>
        <Button type="submit" form="quiz-form">
          {isLastQuestion ? "Complete" : "Next"}
        </Button>
      </CardFooter>
    </Card>
  );
};
