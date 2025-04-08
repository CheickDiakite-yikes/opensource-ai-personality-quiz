
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Tabs } from "@/components/ui/tabs";
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
    loadAllAnalysesFromSupabase
  } = useAIAnalysis();
  const isMobile = useIsMobile();
  const [stableAnalysis, setStableAnalysis] = useState<PersonalityAnalysis | null>(null);
  const [hasAttemptedToLoadAnalysis, setHasAttemptedToLoadAnalysis] = useState(false);
  const [forcedRefresh, setForcedRefresh] = useState(false);
  const [isChangingAnalysis, setIsChangingAnalysis] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const [isLoadingAllAnalyses, setIsLoadingAllAnalyses] = useState(false);
  const [showErrorHandler, setShowErrorHandler] = useState(false);
  
  // Extract the analysis history and ensure it's a stable reference
  const analysisHistory = useMemo(() => {
    const history = getAnalysisHistory();
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
    if ((isLoading && !isChangingAnalysis) || stableAnalysis) return;
    
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
          }
          
          // If we failed to load the specified analysis and haven't already attempted to handle this
          if (!success && !analysis && !stableAnalysis && !hasAttemptedToLoadAnalysis) {
            setHasAttemptedToLoadAnalysis(true);
            
            // Try to load all analyses to make sure we have the complete history
            const allAnalyses = await loadAllAnalysesFromSupabase();
            
            // After loading all analyses, try again to set the current analysis
            if (allAnalyses && allAnalyses.length > 0) {
              const secondAttemptSuccess = setCurrentAnalysis(id);
              
              if (secondAttemptSuccess) {
                console.log(`Successfully set current analysis to ${id} after loading all analyses`);
                return;
              }
              
              // If we still can't find the specified analysis, redirect to the most recent one
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
          // If no ID is provided in the URL but we have analyses, redirect to the latest one
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
          
          setShowErrorHandler(true);
        }
      }
    };
    
    loadAnalysis();
  }, [id, isLoading, setCurrentAnalysis, navigate, analysis, stableAnalysis, analysisHistory, hasAttemptedToLoadAnalysis, forcedRefresh, refreshAnalysis, getAnalysisById, isChangingAnalysis, loadAttempts, loadAllAnalysesFromSupabase]);
  
  // Update stable analysis when the analysis from the hook changes
  useEffect(() => {
    if (analysis && (!stableAnalysis || analysis.id !== stableAnalysis.id)) {
      // Make sure this analysis has the minimum required data structure
      try {
        // Check for critical missing data that could cause rendering issues
        if (!analysis.traits || analysis.traits.length === 0 ||
            !analysis.intelligence) {
          
          console.warn("Analysis is missing critical data:", analysis.id);
          console.log("Traits:", analysis.traits ? analysis.traits.length : 'none');
          console.log("Intelligence data present:", !!analysis.intelligence);
          
          // Show error handler for insufficient data
          setShowErrorHandler(true);
          
          // Add fallbacks to prevent crashes, even as we show the error handler
          if (!analysis.traits || analysis.traits.length === 0) {
            analysis.traits = [{
              trait: "Analysis Processing",
              score: 5,
              description: "Your analysis is still being processed or has incomplete trait data.",
              strengths: ["Not available yet"],
              challenges: ["Not available yet"],
              growthSuggestions: ["Please check back shortly or try regenerating your analysis."]
            }];
          }
          
          if (!analysis.intelligence) {
            analysis.intelligence = {
              type: "Analysis Processing",
              score: 5,
              description: "Intelligence profile is being processed.",
              domains: [{
                name: "General Intelligence",
                score: 5,
                description: "Intelligence data is incomplete."
              }]
            };
          }
        }
        
        setStableAnalysis(analysis);
        setIsChangingAnalysis(false);
        // Update the URL if it doesn't already match the current analysis ID
        if (id !== analysis.id) {
          navigate(`/report/${analysis.id}`, { replace: true });
        }
      } catch (error) {
        console.error("Error processing analysis data:", error);
        setShowErrorHandler(true);
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
  }, [id, setCurrentAnalysis, navigate, getAnalysisById, loadAllAnalysesFromSupabase]);
  
  // Show loading state only on initial load or when changing analyses
  if ((isLoading && !stableAnalysis) || isChangingAnalysis) {
    return (
      <div className={`container ${isMobile ? 'pt-2 pb-16 px-0.5 mx-0 w-full max-w-full overflow-hidden' : 'py-10'}`}>
        <ReportSkeleton />
      </div>
    );
  }
  
  // Show error handler if we've detected an issue with the analysis
  if (showErrorHandler) {
    return (
      <div className={`container ${isMobile ? 'py-4 px-2 mx-auto' : 'py-10'}`}>
        <AssessmentErrorHandler />
      </div>
    );
  }
  
  // Use stableAnalysis if available, otherwise use analysis from the hook
  const displayAnalysis = stableAnalysis || analysis;
  
  // Handle case where no analysis is available after loading
  if (!displayAnalysis && !isLoading && hasAttemptedToLoadAnalysis) {
    // This shouldn't happen often since we redirect in the useEffect,
    // but this is a fallback just in case
    return (
      <div className={`container ${isMobile ? 'py-4 px-2 mx-auto' : 'py-10'} text-center`}>
        <AssessmentErrorHandler
          title="No Analysis Found"
          description="We couldn't find any personality analysis reports. Please try taking the assessment."
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
