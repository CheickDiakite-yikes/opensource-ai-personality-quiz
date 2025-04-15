
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [retryCount, setRetryCount] = useState<number>(0);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [isCreatingTest, setIsCreatingTest] = useState<boolean>(false);
  const [testPrompt, setTestPrompt] = useState<string>("");
  const [showAdvancedOptions, setShowAdvancedOptions] = useState<boolean>(false);
  const [fetchComplete, setFetchComplete] = useState<boolean>(false);
  const { pollForAnalysis, isPolling, foundAnalysis, hasAttemptedPolling } = useComprehensiveAnalysisFallback(id);
  
  // Enhanced function to fetch comprehensive analysis with better error handling
  const fetchComprehensiveAnalysis = useCallback(async (analysisId: string) => {
    if (!analysisId) {
      return null;
    }

    try {
      console.log(`Fetching comprehensive analysis with ID: ${analysisId}`);
      
      // First check if it exists directly in the database
      const { data: directData, error: directError } = await supabase
        .from('comprehensive_analyses')
        .select('*')
        .eq('id', analysisId)
        .maybeSingle();
      
      if (directData && !directError) {
        console.log("Found analysis directly in database");
        return directData as unknown as ComprehensiveAnalysis;
      }
      
      // Also check if it exists as an assessment ID
      const { data: byAssessmentId, error: assessmentError } = await supabase
        .from('comprehensive_analyses')
        .select('*')
        .eq('assessment_id', analysisId)
        .maybeSingle();
        
      if (byAssessmentId && !assessmentError) {
        console.log("Found analysis by assessment ID");
        return byAssessmentId as unknown as ComprehensiveAnalysis;
      }
      
      // If we still haven't found it, try the edge function with a timeout
      try {
        // Set up timeout for the request (10 seconds)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        // Call the edge function to get the comprehensive analysis
        const { data, error: functionError } = await supabase.functions.invoke(
          "get-comprehensive-analysis",
          {
            body: { id: analysisId }
          }
        );
        
        clearTimeout(timeoutId);

        if (functionError) {
          console.error("Function error:", functionError);
          throw new Error(`Edge function error: ${functionError.message}`);
        }

        if (!data) {
          throw new Error("No analysis data returned from edge function");
        }

        console.log("Comprehensive analysis data:", data);
        
        // Check for message indicating fallback to most recent analysis
        if (data.message) {
          toast.info(data.message);
        }
        
        return data as ComprehensiveAnalysis;
      } catch (edgeFuncError) {
        console.error("Edge function error:", edgeFuncError);
        
        // If it's a timeout, try one more approach
        if (edgeFuncError.name === 'AbortError') {
          console.log("Edge function request timed out, trying direct DB query for most recent analysis");
          
          // If all else fails, get the most recent analysis
          const { data: recentAnalysis } = await supabase
            .from('comprehensive_analyses')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
            
          if (recentAnalysis) {
            toast.info("Using most recent analysis as fallback");
            return recentAnalysis as unknown as ComprehensiveAnalysis;
          }
        }
        
        throw edgeFuncError;
      }
    } catch (err) {
      console.error("Error fetching comprehensive analysis:", err);
      throw err;
    }
  }, []);

  // Fetch comprehensive analysis
  useEffect(() => {
    if (fetchComplete || foundAnalysis) return;
    
    let isMounted = true;
    
    async function loadAnalysis() {
      if (!id) {
        if (isMounted) {
          setIsLoading(false);
          setError("No analysis ID provided");
          setFetchComplete(true);
        }
        return;
      }

      try {
        const data = await fetchComprehensiveAnalysis(id);
        if (data && isMounted) {
          setAnalysis(data);
          setFetchComplete(true);
        } else if (isMounted && !isPolling && !hasAttemptedPolling) {
          // If we couldn't load the analysis directly, check if it's an assessment ID
          // and try to poll for its completion
          toast.info("Checking if analysis is still processing...");
          pollForAnalysis(id);
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : "Failed to load analysis";
          setError(errorMessage);
          setDebugInfo(JSON.stringify(err, null, 2));
          setFetchComplete(true);
          
          // Only show error toast if we're not already polling
          if (!isPolling && !hasAttemptedPolling) {
            toast.error("Failed to load analysis", {
              description: "There was a problem retrieving your comprehensive analysis"
            });
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadAnalysis();
    
    return () => {
      isMounted = false;
    };
  }, [id, retryCount, fetchComprehensiveAnalysis, pollForAnalysis, isPolling, hasAttemptedPolling, foundAnalysis, fetchComplete]);
  
  // Update analysis when foundAnalysis changes
  useEffect(() => {
    if (foundAnalysis && !analysis) {
      setAnalysis(foundAnalysis);
      setFetchComplete(true);
      setError(null);
    }
  }, [foundAnalysis, analysis]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setFetchComplete(false);
    toast.loading("Retrying analysis load...");
  };
  
  const handleGoBack = () => {
    navigate('/comprehensive-report');
  };
  
  // Enhanced createTestAnalysis with better timeout handling
  const handleCreateTestAnalysis = async () => {
    if (!user) {
      toast.error("You must be logged in to create a test analysis");
      return;
    }
    
    setIsCreatingTest(true);
    try {
      toast.loading("Creating test analysis...", { id: "test-analysis" });
      
      // Create a test assessment first
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
        throw new Error(`Failed to create test assessment: ${assessmentError?.message || "Unknown error"}`);
      }
      
      console.log("Created test assessment:", assessmentData);
      
      // Setup timeout for the request (60 seconds)
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Analysis request timed out")), 60000)
      );
      
      // Call the edge function
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
        
        if (error) throw new Error(error.message);
        
        if (!data?.analysisId) {
          throw new Error("Analysis completed but no analysis ID was returned");
        }
        
        toast.success("Test analysis created!", { 
          id: "test-analysis",
          description: `Analysis ID: ${data.analysisId}`
        });
        
        // Navigate to the new analysis
        navigate(`/comprehensive-report/${data.analysisId}`);
      } catch (timeoutError) {
        console.error("Analysis timed out:", timeoutError);
        toast.warning("Analysis is taking longer than expected", { 
          id: "test-analysis",
          description: "Your test has been saved. We'll try to retrieve the results."
        });
        
        // Since we have the assessment ID, we can navigate to it and let the page try to poll for completion
        navigate(`/comprehensive-report/${assessmentData.id}`);
      }
      
    } catch (err) {
      console.error("Error creating test analysis:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      
      toast.error("Failed to create test analysis", { 
        id: "test-analysis",
        description: errorMessage
      });
      
      setDebugInfo(JSON.stringify(err, null, 2));
    } finally {
      setIsCreatingTest(false);
    }
  };

  // Loading state
  if (isLoading && !fetchComplete) {
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
                <pre className="text-xs overflow-auto text-left whitespace-pre-wrap">
                  {debugInfo}
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
        
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <h2 className="text-xl font-semibold">Analysis in Progress</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Your comprehensive analysis is currently being processed. This may take a few minutes as our AI generates detailed insights.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // Process data for safe rendering
  const processedRelationships = isRelationshipObject(analysis?.relationshipPatterns) 
    ? analysis.relationshipPatterns 
    : { 
        strengths: Array.isArray(analysis?.relationshipPatterns) ? ensureStringItems(analysis?.relationshipPatterns) : [],
        challenges: [],
        compatibleTypes: []
      };

  // Ensure all arrays have default values and are properly stringified
  const safeMotivators = ensureStringItems(analysis?.motivators || []);
  const safeInhibitors = ensureStringItems(analysis?.inhibitors || []);
  const safeGrowthAreas = ensureStringItems(analysis?.growthAreas || []);
  const safeWeaknesses = ensureStringItems(analysis?.weaknesses || []);
  const safeLearningPathways = ensureStringItems(analysis?.learningPathways || []);
  const safeCareerSuggestions = ensureStringItems(analysis?.careerSuggestions || []);

  // Render analysis data
  return (
    <div className="container py-6 md:py-10 px-4 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Comprehensive Report</h1>
        <p className="text-muted-foreground">
          Analysis ID: {safeString(analysis?.id)}
        </p>
      </div>
      
      {/* Report navigation tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="personality">Traits</TabsTrigger>
          <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
          <TabsTrigger value="motivation">Motivators</TabsTrigger>
          <TabsTrigger value="relationships">Relationships</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="career">Career</TabsTrigger>
        </TabsList>
        
        {/* Tab content sections */}
        <TabsContent value="overview" className="space-y-6">
          <ComprehensiveOverviewSection 
            overview={safeString(analysis?.overview)}
            traits={analysis?.traits}
            intelligenceScore={analysis?.intelligenceScore}
            emotionalIntelligenceScore={analysis?.emotionalIntelligenceScore}
            motivators={safeMotivators}
            growthAreas={safeGrowthAreas}
          />
        </TabsContent>
        
        <TabsContent value="personality" className="space-y-6">
          <ComprehensiveTraitsSection
            traits={analysis?.traits || []}
          />
        </TabsContent>
        
        <TabsContent value="intelligence" className="space-y-6">
          <ComprehensiveIntelligenceSection
            intelligence={analysis?.intelligence}
            intelligenceScore={analysis?.intelligenceScore}
            emotionalIntelligenceScore={analysis?.emotionalIntelligenceScore}
          />
        </TabsContent>
        
        <TabsContent value="motivation" className="space-y-6">
          <ComprehensiveMotivationSection
            motivators={safeMotivators}
            inhibitors={safeInhibitors}
          />
        </TabsContent>
        
        <TabsContent value="relationships" className="space-y-6">
          <ComprehensiveRelationshipsSection
            relationshipPatterns={processedRelationships}
          />
        </TabsContent>
        
        <TabsContent value="growth" className="space-y-6">
          <ComprehensiveGrowthSection
            growthAreas={safeGrowthAreas}
            weaknesses={safeWeaknesses}
            learningPathways={safeLearningPathways}
          />
        </TabsContent>
        
        <TabsContent value="career" className="space-y-6">
          <ComprehensiveCareerSection
            careerSuggestions={safeCareerSuggestions}
            roadmap={safeString(analysis?.roadmap || "")}
          />
        </TabsContent>
      </Tabs>
      
      {/* Footer navigation */}
      <div className="flex flex-wrap gap-4 justify-center mt-8">
        <Button variant="outline" onClick={handleGoBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Reports List
        </Button>
        {user && (
          <Button 
            variant="secondary" 
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            className="flex items-center gap-2"
          >
            {showAdvancedOptions ? (
              <>
                <Bug className="h-4 w-4" /> Hide Options
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Create New Test Analysis
              </>
            )}
          </Button>
        )}
      </div>
      
      {/* Advanced options panel */}
      {showAdvancedOptions && (
        <Card className="p-6 mt-4 max-w-lg mx-auto">
          <h3 className="text-lg font-medium mb-3">Create New Test Analysis</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="newTestPrompt" className="block text-sm font-medium mb-1">
                Custom Personality Description
              </label>
              <textarea 
                id="newTestPrompt"
                value={testPrompt}
                onChange={(e) => setTestPrompt(e.target.value)}
                placeholder="Describe your personality traits, preferences, and characteristics for the AI to analyze..."
                className="w-full p-3 border rounded-md h-24"
              />
              <p className="text-xs text-muted-foreground mt-1">
                The more detailed your description, the more accurate the analysis will be.
              </p>
            </div>
            <Button 
              onClick={handleCreateTestAnalysis} 
              disabled={isCreatingTest}
              className="w-full"
            >
              {isCreatingTest ? "Creating..." : "Generate New Analysis"}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ComprehensiveReportPage;
