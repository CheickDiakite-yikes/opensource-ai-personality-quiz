
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ComprehensiveResponse, ComprehensiveSubmissionResponse } from "./comprehensiveTypes";
import { Json } from "@/integrations/supabase/types";

export function useComprehensiveSubmission(
  responses: Record<string, ComprehensiveResponse>
) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  
  // Submit assessment for analysis
  const handleSubmitAssessment = async () => {
    if (!user) {
      toast.error("Please log in to submit your assessment");
      return;
    }
    
    // Convert responses to the format expected by the backend
    const formattedResponses: ComprehensiveSubmissionResponse[] = Object.values(responses).map(response => ({
      questionId: response.questionId,
      answer: response.selectedOption === "Other" ? response.customResponse : response.selectedOption,
      category: response.category 
    }));
    
    // Validate we have enough responses
    if (formattedResponses.length < 50) {
      toast.error(`Not enough responses to analyze: ${formattedResponses.length}/100`, {
        description: "Please complete more questions for a thorough analysis"
      });
      return;
    }
    
    console.log(`Submitting comprehensive assessment with ${formattedResponses.length} responses`);
    
    // Track the assessment data outside the try block so it's accessible in the catch block
    let createdAssessmentId: string | null = null;
    
    try {
      setIsAnalyzing(true);
      toast.loading("Saving your assessment responses...", { id: "assessment-submission" });
      
      // Save assessment responses to Supabase with improved logging
      console.log("Saving comprehensive assessment to Supabase...");
      const { data: assessmentData, error: assessmentError } = await supabase
        .from("comprehensive_assessments")
        .insert({
          user_id: user.id,
          responses: formattedResponses as unknown as Json
        })
        .select('id')
        .single();
      
      if (assessmentError) {
        console.error("Error saving assessment:", assessmentError);
        throw new Error(assessmentError.message);
      }
      
      if (!assessmentData?.id) {
        console.error("No assessment ID returned from database");
        throw new Error("Failed to create assessment - no ID returned");
      }
      
      console.log("Assessment saved successfully with ID:", assessmentData.id);
      
      // Store the ID for use in the catch block if needed
      createdAssessmentId = assessmentData.id;
      
      toast.loading("Analyzing your responses with advanced AI...", { id: "assessment-submission" });
      
      // Enhanced analysis instructions for more sophisticated output based on research
      const enhancedInstructions = {
        systemInstruction: `You are a world-class personality analyst with expertise in multiple psychological frameworks including Big Five, MBTI, Jungian psychology, attachment theory, cognitive behavioral patterns, and positive psychology. 

Your task is to create an exceptionally insightful, evidence-based, and transformative psychological profile based on comprehensive assessment responses.

Your analysis should demonstrate extraordinary depth, be highly personalized, and reflect the latest understanding in personality psychology, cognitive science, and human development research.

Structure your analysis with these key components:
1. A profound overview that captures the essence of the individual's unique psychological makeup and core identity 
2. 7-9 primary personality traits with nuanced scores (1-10) that include both strengths and growth edges
3. Multi-dimensional intelligence analysis covering cognitive, emotional, creative, practical, and social intelligences
4. Emotional intelligence assessment with detailed components: self-awareness, self-regulation, motivation, empathy, and social skills
5. Value system analysis connecting to established frameworks like Schwartz's Basic Human Values
6. Precise motivational drivers and inhibitors with psychological underpinnings
7. Relationship patterns based on attachment theory and interpersonal dynamics research
8. Career alignment analysis based on Holland's vocational types and contemporary workplace psychology
9. Learning style analysis incorporating neuropsychological research
10. A developmental roadmap with specific growth strategies supported by positive psychology findings

Your analysis MUST include actionable insights that enable personal transformation. It should be written with empathy and nuance, avoiding deterministic language while acknowledging the complexity of human personality.

Balance scientific precision with accessibility. Use language that is sophisticated yet understandable. Support insights with subtle references to psychological theories without explicitly naming them.`,
        temperature: 0.75, // Balanced between consistency and creative insight
        responseFormat: "json" // Ensure structured output
      };
      
      // Call Supabase Edge Function to analyze responses with improved instructions
      console.log(`Calling analyze-comprehensive-responses function with assessment ID: ${createdAssessmentId}`);
      console.log(`Sending ${formattedResponses.length} responses for analysis`);
      
      // Add response distribution logging
      const categoryDistribution = formattedResponses.reduce((acc: Record<string, number>, curr) => {
        acc[curr.category as string] = (acc[curr.category as string] || 0) + 1;
        return acc;
      }, {});
      
      console.log("Response distribution by category:", 
        Object.entries(categoryDistribution)
          .map(([category, count]) => `${category}: ${count}`)
          .join(', ')
      );
      
      // Call the edge function with enhanced instructions
      const { data, error } = await supabase.functions.invoke(
        "analyze-comprehensive-responses",
        {
          body: { 
            assessmentId: createdAssessmentId,
            responses: formattedResponses,
            enhancedAnalysis: true, // Flag to use advanced analysis
            instructions: enhancedInstructions
          }
        }
      );
      
      if (error) {
        console.error("Edge function error:", error);
        throw new Error(`Analysis failed: ${error.message}`);
      }
      
      console.log("Edge function response:", data);
      
      if (!data) {
        throw new Error("No data returned from analysis function");
      }
      
      // Clear stored progress after successful submission
      localStorage.removeItem("comprehensive_assessment_progress");
      console.log("Assessment progress cleared from localStorage");
      
      // Show success message
      toast.success("Advanced analysis complete!", { id: "assessment-submission" });
      
      // Navigate to the comprehensive report page
      if (data.analysis && data.analysis.id) {
        console.log(`Navigating to report page with ID: ${data.analysis.id}`);
        navigate(`/comprehensive-report/${data.analysis.id}`);
      } else if (data.analysisId) {
        console.log(`Navigating to report page with ID: ${data.analysisId}`);
        navigate(`/comprehensive-report/${data.analysisId}`);
      } else {
        console.error("No analysis ID in response:", data);
        throw new Error("Analysis completed but no ID was returned");
      }
      
    } catch (error) {
      console.error("Error submitting assessment:", error);
      
      // Check if the assessment was created but analysis failed
      if (createdAssessmentId) {
        toast.error("Your assessment was saved but analysis failed", { 
          id: "assessment-submission",
          description: "We'll try to analyze it again when you view your reports."
        });
        
        // Navigate to the assessment ID, the report page will handle polling
        navigate(`/comprehensive-report/${createdAssessmentId}`);
      } else {
        // Complete submission failure
        toast.error("Failed to submit assessment", { 
          id: "assessment-submission",
          description: error instanceof Error ? error.message : "Please try again later"
        });
        
        setIsAnalyzing(false);
      }
    }
  };
  
  return {
    isAnalyzing,
    handleSubmitAssessment
  };
}
