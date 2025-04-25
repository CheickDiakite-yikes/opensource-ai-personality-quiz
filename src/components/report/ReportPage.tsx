
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs } from "@/components/ui/tabs";
import ReportHeader from "./ReportHeader";
import ReportTabs from "./ReportTabs";
import ReportTabContent from "./ReportTabContent";
import ReportSkeleton from "./skeletons/ReportSkeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { useReportData } from "@/hooks/useReportData";
import ReportError from "./ReportError";
import { toast } from "sonner";

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

  // Add debugging effect
  useEffect(() => {
    if (!isLoading) {
      console.log("ReportPage render state:", {
        hasAnalysis: !!analysis,
        analysisId: analysis?.id,
        historyLength: analysisHistory?.length,
        isLoading,
        errorMessage
      });
    }
  }, [analysis, analysisHistory, isLoading, errorMessage]);

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
    // Show toast for better visibility
    if (errorMessage && analysisHistory.length > 0) {
      toast.error("Error loading report", { 
        description: errorMessage,
        duration: 5000
      });
    }
    
    return (
      <ReportError
        description={errorMessage || "Could not load the requested analysis"}
        onRetry={retryLoading}
        errorDetails={`Report ID: ${id}, History Size: ${analysisHistory.length}`}
      />
    );
  }

  // If no analysis and no ID, but we have history, use the first analysis
  if (!analysis && !id && analysisHistory.length > 0) {
    console.log("No current analysis but history available, redirecting to first analysis");
    navigate(`/report/${analysisHistory[0].id}`, { replace: true });
    return null;
  }
  
  // If no analysis and no history, redirect to assessment
  if (!analysis && !id && analysisHistory.length === 0 && !isLoading) {
    console.log("No analysis and no history, redirecting to assessment");
    toast.error("No analysis reports found", {
      description: "Please complete the assessment first to view your report"
    });
    navigate("/assessment", { replace: true });
    return null;
  }

  // Render the report content
  return (
    <div className={`mx-auto ${isMobile ? 'p-0 pt-1 pb-16 px-0 max-w-full w-full overflow-hidden' : 'py-6 space-y-8 max-w-4xl container'}`}>
      {analysis ? (
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
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold">No Analysis Selected</h2>
          <p className="text-muted-foreground mt-2">
            {analysisHistory.length > 0 
              ? "Please select an analysis from your history" 
              : "Complete an assessment to view your analysis"}
          </p>
          <div className="mt-4">
            <button 
              onClick={() => navigate("/assessment")} 
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
            >
              Take Assessment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportPage;
