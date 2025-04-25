
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

  // Add debugging effect to help diagnose the issue
  useEffect(() => {
    console.log("ReportPage render with state:", {
      route: window.location.pathname,
      hasIdParam: !!id,
      hasAnalysis: !!analysis,
      analysisId: analysis?.id,
      historyLength: analysisHistory?.length,
      isLoading,
      errorMessage,
      redirectAttempted
    });
  }, [analysis, analysisHistory, isLoading, errorMessage, id, redirectAttempted]);

  // Handle redirect to first analysis if we're on /report with no ID
  useEffect(() => {
    const handleMissingIdRedirect = () => {
      // Only proceed if we're not loading, have no ID, and have analyses available
      if (!isLoading && !id && analysisHistory.length > 0 && !redirectAttempted) {
        console.log("No ID in URL but analyses available, redirecting to first analysis:", analysisHistory[0].id);
        setRedirectAttempted(true);
        navigate(`/report/${analysisHistory[0].id}`, { replace: true });
        return true;
      }
      return false;
    };
    
    // Attempt the redirect - only on clean mount
    if (!redirectAttempted) {
      const didRedirect = handleMissingIdRedirect();
      if (!didRedirect && !isLoading && !id && analysisHistory.length === 0) {
        // No analyses available and no ID - mark redirect attempted to avoid loops
        setRedirectAttempted(true);
      }
    }
  }, [id, analysis, analysisHistory, isLoading, navigate, redirectAttempted]);

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

  // If we're on /report with no ID parameter but have analyses, show a temporary message
  // while we redirect (this should be very brief)
  if (!id && analysisHistory.length > 0 && !redirectAttempted) {
    return (
      <div className="container py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Redirecting to your most recent analysis...
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  // Show "No analyses" view when appropriate
  if (!analysis && !id && analysisHistory.length === 0 && !isLoading) {
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
        // This is a fallback UI while waiting for redirect or if something unexpected happens
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold">No Analysis Selected</h2>
          <p className="text-muted-foreground mt-2">
            {analysisHistory.length > 0 
              ? "Please select an analysis from your history" 
              : "Complete an assessment to view your analysis"}
          </p>
          <div className="mt-4 space-x-4">
            <button 
              onClick={() => navigate("/assessment")} 
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
            >
              Take Assessment
            </button>
            {analysisHistory.length > 0 && (
              <button 
                onClick={retryLoading} 
                className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md"
              >
                Refresh Data
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportPage;
