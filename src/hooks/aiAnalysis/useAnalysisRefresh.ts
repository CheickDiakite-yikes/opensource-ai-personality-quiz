
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { PersonalityAnalysis } from '@/utils/types';
import { toast } from 'sonner';
import { sortAnalysesByDate } from './utils';
import { convertToPersonalityAnalysis } from './utils';

export function useAnalysisRefresh() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user } = useAuth();

  const forceAnalysisRefresh = async (): Promise<PersonalityAnalysis[]> => {
    if (!user) {
      console.log('[AnalysisRefresh] No user logged in, cannot refresh');
      return [];
    }

    setIsRefreshing(true);
    console.log('[AnalysisRefresh] Forcing analysis refresh for user:', user.id);

    try {
      // Force fetch the most recent analyses
      const { data: analyses, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch analyses: ${error.message}`);
      }

      if (!analyses || analyses.length === 0) {
        console.log('[AnalysisRefresh] No analyses found in database');
        return [];
      }

      console.log(`[AnalysisRefresh] Found ${analyses.length} analyses in the database`);
      
      // Convert to PersonalityAnalysis objects
      const convertedAnalyses = analyses.map(convertToPersonalityAnalysis).filter(Boolean);
      
      // Sort by date (newest first)
      const sortedAnalyses = sortAnalysesByDate(convertedAnalyses);
      
      return sortedAnalyses;
    } catch (error) {
      console.error('[AnalysisRefresh] Error refreshing analysis:', error);
      toast.error('Failed to refresh analyses', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
      return [];
    } finally {
      setIsRefreshing(false);
    }
  };

  return {
    isRefreshing,
    forceAnalysisRefresh
  };
}
