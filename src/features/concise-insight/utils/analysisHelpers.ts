
import { supabase } from "@/integrations/supabase/client";
import { ConciseAnalysisResult } from "../types";
import { toast } from "sonner";

export const isUUID = (str: string): boolean => {
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidPattern.test(str);
};

export const fetchAnalysisByDirectId = async (analysisId: string) => {
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
  
  return matchingAnalyses[0].analysis_data as unknown as ConciseAnalysisResult;
};

export const generateNewAnalysis = async (assessmentId: string, userId: string) => {
  const { data: assessment, error: responseError } = await supabase
    .from('concise_assessments')
    .select('*')
    .eq('id', assessmentId)
    .eq('user_id', userId)
    .single();
    
  if (responseError) {
    console.error("[generateNewAnalysis] Error:", responseError);
    throw responseError;
  }
  
  if (!assessment) {
    throw new Error("Assessment not found");
  }
  
  const { data: analysisResult, error: analysisError } = await supabase.functions.invoke(
    'analyze-concise-responses',
    {
      body: { 
        assessmentId,
        responses: assessment.responses,
        userId
      }
    }
  );
  
  if (analysisError) {
    console.error("[generateNewAnalysis] Error:", analysisError);
    throw analysisError;
  }
  
  return analysisResult as ConciseAnalysisResult;
};

export const saveAnalysisToDatabase = async (
  analysis: ConciseAnalysisResult,
  assessmentId: string,
  userId: string
) => {
  try {
    const { error: saveError } = await supabase
      .from('concise_analyses')
      .insert({
        assessment_id: assessmentId,
        user_id: userId,
        analysis_data: analysis as any
      });
      
    if (saveError) throw saveError;
    console.log("[saveAnalysisToDatabase] Analysis saved successfully");
  } catch (err: any) {
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
    
    // If record still exists, it means deletion failed
    if (checkData) {
      console.error("[deleteAnalysisFromDatabase] Deletion verification failed - record still exists");
      
      // Second attempt: Using match syntax instead of eq
      const { error: secondError } = await supabase
        .from('concise_analyses')
        .delete()
        .match({ id: analysisId });
      
      if (secondError) {
        console.error("[deleteAnalysisFromDatabase] Second deletion attempt error:", secondError);
        toast.error("Failed to delete analysis: " + secondError.message);
        return false;
      }
      
      // Verify second deletion attempt
      const { data: secondCheck } = await supabase
        .from('concise_analyses')
        .select('id')
        .eq('id', analysisId)
        .maybeSingle();
      
      if (secondCheck) {
        console.error("[deleteAnalysisFromDatabase] Second deletion failed - record still exists");
        
        // Third attempt: Use the edge function we created for this purpose
        try {
          const response = await fetch(`https://fhmvdprcmhkolyzuecrr.supabase.co/functions/v1/delete-concise-analysis`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
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
