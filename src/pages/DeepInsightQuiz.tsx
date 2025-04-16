
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormField, FormItem, FormControl, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

// Types for our quiz
interface DeepInsightQuestion {
  id: string;
  question: string;
  description?: string;
  options: {
    id: string;
    text: string;
    value: number;
  }[];
  category: string;
}

// Sample questions (we'll add more later)
const deepInsightQuestions: DeepInsightQuestion[] = [
  {
    id: "q1",
    question: "When faced with a difficult decision, I typically:",
    description: "Think about your natural response pattern in challenging situations",
    category: "decision-making",
    options: [
      { id: "q1-a", text: "Analyze all options methodically before deciding", value: 1 },
      { id: "q1-b", text: "Go with what feels right intuitively", value: 2 },
      { id: "q1-c", text: "Consider how others would handle it", value: 3 },
      { id: "q1-d", text: "Delay the decision until absolutely necessary", value: 4 },
    ],
  },
  {
    id: "q2",
    question: "In social gatherings, I am most often:",
    category: "social",
    options: [
      { id: "q2-a", text: "The center of attention, energized by interaction", value: 1 },
      { id: "q2-b", text: "Engaging with a small group of close friends", value: 2 },
      { id: "q2-c", text: "Observing others and selectively participating", value: 3 },
      { id: "q2-d", text: "Feeling drained and looking forward to alone time", value: 4 },
    ],
  },
  {
    id: "q3",
    question: "My approach to personal growth is best described as:",
    category: "growth",
    options: [
      { id: "q3-a", text: "Setting clear goals with measurable outcomes", value: 1 },
      { id: "q3-b", text: "Following my passions wherever they lead me", value: 2 },
      { id: "q3-c", text: "Learning from mentors and role models", value: 3 },
      { id: "q3-d", text: "Reflecting deeply on past experiences", value: 4 },
    ],
  },
  {
    id: "q4",
    question: "When I experience failure, I typically:",
    category: "resilience",
    options: [
      { id: "q4-a", text: "Analyze what went wrong to avoid future mistakes", value: 1 },
      { id: "q4-b", text: "Feel deeply disappointed but try to move forward", value: 2 },
      { id: "q4-c", text: "Seek support and perspective from others", value: 3 },
      { id: "q4-d", text: "Question my abilities and worry about future attempts", value: 4 },
    ],
  },
  {
    id: "q5",
    question: "My ideal work environment would be:",
    category: "work",
    options: [
      { id: "q5-a", text: "Structured and organized with clear expectations", value: 1 },
      { id: "q5-b", text: "Creative and flexible with room for innovation", value: 2 },
      { id: "q5-c", text: "Collaborative with strong team relationships", value: 3 },
      { id: "q5-d", text: "Independent with minimal oversight", value: 4 },
    ],
  },
];

// Main component
const DeepInsightQuiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { user } = useAuth();
  const form = useForm();
  
  const currentQuestion = deepInsightQuestions[currentQuestionIndex];
  const totalQuestions = deepInsightQuestions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  
  const handleNext = (data: Record<string, string>) => {
    // Get the current question's response
    const currentResponse = data[currentQuestion.id];
    
    // Save response
    setResponses({
      ...responses,
      [currentQuestion.id]: currentResponse
    });
    
    // Move to next question or submit if done
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      form.reset({ [deepInsightQuestions[currentQuestionIndex + 1].id]: "" });
    } else {
      // Submit all responses
      handleSubmit();
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      form.setValue(currentQuestion.id, responses[currentQuestion.id] || "");
    }
  };
  
  const handleSubmit = () => {
    // In a real implementation, we would send these responses to an API
    console.log("All responses:", responses);
    
    // For now, just navigate to results page with responses as state
    toast.success("Your Deep Insight assessment is complete!");
    navigate("/deep-insight/results", { 
      state: { responses } 
    });
  };
  
  return (
    <motion.div 
      className="container max-w-4xl py-8 px-4 md:px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex flex-col gap-8">
        <header className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            Deep Insight Assessment
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover your authentic self through this comprehensive personality assessment. 
            Answer thoughtfully to receive a detailed analysis of your inner workings.
          </p>
        </header>
        
        {/* Progress bar */}
        <div className="w-full bg-muted rounded-full h-2.5 mb-2">
          <div 
            className="bg-primary h-2.5 rounded-full transition-all" 
            style={{ width: `${progress}%` }}
          ></div>
          <div className="text-sm text-muted-foreground text-right">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </div>
        </div>
        
        {/* Question card */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">{currentQuestion.question}</CardTitle>
            {currentQuestion.description && (
              <CardDescription>{currentQuestion.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleNext)}>
                <FormField
                  control={form.control}
                  name={currentQuestion.id}
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-3"
                        >
                          {currentQuestion.options.map((option) => (
                            <FormItem
                              key={option.id}
                              className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-muted/50 transition cursor-pointer"
                            >
                              <FormControl>
                                <RadioGroupItem value={option.id} />
                              </FormControl>
                              <FormLabel className="cursor-pointer font-normal flex-1">
                                {option.text}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-between mt-6">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous
                  </Button>
                  <Button type="submit">
                    {currentQuestionIndex < totalQuestions - 1 ? "Next" : "Complete"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default DeepInsightQuiz;
