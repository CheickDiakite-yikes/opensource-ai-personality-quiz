import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { AssessmentQuestion, AssessmentResponse } from "@/utils/types";
import { useAIAnalysis } from "@/hooks/useAIAnalysis";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import { toast } from "sonner";

// Sample questions for the assessment
const sampleQuestions: AssessmentQuestion[] = [
  {
    id: 1,
    question: "How do you typically react when faced with unexpected challenges?",
    options: [
      "I embrace them as opportunities for growth",
      "I analyze the situation before deciding how to proceed",
      "I seek advice or help from others",
      "I feel stressed but try to work through it",
      "I prefer to avoid unexpected situations altogether"
    ],
    allowCustomResponse: true
  },
  {
    id: 2,
    question: "When making important decisions, what approach do you usually take?",
    options: [
      "I follow my intuition and gut feelings",
      "I carefully weigh pros and cons before deciding",
      "I consider how the decision will affect others",
      "I prefer to gather as much information as possible",
      "I often seek advice from people I trust"
    ],
    allowCustomResponse: true
  },
  {
    id: 3,
    question: "How do you prefer to spend your free time?",
    options: [
      "Socializing with friends or family",
      "Engaging in creative or artistic activities",
      "Learning something new or intellectual pursuits",
      "Physical activities or being in nature",
      "Relaxing alone with books, movies, or other media"
    ],
    allowCustomResponse: true
  },
  {
    id: 4,
    question: "In team settings, which role do you naturally gravitate toward?",
    options: [
      "The leader who takes charge",
      "The creative who generates ideas",
      "The analyzer who evaluates options critically",
      "The mediator who ensures everyone is heard",
      "The executor who gets things done"
    ],
    allowCustomResponse: true
  },
  {
    id: 5,
    question: "How do you typically handle criticism?",
    options: [
      "I welcome it as an opportunity to improve",
      "I carefully consider it before deciding if it's valid",
      "I often take it personally initially",
      "I prefer to receive it privately",
      "I tend to defend myself or explain my reasoning"
    ],
    allowCustomResponse: true
  },
];

// Generate 50 questions by duplicating and slightly modifying the sample questions
const generateQuestions = (): AssessmentQuestion[] => {
  const questions: AssessmentQuestion[] = [];
  
  // For a real app, you'd have 50 unique, carefully crafted questions
  // Here we'll just duplicate the samples with modified text for demonstration
  for (let i = 0; i < 10; i++) {
    sampleQuestions.forEach((q, index) => {
      questions.push({
        ...q,
        id: i * 5 + index + 1,
        question: i === 0 ? q.question : `${q.question} (Scenario ${i + 1})`,
      });
    });
  }
  
  return questions.slice(0, 50);
};

