import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AssessmentQuestion, AssessmentResponse } from "@/utils/types";
import { useAIAnalysis } from "@/hooks/useAIAnalysis";
import { ArrowLeft, ArrowRight, Send, Info } from "lucide-react";
import { toast } from "sonner";
import QuestionCard from "./QuestionCard";
import AssessmentProgress from "./AssessmentProgress";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const [completedQuestions, setCompletedQuestions] = useState<number[]>([]);
  const { analyzeResponses, isAnalyzing } = useAIAnalysis();
  const navigate = useNavigate();
  
  const currentQuestion = allQuestions[currentQuestionIndex];
  
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
    
    // Mark question as completed if not already
    if (!completedQuestions.includes(currentQuestionIndex)) {
      setCompletedQuestions([...completedQuestions, currentQuestionIndex]);
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
          customResponse: undefined,
          selectedOption: undefined
        });
        setUseCustomResponse(false);
      }
    }
  };
  
  const handleSubmitAssessment = async () => {
    // Save the final response
    saveCurrentResponse();
    
    try {
      toast.info("Analyzing your responses...", {
        duration: 3000,
      });
      
      // In a real app, you would send this to your backend
      // For now we'll just pass it to our mock analysis function
      await analyzeResponses(responses);
      navigate("/report");
    } catch (error) {
      console.error("Error submitting assessment:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };
  
  const progressContainerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
  
  return (
    <div className="container max-w-3xl py-8 md:py-12 px-4 md:px-6 min-h-screen flex flex-col">
      <motion.div 
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">Self-Discovery Assessment</h1>
        <p className="text-muted-foreground mt-2 flex items-center justify-center gap-2">
          Answer thoughtfully for the most accurate insights
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Your responses help our AI understand your personality traits, motivations, and growth areas.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </p>
      </motion.div>
      
      <motion.div
        variants={progressContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <AssessmentProgress 
          currentQuestion={currentQuestionIndex}
          totalQuestions={allQuestions.length}
          completedQuestions={completedQuestions}
        />
      </motion.div>
      
      <AnimatePresence mode="wait">
        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          selectedOption={currentResponse.selectedOption}
          customResponse={currentResponse.customResponse}
          onOptionSelect={handleOptionSelect}
          onCustomResponseChange={handleCustomResponseChange}
          useCustomResponse={useCustomResponse}
        />
      </AnimatePresence>
      
      <motion.div 
        className="flex justify-between mt-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
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
            className="flex items-center bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          >
            {isAnalyzing ? "Analyzing..." : "Submit"} <Send className="ml-2 h-4 w-4" />
          </Button>
        )}
      </motion.div>
    </div>
  );
};

export default AssessmentPage;
