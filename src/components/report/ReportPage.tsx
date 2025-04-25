
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs } from "@/components/ui/tabs";
import ReportHeader from "./ReportHeader";
import ReportTabs from "./ReportTabs";
import ReportTabContent from "./ReportTabContent";
import ReportSkeleton from "./skeletons/ReportSkeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { useReportData } from "@/hooks/useReportData";
import ReportError from "./ReportError";

const ReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Use our focused hook for report data
  const {
    analysis,
    analysisHistory,
    isLoading,
    errorMessage,
    onAnalysisChange,
    onManualRefresh,
    retryLoading
  } = useReportData(id);

  // Show loading state
  if (isLoading) {
    return (
      <div className={`container ${isMobile ? 'pt-2 pb-16 px-0.5 mx-0 w-full max-w-full overflow-hidden' : 'py-10'}`}>
        <ReportSkeleton />
      </div>
    );
  }
  
  // Show error state if we have an error or no analysis after loading
  if (errorMessage || (!analysis && !isLoading)) {
    return (
      <ReportError
        description={errorMessage || "Could not load the requested analysis"}
        onRetry={retryLoading}
        errorDetails={`Report ID: ${id}, History Size: ${analysisHistory.length}`}
      />
    );
  }

  // If no analysis and no ID, redirect to assessment
  if (!analysis && !id) {
    navigate("/assessment", { replace: true });
    return null;
  }

  // Render the report content
  return (
    <div className={`mx-auto ${isMobile ? 'p-0 pt-1 pb-16 px-0 max-w-full w-full overflow-hidden' : 'py-6 space-y-8 max-w-4xl container'}`}>
      {analysis && (
        <>
          <ReportHeader 
            analysis={analysis} 
            analysisHistory={analysisHistory}
            onAnalysisChange={onAnalysisChange}
            onManualRefresh={onManualRefresh}
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
