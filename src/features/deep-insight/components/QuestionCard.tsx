
import React, { useEffect, memo } from "react";
import { Controller, useForm } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DeepInsightQuestion } from "../types";

interface QuestionCardProps {
  question: DeepInsightQuestion;
  currentResponse: string;
  onPrevious: () => void;
  onSubmit: (data: Record<string, string>) => Promise<boolean>;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  error: string | null;
  isLoading?: boolean;
}

// Using memo to prevent unnecessary re-renders
export const QuestionCard: React.FC<QuestionCardProps> = memo(({
  question,
  currentResponse,
  onPrevious,
  onSubmit,
  isFirstQuestion,
  isLastQuestion,
  error,
  isLoading = false,
}) => {
  const { control, handleSubmit, setValue, formState } = useForm<Record<string, string>>({
    defaultValues: {
      [question.id]: currentResponse || ""
    }
  });

  // Update form value when question or currentResponse changes
  useEffect(() => {
    if (currentResponse) {
      setValue(question.id, currentResponse);
    }
  }, [question.id, currentResponse, setValue]);

  // Process submission with loading state handling
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const processSubmit = async (data: Record<string, string>) => {
    // Prevent multiple submissions
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    // Make sure we're submitting the correct question ID
    const formattedData = {
      [question.id]: data[question.id]
    };
    
    try {
      // Wait for submission result and only proceed if successful
      await onSubmit(formattedData);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="h-8 w-3/4 mb-2 bg-muted animate-pulse rounded" />
          <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 w-full bg-muted animate-pulse rounded" />
          ))}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="h-10 w-24 bg-muted animate-pulse rounded" />
          <div className="h-10 w-24 bg-muted animate-pulse rounded" />
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
                    <RadioGroupItem 
                      value={option.id} 
                      id={option.id}
                      checked={field.value === option.id}
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
        <Button 
          type="submit" 
          form="quiz-form" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></span>
              {isLastQuestion ? "Completing..." : "Next..."}
            </span>
          ) : (
            isLastQuestion ? "Complete" : "Next"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
});

// Display name for better debugging
QuestionCard.displayName = "QuestionCard";
