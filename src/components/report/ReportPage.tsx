
import React, { useState } from "react";
import { useParams } from "react-router-dom";
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
  const { loadAllAnalysesFromSupabase } = useAIAnalysis();
  
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
      await loadAllAnalysesFromSupabase();
      toast.success("Successfully refreshed your analyses", { id: "refresh-toast" });
    } catch (error) {
      console.error("Error manually refreshing analyses:", error);
      toast.error("Failed to refresh analyses", { 
        id: "refresh-toast",
        description: "Please try again later"
      });
    }
  };

  // Show loading state only on initial load or when changing analyses
  if ((isLoading && !analysis) || isChangingAnalysis) {
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
        analysisHistory={analysisHistory}
        loadAttempts={loadAttempts}
        onManualRefresh={handleManualRefresh}
      />
    );
  }

  return (
    <div className={`mx-auto ${isMobile ? 'p-0 pt-1 pb-16 px-0 max-w-full w-full overflow-hidden' : 'py-6 space-y-8 max-w-4xl container'}`}>
      {analysis && (
        <>
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
        </>
      )}
    </div>
  );
};

export default ReportPage;
