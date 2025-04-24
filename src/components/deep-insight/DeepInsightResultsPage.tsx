
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import PageTransition from "@/components/ui/PageTransition";
import DeepInsightHeader from "./components/DeepInsightHeader";
import PersonalityOverview from "./components/PersonalityOverview";
import AnalysisInsights from "./components/AnalysisInsights";
import IntelligenceScores from "./components/IntelligenceScores";
import DeepInsightTabs from "./components/DeepInsightTabs";
import AnalysisActions from "./components/AnalysisActions";
import AnalysisLoadingState from "./components/AnalysisLoadingState";
import AnalysisErrorState from "./components/AnalysisErrorState";
import AnalysisProcessingState from "./components/AnalysisProcessingState";
import { useAnalysisFetching } from "./hooks/useAnalysisFetching";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';

const DeepInsightResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { analysis, loading, error, fetchAnalysis } = useAnalysisFetching();
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [autoRetryEnabled, setAutoRetryEnabled] = useState<boolean>(true);

  // Auto-retry logic for incomplete analysis
  useEffect(() => {
    let retryTimer: number | undefined;
    
    if (analysis && 
        (!analysis.overview || 
         analysis.overview.includes("processing") || 
         !analysis.core_traits || 
         (typeof analysis.core_traits === 'object' && 
          analysis.core_traits !== null &&
          (!('primary' in analysis.core_traits) || !analysis.core_traits.primary))) && 
        autoRetryEnabled && 
        retryCount < 5) {
      
      // Set increasing retry delays: 5s, 10s, 20s, 40s, 60s
      const delayMs = retryCount < 4 ? Math.min(5000 * Math.pow(2, retryCount), 60000) : 60000;
      
      console.log(`Analysis incomplete, scheduling retry in ${delayMs/1000} seconds (attempt ${retryCount + 1}/5)`);
      
      retryTimer = setTimeout(() => {
        console.log(`Auto-retrying analysis fetch (${retryCount + 1}/5)`);
        fetchAnalysis();
        setRetryCount(prevCount => prevCount + 1);
      }, delayMs);
    }
    
    return () => {
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [analysis, autoRetryEnabled, retryCount, fetchAnalysis]);

  // Manual retry handler
  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      toast.loading("Refreshing your analysis...");
      await fetchAnalysis();
      toast.success("Analysis refreshed");
      setRetryCount(0); // Reset auto-retry counter after manual retry
    } catch (err) {
      console.error("Error refreshing analysis:", err);
      toast.error("Failed to refresh analysis");
    } finally {
      setIsRetrying(false);
    }
  };
  
  // Direct Supabase fetch as a backup
  const fetchDirectFromSupabase = async () => {
    if (!user) return;
    
    setIsRetrying(true);
    try {
      toast.loading("Attempting direct database fetch...");
      
      const { data, error } = await supabase
        .from('deep_insight_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        toast.success("Found updated analysis");
        setRetryCount(0);
        // Force a refresh of the analysis in the hook
        fetchAnalysis();
      } else {
        toast.error("No updated analysis found");
      }
    } catch (err) {
      console.error("Direct fetch error:", err);
      toast.error("Failed to fetch updated analysis");
    } finally {
      setIsRetrying(false);
    }
  };

  if (loading) {
    return <AnalysisLoadingState />;
  }

  if (error && !analysis) {
    return <AnalysisErrorState error={error} onRetry={handleRetry} />;
  }
  
  const isProcessing = analysis && (
    !analysis.overview || 
    analysis.overview.includes("processing") ||
    !analysis.core_traits || 
    (typeof analysis.core_traits === 'object' && 
     analysis.core_traits !== null &&
     (!('primary' in analysis.core_traits) || !analysis.core_traits.primary))
  );
  
  if (error || isProcessing) {
    const errorMessage = error || "Your analysis is still being processed. Please check back in a few minutes.";
    
    return (
      <PageTransition>
        <div className="container max-w-4xl py-8 md:py-12 px-4 md:px-6">
          <DeepInsightHeader />
          <AnalysisProcessingState 
            error={errorMessage}
            isRetrying={isRetrying}
            onRetry={handleRetry}
            analysis={analysis}
            onDirectFetch={fetchDirectFromSupabase}
            autoRetryEnabled={autoRetryEnabled}
            onToggleAutoRetry={() => setAutoRetryEnabled(!autoRetryEnabled)}
            retryCount={retryCount}
          />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container max-w-4xl py-8 md:py-12 px-4 md:px-6">
        <DeepInsightHeader />
        
        {analysis && (
          <>
            <PersonalityOverview overview={analysis.overview || "Your Deep Insight Analysis reveals a multifaceted personality with unique cognitive patterns and emotional depths."} />
            
            <IntelligenceScores 
              intelligenceScore={analysis.intelligence_score}
              emotionalIntelligenceScore={analysis.emotional_intelligence_score}
            />
            
            <AnalysisInsights analysis={analysis} />
            
            <DeepInsightTabs analysis={analysis} />
            
            <AnalysisActions analysis={analysis} />
          </>
        )}
      </div>
    </PageTransition>
  );
};

export default DeepInsightResultsPage;
