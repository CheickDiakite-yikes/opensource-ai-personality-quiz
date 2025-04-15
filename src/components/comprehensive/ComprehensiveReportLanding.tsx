
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, FileText, ArrowRight, Database, Sparkles, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useComprehensiveAnalysisFallback } from "@/hooks/useComprehensiveAnalysisFallback";
import { useAuth } from "@/contexts/AuthContext";
import { ComprehensiveAnalysis } from "@/utils/types";

const ComprehensiveReportLanding: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState<ComprehensiveAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  
  // Use our enhanced hook with user analyses fetch capability
  const { 
    fetchAllUserAnalyses, 
    pollForAnalysis, 
    userAnalyses,
    isLoadingUserAnalyses 
  } = useComprehensiveAnalysisFallback("");

  // Use the enhanced edge function to load all user analyses
  useEffect(() => {
    const loadUserAnalyses = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        console.log(`LANDING: Fetching all analyses for user ${user.id} using edge function`);
        
        // Use our new method that leverages the edge function
        const userAnalysesData = await fetchAllUserAnalyses();
        
        if (userAnalysesData && userAnalysesData.length > 0) {
          console.log(`LANDING: Edge function found ${userAnalysesData.length} analyses`);
          setAnalyses(userAnalysesData);
          
          // Store the latest ID in local storage
          localStorage.setItem('latest_comprehensive_analysis_id', userAnalysesData[0].id);
        } else {
          console.warn("LANDING: No analyses found for user via edge function");
          setAnalyses([]);
        }
      } catch (err) {
        console.error("LANDING: Error fetching comprehensive analyses:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        toast.error("Failed to retrieve your comprehensive reports");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserAnalyses();
  }, [user, fetchAllUserAnalyses, userAnalyses]);
  
  // Handler for manual refresh of analyses
  const handleRefreshAnalyses = async () => {
    if (!user || isRefreshing) return;
    
    try {
      setIsRefreshing(true);
      toast.loading("Refreshing your analyses...", { id: "refresh-analyses" });
      
      const refreshedAnalyses = await fetchAllUserAnalyses();
      
      if (refreshedAnalyses && refreshedAnalyses.length > 0) {
        setAnalyses(refreshedAnalyses);
        toast.success(`Found ${refreshedAnalyses.length} analyses`, { 
          id: "refresh-analyses",
          description: "Your analyses have been updated"
        });
      } else {
        toast.error("No analyses found", { id: "refresh-analyses" });
      }
    } catch (error) {
      console.error("Error refreshing analyses:", error);
      toast.error("Failed to refresh analyses", { id: "refresh-analyses" });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleViewReport = (analysisId: string) => {
    console.log(`LANDING: Navigating to report page for analysis ${analysisId}`);
    navigate(`/comprehensive-report/${analysisId}`);
  };

  const handleTakeAssessment = () => {
    navigate("/comprehensive-assessment");
  };

  const toggleDebug = () => {
    setShowDebug(!showDebug);
  };

  if (isLoading) {
    return (
      <div className="container py-8 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Comprehensive Report</h1>
        <Card className="p-6 max-w-3xl mx-auto">
          <div className="space-y-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-12 w-40 mx-auto mt-4" />
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Comprehensive Report</h1>
        <Card className="p-6 max-w-3xl mx-auto text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Reports</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <div className="space-y-4">
            <Button onClick={() => window.location.reload()}>Try Again</Button>
            <div>
              <Button variant="outline" onClick={toggleDebug} className="mt-4">
                {showDebug ? "Hide Debug Info" : "Show Debug Info"}
              </Button>
              {showDebug && (
                <div className="mt-4 p-4 bg-muted rounded text-left text-sm overflow-auto max-h-40">
                  <p>User ID: {user?.id || "Not logged in"}</p>
                  <p>Error details: {error}</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Comprehensive Report</h1>
      
      {analyses.length > 0 ? (
        <div className="space-y-6">
          {/* Latest analysis */}
          <Card className="p-6 md:p-8 max-w-3xl mx-auto text-center">
            <div className="flex justify-between items-center mb-4">
              <FileText className="h-16 w-16 text-primary" />
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleRefreshAnalyses} 
                disabled={isRefreshing}
                className="flex items-center gap-1"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            
            <h2 className="text-2xl font-semibold mb-2">Your Latest Comprehensive Analysis</h2>
            <p className="text-muted-foreground mb-6">
              View your detailed personality analysis based on the 100-question comprehensive assessment.
            </p>
            <Button 
              size="lg" 
              onClick={() => handleViewReport(analyses[0].id)} 
              className="gap-2"
            >
              View Full Report <ArrowRight className="h-4 w-4" />
            </Button>
            
            {analyses.length > 1 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Previous Reports ({analyses.length - 1})</h3>
                <div className="space-y-2">
                  {analyses.slice(1, 4).map((analysis, index) => (
                    <Button 
                      key={analysis.id}
                      variant="outline" 
                      onClick={() => handleViewReport(analysis.id)}
                      className="w-full justify-between"
                    >
                      <span>Report {index + 2}</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(analysis.created_at).toLocaleDateString()}
                      </span>
                    </Button>
                  ))}
                  
                  {analyses.length > 4 && (
                    <Button 
                      variant="secondary" 
                      className="w-full mt-2"
                      onClick={() => {
                        // Show all analyses in a toast notification for now
                        // In a real app, we could create a modal or dedicated page
                        toast.info(
                          <div className="max-h-[300px] overflow-y-auto">
                            <h3 className="font-bold mb-2">All Reports ({analyses.length})</h3>
                            <ul className="space-y-2">
                              {analyses.map((analysis, idx) => (
                                <li key={analysis.id} className="flex justify-between">
                                  <span>Report {idx + 1}</span>
                                  <span className="text-sm">
                                    {new Date(analysis.created_at).toLocaleDateString()}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>,
                          { duration: 5000 }
                        );
                      }}
                    >
                      View All Reports
                    </Button>
                  )}
                </div>
              </div>
            )}
          </Card>
          
          {/* Debug section */}
          <div className="max-w-3xl mx-auto">
            <Button variant="ghost" onClick={toggleDebug} size="sm" className="text-xs">
              <Database className="h-3 w-3 mr-1" />
              {showDebug ? "Hide Analysis Data" : "View Analysis Data"}
            </Button>
            
            {showDebug && (
              <Card className="p-4 mt-2">
                <h3 className="text-sm font-medium mb-2">Found {analyses.length} analyses</h3>
                <div className="text-xs overflow-auto max-h-40 bg-muted p-2 rounded">
                  <pre>{JSON.stringify(analyses.map(a => ({
                    id: a.id,
                    created_at: a.created_at,
                    assessment_id: a.assessment_id,
                    traits_count: Array.isArray(a.traits) ? a.traits.length : 0,
                    overview_length: a.overview ? a.overview.length : 0
                  })), null, 2)}</pre>
                </div>
              </Card>
            )}
          </div>
        </div>
      ) : (
        <Card className="p-6 md:p-8 max-w-3xl mx-auto text-center">
          <Sparkles className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No Comprehensive Report Yet</h2>
          <p className="text-muted-foreground mb-6">
            Complete the 100-question comprehensive assessment to receive your detailed personality analysis.
          </p>
          <Button size="lg" onClick={handleTakeAssessment} className="gap-2">
            Take the Assessment <ArrowRight className="h-4 w-4" />
          </Button>
        </Card>
      )}
    </div>
  );
};

export default ComprehensiveReportLanding;
