
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

const ReportPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    analysis, 
    isLoading, 
    getAnalysisHistory, 
    setCurrentAnalysis,
    refreshAnalysis
  } = useAIAnalysis();
  const isMobile = useIsMobile();
  const [stableAnalysis, setStableAnalysis] = useState<PersonalityAnalysis | null>(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [refreshAttempted, setRefreshAttempted] = useState(false);
  
  // Extract the analysis history and ensure it's a stable reference
  const analysisHistory = useMemo(() => {
    return getAnalysisHistory();
  }, [getAnalysisHistory]);
  
  // Force a data refresh when the component mounts
  useEffect(() => {
    if (!refreshAttempted) {
      refreshAnalysis(true).catch(err => {
        console.error("Error refreshing analysis:", err);
      }).finally(() => {
        setRefreshAttempted(true);
      });
    }
  }, [refreshAnalysis, refreshAttempted]);
  
  // Define a stable navigate function that doesn't change on re-renders
  const stableNavigate = useCallback((path: string, options = {}) => {
    navigate(path, options);
  }, [navigate]);
  
  // Set the current analysis based on the ID param if provided
  useEffect(() => {
    // Only run this effect once the initial refresh has been attempted
    if (!refreshAttempted) return;
    
    if (!isLoading) {
      if (id) {
        // If we have an ID in the URL, try to load that specific analysis
        const success = setCurrentAnalysis(id);
        
        if (!success && !stableAnalysis) {
          // If we can't find that ID and don't have a stable analysis yet
          if (analysisHistory && analysisHistory.length > 0) {
            // If there's any analysis available, redirect to the latest one
            stableNavigate(`/report/${analysisHistory[0].id}`, { replace: true });
          } else {
            // If no analysis is available at all, show error and redirect to assessment
            toast.error("Could not find the requested analysis", {
              description: "Please try taking the assessment again",
              duration: 5000
            });
            
            stableNavigate("/assessment");
          }
        }
      } else if (analysisHistory && analysisHistory.length > 0) {
        // If no ID is provided but we have analysis history, redirect to the latest analysis
        stableNavigate(`/report/${analysisHistory[0].id}`, { replace: true });
      } else if (!stableAnalysis && !initialLoadComplete) {
        // If we have no analysis history and no stable analysis, show error
        toast.error("No analysis found", {
          description: "Please take the assessment first to generate your personality analysis",
          duration: 5000
        });
        
        stableNavigate("/assessment");
      }
      
      setInitialLoadComplete(true);
    }
  }, [id, isLoading, setCurrentAnalysis, stableNavigate, stableAnalysis, analysisHistory, initialLoadComplete, refreshAttempted]);
  
  // Update stable analysis when the analysis from the hook changes
  useEffect(() => {
    if (analysis && (!stableAnalysis || analysis.id !== stableAnalysis.id)) {
      setStableAnalysis(analysis);
    }
  }, [analysis, stableAnalysis]);
  
  // Show loading state only on initial load
  if ((isLoading && !stableAnalysis) || !initialLoadComplete) {
    return (
      <div className={`container ${isMobile ? 'py-4 px-3' : 'py-10'}`}>
        <ReportSkeleton />
      </div>
    );
  }
  
  // Use stableAnalysis if available, otherwise use analysis from the hook
  const displayAnalysis = stableAnalysis || analysis;
  
  if (!displayAnalysis) {
    return (
      <div className="container py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">No Analysis Available</h2>
        <p className="mb-6">Please take the assessment to generate your personality profile.</p>
        <button 
          onClick={() => navigate("/assessment")}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Go to Assessment
        </button>
      </div>
    );
  }
  
  const handleAnalysisChange = (analysisId: string) => {
    navigate(`/report/${analysisId}`);
  };
  
  return (
    <div className={`container ${isMobile ? 'py-4 px-3 space-y-4' : 'py-6 space-y-8'}`}>
      <ReportHeader 
        analysis={displayAnalysis} 
        analysisHistory={analysisHistory || []}
        onAnalysisChange={handleAnalysisChange}
      />
      
      <Tabs defaultValue="overview" className={`${isMobile ? 'space-y-4' : 'space-y-6'}`}>
        <ReportTabs />
        <ReportTabContent analysis={displayAnalysis} />
      </Tabs>
    </div>
  );
};

export default ReportPage;
