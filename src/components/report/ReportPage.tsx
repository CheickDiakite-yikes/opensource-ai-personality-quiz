
import React, { useEffect, useState } from "react";
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
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [redirectAttempted, setRedirectAttempted] = useState(false);
  
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

  // When on the /report route (with no ID), check if we have analyses available
  useEffect(() => {
    const handleInitialNavigation = async () => {
      // Only run this once per component mount
      if (redirectAttempted) return;
      setRedirectAttempted(true);
      
      console.log("ReportPage navigation check:", {
        id,
        historyLength: analysisHistory.length,
        isLoading
      });
      
      // If we're on /report with no ID but have analyses, redirect to the first one
      if (!id && !isLoading && analysisHistory.length > 0) {
        console.log("No ID but analyses available, redirecting to first analysis:", analysisHistory[0].id);
        navigate(`/report/${analysisHistory[0].id}`, { replace: true });
      }
      // If we're on /report with no analyses and no loading, try refreshing once
      else if (!id && !isLoading && analysisHistory.length === 0) {
        console.log("No analyses found, attempting refresh");
        await onManualRefresh();
      }
    };
    
    handleInitialNavigation();
  }, [id, isLoading, analysisHistory, navigate, redirectAttempted, onManualRefresh]);

  // Show loading state
  if (isLoading) {
    return (
      <div className={`container ${isMobile ? 'pt-2 pb-16 px-0.5 mx-0 w-full max-w-full overflow-hidden' : 'py-10'}`}>
        <ReportSkeleton />
      </div>
    );
  }
  
  // Show error state if we have an error
  if (errorMessage) {
    return (
      <ReportError
        description={errorMessage}
        onRetry={retryLoading}
        errorDetails={`Report ID: ${id || 'none'}, History Size: ${analysisHistory.length}`}
      />
    );
  }
  
  // Show "No analyses" view when appropriate
  if (!analysis && !isLoading && analysisHistory.length === 0) {
    return (
      <div className="container py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">No Analysis Reports Found</h2>
        <p className="mb-6">
          Complete an assessment to view your personality analysis report.
        </p>
        <button 
          onClick={() => navigate("/assessment")} 
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
        >
          Take Assessment
        </button>
      </div>
    );
  }

  // If we have analyses but no current one selected, either we're redirecting or something's wrong
  if (!analysis && analysisHistory.length > 0) {
    return (
      <div className="container py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {redirectAttempted ? "Selecting an analysis..." : "Loading your analysis..."}
          </AlertDescription>
        </Alert>
        <div className="mt-4 text-center">
          <button 
            onClick={retryLoading} 
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
          >
            Reload Analyses
          </button>
        </div>
      </div>
    );
  }
  
  // Render the report content if we have an analysis
  if (analysis) {
    return (
      <div className={`mx-auto ${isMobile ? 'p-0 pt-1 pb-16 px-0 max-w-full w-full overflow-hidden' : 'py-6 space-y-8 max-w-4xl container'}`}>
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
      </div>
    );
  }
  
  // Final fallback UI
  return (
    <div className="container py-8 text-center">
      <h2 className="text-xl font-medium mb-4">Something went wrong</h2>
      <p className="text-muted-foreground mb-6">
        We couldn't load your analysis. Please try refreshing the page.
      </p>
      <button 
        onClick={retryLoading} 
        className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
      >
        Retry Loading
      </button>
    </div>
  );
};

export default ReportPage;
