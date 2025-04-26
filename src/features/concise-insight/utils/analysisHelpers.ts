
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
    
    // Perform the deletion with a more forceful approach
    const { error } = await supabase
      .from('concise_analyses')
      .delete()
      .eq('id', analysisId);
    
    if (error) {
      console.error("[deleteAnalysisFromDatabase] Deletion error:", error);
      toast.error("Failed to delete analysis: " + error.message);
      return false;
    }
    
    // Verify deletion was successful with a separate query
    const { data: checkDeleted, error: verifyError } = await supabase
      .from('concise_analyses')
      .select('id')
      .eq('id', analysisId);
      
    if (verifyError) {
      console.error("[deleteAnalysisFromDatabase] Verification error:", verifyError);
      // Even with verification error, we'll trust the deletion succeeded if we didn't get an error on delete
      toast.success("Analysis deleted successfully");
      return true;
    }
    
    // If we still found the record, deletion failed
    if (checkDeleted && checkDeleted.length > 0) {
      console.error("[deleteAnalysisFromDatabase] Deletion failed - record still exists");
      toast.error("Failed to delete analysis: Record still exists");
      
      // Try one more time with a different approach
      const { error: secondDeleteError } = await supabase
        .from('concise_analyses')
        .delete()
        .match({ id: analysisId });
      
      if (secondDeleteError) {
        console.error("[deleteAnalysisFromDatabase] Second deletion attempt error:", secondDeleteError);
        return false;
      }
      
      // Verify again
      const { data: secondCheck } = await supabase
        .from('concise_analyses')
        .select('id')
        .eq('id', analysisId);
        
      if (secondCheck && secondCheck.length > 0) {
        console.error("[deleteAnalysisFromDatabase] Second deletion failed - record still exists");
        return false;
      }
      
      console.log("[deleteAnalysisFromDatabase] Second deletion attempt succeeded");
      toast.success("Analysis deleted successfully");
      return true;
    }
    
    // Successfully deleted
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
