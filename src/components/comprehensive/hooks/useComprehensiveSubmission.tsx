
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
      
      // CRITICAL FIX: Retry logic for assessment saving
      let saveAttempts = 0;
      let assessmentData = null;
      let assessmentError = null;
      
      while (saveAttempts < 3 && !assessmentData) {
        try {
          console.log(`Attempt ${saveAttempts + 1}: Saving comprehensive assessment to Supabase...`);
          
          const result = await supabase
            .from("comprehensive_assessments")
            .insert({
              user_id: user.id,
              responses: formattedResponses as unknown as Json
            })
            .select('id')
            .single();
            
          if (result.error) {
            console.error(`Error saving assessment (attempt ${saveAttempts + 1}):`, result.error);
            assessmentError = result.error;
            saveAttempts++;
            // Wait before retry
            if (saveAttempts < 3) await new Promise(r => setTimeout(r, 1000));
          } else {
            assessmentData = result.data;
            break;
          }
        } catch (err) {
          console.error(`Exception saving assessment (attempt ${saveAttempts + 1}):`, err);
          saveAttempts++;
          if (saveAttempts < 3) await new Promise(r => setTimeout(r, 1000));
        }
      }
      
      if (!assessmentData?.id) {
        console.error("Failed to create assessment after multiple attempts:", assessmentError);
        throw new Error("Failed to save your assessment. Please try again later.");
      }
      
      console.log("Assessment saved successfully with ID:", assessmentData.id);
      
      // Store the ID for use in the catch block if needed
      createdAssessmentId = assessmentData.id;
      
      toast.loading("Analyzing your responses...", { id: "assessment-submission" });
      
      // CRITICAL FIX: Make multiple attempts to analyze with clear error handling
      let analysisSuccess = false;
      let analysisError = null;
      let analysisData = null;
      
      for (let attempt = 0; attempt < 3 && !analysisSuccess; attempt++) {
        try {
          console.log(`Analysis attempt ${attempt + 1} for assessment ID: ${createdAssessmentId}`);
          
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
          
          // CRITICAL FIX: Enhanced error handling with timeout protection
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error("Analysis timed out after 30 seconds")), 30000);
          });
          
          const analysisPromise = supabase.functions.invoke(
            "analyze-comprehensive-responses",
            {
              body: { 
                assessmentId: createdAssessmentId,
                userId: user.id,
                responses: formattedResponses,
                forceAssociation: true,
                retry: attempt > 0
              }
            }
          );
          
          // Race between analysis and timeout
          const result = await Promise.race([analysisPromise, timeoutPromise]) as any;
          
          if (result.error) {
            console.error(`Analysis error on attempt ${attempt + 1}:`, result.error);
            analysisError = result.error;
            // Wait before retry
            if (attempt < 2) await new Promise(r => setTimeout(r, 2000 * (attempt + 1)));
            continue;
          }
          
          if (!result.data) {
            console.error(`Invalid analysis response on attempt ${attempt + 1}:`, result);
            // Wait before retry
            if (attempt < 2) await new Promise(r => setTimeout(r, 2000 * (attempt + 1)));
            continue;
          }
          
          analysisData = result.data;
          analysisSuccess = true;
          console.log("Analysis successful:", analysisData);
          break;
          
        } catch (err) {
          console.error(`Exception during analysis attempt ${attempt + 1}:`, err);
          analysisError = err;
          // Wait before retry
          if (attempt < 2) await new Promise(r => setTimeout(r, 2000 * (attempt + 1)));
        }
      }
      
      // Clear stored progress after successful submission regardless of analysis result
      localStorage.removeItem("comprehensive_assessment_progress");
      console.log("Assessment progress cleared from localStorage");
      
      // CRITICAL FIX: Always navigate to report even if analysis is still processing
      if (analysisSuccess) {
        // Show success message
        toast.success("Analysis complete!", { id: "assessment-submission" });
        
        // Navigate to the comprehensive report page
        const analysisId = analysisData?.analysisId || 
                          (analysisData?.analysis && analysisData.analysis.id) || 
                          createdAssessmentId;
                          
        console.log(`Navigating to report page with ID: ${analysisId}`);
        navigate(`/comprehensive-report/${analysisId}`);
      } else {
        // If analysis failed but assessment was saved, direct to the assessment ID page anyway
        toast.warning("Assessment saved, but analysis is still processing", { 
          id: "assessment-submission",
          duration: 8000,
          description: "You'll be redirected to view your results. Processing may take a moment."
        });
        
        console.log(`Redirecting to assessment page with ID: ${createdAssessmentId} since analysis is pending`);
        navigate(`/comprehensive-report/${createdAssessmentId}`);
      }
      
    } catch (error) {
      console.error("Error submitting assessment:", error);
      
      // Always handle the case where the assessment was created but analysis failed
      if (createdAssessmentId) {
        toast.warning("Your assessment was saved but analysis is still processing", { 
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
