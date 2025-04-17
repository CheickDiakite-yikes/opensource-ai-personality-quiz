
import { supabase } from '../_shared/db.ts';
import { AnalysisResult } from '../_shared/types.ts';

export async function getAnalysisById(id: string): Promise<AnalysisResult | null> {
  const { data, error } = await supabase
    .from('deep_insight_analyses')
    .select('*')
    .eq('id', id)
    .maybeSingle();
    
  if (error) {
    console.error("[get-public-analysis] Error fetching from deep_insight_analyses:", error);
    return null;
  }
  
  return data;
}

export async function getLegacyAnalysisById(id: string): Promise<AnalysisResult | null> {
  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('id', id)
    .maybeSingle();
    
  if (error) {
    console.error("[get-public-analysis] Error fetching legacy analysis:", error);
    return null;
  }
  
  return data;
}

export async function searchAnalysisByTerm(searchTerm: string): Promise<AnalysisResult | null> {
  // Try deep_insight_analyses first
  const { data: deepInsightData, error: deepInsightError } = await supabase
    .from('deep_insight_analyses')
    .select('*')
    .filter('id', 'ilike', `%${searchTerm}%`)
    .order('created_at', { ascending: false })
    .limit(1);
    
  if (!deepInsightError && deepInsightData?.length) {
    return deepInsightData[0];
  }
  
  // Try analyses table as fallback
  const { data: analysesData, error: analysesError } = await supabase
    .from('analyses')
    .select('*')
    .filter('id', 'ilike', `%${searchTerm}%`)
    .order('created_at', { ascending: false })
    .limit(1);
    
  if (!analysesError && analysesData?.length) {
    return analysesData[0];
  }
  
  return null;
}

export async function getMostRecentAnalysis(): Promise<AnalysisResult | null> {
  // Try deep_insight_analyses first
  const { data: recentDeepInsight, error: deepInsightError } = await supabase
    .from('deep_insight_analyses')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1);
    
  if (!deepInsightError && recentDeepInsight?.length) {
    return recentDeepInsight[0];
  }
  
  // Try analyses as fallback
  const { data: recentAnalyses, error: analysesError } = await supabase
    .from('analyses')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1);
    
  if (!analysesError && recentAnalyses?.length) {
    return recentAnalyses[0];
  }
  
  return null;
}
