
import { supabase } from "@/integrations/supabase/client";
import { ConciseAnalysisResult } from "../types";

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

