
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Tabs } from "@/components/ui/tabs";
import ReportHeader from "./ReportHeader";
import ReportTabs from "./ReportTabs";
import ReportTabContent from "./ReportTabContent";
import ReportSkeleton from "./skeletons/ReportSkeleton";
import ReportError from "./ReportError";
import { useReportData } from "@/hooks/useReportData";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAIAnalysis } from "@/hooks/useAIAnalysis";

const ReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { loadAllAnalysesFromSupabase } = useAIAnalysis();
  
  // Check if we're on /report without an ID
  useEffect(() => {
    if (!id) {
      // If we're on /report without an ID, fetch analyses and redirect to the first one
      loadAllAnalysesFromSupabase().then(analyses => {
        if (analyses && analyses.length > 0) {
          navigate(`/report/${analyses[0].id}`, { replace: true });
        } else {
          toast.error("No analysis reports found", {
            description: "Please take the assessment first"
          });
          navigate("/assessment", { replace: true });
        }
      });
    }
  }, [id, navigate, loadAllAnalysesFromSupabase]);

  const {
    analysis,
    isLoading,
    isChangingAnalysis,
    hasAttemptedToLoadAnalysis,
    analysisHistory,
    loadAttempts
  } = useReportData(id);

  // Handle manual reload of analyses
  const handleManualRefresh = async () => {
    toast.loading("Refreshing your analyses...", { id: "refresh-toast" });
    try {
      const analyses = await loadAllAnalysesFromSupabase();
      if (analyses && analyses.length > 0) {
        toast.success(`Successfully refreshed ${analyses.length} analyses`, { id: "refresh-toast" });
        // If current analysis is not loaded but we found some, redirect to the first one
        if (!analysis && analyses.length > 0) {
          navigate(`/report/${analyses[0].id}`, { replace: true });
        }
      } else {
        toast.error("No analyses found", { id: "refresh-toast" });
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
  if (isLoading && (!analysis || isChangingAnalysis)) {
    return (
      <div className={`container ${isMobile ? 'pt-2 pb-16 px-0.5 mx-0 w-full max-w-full overflow-hidden' : 'py-10'}`}>
        <ReportSkeleton />
      </div>
    );
  }

  // Handle case where no analysis is available after loading
  if (!analysis && !isLoading && hasAttemptedToLoadAnalysis) {
    return (
      <ReportError 
        id={id}
        analysisHistory={analysisHistory || []}
        loadAttempts={loadAttempts}
        onManualRefresh={handleManualRefresh}
      />
    );
  }

  // Make sure we always have analysis before rendering the content
  if (!analysis) {
    return (
      <div className={`container ${isMobile ? 'pt-2 pb-16 px-0.5 mx-0 w-full max-w-full overflow-hidden' : 'py-10'}`}>
        <ReportSkeleton />
      </div>
    );
  }

  return (
    <div className={`mx-auto ${isMobile ? 'p-0 pt-1 pb-16 px-0 max-w-full w-full overflow-hidden' : 'py-6 space-y-8 max-w-4xl container'}`}>
      <ReportHeader 
        analysis={analysis}
        analysisHistory={analysisHistory || []}
        onManualRefresh={handleManualRefresh}
      />
      
      <Tabs defaultValue="overview" className="w-full overflow-hidden max-w-full">
        <div className="w-full overflow-x-auto sticky top-0 z-10 bg-background/80 backdrop-blur-sm pt-1 shadow-sm">
          <ReportTabs />
        </div>
        <ReportTabContent analysis={analysis} />
      </Tabs>
    </div>
  );
};

export default ReportPage;