const AssessmentPage: React.FC = () => {
  const allQuestions = generateQuestions();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<AssessmentResponse[]>([]);
  const [currentResponse, setCurrentResponse] = useState<AssessmentResponse>({
    questionId: allQuestions[0].id,
    selectedOption: undefined,
    customResponse: undefined
  });
  const [useCustomResponse, setUseCustomResponse] = useState(false);
  const { analyzeResponses, isAnalyzing } = useAIAnalysis();
  const navigate = useNavigate();
  
  const currentQuestion = allQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / allQuestions.length) * 100;
  
  const handleOptionSelect = (option: string) => {
    setCurrentResponse({
      ...currentResponse,
      questionId: currentQuestion.id,
      selectedOption: option,
      customResponse: undefined
    });
    setUseCustomResponse(false);
  };
  
  const handleCustomResponseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentResponse({
      ...currentResponse,
      questionId: currentQuestion.id,
      selectedOption: undefined,
      customResponse: e.target.value
    });
    setUseCustomResponse(true);
  };
  
  const saveCurrentResponse = () => {
    const existingResponseIndex = responses.findIndex(
      (r) => r.questionId === currentQuestion.id
    );
    
    if (existingResponseIndex >= 0) {
      const updatedResponses = [...responses];
      updatedResponses[existingResponseIndex] = currentResponse;
      setResponses(updatedResponses);
    } else {
      setResponses([...responses, currentResponse]);
    }
  };
  
  const goToNextQuestion = () => {
    if (!currentResponse.selectedOption && !currentResponse.customResponse) {
      toast.error("Please select an option or provide a custom response");
      return;
    }
    
    saveCurrentResponse();
    
    if (currentQuestionIndex < allQuestions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      
      // Check if the next question already has a response
      const existingResponse = responses.find(
        (r) => r.questionId === allQuestions[nextIndex].id
      );
      
      if (existingResponse) {
        setCurrentResponse(existingResponse);
        setUseCustomResponse(!!existingResponse.customResponse);
      } else {
        setCurrentResponse({
          questionId: allQuestions[nextIndex].id,
          selectedOption: undefined,
          customResponse: undefined
        });
        setUseCustomResponse(false);
      }
    } else {
      handleSubmitAssessment();
    }
  };
  
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      saveCurrentResponse();
      
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
      
      const existingResponse = responses.find(
        (r) => r.questionId === allQuestions[prevIndex].id
      );
      
      if (existingResponse) {
        setCurrentResponse(existingResponse);
        setUseCustomResponse(!!existingResponse.customResponse);
      } else {
        setCurrentResponse({
          questionId: allQuestions[prevIndex].id,
          selectedOption: undefined,
          customResponse: undefined
        });
        setUseCustomResponse(false);
      }
    }
  };
  
  const handleSubmitAssessment = async () => {
    // Save the final response
    saveCurrentResponse();
    
    try {
      // In a real app, you would send this to your backend
      // For now we'll just pass it to our mock analysis function
      await analyzeResponses(responses);
      navigate("/report");
    } catch (error) {
      console.error("Error submitting assessment:", error);
    }
  };
  
  // Animation variants
  const questionVariants = {
    enter: { opacity: 0, x: 100 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  };
  
  return (
    <div className="container max-w-3xl py-8 md:py-12 px-4 md:px-6 min-h-screen flex flex-col">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Self-Discovery Assessment</h1>
        <p className="text-muted-foreground mt-2">
          Answer thoughtfully for the most accurate insights
        </p>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span>Question {currentQuestionIndex + 1} of {allQuestions.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      <Card className="flex-1 glass-panel p-6 md:p-8 rounded-xl mb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial="enter"
            animate="center"
            exit="exit"
            variants={questionVariants}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30
            }}
            className="h-full flex flex-col"
          >
            <h2 className="text-xl font-medium mb-6">
              {currentQuestion.question}
            </h2>
            
            <div className="flex-1">
              <RadioGroup 
                value={currentResponse.selectedOption} 
                className="space-y-3 mb-6"
                onValueChange={handleOptionSelect}
              >
                {currentQuestion.options.map((option) => (
                  <div key={option} className="flex items-start space-x-2">
                    <RadioGroupItem value={option} id={option} className="mt-1" />
                    <Label 
                      htmlFor={option} 
                      className="text-base leading-relaxed cursor-pointer"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              
              {currentQuestion.allowCustomResponse && (
                <div className="mt-4">
                  <Label 
                    htmlFor="custom-response" 
                    className="block text-base font-medium mb-2"
                  >
                    Or provide your own response (optional)
                  </Label>
                  <Textarea 
                    id="custom-response"
                    placeholder="Write your response here..."
                    value={currentResponse.customResponse || ""}
                    onChange={handleCustomResponseChange}
                    className="min-h-[120px]"
                    maxLength={300}
                  />
                  {currentResponse.customResponse && (
                    <div className="text-xs text-right mt-1 text-muted-foreground">
                      {currentResponse.customResponse.length}/300 characters
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </Card>
      
      <div className="flex justify-between mt-auto">
        <Button
          variant="outline"
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0 || isAnalyzing}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        
        {currentQuestionIndex < allQuestions.length - 1 ? (
          <Button 
            onClick={goToNextQuestion}
            disabled={!currentResponse.selectedOption && !currentResponse.customResponse || isAnalyzing}
            className="flex items-center"
          >
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button 
            onClick={handleSubmitAssessment}
            disabled={!currentResponse.selectedOption && !currentResponse.customResponse || isAnalyzing}
            className="flex items-center"
          >
            {isAnalyzing ? "Analyzing..." : "Submit"} <Send className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default AssessmentPage;
