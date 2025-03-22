
import React, { useEffect, useState, useMemo } from "react";
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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    analysis, 
    isLoading, 
    getAnalysisHistory, 
    setCurrentAnalysis 
  } = useAIAnalysis();
  const isMobile = useIsMobile();
  const [stableAnalysis, setStableAnalysis] = useState<PersonalityAnalysis | null>(null);
  const [hasAttemptedToLoadAnalysis, setHasAttemptedToLoadAnalysis] = useState(false);
  
  // Extract the analysis history and ensure it's a stable reference
  const analysisHistory = useMemo(() => {
    const history = getAnalysisHistory();
    return history;
  }, [getAnalysisHistory]);
  
  // Handle direct URL access and page refresh by ensuring we load analysis data properly
  useEffect(() => {
    // Skip if we're still loading or have already successfully loaded an analysis
    if (isLoading || stableAnalysis) return;
    
    const loadAnalysis = async () => {
      // If we have an ID from the URL, try to load that specific analysis
      if (id) {
        const success = setCurrentAnalysis(id);
        
        // If we failed to load the specified analysis and haven't already attempted to handle this
        if (!success && !analysis && !stableAnalysis && !hasAttemptedToLoadAnalysis) {
          setHasAttemptedToLoadAnalysis(true);
          
          // If we have other analyses available, redirect to the most recent one
          if (analysisHistory && analysisHistory.length > 0) {
            toast.info("Redirecting to your most recent analysis", {
              duration: 3000
            });
            navigate(`/report/${analysisHistory[0].id}`, { replace: true });
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
        // No ID in URL and no analyses available
        setHasAttemptedToLoadAnalysis(true);
        toast.error("No analysis reports found", {
          description: "Please complete the assessment first to view your report",
          duration: 5000
        });
        navigate("/assessment", { replace: true });
      }
    };
    
    loadAnalysis();
  }, [id, isLoading, setCurrentAnalysis, navigate, analysis, stableAnalysis, analysisHistory, hasAttemptedToLoadAnalysis]);
  
  // Update stable analysis when the analysis from the hook changes
  useEffect(() => {
    if (analysis && (!stableAnalysis || analysis.id !== stableAnalysis.id)) {
      setStableAnalysis(analysis);
      // Update the URL if it doesn't already match the current analysis ID
      if (id !== analysis.id) {
        navigate(`/report/${analysis.id}`, { replace: true });
      }
    }
  }, [analysis, stableAnalysis, navigate, id]);
  
  // Show loading state only on initial load
  if (isLoading && !stableAnalysis) {
    return (
      <div className={`container ${isMobile ? 'py-4 px-3' : 'py-10'}`}>
        <ReportSkeleton />
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
      <div className={`container ${isMobile ? 'py-4 px-3' : 'py-10'} text-center`}>
        <h2 className="text-2xl font-bold mb-4">No Analysis Found</h2>
        <p className="mb-6">We couldn't find any personality analysis reports.</p>
        <button
          onClick={() => navigate("/assessment")}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          Take Assessment
        </button>
      </div>
    );
  }
  
  const handleAnalysisChange = (analysisId: string) => {
    navigate(`/report/${analysisId}`, { replace: false });
  };
  
  return (
    <div className={`container max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto ${isMobile ? 'py-4 px-2 space-y-4' : 'py-6 space-y-8'}`}>
      {displayAnalysis && (
        <>
          <ReportHeader 
            analysis={displayAnalysis} 
            analysisHistory={analysisHistory || []}
            onAnalysisChange={handleAnalysisChange}
          />
          
          <Tabs defaultValue="overview" className={`${isMobile ? 'space-y-4' : 'space-y-6'}`}>
            <div className="scrollable-tabs overflow-x-auto pb-2 -mx-2 px-2">
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
