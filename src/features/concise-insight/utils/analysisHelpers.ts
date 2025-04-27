
import { supabase } from "@/integrations/supabase/client";
import { ConciseAnalysisResult } from "../types";
import { toast } from "sonner";

export const isUUID = (str: string): boolean => {
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidPattern.test(str);
};

export const fetchAnalysisByDirectId = async (analysisId: string) => {
  console.log("[fetchAnalysisByDirectId] Fetching analysis:", analysisId);
  
  const { data: specificAnalysis, error: specificError } = await supabase
    .from('concise_analyses')
    .select('*')
    .eq('id', analysisId)
    .single();
    
  if (specificError) {
    console.error("[fetchAnalysisByDirectId] Error:", specificError);
    throw specificError;
  }
  
  if (!specificAnalysis?.analysis_data) {
    throw new Error("Analysis data is missing or invalid");
  }
  
  return specificAnalysis.analysis_data as unknown as ConciseAnalysisResult;
};

export const fetchAnalysisByAssessmentId = async (assessmentId: string, userId: string) => {
  console.log("[fetchAnalysisByAssessmentId] Fetching analysis for assessment:", assessmentId);
  
  const { data: matchingAnalyses, error: fetchError } = await supabase
    .from('concise_analyses')
    .select('*')
    .eq('assessment_id', assessmentId)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (fetchError) {
    console.error("[fetchAnalysisByAssessmentId] Error:", fetchError);
    throw fetchError;
  }
  
  if (!matchingAnalyses?.length) return null;
  
  console.log(`[fetchAnalysisByAssessmentId] Found existing analysis for assessment: ${assessmentId}`);
  return matchingAnalyses[0].analysis_data as unknown as ConciseAnalysisResult;
};

