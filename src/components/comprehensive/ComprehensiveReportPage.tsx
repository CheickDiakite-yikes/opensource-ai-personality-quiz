
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  RefreshCw, 
  AlertTriangle,
  FileText,
  Brain,
  Heart,
  Dumbbell,
  Lightbulb,
  GraduationCap
} from "lucide-react";
import { ComprehensiveAnalysis } from "@/utils/types";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useAuth } from "@/contexts/AuthContext";

const ComprehensiveReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState<ComprehensiveAnalysis | null>(null);
  const [analyses, setAnalyses] = useState<ComprehensiveAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingAllAnalyses, setIsLoadingAllAnalyses] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string>("overview");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Function to fetch a specific analysis by ID
  const fetchAnalysisById = useCallback(async (analysisId: string) => {
    try {
      console.log(`Fetching comprehensive analysis with ID: ${analysisId}`);
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke(
        "get-comprehensive-analysis",
        {
          method: 'POST',
          body: { id: analysisId }
        }
      );
      
      if (error) {
        console.error("Error fetching analysis:", error);
        setError(`Failed to load analysis: ${error.message}`);
        setAnalysis(null);
      } else if (!data) {
        console.error("No analysis data returned");
        setError("No analysis data found");
        setAnalysis(null);
      } else {
        console.log("Analysis data retrieved:", data);
        setAnalysis(data as ComprehensiveAnalysis);
        setError(null);
      }
    } catch (err) {
      console.error("Exception in fetchAnalysisById:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      setAnalysis(null);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Function to fetch all analyses for the current user
  const fetchAllAnalyses = useCallback(async () => {
    if (!user) return;
    
    try {
      console.log(`Fetching all analyses for user: ${user.id}`);
      setIsLoadingAllAnalyses(true);
      
      const { data, error } = await supabase.functions.invoke(
        "get-comprehensive-analysis",
        {
          method: 'POST',
          body: { 
            user_id: user.id,
            fetch_all: true
          }
        }
      );
      
      if (error) {
        console.error("Error fetching all analyses:", error);
        toast.error("Failed to load your analyses");
      } else if (!data || !Array.isArray(data) || data.length === 0) {
        console.log("No analyses found for user");
        setAnalyses([]);
      } else {
        console.log(`Found ${data.length} analyses for user`);
        
        // Sort by creation date (newest first)
        const sortedAnalyses = [...data].sort((a, b) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        
        setAnalyses(sortedAnalyses as ComprehensiveAnalysis[]);
        
        // If no specific ID is provided, use the most recent analysis
        if (!id && sortedAnalyses.length > 0) {
          const latestId = sortedAnalyses[0].id;
          navigate(`/comprehensive-report/${latestId}`, { replace: true });
        }
      }
    } catch (err) {
      console.error("Exception in fetchAllAnalyses:", err);
      toast.error("Error loading analyses");
    } finally {
      setIsLoadingAllAnalyses(false);
    }
  }, [user, navigate, id]);
  
  // Handle manual refresh
  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    toast.loading("Refreshing analysis data...", { id: "refresh-toast" });
    
    try {
      await fetchAllAnalyses();
      
      if (id) {
        await fetchAnalysisById(id);
        toast.success("Analysis refreshed", { id: "refresh-toast" });
      } else {
        toast.success("Analyses list refreshed", { id: "refresh-toast" });
      }
    } catch (err) {
      console.error("Error during refresh:", err);
      toast.error("Failed to refresh analysis", { id: "refresh-toast" });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Fetch data when component mounts or ID changes
  useEffect(() => {
    if (id) {
      fetchAnalysisById(id);
    }
  }, [id, fetchAnalysisById]);
  
  // Fetch all analyses when component mounts or user changes
  useEffect(() => {
    fetchAllAnalyses();
  }, [fetchAllAnalyses]);
  
  // Render a loading state
  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>
        
        <Card className="w-full mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12">
              <LoadingSpinner size="lg" />
              <p className="text-muted-foreground mt-4">Loading your comprehensive analysis...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Render an error state
  if (error) {
    return (
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>
        
        <Card className="w-full mb-6 border-red-200">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Error Loading Analysis</h2>
              <p className="text-muted-foreground mb-6">{error}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={() => fetchAnalysisById(id || '')}>
                  Try Again
                </Button>
                <Button variant="outline" onClick={() => navigate("/comprehensive-report")}>
                  Back to Reports
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // If no analysis is available and not loading, redirect to the landing page
  if (!analysis && !isLoading) {
    return (
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>
        
        <Card className="w-full mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-primary mb-4" />
              <h2 className="text-2xl font-bold mb-2">No Analysis Found</h2>
              <p className="text-muted-foreground mb-6">
                We couldn't find the analysis you're looking for. Please try taking the comprehensive assessment.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={() => navigate("/comprehensive-assessment")}>
                  Take Assessment
                </Button>
                <Button variant="outline" onClick={() => navigate("/comprehensive-report")}>
                  View All Reports
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container py-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {/* Analysis Header Card */}
      <Card className="w-full mb-6">
        <CardContent className="pt-6">
          <h1 className="text-2xl font-bold mb-2">Comprehensive Personality Analysis</h1>
          <p className="text-muted-foreground mb-4">
            {new Date(analysis?.created_at || '').toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          
          {analyses.length > 1 && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Previous reports:</p>
              <div className="flex flex-wrap gap-2">
                {analyses.slice(0, 5).map((a, index) => (
                  <Button 
                    key={a.id}
                    variant={a.id === id ? "default" : "outline"} 
                    size="sm"
                    onClick={() => navigate(`/comprehensive-report/${a.id}`)}
                  >
                    {index === 0 ? 'Latest' : `Report ${index + 1}`}
                  </Button>
                ))}
                
                {analyses.length > 5 && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate('/comprehensive-report')}
                  >
                    View all ({analyses.length})
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Tabs */}
      <Tabs 
        defaultValue="overview" 
        value={selectedTab} 
        onValueChange={setSelectedTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="overview" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Overview</span>
            <span className="sm:hidden">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="intelligence" className="flex items-center">
            <Brain className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Intelligence</span>
            <span className="sm:hidden">Intel</span>
          </TabsTrigger>
          <TabsTrigger value="traits" className="flex items-center">
            <Heart className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Traits</span>
            <span className="sm:hidden">Traits</span>
          </TabsTrigger>
          <TabsTrigger value="growth" className="flex items-center">
            <Dumbbell className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Growth</span>
            <span className="sm:hidden">Growth</span>
          </TabsTrigger>
          <TabsTrigger value="career" className="flex items-center">
            <GraduationCap className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Career</span>
            <span className="sm:hidden">Career</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personality Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap">
                {analysis?.overview || "No overview available."}
              </div>
            </CardContent>
          </Card>
          
          {/* Motivators & Inhibitors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Motivators</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2">
                  {analysis?.motivators && Array.isArray(analysis.motivators) && analysis.motivators.length > 0 ? (
                    analysis.motivators.map((motivator, index) => (
                      <li key={index}>{motivator}</li>
                    ))
                  ) : (
                    <li>No motivators identified.</li>
                  )}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Potential Inhibitors</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2">
                  {analysis?.inhibitors && Array.isArray(analysis.inhibitors) && analysis.inhibitors.length > 0 ? (
                    analysis.inhibitors.map((inhibitor, index) => (
                      <li key={index}>{inhibitor}</li>
                    ))
                  ) : (
                    <li>No inhibitors identified.</li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Intelligence Tab */}
        <TabsContent value="intelligence" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Intelligence Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold text-primary">
                    {analysis?.intelligenceScore || 0}/10
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Intelligence Score
                  </p>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold text-primary">
                    {analysis?.emotionalIntelligenceScore || 0}/10
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Emotional Intelligence
                  </p>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Cognitive Style</h3>
                <p className="whitespace-pre-wrap">
                  {analysis?.intelligence && typeof analysis.intelligence === 'object' 
                    ? (analysis.intelligence as any).cognitiveStyle || "No information available."
                    : "No information available."}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Traits Tab */}
        <TabsContent value="traits" className="space-y-6">
          {analysis?.traits && Array.isArray(analysis.traits) && analysis.traits.length > 0 ? (
            analysis.traits.map((trait, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{trait.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Intensity:</span>
                    <div className="flex items-center">
                      <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${(trait.score || 5) * 10}%` }}
                        />
                      </div>
                      <span className="ml-2 text-sm font-medium">
                        {trait.score || 5}/10
                      </span>
                    </div>
                  </div>
                  
                  <p>{trait.description || "No description available."}</p>
                  
                  {trait.impact && Array.isArray(trait.impact) && trait.impact.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Impact</h4>
                      <ul className="list-disc pl-6 space-y-1">
                        {trait.impact.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {trait.strengths && Array.isArray(trait.strengths) && trait.strengths.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Strengths</h4>
                      <ul className="list-disc pl-6 space-y-1">
                        {trait.strengths.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {trait.challenges && Array.isArray(trait.challenges) && trait.challenges.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Challenges</h4>
                      <ul className="list-disc pl-6 space-y-1">
                        {trait.challenges.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-6">
                <div className="flex flex-col items-center justify-center text-center">
                  <Lightbulb className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Traits Identified</h3>
                  <p className="text-muted-foreground">
                    We couldn't find any personality traits in your analysis.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Growth Tab */}
        <TabsContent value="growth" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Growth Areas</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2">
                {analysis?.growthAreas && Array.isArray(analysis.growthAreas) && analysis.growthAreas.length > 0 ? (
                  analysis.growthAreas.map((area, index) => (
                    <li key={index}>{area}</li>
                  ))
                ) : (
                  <li>No growth areas identified.</li>
                )}
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Personal Development Roadmap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap">
                {analysis?.roadmap || "No roadmap available."}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Learning Pathways</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2">
                {analysis?.learningPathways && Array.isArray(analysis.learningPathways) && analysis.learningPathways.length > 0 ? (
                  analysis.learningPathways.map((pathway, index) => (
                    <li key={index}>{pathway}</li>
                  ))
                ) : (
                  <li>No learning pathways identified.</li>
                )}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Career Tab */}
        <TabsContent value="career" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Career Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2">
                {analysis?.careerSuggestions && Array.isArray(analysis.careerSuggestions) && analysis.careerSuggestions.length > 0 ? (
                  analysis.careerSuggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))
                ) : (
                  <li>No career suggestions available.</li>
                )}
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Relationship Patterns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap">
                {analysis?.relationshipPatterns && typeof analysis.relationshipPatterns === 'object'
                  ? JSON.stringify(analysis.relationshipPatterns, null, 2)
                  : "No relationship patterns identified."}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComprehensiveReportPage;
