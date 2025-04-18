
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Brain, ArrowRight, ArrowLeft, Send, Loader2, AlertTriangle } from "lucide-react";
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
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  
  // Make sure we're getting all 100 questions
  const questions = getDeepInsightQuestions(100);
  
  const {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    responses,
    updateResponse,
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
    
    setIsSubmitting(true);
    setAnalysisError(null);
    
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
      
      if (assessmentData && assessmentData[0]) {
        // Create a timeout promise to handle long-running function calls
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => {
            reject(new Error('Edge function request timed out after 60 seconds'));
          }, 60000); // 60 second timeout
        });
        
        // Call the deep insight analysis edge function with robust error handling
        toast.loading("Analyzing your responses...", { id: "deep-insight-analysis" });
        
        console.log("Calling deep-insight-analysis function...");
        
        try {
          // Race between function call and timeout
          const result = await Promise.race([
            supabase.functions.invoke('deep-insight-analysis', {
              body: { 
                responses: Object.entries(responses).reduce((acc, [questionId, selectedOption]) => {
                  acc[questionId] = selectedOption;
                  return acc;
                }, {} as Record<string, string>) 
              }
            }),
            timeoutPromise
          ]);
          
          console.log("Function call completed. Result status:", result ? "Success" : "Empty result");
          
          if (!result) {
            throw new Error("Empty response from edge function");
          }
          
          if (result.error) {
            console.error("Edge function error:", result.error);
            throw new Error(`Analysis error: ${result.error}`);
          }
          
          if (!result.data || !result.data.analysis) {
            console.error("Invalid edge function response structure:", result);
            throw new Error("Invalid response from analysis function - missing analysis data");
          }
          
          // Save the analysis to Supabase
          console.log("Saving analysis result to database...");
          
          const { error: saveAnalysisError } = await supabase
            .from('deep_insight_analyses')
            .insert({
              user_id: user.id,
              complete_analysis: result.data.analysis,
              core_traits: result.data.analysis.coreTraits,
              cognitive_patterning: result.data.analysis.cognitivePatterning,
              emotional_architecture: result.data.analysis.emotionalArchitecture,
              interpersonal_dynamics: result.data.analysis.interpersonalDynamics,
              growth_potential: result.data.analysis.growthPotential,
              intelligence_score: result.data.analysis.intelligenceScore || 70,
              emotional_intelligence_score: result.data.analysis.emotionalIntelligenceScore || 70,
              overview: result.data.analysis.overview,
              response_patterns: result.data.analysis.responsePatterns,
              raw_responses: formattedResponses
            })
            .select('id');
          
          if (saveAnalysisError) {
            console.error("Error saving analysis:", saveAnalysisError);
            throw new Error(`Failed to save analysis: ${saveAnalysisError.message}`);
          }
          
          toast.success("Assessment completed!", {
            id: "deep-insight-analysis",
            description: "Your deep insight analysis is ready to view."
          });
          
          // Navigate to the results page
          navigate(`/deep-insight/results`);
        } catch (error: any) {
          console.error("Function invocation error:", error);
          setAnalysisError(error.message);
          
          // Record the failure and attempt a retry if needed
          if (submitAttempts < 1) {
            setSubmitAttempts(submitAttempts + 1);
            toast.error("Analysis failed, will attempt to retry", {
              id: "deep-insight-analysis",
              description: "Please wait a moment while we try again."
            });
            
            // Short delay before retry
            setTimeout(() => {
              handleSubmit();
            }, 3000);
          } else {
            // If we've already retried, save partial results and navigate anyway
            toast.error("Analysis processing encountered an error", {
              id: "deep-insight-analysis",
              description: "We'll save your responses and show partial results."
            });
            
            // Save a minimal placeholder analysis entry
            try {
              await supabase.from('deep_insight_analyses').insert({
                user_id: user.id,
                complete_analysis: {
                  id: crypto.randomUUID(),
                  createdAt: new Date().toISOString(),
                  overview: "Your analysis is being processed. Full results will be available soon.",
                  coreTraits: { primary: "Analysis in progress", tertiaryTraits: ["Pending"] },
                  intelligenceScore: 70,
                  emotionalIntelligenceScore: 70
                },
                raw_responses: formattedResponses,
                overview: "Analysis in progress. Check back soon for complete results."
              });
            } catch (saveError) {
              console.error("Error saving placeholder analysis:", saveError);
            }
            
            navigate(`/deep-insight/results`);
          }
        }
      }
    } catch (error: any) {
      console.error("Comprehensive submission error:", error);
      setAnalysisError(error.message);
      
      // More detailed error toast
      toast.error("Failed to submit assessment", {
        id: "deep-insight-analysis",
        description: error instanceof Error ? error.message : "Please try again later. An unexpected error occurred.",
        duration: 5000
      });
      
      // Navigate to results anyway - they might have some data from previous attempts
      navigate(`/deep-insight/results`);
    } finally {
      setIsSubmitting(false);
    }
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
        </div>
        
        {analysisError && (
          <div className="mb-6 bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-destructive">Analysis Error</p>
              <p className="text-sm text-destructive/90">{analysisError}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Don't worry, your answers have been saved. You can continue and we'll try to generate your results again.
              </p>
            </div>
          </div>
        )}
        
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