export const generateNewAnalysis = async (assessmentId: string, userId: string) => {
  try {
    // First check if the assessment exists
    const { data: assessment, error: responseError } = await supabase
      .from('concise_assessments')
      .select('*')
      .eq('id', assessmentId)
      .eq('user_id', userId)
      .single();
      
    if (responseError) {
      console.error("[generateNewAnalysis] Error fetching assessment:", responseError);
      throw responseError;
    }
    
    if (!assessment) {
      throw new Error("Assessment not found");
    }
    
    console.log(`[generateNewAnalysis] Starting analysis generation for assessment: ${assessmentId}`);
    console.log(`[generateNewAnalysis] Found ${Object.keys(assessment.responses).length} responses to analyze`);
    
    // Implement a timeout for the edge function call
    const timeoutDuration = 120000; // 2 minutes
    
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Analysis generation timed out after ${timeoutDuration/1000} seconds`));
      }, timeoutDuration);
    });
    
    const functionPromise = supabase.functions.invoke(
      'analyze-concise-responses',
      {
        body: { 
          assessmentId,
          responses: assessment.responses,
          userId
        }
      }
    );
    
    // Race between the actual function call and the timeout
    const result = await Promise.race([functionPromise, timeoutPromise]);
    
    if (!result?.data) {
      console.error("[generateNewAnalysis] Edge function returned no data:", result);
      throw new Error("Edge function returned empty response");
    }
    
    console.log(`[generateNewAnalysis] Successfully generated analysis for assessment: ${assessmentId}`);
    return result.data as ConciseAnalysisResult;
  } catch (error: any) {
    // Enhanced error logging with more context
    console.error("[generateNewAnalysis] Error:", error);
    
    // Check if it's an edge function error and extract more details
    if (error?.message?.includes('FunctionsHttpError')) {
      console.error("[generateNewAnalysis] Edge function error details:", {
        message: error.message,
        context: error.context || {},
        name: error.name,
      });
      throw new Error(`Edge function error: ${error.message}`);
    }
    
    throw error;
  }
};

export const saveAnalysisToDatabase = async (
  analysis: ConciseAnalysisResult,
  assessmentId: string,
  userId: string
) => {
  try {
    const { data, error } = await supabase
      .from('concise_analyses')
      .upsert({
        assessment_id: assessmentId,
        user_id: userId,
        analysis_data: analysis as any
      }, {
        onConflict: 'user_id,assessment_id',
        ignoreDuplicates: true
      })
      .select()
      .single();
      
    if (error) {
      // Only log duplicates but don't treat them as errors
      if (error.code === '23505') {
        console.log("[saveAnalysisToDatabase] Analysis already exists, using existing");
        return;
      }
      throw error;
    }
    
    console.log("[saveAnalysisToDatabase] Analysis saved/updated successfully");
  } catch (err: any) {
    // If it's a unique constraint violation, just log it
    if (err.code === '23505') {
      console.log("[saveAnalysisToDatabase] Analysis already exists, using existing");
      return;
    }
    console.error("[saveAnalysisToDatabase] Error:", err);
    toast.error("Analysis generated but couldn't be saved for future use");
    throw err;
  }
};

export const deleteAnalysisFromDatabase = async (analysisId: string): Promise<boolean> => {
  try {
    console.log(`[deleteAnalysisFromDatabase] Attempting to delete analysis with ID: ${analysisId}`);
    
    // First attempt: Using standard delete with explicit equals condition
    const { error } = await supabase
      .from('concise_analyses')
      .delete()
      .eq('id', analysisId);
    
    if (error) {
      console.error("[deleteAnalysisFromDatabase] Deletion error:", error);
      toast.error("Failed to delete analysis: " + error.message);
      return false;
    }
    
    // Verify deletion was successful by checking if the record still exists
    const { data: checkData, error: checkError } = await supabase
      .from('concise_analyses')
      .select('id')
      .eq('id', analysisId)
      .maybeSingle();
    
    if (checkError) {
      console.error("[deleteAnalysisFromDatabase] Verification error:", checkError);
    }
    
    // If record still exists, try alternative deletion methods
    if (checkData) {
      console.error("[deleteAnalysisFromDatabase] Deletion verification failed - record still exists");
      
      // Second attempt: Use the edge function we created for this purpose
      try {
        const response = await fetch(`https://fhmvdprcmhkolyzuecrr.supabase.co/functions/v1/delete-concise-analysis`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('supabase-auth-token')}`
          },
          body: JSON.stringify({ analysisId })
        });
        
        const result = await response.json();
        
        if (!response.ok || !result.success) {
          console.error("[deleteAnalysisFromDatabase] Edge function deletion failed:", result);
          toast.error("Failed to delete analysis after multiple attempts");
          return false;
        }
        
        // Final verification
        const { data: finalCheck } = await supabase
          .from('concise_analyses')
          .select('id')
          .eq('id', analysisId)
          .maybeSingle();
        
        if (finalCheck) {
          console.error("[deleteAnalysisFromDatabase] All deletion attempts failed");
          toast.error("Failed to delete analysis: Persistent database issue");
          return false;
        }
      } catch (err) {
        console.error("[deleteAnalysisFromDatabase] Edge function error:", err);
        toast.error("Failed to delete analysis via edge function");
        return false;
      }
    }
    
    console.log(`[deleteAnalysisFromDatabase] Analysis deleted successfully`);
    toast.success("Analysis deleted successfully");
    return true;
  } catch (err: any) {
    console.error("[deleteAnalysisFromDatabase] Error:", err);
    toast.error("Failed to delete analysis: " + (err.message || "Unknown error"));
    return false;
  }
};

export const fetchAllAnalysesByUserId = async (userId: string) => {
  try {
    console.log(`[fetchAllAnalysesByUserId] Fetching analyses for user: ${userId}`);
    
    const { data, error } = await supabase
      .from('concise_analyses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("[fetchAllAnalysesByUserId] Error:", error);
      throw error;
    }
    
    console.log(`[fetchAllAnalysesByUserId] Found ${data?.length || 0} analyses`);
    return data || [];
  } catch (err: any) {
    console.error("[fetchAllAnalysesByUserId] Error:", err);
    toast.error("Failed to fetch analyses");
    return [];
  }
};
