
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AlertTriangle, FileText, ArrowRight, RefreshCw, Clock } from "lucide-react";
import { toast } from "sonner";
import { ComprehensiveAnalysis, DbComprehensiveAnalysis } from "@/utils/types";
import { format } from "date-fns";
import { mapDbArrayToComprehensiveAnalyses } from "@/utils/dataMappers";

const ComprehensiveReportLanding: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [latestAnalysisId, setLatestAnalysisId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reportHistory, setReportHistory] = useState<ComprehensiveAnalysis[]>([]);

  useEffect(() => {
    const fetchUserReports = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Get all the user's comprehensive analyses
        const { data, error } = await supabase
          .from('comprehensive_analyses')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw new Error(error.message);
        
        if (data && data.length > 0) {
          const mappedData = mapDbArrayToComprehensiveAnalyses(data as DbComprehensiveAnalysis[]);
          setReportHistory(mappedData);
          setLatestAnalysisId(data[0].id);
        }
      } catch (err) {
        console.error("Error fetching comprehensive analyses:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        toast.error("Failed to find your comprehensive reports");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserReports();
  }, [user]);

  const handleViewReport = (reportId: string = latestAnalysisId) => {
    if (reportId) {
      navigate(`/comprehensive-report/${reportId}`);
    }
  };

  const handleTakeAssessment = () => {
    navigate("/comprehensive-assessment");
  };
  
  const handleRefreshReports = async () => {
    if (!user) return;
    
    toast.loading("Refreshing your reports...", { id: "refresh-reports" });
    try {
      const { data, error } = await supabase
        .from('comprehensive_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw new Error(error.message);
      
      if (data && data.length > 0) {
        const mappedData = mapDbArrayToComprehensiveAnalyses(data as DbComprehensiveAnalysis[]);
        setReportHistory(mappedData);
        setLatestAnalysisId(data[0].id);
        toast.success("Reports refreshed successfully", { id: "refresh-reports" });
      } else {
        toast.info("No reports found", { id: "refresh-reports" });
      }
    } catch (err) {
      toast.error("Failed to refresh reports", { 
        id: "refresh-reports",
        description: err instanceof Error ? err.message : "Unknown error" 
      });
    }
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
          <Button onClick={handleRefreshReports}>Try Again</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Comprehensive Report</h1>
      
      {reportHistory.length > 0 ? (
        <div className="space-y-6 max-w-3xl mx-auto">
          <Card className="p-6 md:p-8 text-center">
            <FileText className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Your Comprehensive Analysis is Ready</h2>
            <p className="text-muted-foreground mb-6">
              View your detailed personality analysis based on the 100-question comprehensive assessment.
            </p>
            <Button size="lg" onClick={() => handleViewReport()} className="gap-2">
              View Latest Report <ArrowRight className="h-4 w-4" />
            </Button>
          </Card>
          
          {/* Report History Section */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold flex items-center">
                <Clock className="h-5 w-5 mr-2" /> Report History
              </h3>
              <Button variant="outline" size="sm" onClick={handleRefreshReports}>
                <RefreshCw className="h-3.5 w-3.5 mr-1" /> Refresh
              </Button>
            </div>
            
            <div className="space-y-2">
              {reportHistory.map((report) => {
                const date = report.created_at 
                  ? format(new Date(report.created_at), 'MMM d, yyyy, h:mm a')
                  : 'Unknown date';
                  
                return (
                  <Card key={report.id} className="p-3 hover:bg-accent cursor-pointer" onClick={() => handleViewReport(report.id)}>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{date}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-xs">
                          ID: {report.id}
                        </p>
                      </div>
                      <Button size="sm" variant="ghost">
                        View <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </Card>
          
          <div className="text-center mt-4">
            <Button onClick={handleTakeAssessment} variant="outline">
              Take New Assessment
            </Button>
          </div>
        </div>
      ) : (
        <Card className="p-6 md:p-8 max-w-3xl mx-auto text-center">
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
