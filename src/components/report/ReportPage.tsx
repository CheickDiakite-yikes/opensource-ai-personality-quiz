
import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  
  // Extract the analysis history and ensure it's a stable reference
  const analysisHistory = useMemo(() => {
    const history = getAnalysisHistory();
    console.log("ReportPage: Available analyses:", history?.length || 0);
    return history;
  }, [getAnalysisHistory]);
  
  // Refresh analyses only once when the component mounts
  useEffect(() => {
    if (!initialLoadComplete) {
      console.log("ReportPage: Initial refresh of analysis data");
      refreshAnalysis();
      setInitialLoadComplete(true);
    }
  }, [refreshAnalysis, initialLoadComplete]);
  
  // Set the current analysis based on the ID param if provided
  useEffect(() => {
    // Only run this effect after initial loading is complete
    if (!isLoading && initialLoadComplete) {
      console.log("ReportPage: ID param or loading state changed", id);
      
      if (id) {
        console.log("ReportPage: Setting analysis from URL param:", id);
        const success = setCurrentAnalysis(id);
        
        if (!success && !analysis && !stableAnalysis) {
          toast.error("Could not find the requested analysis", {
            description: "Please try taking the assessment again or log in to access your saved analyses",
            duration: 5000
          });
          
          navigate("/assessment");
        }
      } else if (analysisHistory && analysisHistory.length > 0) {
        // If no ID is provided, redirect to the latest analysis
        console.log("ReportPage: No ID provided, redirecting to latest analysis");
        navigate(`/report/${analysisHistory[0].id}`);
      }
    }
  }, [id, isLoading, setCurrentAnalysis, navigate, analysis, stableAnalysis, initialLoadComplete, analysisHistory]);
  
  // Update stable analysis when the analysis from the hook changes
  useEffect(() => {
    if (analysis && (!stableAnalysis || analysis.id !== stableAnalysis.id)) {
      console.log("ReportPage: Updating stable analysis", analysis.id);
      setStableAnalysis(analysis);
    }
  }, [analysis, stableAnalysis]);
  
  // Add additional logging for debugging
  useEffect(() => {
    console.log("ReportPage: Analysis history updated:", analysisHistory?.length || 0);
  }, [analysisHistory]);
  
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
  
  if (!displayAnalysis) {
    toast.error("Error loading analysis", {
      description: "We couldn't load the personality analysis. Please try taking the assessment again.",
      duration: 5000
    });
    
    navigate("/assessment");
    return null;
  }
  
  const handleAnalysisChange = (analysisId: string) => {
    console.log("ReportPage: User selected analysis:", analysisId);
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
