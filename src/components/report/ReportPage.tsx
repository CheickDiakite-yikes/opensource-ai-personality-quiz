
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Tabs } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ReportHeader from "./ReportHeader";
import ReportTabs from "./ReportTabs";
import ReportTabContent from "./ReportTabContent";
import { useAIAnalysis } from "@/hooks/useAIAnalysis";
import ReportSkeleton from "./skeletons/ReportSkeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { PersonalityAnalysis } from "@/utils/types";
import { AssessmentErrorHandler } from "../assessment/AssessmentErrorHandler";

const ReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    analysis, 
    isLoading, 
    getAnalysisHistory, 
    setCurrentAnalysis,
    refreshAnalysis,
    getAnalysisById,
    loadAllAnalysesFromSupabase,
    fetchAnalysisById
  } = useAIAnalysis();
  const isMobile = useIsMobile();
  const [stableAnalysis, setStableAnalysis] = useState<PersonalityAnalysis | null>(null);
  const [hasAttemptedToLoadAnalysis, setHasAttemptedToLoadAnalysis] = useState(false);
  const [forcedRefresh, setForcedRefresh] = useState(false);
  const [isChangingAnalysis, setIsChangingAnalysis] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const [isLoadingAllAnalyses, setIsLoadingAllAnalyses] = useState(false);
  const [directlyFetchedAnalysis, setDirectlyFetchedAnalysis] = useState<PersonalityAnalysis | null>(null);
  
  // Extract the analysis history and ensure it's a stable reference
  const analysisHistory = useMemo(() => {
    const history = getAnalysisHistory();
    console.log(`Retrieved ${history.length} analyses in history`);
    return history;
  }, [getAnalysisHistory]);
  
  // Force a refresh when coming from assessment completion
  useEffect(() => {
    if (location.state?.fromAssessment && !forcedRefresh) {
      console.log("Detected navigation from assessment completion, forcing refresh");
      setForcedRefresh(true);
      refreshAnalysis().then(() => {
        console.log("Analysis refreshed after assessment completion");
      }).catch(error => {
        console.error("Error refreshing after assessment completion:", error);
        toast.error("Could not load your latest results", {
          description: "Please try refreshing the page"
        });
      });
    }
  }, [location.state, forcedRefresh, refreshAnalysis]);

  // Emergency load if coming directly to URL with ID
  useEffect(() => {
    // If we have an ID but no analysis or analysis history, try direct fetch
    if (id && !analysis && !stableAnalysis && !directlyFetchedAnalysis && analysisHistory.length === 0 && !isChangingAnalysis) {
      const directFetch = async () => {
        console.log(`No analysis history found, trying direct fetch for ID: ${id}`);
        const directAnalysis = await fetchAnalysisById(id);
        
        if (directAnalysis) {
          console.log(`Directly fetched analysis for ID: ${id}`);
          setDirectlyFetchedAnalysis(directAnalysis);
        } else {
          console.log(`Direct fetch failed for ID: ${id}`);
        }
      };
      
      directFetch();
    }
  }, [id, analysis, stableAnalysis, directlyFetchedAnalysis, analysisHistory, isChangingAnalysis, fetchAnalysisById]);

  // Load all analyses on first mount to ensure we have all history
  useEffect(() => {
    if (!isLoadingAllAnalyses && !forcedRefresh) {
      setIsLoadingAllAnalyses(true);
      loadAllAnalysesFromSupabase()
        .then(analyses => {
          console.log(`Loaded ${analyses.length} analyses on initial mount`);
        })
        .catch(error => {
          console.error("Error loading all analyses on mount:", error);
        })
        .finally(() => {
          setForcedRefresh(true);
          setIsLoadingAllAnalyses(false);
        });
    }
  }, [loadAllAnalysesFromSupabase, forcedRefresh, isLoadingAllAnalyses]);
  
  // Handle direct URL access and page refresh by ensuring we load analysis data properly
  useEffect(() => {
    // Skip if we're still loading or have already successfully loaded an analysis
    if ((isLoading && !isChangingAnalysis) || stableAnalysis || directlyFetchedAnalysis) return;
    
    const loadAnalysis = async () => {
      try {
        // Force a refresh when the component mounts to ensure we have the latest data
        if (!forcedRefresh) {
          await refreshAnalysis();
          setForcedRefresh(true);
        }
        
        // If we have an ID from the URL, try to load that specific analysis
        if (id) {
          const success = setCurrentAnalysis(id);
          
          // If setCurrentAnalysis fails, try to fetch the analysis directly
          if (!success) {
            console.log(`Failed to set current analysis to ${id}, trying direct fetch`);
            const directAnalysis = await getAnalysisById(id);
            
            if (directAnalysis) {
              console.log(`Successfully fetched analysis ${id} directly`);
              setStableAnalysis(directAnalysis);
              return;
            }
            
            // Try last resort direct fetch from Supabase
            const supabaseDirectFetch = await fetchAnalysisById(id);
            if (supabaseDirectFetch) {
              console.log(`Direct Supabase fetch successful for ${id}`);
              setDirectlyFetchedAnalysis(supabaseDirectFetch);
              return;
            }
          }
          
          // If we failed to load the specified analysis and haven't already attempted to handle this
          if (!success && !analysis && !stableAnalysis && !directlyFetchedAnalysis && !hasAttemptedToLoadAnalysis) {
            setHasAttemptedToLoadAnalysis(true);
            
            // Try to load all analyses to make sure we have the complete history
            const allAnalyses = await loadAllAnalysesFromSupabase();
            
            // After loading all analyses, try again to set the current analysis
            if (allAnalyses && allAnalyses.length > 0) {
              console.log(`Loaded ${allAnalyses.length} analyses, trying to find ${id} again`);
              const secondAttemptSuccess = setCurrentAnalysis(id);
              
              if (secondAttemptSuccess) {
                console.log(`Successfully set current analysis to ${id} after loading all analyses`);
                return;
              }
              
              // Redirect to the most recent analysis
              toast.info("Redirecting to your most recent analysis", {
                duration: 3000
              });
              navigate(`/report/${allAnalyses[0].id}`, { replace: true });
            } else {
              // No analyses available at all, redirect to assessment
              toast.error("Could not find the requested analysis", {
                description: "Please try taking the assessment again or log in to access your saved analyses",
                duration: 5000
              });
              
              navigate("/assessment", { replace: true });
            }
          }
        } else if (analysisHistory && analysisHistory.length > 0) {
          // If no ID is provided in the URL but we have analyses, use the most recent one
          navigate(`/report/${analysisHistory[0].id}`, { replace: true });
        } else if (!hasAttemptedToLoadAnalysis) {
          // Try to load all analyses as a last resort
          const allAnalyses = await loadAllAnalysesFromSupabase();
          
          if (allAnalyses && allAnalyses.length > 0) {
            navigate(`/report/${allAnalyses[0].id}`, { replace: true });
            return;
          }
          
          // No ID in URL and no analyses available
          setHasAttemptedToLoadAnalysis(true);
          toast.error("No analysis reports found", {
            description: "Please complete the assessment first to view your report",
            duration: 5000
          });
          navigate("/assessment", { replace: true });
        }
      } catch (error) {
        console.error("Error in loadAnalysis:", error);
        
        // Implement retry mechanism for loading analysis data
        if (loadAttempts < 2) { // Try up to 3 times (initial + 2 retries)
          setLoadAttempts(prev => prev + 1);
          const delay = Math.pow(2, loadAttempts) * 1000; // 1s, 2s
          console.log(`Retrying analysis load (attempt ${loadAttempts + 1}) in ${delay}ms`);
          
          setTimeout(loadAnalysis, delay);
        } else {
          toast.error("Failed to load analysis after multiple attempts", {
            description: "Please try refreshing the page",
            duration: 5000
          });
        }
      }
    };
    
    loadAnalysis();
  }, [id, isLoading, setCurrentAnalysis, navigate, analysis, stableAnalysis, analysisHistory, hasAttemptedToLoadAnalysis, forcedRefresh, refreshAnalysis, getAnalysisById, isChangingAnalysis, loadAttempts, loadAllAnalysesFromSupabase, directlyFetchedAnalysis, fetchAnalysisById]);
  
  // Update this useEffect to check for incomplete analyses
  useEffect(() => {
    if (analysis && (!stableAnalysis || analysis.id !== stableAnalysis.id)) {
      setStableAnalysis(analysis);
      setIsChangingAnalysis(false);
      
      // Update the URL if it doesn't already match the current analysis ID
      if (id !== analysis.id) {
        navigate(`/report/${analysis.id}`, { replace: true });
      }
    }
  }, [analysis, stableAnalysis, navigate, id]);
  
  // Handle switching between analyses
  const handleAnalysisChange = useCallback(async (analysisId: string) => {
    console.log(`Changing analysis to ${analysisId}`);
    
    if (analysisId === id) {
      console.log("Already viewing this analysis, no change needed");
      return;
    }
    
    setIsChangingAnalysis(true);
    
    // First try to set the current analysis using the normal method
    const success = setCurrentAnalysis(analysisId);
    
    // If that fails, try to fetch it directly
    if (!success) {
      console.log(`Failed to set current analysis to ${analysisId}, trying direct fetch`);
      const directAnalysis = await getAnalysisById(analysisId);
      
      if (directAnalysis) {
        console.log(`Successfully fetched analysis ${analysisId} directly`);
        setStableAnalysis(directAnalysis);
        navigate(`/report/${analysisId}`, { replace: false });
      } else {
        // Try direct Supabase fetch
        const supabaseDirectFetch = await fetchAnalysisById(analysisId);
        
        if (supabaseDirectFetch) {
          console.log(`Direct Supabase fetch successful for ${analysisId}`);
          setDirectlyFetchedAnalysis(supabaseDirectFetch);
          navigate(`/report/${analysisId}`, { replace: false });
          setIsChangingAnalysis(false);
          return;
        }
        
        // Try to load all analyses as a last resort
        await loadAllAnalysesFromSupabase();
        
        // Try one more time to set the current analysis
        const secondAttemptSuccess = setCurrentAnalysis(analysisId);
        
        if (secondAttemptSuccess) {
          console.log(`Successfully set current analysis to ${analysisId} after loading all analyses`);
          navigate(`/report/${analysisId}`, { replace: false });
        } else {
          toast.error("Could not load the selected analysis", {
            description: "Please try again or select a different report",
            duration: 3000
          });
          setIsChangingAnalysis(false);
        }
      }
    } else {
      navigate(`/report/${analysisId}`, { replace: false });
    }
  }, [id, setCurrentAnalysis, navigate, getAnalysisById, loadAllAnalysesFromSupabase, fetchAnalysisById]);

  // Handle manual reload of analyses
  const handleManualRefresh = async () => {
    toast.loading("Refreshing your analyses...", { id: "refresh-toast" });
    try {
      await loadAllAnalysesFromSupabase();
      toast.success("Successfully refreshed your analyses", { id: "refresh-toast" });
      
      // If we have an ID but no analysis, try to load it again
      if (id && !analysis && !stableAnalysis && !directlyFetchedAnalysis) {
        const directAnalysis = await fetchAnalysisById(id);
        if (directAnalysis) {
          setDirectlyFetchedAnalysis(directAnalysis);
        }
      }
    } catch (error) {
      console.error("Error manually refreshing analyses:", error);
      toast.error("Failed to refresh analyses", { 
        id: "refresh-toast",
        description: "Please try again later"
      });
    }
  };
  
  // Show loading state only on initial load or when changing analyses
  if ((isLoading && !stableAnalysis && !directlyFetchedAnalysis) || isChangingAnalysis) {
    return (
      <div className={`container ${isMobile ? 'pt-2 pb-16 px-0.5 mx-0 w-full max-w-full overflow-hidden' : 'py-10'}`}>
        <ReportSkeleton />
      </div>
    );
  }
  
  // Use stableAnalysis if available, otherwise use analysis from the hook
  const displayAnalysis = directlyFetchedAnalysis || stableAnalysis || analysis;
  
  // Handle case where no analysis is available after loading
  if (!displayAnalysis && !isLoading && hasAttemptedToLoadAnalysis) {
    return (
      <div className={`container ${isMobile ? 'py-4 px-2 mx-auto' : 'py-10'} text-center`}>
        <h2 className="text-2xl font-bold">No Analysis Found</h2>
        <p className="mt-2 text-muted-foreground">
          We couldn't find any personality analysis reports. Please try taking the assessment.
        </p>
        <div className="space-y-4 mt-6">
          <Button onClick={() => navigate("/assessment")} className="w-full sm:w-auto">
            Take Assessment
          </Button>
          <Button onClick={handleManualRefresh} variant="outline" className="w-full sm:w-auto">
            Manually Refresh Analyses
          </Button>
        </div>
        
        <AssessmentErrorHandler 
          title="Data Loading Issue"
          description="We're having trouble retrieving your analysis data from the server."
          showRetry={false}
          errorDetails={`Analysis ID: ${id}, History Size: ${analysisHistory.length}, Load Attempts: ${loadAttempts}`}
        />
      </div>
    );
  }
  
  return (
    <div className={`mx-auto ${isMobile ? 'p-0 pt-1 pb-16 px-0 max-w-full w-full overflow-hidden' : 'py-6 space-y-8 max-w-4xl container'}`}>
      {displayAnalysis && (
        <>
          <ReportHeader 
            analysis={displayAnalysis} 
            analysisHistory={analysisHistory || []}
            onAnalysisChange={handleAnalysisChange}
            onManualRefresh={handleManualRefresh}
          />
          
          <Tabs defaultValue="overview" className="w-full overflow-hidden max-w-full">
            <div className="w-full overflow-x-auto sticky top-0 z-10 bg-background/80 backdrop-blur-sm pt-1 shadow-sm">
              <ReportTabs />
            </div>
            <ReportTabContent analysis={displayAnalysis} />
          </Tabs>
        </>
      )}
    </div>
  );
};

export default ReportPage;
