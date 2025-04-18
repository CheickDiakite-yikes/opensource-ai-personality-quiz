
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Brain, ArrowRight, ArrowLeft, Send, Loader2 } from "lucide-react";
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
  const questions = getDeepInsightQuestions();
  
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
        throw assessmentError;
      }
      
      if (assessmentData && assessmentData[0]) {
        // Call the deep insight analysis edge function
        const { data: analysisData, error: analysisError } = await supabase.functions.invoke('deep-insight-analysis', {
          body: { 
            responses: formattedResponses.reduce((acc, curr) => {
              acc[curr.questionId] = curr.selectedOption;
              return acc;
            }, {} as Record<string, string>) 
          }
        });
        
        if (analysisError) {
          console.error("Analysis invocation error:", analysisError);
          throw analysisError;
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
            throw saveAnalysisError;
          }
          
          toast.success("Assessment completed!", {
            description: "Your deep insight analysis is ready to view."
          });
          
          // Navigate to the results page
          navigate(`/deep-insight/results`);
        }
      }
    } catch (error) {
      console.error("Comprehensive submission error:", error);
      
      // More detailed error toast
      toast.error("Failed to submit assessment", {
        description: error instanceof Error ? error.message : "Please try again later. An unexpected error occurred.",
        duration: 5000
      });
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
