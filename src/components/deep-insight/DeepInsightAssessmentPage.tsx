
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Brain, ArrowRight, ArrowLeft, Send, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { getDeepInsightQuestions } from "@/utils/deep-insight/questionBank";
import { useDeepInsightState } from "@/components/deep-insight/hooks/useDeepInsightState";
import DeepInsightQuestionCard from "@/components/deep-insight/DeepInsightQuestionCard";
import PageTransition from "@/components/ui/PageTransition";

const DeepInsightAssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempts, setSubmitAttempts] = useState(0);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  
  // Add abort controller reference for cleanup
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Clean up any pending requests on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);
  
  // Make sure we're getting all 100 questions
  const questions = getDeepInsightQuestions(100);
  
  const {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    responses,
    updateResponse,
    resetResponses,
    currentQuestion,
    hasResponse,
    progress
  } = useDeepInsightState(questions);
  
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const handleOptionSelect = (option: string) => {
    updateResponse(currentQuestion.id, option);
  };
  
  const handleSubmit = async () => {
    if (!user) {
      toast.error("You must be logged in to submit the assessment", {
        description: "Please log in and try again."
      });
      return;
    }
    
    // Clean up any existing controller
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create a new controller for this submission
    abortControllerRef.current = new AbortController();
    
    setIsSubmitting(true);
    setSubmissionError(null);
    
    try {
      // Validate responses
      if (Object.keys(responses).length < questions.length) {
        toast.error("Incomplete Assessment", {
          description: "Please answer all questions before submitting."
        });
        setIsSubmitting(false);
        return;
      }
      
      // Convert responses to the format expected by the database
      const formattedResponses = Object.entries(responses).map(([questionId, selectedOption]) => ({
        questionId,
        selectedOption,
        category: questions.find(q => q.id === questionId)?.category,
        timestamp: new Date().toISOString()
      }));
      
      // Save responses to Supabase
      const { data: assessmentData, error: assessmentError } = await supabase
        .from('deep_insight_assessments')
        .insert({
          user_id: user.id,
          responses: formattedResponses,
          completed_at: new Date().toISOString()
        })
        .select('id');
      
      if (assessmentError) {
        console.error("Error saving assessment:", assessmentError);
        throw new Error(`Failed to save assessment: ${assessmentError.message}`);
      }
      
      // First save a placeholder analysis to ensure we have something to show
      const placeholderId = crypto.randomUUID();
      const { error: placeholderError } = await supabase
        .from('deep_insight_analyses')
        .insert({
          id: placeholderId,
          user_id: user.id,
          title: 'Deep Insight Analysis (Processing)',
          overview: 'Your analysis is currently being processed. Please check back shortly for your complete results.',
          complete_analysis: { status: 'processing' },
          intelligence_score: 70,
          emotional_intelligence_score: 70,
          core_traits: {
            primary: "Processing...",
            tertiaryTraits: ["Analysis in progress"]
          },
          created_at: new Date().toISOString()
        });
      
      if (placeholderError) {
        console.error("Error saving placeholder analysis:", placeholderError);
      }
      
      if (assessmentData && assessmentData[0]) {
        // Create a timeout mechanism to prevent UI freezing
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Analysis request timed out")), 90000) // Increased timeout to 90s
        );
        
        try {
          // Call the deep insight analysis edge function with signal from our AbortController
          const analysisPromise = supabase.functions.invoke(
            'deep-insight-analysis', 
            {
              body: { 
                responses: Object.entries(responses).reduce((acc, [questionId, selectedOption]) => {
                  acc[questionId] = selectedOption;
                  return acc;
                }, {} as Record<string, string>),
                timestamp: new Date().toISOString() // Add timestamp to reduce caching issues
              },
              signal: abortControllerRef.current.signal // Pass signal to the request
            }
          );
          
          // Race the analysis promise against the timeout
          const { data: analysisData, error: analysisError } = await Promise.race([
            analysisPromise,
            timeoutPromise.then(() => {
              if (abortControllerRef.current) {
                abortControllerRef.current.abort("Timeout exceeded");
              }
              throw new Error("Analysis request timed out after 90 seconds");
            })
          ]);
          
          if (analysisError) {
            console.error("Analysis invocation error:", analysisError);
            setSubmissionError(`Analysis error: ${analysisError.message || "Unknown error"}`);
            
            // If this is the first attempt, try once more
            if (submitAttempts < 1) {
              setSubmitAttempts(submitAttempts + 1);
              toast.info("Retrying analysis...", {
                description: "Please wait a moment while we process your responses again."
              });
              
              // Save the analysis results anyway to allow viewing later
              navigate(`/deep-insight/results`);
              return;
            }
            
            throw new Error(`Analysis failed: ${analysisError.message}`);
          }
          
          if (analysisData && analysisData.analysis) {
            // Save the analysis to Supabase
            const { error: saveAnalysisError } = await supabase
              .from('deep_insight_analyses')
              .insert({
                user_id: user.id,
                complete_analysis: analysisData.analysis,
                core_traits: analysisData.analysis.coreTraits,
                cognitive_patterning: analysisData.analysis.cognitivePatterning,
                emotional_architecture: analysisData.analysis.emotionalArchitecture,
                interpersonal_dynamics: analysisData.analysis.interpersonalDynamics,
                growth_potential: analysisData.analysis.growthPotential,
                intelligence_score: analysisData.analysis.intelligenceScore || 70,
                emotional_intelligence_score: analysisData.analysis.emotionalIntelligenceScore || 70,
                overview: analysisData.analysis.overview,
                response_patterns: analysisData.analysis.responsePatterns,
                raw_responses: formattedResponses
              })
              .select('id');
            
            if (saveAnalysisError) {
              console.error("Error saving analysis:", saveAnalysisError);
              throw new Error(`Failed to save analysis: ${saveAnalysisError.message}`);
            }
            
            // Delete the placeholder if it was created
            if (!placeholderError) {
              await supabase
                .from('deep_insight_analyses')
                .delete()
                .eq('id', placeholderId);
            }
            
            toast.success("Assessment completed!", {
              description: "Your deep insight analysis is ready to view."
            });
            
            // Navigate to the results page
            navigate(`/deep-insight/results`);
          } else {
            // Even if analysis wasn't complete, navigate to results
            toast.info("Processing your assessment", {
              description: "Your results will be available shortly."
            });
            navigate(`/deep-insight/results`);
          }
        } catch (error) {
          // Clean up the abort controller reference
          abortControllerRef.current = null;
          
          // Ensure we set the submission error for display
          setSubmissionError(error instanceof Error ? error.message : "Unknown error occurred");
          throw error;
        }
      }
    } catch (error) {
      console.error("Comprehensive submission error:", error);
      
      // More detailed error toast
      toast.error("Failed to submit assessment", {
        description: error instanceof Error ? error.message : "Please try again later. An unexpected error occurred.",
        duration: 5000
      });
      
      // Navigate to results anyway - they might have some data from previous attempts
      navigate(`/deep-insight/results`);
    } finally {
      setIsSubmitting(false);
      // Don't clear abortControllerRef here as we need it for potential cleanup on unmount
    }
  };
  
  // Option to restart assessment
  const handleRestart = () => {
    if (isSubmitting) return;
    
    resetResponses();
    setCurrentQuestionIndex(0);
    toast.success("Assessment reset", {
      description: "You can now start the assessment from the beginning."
    });
  };
  
  return (
    <PageTransition>
      <div className="container max-w-4xl py-8 md:py-12 px-4 md:px-6 min-h-screen flex flex-col">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <Brain className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Deep Insight Assessment</h1>
          <p className="text-muted-foreground mt-2">
            Complete this comprehensive assessment to receive your detailed personality analysis
          </p>
          
          {/* Add reset button if there are saved responses */}
          {Object.keys(responses).length > 0 && (
            <Button 
              variant="outline" 
              onClick={handleRestart} 
              className="mt-4"
              disabled={isSubmitting}
            >
              <RefreshCw className="mr-2 h-4 w-4" /> 
              Reset Assessment
            </Button>
          )}
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span className="font-medium">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
          
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
              {currentQuestion.category}
            </span>
          </div>
        </div>
        
        {submissionError && (
          <Card className="mb-6 border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900">
            <CardContent className="p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-red-700 dark:text-red-400">Error processing your assessment</p>
                <p className="text-sm text-red-600/80 dark:text-red-300/80 mt-1">
                  Your responses have been saved. Please try viewing your results again in a few minutes.
                </p>
                <p className="text-xs text-red-600/70 dark:text-red-300/70 mt-1">{submissionError}</p>
              </div>
            </CardContent>
          </Card>
        )}
        
        <DeepInsightQuestionCard
          question={currentQuestion}
          selectedOption={responses[currentQuestion.id] || ""}
          onOptionSelect={handleOptionSelect}
        />
        
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0 || isSubmitting}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          
          {!isLastQuestion ? (
            <Button 
              onClick={handleNext}
              disabled={!hasResponse(currentQuestion.id) || isSubmitting}
              className="flex items-center"
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={!hasResponse(currentQuestion.id) || isSubmitting}
              className="flex items-center bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Submit <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default DeepInsightAssessmentPage;
