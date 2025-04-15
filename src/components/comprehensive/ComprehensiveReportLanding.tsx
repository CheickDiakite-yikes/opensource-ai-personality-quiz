
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AlertTriangle, FileText, ArrowRight, Database, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useComprehensiveAnalysisFallback } from "@/hooks/useComprehensiveAnalysisFallback";

const ComprehensiveReportLanding: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState<boolean>(false);
  const { pollForAnalysis } = useComprehensiveAnalysisFallback("");

  useEffect(() => {
    const fetchUserAnalyses = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Fetch all analyses using multiple approaches for redundancy
        const analysesFromAllSources = await fetchFromAllSources();
        
        if (analysesFromAllSources && analysesFromAllSources.length > 0) {
          console.log(`Found ${analysesFromAllSources.length} analyses from all sources`);
          // Sort analyses by created_at in descending order (newest first)
          const sortedAnalyses = analysesFromAllSources.sort((a, b) => {
            const dateA = new Date(a.created_at || "1970-01-01");
            const dateB = new Date(b.created_at || "1970-01-01");
            return dateB.getTime() - dateA.getTime();
          });
          
          setAnalyses(sortedAnalyses);
        } else {
          console.warn("No analyses found for user");
        }
      } catch (err) {
        console.error("Error fetching comprehensive analyses:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        toast.error("Failed to retrieve your comprehensive reports");
      } finally {
        setIsLoading(false);
      }
    };
    
    // Function to fetch analyses from all possible sources
    const fetchFromAllSources = async () => {
      if (!user) return [];
      
      const results: any[] = [];
      const analysisIds = new Set();
      let foundError = false;
      
      // 1. First try: Direct query from the comprehensive_analyses table
      try {
        const { data: directData, error: directError } = await supabase
          .from('comprehensive_analyses')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (directError) {
          console.error("Error in direct query:", directError);
          foundError = true;
        } else if (directData && Array.isArray(directData)) {
          console.log(`Direct query found ${directData.length} analyses`);
          directData.forEach(item => {
            if (!analysisIds.has(item.id)) {
              analysisIds.add(item.id);
              results.push(item);
            }
          });
        }
      } catch (e) {
        console.error("Exception in direct query:", e);
        foundError = true;
      }
      
      // 2. Second try: Get analyses via assessments
      try {
        const { data: assessments, error: assessmentsError } = await supabase
          .from('comprehensive_assessments')
          .select('id')
          .eq('user_id', user.id);
          
        if (assessmentsError) {
          console.error("Error fetching assessments:", assessmentsError);
        } else if (assessments && Array.isArray(assessments) && assessments.length > 0) {
          console.log(`Found ${assessments.length} assessments, checking for analyses`);
          
          // For each assessment, check if there's a corresponding analysis
          for (const assessment of assessments) {
            try {
              // Fixed: Use .select('*') instead of .maybeSingle() to handle multiple results
              const { data: linkedAnalyses, error: linkedError } = await supabase
                .from('comprehensive_analyses')
                .select('*')
                .eq('assessment_id', assessment.id);
                
              if (linkedError) {
                console.error(`Error checking analysis for assessment ${assessment.id}:`, linkedError);
              } else if (linkedAnalyses && linkedAnalyses.length > 0) {
                console.log(`Found ${linkedAnalyses.length} analyses for assessment ${assessment.id}`);
                
                // Process each linked analysis
                linkedAnalyses.forEach(linkedAnalysis => {
                  if (!analysisIds.has(linkedAnalysis.id)) {
                    analysisIds.add(linkedAnalysis.id);
                    results.push(linkedAnalysis);
                  }
                });
              }
            } catch (assessErr) {
              console.error(`Error processing assessment ${assessment.id}:`, assessErr);
            }
          }
        }
      } catch (e) {
        console.error("Exception in assessments query:", e);
      }
      
      // 3. Third try: Query with no user filter as fallback
      if (results.length === 0) {
        try {
          const { data: allAnalyses, error: allError } = await supabase
            .from('comprehensive_analyses')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);
            
          if (allError) {
            console.error("Error in unfiltered query:", allError);
          } else if (allAnalyses && Array.isArray(allAnalyses)) {
            console.log(`Unfiltered query found ${allAnalyses.length} analyses`);
            
            // Filter client-side to find user's analyses
            const userAnalyses = allAnalyses.filter(a => a.user_id === user.id);
            userAnalyses.forEach(item => {
              if (!analysisIds.has(item.id)) {
                analysisIds.add(item.id);
                results.push(item);
              }
            });
          }
        } catch (e) {
          console.error("Exception in unfiltered query:", e);
        }
      }
      
      // 4. Try using the database function as another method
      try {
        // Get all analyses we have access to
        const { data: recentAnalyses, error: recentError } = await supabase
          .from('comprehensive_analyses')
          .select('id')
          .order('created_at', { ascending: false })
          .limit(20);
          
        if (!recentError && recentAnalyses && recentAnalyses.length > 0) {
          console.log(`Found ${recentAnalyses.length} recent analysis IDs, checking details`);
          
          // For each ID, try to get the full data using the RPC function
          for (const item of recentAnalyses) {
            try {
              const { data: analysisData, error: rpcError } = await supabase
                .rpc('get_comprehensive_analysis_by_id', { analysis_id: item.id });
                
              if (!rpcError && analysisData && !analysisIds.has(item.id)) {
                console.log(`Retrieved analysis ${item.id} via RPC function`);
                analysisIds.add(item.id);
                results.push(analysisData);
              }
            } catch (rpcErr) {
              // Continue to next item on error
            }
          }
        }
      } catch (recentErr) {
        console.error("Error fetching recent analyses:", recentErr);
      }
      
      console.log(`Total analyses found from all sources: ${results.length}`);
      
      // If we found no analyses but encountered errors, try to recover by generating a test analysis
      if (results.length === 0 && foundError && user) {
        toast.info("No analyses found. Auto-generating a test analysis...");
        try {
          const testAnalysis = await pollForAnalysis("test-" + Date.now());
          if (testAnalysis) {
            results.push(testAnalysis);
          }
        } catch (e) {
          console.error("Failed to generate test analysis:", e);
        }
      }
      
      return results;
    };

    fetchUserAnalyses();
  }, [user, pollForAnalysis]);

  const handleViewReport = (analysisId: string) => {
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
                  <p>Database connection: {supabase ? "Available" : "Not available"}</p>
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
            <FileText className="h-16 w-16 text-primary mx-auto mb-4" />
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
                <h3 className="text-lg font-medium mb-3">Previous Reports</h3>
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
