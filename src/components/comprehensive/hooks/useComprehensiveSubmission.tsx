
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
      category: response.category // Now properly typed
    }));
    
    // Validate we have enough responses
    const minResponses = 25; // Lower threshold for testing
    if (formattedResponses.length < minResponses) {
      toast.error(`Not enough responses to analyze: ${formattedResponses.length}/100`, {
        description: `Please complete at least ${minResponses} questions for a thorough analysis`
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
      
      toast.loading("Analyzing your responses...", { id: "assessment-submission" });
      
      // Call Supabase Edge Function to analyze responses with improved logging
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
      
      // Call the edge function with improved error handling
      const { data, error } = await supabase.functions.invoke(
        "analyze-comprehensive-responses",
        {
          body: { 
            assessmentId: createdAssessmentId,
            userId: user.id, // Always include user ID
            responses: formattedResponses,
            forceAssociation: true // Always force association with user
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
      toast.success("Analysis complete!", { id: "assessment-submission" });
      
      // Navigate to the comprehensive report page
      const analysisId = data.analysisId || (data.analysis && data.analysis.id) || createdAssessmentId;
      console.log(`Navigating to report page with ID: ${analysisId}`);
      navigate(`/comprehensive-report/${analysisId}`);
      
    } catch (error) {
      console.error("Error submitting assessment:", error);
      
      // Always handle the case where the assessment was created but analysis failed
      if (createdAssessmentId) {
        toast.error("Your assessment was saved but analysis is still processing", { 
          id: "assessment-submission",
          description: "You'll be redirected to the report page where processing will continue."
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
