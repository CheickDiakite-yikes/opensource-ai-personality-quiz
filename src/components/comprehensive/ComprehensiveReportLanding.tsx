
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AlertTriangle, FileText, ArrowRight, RefreshCw, Clock, Database } from "lucide-react";
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
  const [isLoadingAllReports, setIsLoadingAllReports] = useState<boolean>(false);
  const [hasTriedDirectFetch, setHasTriedDirectFetch] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserReports = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        console.log("Fetching comprehensive analyses for user:", user.id);
        
        // CRITICAL FIX: First approach - try to get analyses directly with no row limit
        const { data, error } = await supabase
          .from('comprehensive_analyses')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(100); // Increased limit to ensure we get all analyses
          
        if (error) throw new Error(error.message);
        
        if (data && data.length > 0) {
          console.log(`Found ${data.length} analyses for user:`, user.id);
          const mappedData = mapDbArrayToComprehensiveAnalyses(data as DbComprehensiveAnalysis[]);
          
          console.log("Mapped analyses:", mappedData);
          setReportHistory(mappedData);
          setLatestAnalysisId(data[0].id);
        } else {
          console.log("No comprehensive analyses found with direct query. Trying alternative approach.");
          // CRITICAL FIX: Try a different approach if no data is found
          setHasTriedDirectFetch(true);
          await fetchAllComprehensiveAnalyses();
        }
      } catch (err) {
        console.error("Error fetching comprehensive analyses:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        toast.error("Failed to find your comprehensive reports");
        
        // CRITICAL FIX: Try alternative approach if the direct fetch fails
        if (!hasTriedDirectFetch) {
          setHasTriedDirectFetch(true);
          await fetchAllComprehensiveAnalyses();
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserReports();
  }, [user]);

  // CRITICAL FIX: New function to fetch ALL analyses from the database
  const fetchAllComprehensiveAnalyses = async () => {
    if (!user) return;
    
    try {
      setIsLoadingAllReports(true);
      toast.loading("Searching for all your comprehensive reports...", { id: "fetch-all" });
      
      console.log("Attempting to fetch ALL comprehensive analyses related to user");
      
      // First try with assessment_id match in case analyses were saved with assessment ID
      const { data: assessmentData } = await supabase
        .from('comprehensive_assessments')
        .select('id')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });
        
      if (assessmentData && assessmentData.length > 0) {
        console.log(`Found ${assessmentData.length} assessments, checking for analyses linked to these`);
        
        // Get all assessment IDs
        const assessmentIds = assessmentData.map(item => item.id);
        
        // Check for analyses linked to any of these assessment IDs
        const { data: linkedAnalyses } = await supabase
          .from('comprehensive_analyses')
          .select('*')
          .in('assessment_id', assessmentIds)
          .order('created_at', { ascending: false });
          
        if (linkedAnalyses && linkedAnalyses.length > 0) {
          console.log(`Found ${linkedAnalyses.length} analyses linked to user assessments`);
          
          // CRITICAL FIX: If analyses are found but don't have user_id set, update them
          for (const analysis of linkedAnalyses) {
            if (!analysis.user_id || analysis.user_id !== user.id) {
              console.log(`Updating analysis ${analysis.id} to associate with user ${user.id}`);
              
              await supabase
                .from('comprehensive_analyses')
                .update({ user_id: user.id })
                .eq('id', analysis.id);
            }
          }
          
          // Map and set the data
          const mappedData = mapDbArrayToComprehensiveAnalyses(linkedAnalyses as DbComprehensiveAnalysis[]);
          setReportHistory(mappedData);
          setLatestAnalysisId(linkedAnalyses[0].id);
          toast.success(`Found ${linkedAnalyses.length} analyses linked to your assessments`, { id: "fetch-all" });
          return;
        } else {
          console.log("No analyses found linked to user assessments");
        }
      }
      
      // CRITICAL FIX: If we still have nothing, try a broader search with RPC function
      console.log("Trying RPC function to search for analyses");
      
      const { data: rpcData, error: rpcError } = await supabase
        .rpc('get_all_comprehensive_analyses_for_user', { user_uuid: user.id });
        
      if (rpcError) {
        console.error("RPC function error:", rpcError);
        // If RPC fails, continue to next approach
      } else if (rpcData && rpcData.length > 0) {
        console.log(`RPC function found ${rpcData.length} analyses`);
        const mappedData = mapDbArrayToComprehensiveAnalyses(rpcData as any);
        setReportHistory(mappedData);
        setLatestAnalysisId(rpcData[0].id);
        toast.success(`Found ${rpcData.length} analyses through expanded search`, { id: "fetch-all" });
        return;
      }
      
      // CRITICAL FIX: Last resort, try to fetch ALL analyses and filter client-side
      console.log("Attempting to fetch all comprehensive analyses as last resort");
      
      const { data: allAnalyses, error: allError } = await supabase
        .from('comprehensive_analyses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100); // Reasonable limit to prevent overwhelming the client
        
      if (allError) {
        throw new Error(allError.message);
      }
      
      if (allAnalyses && allAnalyses.length > 0) {
        console.log(`Found ${allAnalyses.length} total analyses, filtering for user relevance`);
        
        // Filter for those that MIGHT be related to the user
        const userEmail = user.email?.toLowerCase();
        const userAnalyses = allAnalyses.filter(analysis => {
          // Either has user_id matching or has assessment_id in user assessments
          return analysis.user_id === user.id || 
                 (analysis.result && 
                  typeof analysis.result === 'object' && 
                  ((analysis.result as any).userEmail?.toLowerCase() === userEmail));
        });
        
        if (userAnalyses.length > 0) {
          console.log(`Found ${userAnalyses.length} analyses potentially related to user`);
          
          // Update these to associate with user
          for (const analysis of userAnalyses) {
            if (!analysis.user_id || analysis.user_id !== user.id) {
              await supabase
                .from('comprehensive_analyses')
                .update({ user_id: user.id })
                .eq('id', analysis.id);
            }
          }
          
          const mappedData = mapDbArrayToComprehensiveAnalyses(userAnalyses as DbComprehensiveAnalysis[]);
          setReportHistory(mappedData);
          setLatestAnalysisId(userAnalyses[0].id);
          toast.success(`Found ${userAnalyses.length} analyses linked to your account`, { id: "fetch-all" });
          return;
        }
      }
      
      toast.error("No analyses found", { id: "fetch-all" });
      
    } catch (err) {
      console.error("Error in fetchAllComprehensiveAnalyses:", err);
      toast.error("Failed to retrieve all analyses", { 
        id: "fetch-all",
        description: "Please try again or contact support"
      });
    } finally {
      setIsLoadingAllReports(false);
    }
  };

  const handleViewReport = (reportId: string = latestAnalysisId) => {
    if (reportId) {
      navigate(`/comprehensive-report/${reportId}`);
    }
  };

  const handleTakeAssessment = () => {
    navigate("/comprehensive-assessment");
  };
  
  // CRITICAL FIX: Enhanced refresh reports function
  const handleRefreshReports = async () => {
    if (!user) return;
    
    toast.loading("Searching for all your reports...", { id: "refresh-reports" });
    try {
      setIsLoadingAllReports(true);
      
      // Use the more thorough fetch method
      await fetchAllComprehensiveAnalyses();
      
      if (reportHistory.length > 0) {
        toast.success(`Found ${reportHistory.length} reports`, { id: "refresh-reports" });
      } else {
        toast.warning("No reports found. Try taking an assessment.", { id: "refresh-reports" });
      }
    } catch (err) {
      toast.error("Failed to refresh reports", { 
        id: "refresh-reports",
        description: err instanceof Error ? err.message : "Unknown error" 
      });
    } finally {
      setIsLoadingAllReports(false);
    }
  };

  // CRITICAL FIX: Add function to view ALL analyses in database (admin function)
  const handleViewAllAnalyses = async () => {
    toast.loading("Fetching all analyses in database...", { id: "all-analyses" });
    try {
      const { data, error } = await supabase
        .from('comprehensive_analyses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
        
      if (error) throw new Error(error.message);
      
      if (data && data.length > 0) {
        const mappedData = mapDbArrayToComprehensiveAnalyses(data as DbComprehensiveAnalysis[]);
        setReportHistory(mappedData);
        setLatestAnalysisId(data[0].id);
        toast.success(`Found ${data.length} analyses in database`, { id: "all-analyses" });
      } else {
        toast.info("No analyses found in database", { id: "all-analyses" });
      }
    } catch (err) {
      toast.error("Failed to fetch all analyses", { 
        id: "all-analyses",
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
          <div className="space-y-4">
            <Button onClick={handleRefreshReports} disabled={isLoadingAllReports}>
              {isLoadingAllReports ? "Searching..." : "Search All Reports"}
            </Button>
            <Button onClick={handleTakeAssessment} variant="outline">
              Take New Assessment
            </Button>
          </div>
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
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleRefreshReports} disabled={isLoadingAllReports}>
                  <RefreshCw className={`h-3.5 w-3.5 mr-1 ${isLoadingAllReports ? 'animate-spin' : ''}`} /> 
                  {isLoadingAllReports ? "Searching..." : "Search All Reports"}
                </Button>
                <Button variant="secondary" size="sm" onClick={handleViewAllAnalyses}>
                  <Database className="h-3.5 w-3.5 mr-1" /> View All in DB
                </Button>
              </div>
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
          <div className="space-y-4">
            <Button size="lg" onClick={handleTakeAssessment} className="gap-2">
              Take the Assessment <ArrowRight className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline"
              onClick={handleRefreshReports}
              disabled={isLoadingAllReports}
              className="w-full sm:w-auto"
            >
              {isLoadingAllReports ? "Searching..." : "Search for Existing Reports"}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ComprehensiveReportLanding;
