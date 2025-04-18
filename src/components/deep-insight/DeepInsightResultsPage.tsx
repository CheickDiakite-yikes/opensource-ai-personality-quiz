
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import PageTransition from "@/components/ui/PageTransition";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain, AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeepInsightAnalysis } from "./types/deepInsight";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Import components
import DeepInsightHeader from "./components/DeepInsightHeader";
import PersonalityOverview from "./components/PersonalityOverview";
import AnalysisScores from "./components/AnalysisScores";
import DeepInsightTabs from "./components/DeepInsightTabs";
import AnalysisActions from "./components/AnalysisActions";
import TopTraitsSection from "./results-sections/TopTraitsSection";
import { AssessmentErrorHandler } from '@/components/assessment/AssessmentErrorHandler';

const DeepInsightResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState<DeepInsightAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  
  const fetchAnalysis = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('deep_insight_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Cast data properly to match our DeepInsightAnalysis type
        setAnalysis(data[0] as unknown as DeepInsightAnalysis);
        
        // Check if analysis is processing or incomplete
        const analysisData = data[0];
        if (analysisData.complete_analysis && analysisData.complete_analysis.status === 'processing') {
          setError("Your analysis is still being processed. Please check back in a few minutes.");
        } else if (!analysisData.overview || analysisData.overview.includes("processing") || 
                  !analysisData.core_traits || !analysisData.core_traits.primary) {
          setError("Your analysis is incomplete. We're working to finalize your results.");
        }
      } else {
        setError("No analysis found. Please complete the assessment first.");
      }
    } catch (err) {
      console.error("Error fetching analysis:", err);
      setError("Failed to load analysis. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAnalysis();
  }, [user, id]);
  
  const handleRetry = async () => {
    setIsRetrying(true);
    
    try {
      toast.info("Retrying analysis fetch...");
      await fetchAnalysis();
      toast.success("Analysis refreshed!");
    } catch (err) {
      toast.error("Failed to refresh analysis");
    } finally {
      setIsRetrying(false);
    }
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="container max-w-4xl py-8 md:py-12 px-4 md:px-6">
          <div className="flex items-center justify-center mb-8">
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
          <Skeleton className="h-10 w-3/4 mx-auto mb-4" />
          <Skeleton className="h-6 w-1/2 mx-auto mb-8" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
          
          <Skeleton className="h-[400px] w-full mb-8" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      </PageTransition>
    );
  }

  if (error && !analysis) {
    return (
      <PageTransition>
        <div className="container max-w-4xl py-8 md:py-12 px-4 md:px-6 flex flex-col items-center">
          <Brain className="h-16 w-16 text-muted mb-4" />
          <h1 className="text-2xl font-bold mb-4 text-center">Analysis Unavailable</h1>
          <p className="text-muted-foreground text-center mb-6">{error}</p>
          <Button onClick={() => navigate("/deep-insight")}>
            Take the Assessment
          </Button>
        </div>
      </PageTransition>
    );
  }
  
  // Show partial analysis with an error message
  if (error && analysis) {
    return (
      <PageTransition>
        <div className="container max-w-4xl py-8 md:py-12 px-4 md:px-6">
          <DeepInsightHeader />
          
          <Alert variant="warning" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Processing Status</AlertTitle>
            <AlertDescription>
              {error}
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRetry} 
                  disabled={isRetrying}
                  className="flex items-center gap-2"
                >
                  {isRetrying ? "Checking..." : "Check Again"}
                  <RefreshCcw className={`h-3 w-3 ${isRetrying ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </AlertDescription>
          </Alert>
          
          {analysis && (
            <>
              <PersonalityOverview overview={analysis.overview || "Your complete analysis is still being generated. We'll display your full results when they're ready."} />
              
              <AnalysisScores 
                intelligenceScore={analysis.intelligence_score}
                emotionalIntelligenceScore={analysis.emotional_intelligence_score}
                responsePatterns={analysis.response_patterns}
              />
              
              {analysis.core_traits && (
                <TopTraitsSection coreTraits={analysis.core_traits} />
              )}
              
              <DeepInsightTabs analysis={analysis} />
              
              <AnalysisActions analysis={analysis} />
            </>
          )}
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
            <PersonalityOverview overview={analysis.overview || ""} />
            
            <AnalysisScores 
              intelligenceScore={analysis.intelligence_score}
              emotionalIntelligenceScore={analysis.emotional_intelligence_score}
              responsePatterns={analysis.response_patterns}
            />
            
            <TopTraitsSection coreTraits={analysis.core_traits} />
            
            <DeepInsightTabs analysis={analysis} />
            
            <AnalysisActions analysis={analysis} />
          </>
        )}
      </div>
    </PageTransition>
  );
};

export default DeepInsightResultsPage;
