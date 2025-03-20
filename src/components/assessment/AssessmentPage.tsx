
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AssessmentQuestion, AssessmentResponse, QuestionCategory } from "@/utils/types";
import { useAIAnalysis } from "@/hooks/useAIAnalysis";
import { ArrowLeft, ArrowRight, Send, Info, BarChart2 } from "lucide-react";
import { toast } from "sonner";
import QuestionCard from "./QuestionCard";
import AssessmentProgress from "./AssessmentProgress";
import { questionBank } from "@/utils/questionBank";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const AssessmentPage: React.FC = () => {
  const allQuestions = questionBank;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<AssessmentResponse[]>([]);
  const [currentResponse, setCurrentResponse] = useState<AssessmentResponse>({
    questionId: allQuestions[0].id,
    selectedOption: undefined,
    customResponse: undefined,
    category: allQuestions[0].category,
    timestamp: new Date()
  });
  const [useCustomResponse, setUseCustomResponse] = useState(false);
  const [completedQuestions, setCompletedQuestions] = useState<number[]>([]);
  const [categoryProgress, setCategoryProgress] = useState<Record<QuestionCategory, number>>({} as Record<QuestionCategory, number>);
  const { analyzeResponses, isAnalyzing } = useAIAnalysis();
  const navigate = useNavigate();
  
  const currentQuestion = allQuestions[currentQuestionIndex];

  // Calculate category progress
  useEffect(() => {
    const progress: Record<QuestionCategory, { completed: number, total: number }> = {} as Record<QuestionCategory, { completed: number, total: number }>;
    
    // Initialize all categories
    Object.values(QuestionCategory).forEach(category => {
      progress[category] = { completed: 0, total: 0 };
    });
    
    // Count total questions per category
    allQuestions.forEach(question => {
      progress[question.category].total += 1;
    });
    
    // Count completed questions per category
    responses.forEach(response => {
      const question = allQuestions.find(q => q.id === response.questionId);
      if (question && (response.selectedOption || response.customResponse)) {
        progress[question.category].completed += 1;
      }
    });
    
    // Convert to percentages
    const percentages: Record<QuestionCategory, number> = {} as Record<QuestionCategory, number>;
    Object.entries(progress).forEach(([category, data]) => {
      percentages[category as QuestionCategory] = data.total > 0 
        ? (data.completed / data.total) * 100 
        : 0;
    });
    
    setCategoryProgress(percentages);
  }, [responses, allQuestions]);
  
  const handleOptionSelect = (option: string) => {
    setCurrentResponse({
      ...currentResponse,
      questionId: currentQuestion.id,
      selectedOption: option,
      customResponse: undefined,
      category: currentQuestion.category,
      timestamp: new Date()
    });
    setUseCustomResponse(false);
  };
  
  const handleCustomResponseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentResponse({
      ...currentResponse,
      questionId: currentQuestion.id,
      selectedOption: undefined,
      customResponse: e.target.value,
      category: currentQuestion.category,
      timestamp: new Date()
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
          customResponse: undefined,
          category: allQuestions[nextIndex].category,
          timestamp: new Date()
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
          selectedOption: undefined,
          category: allQuestions[prevIndex].category,
          timestamp: new Date()
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

  const calculateOverallProgress = () => {
    return (completedQuestions.length / allQuestions.length) * 100;
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
                <p>Your responses help our AI understand your personality traits, motivations, and growth areas. Take your time with each question.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </p>
      </motion.div>
      
      <motion.div
        variants={progressContainerVariants}
        initial="hidden"
        animate="visible"
        className="mb-6"
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm">Question {currentQuestionIndex + 1} of {allQuestions.length}</span>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <BarChart2 className="h-4 w-4 mr-1" />
                <span>Progress</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4">
              <h4 className="font-medium mb-2">Category Progress</h4>
              <div className="space-y-3">
                {Object.entries(categoryProgress).map(([category, progress]) => (
                  <div key={category}>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{category}</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-500 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t">
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span>Overall Completion</span>
                  <span>{Math.round(calculateOverallProgress())}%</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-500 rounded-full"
                    style={{ width: `${calculateOverallProgress()}%` }}
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        <AssessmentProgress 
          currentQuestion={currentQuestionIndex}
          totalQuestions={allQuestions.length}
          completedQuestions={completedQuestions}
          currentCategory={currentQuestion.category}
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
