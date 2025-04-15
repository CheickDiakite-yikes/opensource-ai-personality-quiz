import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { ComprehensiveAnalysis } from "@/utils/types";
import { useAuth } from "@/contexts/AuthContext";
import { AlertTriangle, ArrowLeft, RefreshCw, Bug, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isRelationshipObject } from "@/components/report/utils/typeGuards";
import { safeString, ensureStringItems } from "@/utils/formatUtils";

// Import components
import ComprehensiveOverviewSection from "./sections/ComprehensiveOverviewSection";
import ComprehensiveTraitsSection from "./sections/ComprehensiveTraitsSection"; 
import ComprehensiveIntelligenceSection from "./sections/ComprehensiveIntelligenceSection";
import ComprehensiveMotivationSection from "./sections/ComprehensiveMotivationSection";
import ComprehensiveRelationshipsSection from "./sections/ComprehensiveRelationshipsSection";
import ComprehensiveGrowthSection from "./sections/ComprehensiveGrowthSection";
import ComprehensiveCareerSection from "./sections/ComprehensiveCareerSection";
import { useComprehensiveAnalysisFallback } from "@/hooks/useComprehensiveAnalysisFallback";

const ComprehensiveReportPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<ComprehensiveAnalysis | null>(null);
  const [analyses, setAnalyses] = useState<ComprehensiveAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [retryCount, setRetryCount] = useState<number>(0);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [isCreatingTest, setIsCreatingTest] = useState<boolean>(false);
  const [testPrompt, setTestPrompt] = useState<string>("");
  const [showAdvancedOptions, setShowAdvancedOptions] = useState<boolean>(false);
  const { pollForAnalysis, isPolling, foundAnalysis, fetchAllUserAnalyses } = useComprehensiveAnalysisFallback(id);
  const [requestLogs, setRequestLogs] = useState<string[]>([]);
  
  // Add request log with timestamp
  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp}: ${message}`;
    console.log(`ComprehensiveReportPage - ${logEntry}`);
    setRequestLogs(prev => [logEntry, ...prev.slice(0, 99)]);
  }, []);
  
  // If no id provided, we're on the landing page and should fetch all analyses
  useEffect(() => {
    if (!id && user) {
      const fetchAllAnalyses = async () => {
        setIsLoading(true);
        try {
          addLog(`Fetching all analyses for user ${user.id}`);
          
          // First try the edge function to get all analyses for the user
          try {
            addLog("Calling edge function for all user analyses");
            const { data: edgeData, error: edgeError } = await supabase.functions.invoke(
              "get-comprehensive-analysis",
              {
                method: 'POST',
                body: { 
                  user_id: user.id,
                  fetch_all: true 
                }
              }
            );
            
            if (edgeError) {
              addLog(`Edge function error fetching all analyses: ${JSON.stringify(edgeError)}`);
              throw new Error(`Edge function error: ${edgeError.message || JSON.stringify(edgeError)}`);
            } else if (edgeData && Array.isArray(edgeData)) {
              addLog(`Found ${edgeData.length} analyses via edge function`);
              setAnalyses(edgeData);
              setIsLoading(false);
              return;
            } else {
              addLog(`Edge function returned unexpected data format: ${JSON.stringify(edgeData)}`);
              throw new Error("Edge function returned unexpected data format");
            }
          } catch (edgeErr) {
            addLog(`Error calling edge function for all analyses: ${edgeErr instanceof Error ? edgeErr.message : String(edgeErr)}`);
            
            // Detailed error capture
            if (edgeErr instanceof Error) {
              setDebugInfo(prev => {
                const newInfo = {
                  timestamp: new Date().toISOString(),
                  message: edgeErr.message,
                  stack: edgeErr.stack,
                  name: edgeErr.name,
                  ...prev ? JSON.parse(prev) : {}
                };
                return JSON.stringify(newInfo, null, 2);
              });
            }
          }
          
          // Fallback to the hook method if edge function fails
          addLog("Edge function failed, falling back to hook method");
          const allAnalyses = await fetchAllUserAnalyses();
          
          if (allAnalyses && allAnalyses.length > 0) {
            addLog(`Hook method found ${allAnalyses.length} analyses`);
            setAnalyses(allAnalyses);
          } else {
            addLog("No analyses found for user with fallback method either");
          }
        } catch (error) {
          addLog(`Error fetching all analyses: ${error instanceof Error ? error.message : String(error)}`);
          setError("Failed to load your analyses. Please try refreshing the page.");
          
          // Detailed error capture
          setDebugInfo(JSON.stringify({
            error: error instanceof Error ? {
              message: error.message,
              stack: error.stack,
              name: error.name
            } : String(error),
            timestamp: new Date().toISOString(),
            userId: user?.id,
            route: "/comprehensive-report"
          }, null, 2));
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchAllAnalyses();
    }
  }, [user, id, fetchAllUserAnalyses, addLog]);
  
  // Primary fetch function that directly calls the edge function
  const fetchAnalysisFromEdgeFunction = useCallback(async (analysisId: string) => {
    if (!analysisId) return null;
    
    addLog(`Calling get-comprehensive-analysis edge function for ID: ${analysisId}`);
    try {
      const { data, error } = await supabase.functions.invoke(
        "get-comprehensive-analysis",
        {
          method: 'POST',
          body: { id: analysisId }
        }
      );
      
      if (error) {
        addLog(`Edge function error: ${JSON.stringify(error)}`);
        throw new Error(`Edge function error: ${error.message || JSON.stringify(error)}`);
      }
      
      if (!data) {
        addLog('No data returned from edge function');
        throw new Error('No data returned from edge function');
      }
      
      addLog(`Successfully retrieved analysis via edge function for ID: ${analysisId}`);
      return data as ComprehensiveAnalysis;
    } catch (err) {
      addLog(`Error calling edge function: ${err instanceof Error ? err.message : String(err)}`);
      
      // Detailed error capture
      if (err instanceof Error) {
        setDebugInfo(prev => {
          const newInfo = {
            timestamp: new Date().toISOString(),
            edgeFunctionError: {
              message: err.message,
              stack: err.stack,
              name: err.name
            },
            analysisId,
            ...prev ? JSON.parse(prev) : {}
          };
          return JSON.stringify(newInfo, null, 2);
        });
      }
      
      throw err;
    }
  }, [addLog]);

  // Load analysis when component mounts or ID changes
  useEffect(() => {
    if (!id) {
      // We're on the landing page, not the individual report page
      return;
    }
    
    let isMounted = true;
    
    const loadAnalysis = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        addLog(`Loading analysis with ID: ${id}`);
        toast.loading("Fetching your analysis...", { id: "loading-analysis" });
        
        // First try: Direct edge function call (this is now our primary method)
        try {
          addLog("Attempting to fetch analysis with direct edge function call");
          const analysisData = await fetchAnalysisFromEdgeFunction(id);
          if (analysisData && isMounted) {
            addLog(`Analysis loaded successfully: ${analysisData.id}`);
            setAnalysis(analysisData);
            setIsLoading(false);
            toast.success("Analysis loaded successfully", { id: "loading-analysis" });
            return;
          }
        } catch (edgeError) {
          addLog(`Edge function fetch failed: ${edgeError instanceof Error ? edgeError.message : String(edgeError)}`);
          // Continue with fallback methods
        }
        
        // If edge function fails or returns no data, try polling approach
        if (isMounted && !analysis) {
          addLog("Edge function approach failed, trying polling mechanism");
          const polledAnalysis = await pollForAnalysis(id);
          
          if (polledAnalysis && isMounted) {
            addLog(`Analysis found via polling: ${polledAnalysis.id}`);
            setAnalysis(polledAnalysis);
            setIsLoading(false);
            toast.success("Analysis found", { id: "loading-analysis" });
            return;
          }
        }
        
        // If we get here, both approaches failed
        if (isMounted) {
          const errorMessage = `Could not find analysis with ID: ${id}`;
          addLog(errorMessage);
          setError(errorMessage);
          toast.error("Analysis not found", { 
            id: "loading-analysis", 
            description: "The analysis ID does not exist or you may not have access to it." 
          });
          
          // Add diagnostic information
          setDebugInfo(JSON.stringify({
            timestamp: new Date().toISOString(),
            analysisId: id,
            userId: user?.id,
            requestInfo: {
              attempts: retryCount,
              methods: ["edge-function", "polling"],
              isPolling: isPolling
            }
          }, null, 2));
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
          addLog(`Error loading analysis: ${errorMessage}`);
          setError(errorMessage);
          
          toast.error("Error loading analysis", { 
            id: "loading-analysis", 
            description: errorMessage 
          });
          
          // Detailed error capture
          setDebugInfo(JSON.stringify({
            error: err instanceof Error ? {
              message: err.message,
              stack: err.stack,
              name: err.name
            } : String(err),
            id: id,
            timestamp: new Date().toISOString(),
            userId: user?.id,
            route: `/comprehensive-report/${id}`
          }, null, 2));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    loadAnalysis();
    
    return () => {
      isMounted = false;
    };
  }, [id, pollForAnalysis, retryCount, fetchAnalysisFromEdgeFunction, analysis, isPolling, user, addLog]);
  
  // Update local state if foundAnalysis changes via polling
  useEffect(() => {
    if (foundAnalysis && !analysis) {
      addLog(`Found analysis via polling: ${foundAnalysis.id}`);
      setAnalysis(foundAnalysis);
      setError(null);
    }
  }, [foundAnalysis, analysis, addLog]);
  
  const handleRetry = () => {
    addLog(`Manually retrying analysis load, attempt #${retryCount + 1}`);
    setRetryCount(prev => prev + 1);
    setError(null);
    toast.loading("Retrying analysis load...");
  };
  
  const handleGoBack = () => {
    addLog("Navigating back to reports list");
    navigate('/comprehensive-report');
  };
  
  const handleManualRefresh = async () => {
    addLog("Manual refresh requested");
    setIsLoading(true);
    toast.loading("Refreshing analyses...", { id: "refresh-toast" });
    
    try {
      // Fetch all user analyses using edge function
      addLog(`Fetching all analyses for user ${user?.id} via edge function`);
      const { data: edgeData, error: edgeError } = await supabase.functions.invoke(
        "get-comprehensive-analysis",
        {
          method: 'POST',
          body: { 
            user_id: user?.id,
            fetch_all: true 
          }
        }
      );
      
      if (edgeError) {
        addLog(`Edge function error during refresh: ${JSON.stringify(edgeError)}`);
        toast.error("Error refreshing analyses", { id: "refresh-toast" });
      } else if (edgeData && Array.isArray(edgeData)) {
        addLog(`Found ${edgeData.length} analyses during refresh`);
        setAnalyses(edgeData);
        toast.success(`Found ${edgeData.length} analyses`, { id: "refresh-toast" });
      } else {
        addLog("No analyses found during refresh");
        toast.error("No analyses found", { id: "refresh-toast" });
      }
    } catch (error) {
      addLog(`Error during manual refresh: ${error instanceof Error ? error.message : String(error)}`);
      toast.error("Failed to refresh analyses", { id: "refresh-toast" });
      
      // Detailed error capture
      if (error instanceof Error) {
        setDebugInfo(prev => {
          const newInfo = {
            timestamp: new Date().toISOString(),
            refreshError: {
              message: error.message,
              stack: error.stack,
              name: error.name
            },
            userId: user?.id,
            ...prev ? JSON.parse(prev) : {}
          };
          return JSON.stringify(newInfo, null, 2);
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Test analysis creation function
  const handleCreateTestAnalysis = async () => {
    if (!user) {
      toast.error("You must be logged in to create a test analysis");
      return;
    }
    
    setIsCreatingTest(true);
    try {
      addLog("Creating test analysis");
      toast.loading("Creating test analysis...", { id: "test-analysis" });
      
      // Create a test assessment first
      addLog("Creating test assessment record");
      const { data: assessmentData, error: assessmentError } = await supabase
        .from("comprehensive_assessments")
        .insert({
          user_id: user.id,
          responses: [
            { 
              questionId: "test-1", 
              answer: testPrompt || "I am someone who enjoys thinking deeply about problems and finding creative solutions. I value both analytical thinking and emotional intelligence."
            },
            { questionId: "test-2", answer: "I prefer working in collaborative environments where ideas can be freely shared." }
          ]
        })
        .select()
        .single();
        
      if (assessmentError || !assessmentData) {
        addLog(`Failed to create test assessment: ${JSON.stringify(assessmentError)}`);
        throw new Error(`Failed to create test assessment: ${assessmentError?.message || "Unknown error"}`);
      }
      
      addLog(`Created test assessment: ${assessmentData.id}`);
      
      // Setup timeout for the request (60 seconds)
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Analysis request timed out")), 60000)
      );
      
      // Call the edge function
      addLog("Calling analyze-comprehensive-responses edge function");
      const analysisPromise = supabase.functions.invoke(
        "analyze-comprehensive-responses",
        {
          body: { 
            assessmentId: assessmentData.id,
            responses: [
              { 
                questionId: "test-1", 
                answer: testPrompt || "I am someone who enjoys thinking deeply about problems and finding creative solutions. I value both analytical thinking and emotional intelligence."
              },
              { questionId: "test-2", answer: "I prefer working in collaborative environments where ideas can be freely shared." }
            ]
          }
        }
      );
      
      try {
        // Race between the analysis request and the timeout
        const { data, error } = await Promise.race([
          analysisPromise,
          timeoutPromise.then(() => {
            throw new Error("Analysis timed out, but your assessment was saved. You can try viewing it later.");
          })
        ]) as any;
        
        if (error) {
          addLog(`Edge function error during analysis: ${JSON.stringify(error)}`);
          throw new Error(error.message);
        }
        
        if (!data?.analysisId) {
          addLog(`Analysis completed but no analysis ID was returned: ${JSON.stringify(data)}`);
          throw new Error("Analysis completed but no analysis ID was returned");
        }
        
        addLog(`Test analysis created successfully: ${data.analysisId}`);
        toast.success("Test analysis created!", { 
          id: "test-analysis",
          description: `Analysis ID: ${data.analysisId}`
        });
        
        // Navigate to the new analysis
        navigate(`/comprehensive-report/${data.analysisId}`);
      } catch (timeoutError) {
        addLog(`Analysis timed out: ${timeoutError instanceof Error ? timeoutError.message : String(timeoutError)}`);
        toast.warning("Analysis is taking longer than expected", { 
          id: "test-analysis",
          description: "Your test has been saved. We'll try to retrieve the results."
        });
        
        // Since we have the assessment ID, we can navigate to it and let the page try to poll for completion
        navigate(`/comprehensive-report/${assessmentData.id}`);
      }
      
    } catch (err) {
      addLog(`Error creating test analysis: ${err instanceof Error ? err.message : String(err)}`);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      
      toast.error("Failed to create test analysis", { 
        id: "test-analysis",
        description: errorMessage
      });
      
      // Detailed error capture
      if (err instanceof Error) {
        setDebugInfo(JSON.stringify({
          timestamp: new Date().toISOString(),
          testAnalysisError: {
            message: err.message,
            stack: err.stack,
            name: err.name
          },
          userId: user?.id,
          customPrompt: !!testPrompt
        }, null, 2));
      }
    } finally {
      setIsCreatingTest(false);
    }
  };
  
  // Render landing page with list of all analyses (if no id provided)
  if (!id) {
    return (
      <div className="container py-6 md:py-10 px-4 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Comprehensive Reports</h1>
          <p className="text-muted-foreground">
            View your detailed personality analysis reports
          </p>
        </div>
        
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualRefresh}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-full rounded-md" />
            <Skeleton className="h-16 w-full rounded-md" />
            <Skeleton className="h-16 w-full rounded-md" />
          </div>
        ) : error ? (
          <Card className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error Loading Reports</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={handleRetry}>Try Again</Button>
            
            {debugInfo && (
              <div className="mt-6 p-4 border rounded-md bg-muted/30">
                <p className="font-medium text-sm mb-2">Debug Information:</p>
                <pre className="text-xs overflow-auto max-h-48 p-2 bg-background/80 rounded whitespace-pre-wrap">
                  {debugInfo}
                </pre>
              </div>
            )}
            
            {requestLogs.length > 0 && (
              <div className="mt-6 p-4 border rounded-md bg-muted/30">
                <p className="font-medium text-sm mb-2">Request Logs:</p>
                <pre className="text-xs overflow-auto max-h-48 p-2 bg-background/80 rounded whitespace-pre-wrap">
                  {requestLogs.join('\n')}
                </pre>
              </div>
            )}
          </Card>
        ) : analyses.length > 0 ? (
          <div className="space-y-4">
            {analyses.map((item) => (
              <Card 
                key={item.id} 
                className="p-4 hover:bg-secondary/5 transition-colors cursor-pointer"
                onClick={() => navigate(`/comprehensive-report/${item.id}`)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">
                      {new Date(item.created_at).toLocaleDateString('en-US', {
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate max-w-xl">
                      {item.overview 
                        ? item.overview.substring(0, 100) + (item.overview.length > 100 ? '...' : '')
                        : 'No overview available'}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="whitespace-nowrap">
                    View Report
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <h2 className="text-xl mb-4">No Analyses Found</h2>
            <p className="text-muted-foreground mb-6">
              You don't have any comprehensive personality analyses yet.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Button onClick={() => navigate("/comprehensive-assessment")}>
                Take Assessment
              </Button>
              {user && (
                <Button 
                  variant="outline" 
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                >
                  Create Test Analysis
                </Button>
              )}
            </div>
            
            {showAdvancedOptions && (
              <div className="mt-8 p-6 bg-muted rounded-md max-w-lg mx-auto">
                <h3 className="font-medium mb-3">Create Test Analysis</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="testPrompt" className="block text-sm font-medium mb-1">
                      Custom Personality Description (Optional)
                    </label>
                    <textarea 
                      id="testPrompt"
                      value={testPrompt}
                      onChange={(e) => setTestPrompt(e.target.value)}
                      placeholder="Describe your personality traits, preferences, and characteristics..."
                      className="w-full p-3 border rounded-md h-24"
                    />
                  </div>
                  <Button 
                    onClick={handleCreateTestAnalysis} 
                    disabled={isCreatingTest}
                    className="w-full"
                  >
                    {isCreatingTest ? "Creating..." : "Generate Test Analysis"}
                  </Button>
                </div>
              </div>
            )}
            
            {requestLogs.length > 0 && (
              <div className="mt-6 p-4 border rounded-md bg-muted/30">
                <p className="font-medium text-sm mb-2">Request Logs:</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="mb-2"
                  onClick={() => setRequestLogs([])}
                >
                  Clear Logs
                </Button>
                <pre className="text-xs overflow-auto max-h-48 p-2 bg-background/80 rounded whitespace-pre-wrap">
                  {requestLogs.join('\n')}
                </pre>
              </div>
            )}
          </Card>
        )}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container py-6 md:py-10 px-4 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Comprehensive Report</h1>
          <Skeleton className="h-6 w-40 mx-auto" />
        </div>
        
        <Card className="p-8">
          <div className="space-y-4 max-w-3xl mx-auto">
            <Skeleton className="h-8 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            
            <div className="py-4">
              <Skeleton className="h-36 w-full rounded-md" />
            </div>
            
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/6" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </Card>
      </div>
    );
  }

  // Error state
  if (error && !isPolling) {
    return (
      <div className="container py-6 md:py-10 px-4 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Comprehensive Report</h1>
          <p className="text-muted-foreground">
            ID: {id || "No report ID provided"}
          </p>
        </div>
        
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-destructive" />
            <h2 className="text-xl font-semibold">Unable to Load Report</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              {error}
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Button variant="outline" onClick={handleGoBack} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Back to Reports
              </Button>
              <Button onClick={handleRetry} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" /> Try Again
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)} 
                className="flex items-center gap-2"
              >
                <Bug className="h-4 w-4" /> Advanced Options
              </Button>
            </div>
            
            {showAdvancedOptions && (
              <div className="mt-6 p-6 bg-muted rounded-md w-full max-w-lg mx-auto">
                <h3 className="font-medium mb-3">Create Test Analysis</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="testPrompt" className="block text-sm font-medium mb-1">
                      Custom Personality Description (Optional)
                    </label>
                    <textarea 
                      id="testPrompt"
                      value={testPrompt}
                      onChange={(e) => setTestPrompt(e.target.value)}
                      placeholder="Describe your personality traits, preferences, and characteristics..."
                      className="w-full p-3 border rounded-md h-24"
                    />
                  </div>
                  <Button 
                    onClick={handleCreateTestAnalysis} 
                    disabled={isCreatingTest}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    {isCreatingTest ? "Creating..." : "Generate Test Analysis"}
                  </Button>
                </div>
              </div>
            )}
            
            {debugInfo && (
              <div className="mt-6 p-4 bg-muted rounded-md w-full max-w-lg mx-auto">
                <p className="text-sm font-medium mb-2">Debug Information:</p>
                <pre className="text-xs overflow-auto text-left whitespace-pre-wrap max-h-64">
                  {debugInfo}
                </pre>
              </div>
            )}
            
            {requestLogs.length > 0 && (
              <div className="mt-6 p-4 border rounded-md bg-muted/30 w-full max-w-lg mx-auto">
                <p className="font-medium text-sm mb-2">Request Logs:</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="mb-2"
                  onClick={() => setRequestLogs([])}
                >
                  Clear Logs
                </Button>
                <pre className="text-xs overflow-auto max-h-48 p-2 bg-background/80 rounded whitespace-pre-wrap">
                  {requestLogs.join('\n')}
                </pre>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  }

  // No analysis state with option to create a test
  if (!analysis && !isPolling) {
    return (
      <div className="container py-6 md:py-10 px-4 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Comprehensive Report</h1>
          <p className="text-muted-foreground">
            ID: {id || "No report ID provided"}
          </p>
        </div>
        
        <Card className="p-8 text-center">
          <h2 className="text-xl mb-4">No Analysis Found</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't find a comprehensive analysis with the provided ID.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="outline" onClick={handleGoBack} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Reports
            </Button>
            {user && (
              <Button 
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)} 
                className="flex items-center gap-2"
              >
                <Bug className="h-4 w-4" /> {showAdvancedOptions ? "Hide Options" : "Create Test Analysis"}
              </Button>
            )}
          </div>
          
          {showAdvancedOptions && (
            <div className="mt-8 p-6 bg-muted rounded-md max-w-lg mx-auto">
              <h3 className="font-medium mb-3">Create Test Analysis</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="testPrompt" className="block text-sm font-medium mb-1">
                    Custom Personality Description (Optional)
                  </label>
                  <textarea 
                    id="testPrompt"
                    value={testPrompt}
                    onChange={(e) => setTestPrompt(e.target.value)}
                    placeholder="Describe your personality traits, preferences, and characteristics..."
                    className="w-full p-3 border rounded-md h-24"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    The AI will analyze this text to generate a detailed personality profile.
                  </p>
                </div>
                <Button 
                  onClick={handleCreateTestAnalysis} 
                  disabled={isCreatingTest}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  {isCreatingTest ? "Creating..." : "Generate Test Analysis"}
                </Button>
              </div>
            </div>
          )}
          
          {requestLogs.length > 0 && (
            <div className="mt-6 p-4 border rounded-md bg-muted/30">
              <p className="font-medium text-sm mb-2">Request Logs:</p>
              <Button 
                variant="outline" 
                size="sm"
                className="mb-2"
                onClick={() => setRequestLogs([])}
              >
                Clear Logs
              </Button>
              <pre className="text-xs overflow-auto max-h-48 p-2 bg-background/80 rounded whitespace-pre-wrap">
                {requestLogs.join('\n')}
              </pre>
            </div>
          )}
        </Card>
      </div>
    );
  }

  // When polling but no analysis found yet
  if (!analysis && isPolling) {
    return (
      <div className="container py-6 md:py-10 px-4 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Processing Your Analysis</h1>
          <p className="text-muted-foreground">
            ID: {id || "No report ID provided"}
          </p>
        </div>
