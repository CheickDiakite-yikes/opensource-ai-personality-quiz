
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ComprehensiveAnalysis } from "@/utils/types";

// Define a loading spinner component since it was missing
const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
  </div>
);

const FullYou = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<ComprehensiveAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Function to fetch user's latest comprehensive analysis
  const fetchUserAnalysis = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    toast.loading("Fetching your comprehensive analysis...");
    
    try {
      // Call the edge function to get all analyses for the user
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
        console.error("Error fetching analyses:", error);
        setError("Failed to load your analysis data");
        toast.error("Failed to load analysis", { description: error.message });
      } else if (data && Array.isArray(data) && data.length > 0) {
        // Sort analyses by date and get the latest one
        const sortedAnalyses = data.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setAnalysis(sortedAnalyses[0]);
        toast.success("Analysis loaded successfully");
      } else {
        setError("No analysis found. Take a comprehensive assessment first.");
        toast.error("No analysis found", { description: "Take a comprehensive assessment to generate your report." });
      }
    } catch (err) {
      console.error("Exception fetching analysis:", err);
      setError("An unexpected error occurred while loading your analysis");
      toast.error("Error loading analysis");
    } finally {
      setIsLoading(false);
      toast.dismiss();
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserAnalysis();
    } else {
      setError("Please sign in to view your full analysis");
    }
  }, [user]);

  if (!user) {
    return (
      <div className="container py-10 px-4">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
          <p className="text-muted-foreground mb-6">
            Please sign in to view your comprehensive analysis report.
          </p>
          <Button onClick={() => navigate("/auth")}>Sign In</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Full You</h1>
          <p className="text-muted-foreground">Your comprehensive personality analysis</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <Button 
            variant="outline" 
            onClick={fetchUserAnalysis} 
            disabled={isLoading}
            className="flex items-center"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <Card className="p-8">
          <div className="text-center">
            <LoadingSpinner />
            <p className="mt-4 text-muted-foreground">Loading your comprehensive analysis...</p>
          </div>
        </Card>
      ) : error ? (
        <Card className="p-8">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-amber-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">Unable to Load Analysis</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={fetchUserAnalysis}>Try Again</Button>
          </div>
        </Card>
      ) : analysis ? (
        <div className="space-y-8">
          {/* Main Tabs Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 md:grid-cols-7 w-full mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="traits">Personality</TabsTrigger>
              <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
              <TabsTrigger value="motivation">Motivation</TabsTrigger>
              <TabsTrigger value="relationships">Relationships</TabsTrigger>
              <TabsTrigger value="career">Career</TabsTrigger>
              <TabsTrigger value="growth">Growth</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-4">Personality Overview</h2>
                <div className="prose max-w-none">
                  <p>{analysis.overview || "No overview analysis available."}</p>
                </div>
              </Card>
              
              {/* Personality Traits Summary */}
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-4">Key Traits</h2>
                {analysis.traits && Array.isArray(analysis.traits) ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysis.traits.slice(0, 4).map((trait: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-2">{trait.name}</h3>
                        <div className="flex items-center mb-2">
                          <div className="bg-gray-200 h-2 rounded-full w-full">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${(trait.score / 10) * 100}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm font-medium">{trait.score}/10</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{trait.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No trait data available.</p>
                )}
                <div className="mt-4 text-center">
                  <Button variant="outline" onClick={() => setActiveTab("traits")}>View All Traits</Button>
                </div>
              </Card>
            </TabsContent>
            
            {/* Traits Tab */}
            <TabsContent value="traits" className="space-y-4">
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Your Personality Traits</h2>
                {analysis.traits && Array.isArray(analysis.traits) ? (
                  <div className="space-y-6">
                    {analysis.traits.map((trait: any, index: number) => (
                      <div key={index} className="border rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-2">{trait.name}</h3>
                        <div className="flex items-center mb-4">
                          <div className="bg-gray-200 h-3 rounded-full w-full">
                            <div 
                              className="bg-primary h-3 rounded-full" 
                              style={{ width: `${(trait.score / 10) * 100}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 font-medium">{trait.score}/10</span>
                        </div>
                        
                        <div className="prose max-w-none">
                          <p className="mb-4">{trait.description}</p>
                          
                          {trait.impact && Array.isArray(trait.impact) && trait.impact.length > 0 && (
                            <div className="mb-4">
                              <h4 className="text-lg font-medium mb-2">Impact on Your Life</h4>
                              <ul className="list-disc pl-5">
                                {trait.impact.map((item: string, i: number) => (
                                  <li key={i}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {trait.strengths && Array.isArray(trait.strengths) && trait.strengths.length > 0 && (
                            <div className="mb-4">
                              <h4 className="text-lg font-medium mb-2">Strengths</h4>
                              <ul className="list-disc pl-5">
                                {trait.strengths.map((item: string, i: number) => (
                                  <li key={i}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {trait.challenges && Array.isArray(trait.challenges) && trait.challenges.length > 0 && (
                            <div className="mb-4">
                              <h4 className="text-lg font-medium mb-2">Challenges</h4>
                              <ul className="list-disc pl-5">
                                {trait.challenges.map((item: string, i: number) => (
                                  <li key={i}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No trait data available.</p>
                )}
              </Card>
            </TabsContent>
            
            {/* Intelligence Tab */}
            <TabsContent value="intelligence" className="space-y-4">
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Intelligence Profile</h2>
                {analysis.intelligence ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="border rounded-lg p-5">
                        <h3 className="text-lg font-medium mb-2">Intelligence Type</h3>
                        <p className="text-xl font-bold">{analysis.intelligence.type || "Not specified"}</p>
                        <div className="mt-3 flex items-center">
                          <div className="bg-gray-200 h-3 rounded-full w-full">
                            <div 
                              className="bg-blue-500 h-3 rounded-full" 
                              style={{ width: `${analysis.intelligence_score || 50}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 font-medium">{analysis.intelligence_score || 50}%</span>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-5">
                        <h3 className="text-lg font-medium mb-2">Emotional Intelligence</h3>
                        <p className="text-xl font-bold">EQ Score</p>
                        <div className="mt-3 flex items-center">
                          <div className="bg-gray-200 h-3 rounded-full w-full">
                            <div 
                              className="bg-green-500 h-3 rounded-full" 
                              style={{ width: `${analysis.emotional_intelligence_score || 50}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 font-medium">{analysis.emotional_intelligence_score || 50}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="prose max-w-none mb-6">
                      <h3 className="text-xl font-medium mb-3">Description</h3>
                      <p>{analysis.intelligence.description || "No description available."}</p>
                    </div>
                    
                    {analysis.intelligence.cognitive_preferences && Array.isArray(analysis.intelligence.cognitive_preferences) && (
                      <div className="mb-6">
                        <h3 className="text-xl font-medium mb-3">Cognitive Preferences</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {analysis.intelligence.cognitive_preferences.map((pref: string, i: number) => (
                            <div key={i} className="bg-secondary/20 rounded-lg p-3 text-center">
                              {pref}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {analysis.intelligence.strengths && Array.isArray(analysis.intelligence.strengths) && (
                        <div>
                          <h3 className="text-xl font-medium mb-3">Strengths</h3>
                          <ul className="list-disc pl-5 space-y-2">
                            {analysis.intelligence.strengths.map((item: string, i: number) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {analysis.intelligence.areas_for_development && Array.isArray(analysis.intelligence.areas_for_development) && (
                        <div>
                          <h3 className="text-xl font-medium mb-3">Areas for Development</h3>
                          <ul className="list-disc pl-5 space-y-2">
                            {analysis.intelligence.areas_for_development.map((item: string, i: number) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p>No intelligence data available.</p>
                )}
              </Card>
            </TabsContent>
            
            {/* Motivation Tab */}
            <TabsContent value="motivation" className="space-y-4">
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Motivation & Values</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-medium mb-4">Core Motivators</h3>
                    {analysis.motivators && Array.isArray(analysis.motivators) && analysis.motivators.length > 0 ? (
                      <ul className="space-y-3">
                        {analysis.motivators.map((motivator: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">
                              {index + 1}
                            </span>
                            <span>{motivator}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No motivators data available.</p>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-4">Inhibitors</h3>
                    {analysis.inhibitors && Array.isArray(analysis.inhibitors) && analysis.inhibitors.length > 0 ? (
                      <ul className="space-y-3">
                        {analysis.inhibitors.map((inhibitor: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="bg-destructive/20 text-destructive rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">
                              {index + 1}
                            </span>
                            <span>{inhibitor}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No inhibitors data available.</p>
                    )}
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-xl font-medium mb-4">Value System</h3>
                  {analysis.value_system && Array.isArray(analysis.value_system) ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {analysis.value_system.map((value: string, index: number) => (
                        <div key={index} className="bg-secondary/20 rounded-lg p-3 text-center">
                          {value}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No value system data available.</p>
                  )}
                </div>
              </Card>
            </TabsContent>
            
            {/* Relationships Tab */}
            <TabsContent value="relationships" className="space-y-4">
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Relationships</h2>
                <div className="space-y-8">
                  {analysis.relationship_patterns && typeof analysis.relationship_patterns === 'object' ? (
                    <>
                      {analysis.relationship_patterns.strengths && Array.isArray(analysis.relationship_patterns.strengths) && (
                        <div>
                          <h3 className="text-xl font-medium mb-4">Relationship Strengths</h3>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {analysis.relationship_patterns.strengths.map((strength: string, index: number) => (
                              <li key={index} className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {analysis.relationship_patterns.challenges && Array.isArray(analysis.relationship_patterns.challenges) && (
                        <div>
                          <h3 className="text-xl font-medium mb-4">Relationship Challenges</h3>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {analysis.relationship_patterns.challenges.map((challenge: string, index: number) => (
                              <li key={index} className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
                                {challenge}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {analysis.relationship_patterns.compatibleTypes && Array.isArray(analysis.relationship_patterns.compatibleTypes) && (
                        <div>
                          <h3 className="text-xl font-medium mb-4">Compatible Types</h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {analysis.relationship_patterns.compatibleTypes.map((type: string, index: number) => (
                              <div key={index} className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                                {type}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <p>No relationship pattern data available.</p>
                  )}
                  
                  <div>
                    <h3 className="text-xl font-medium mb-4">Learning Pathways</h3>
                    {analysis.learning_pathways && Array.isArray(analysis.learning_pathways) ? (
                      <ul className="space-y-3">
                        {analysis.learning_pathways.map((pathway: string, index: number) => (
                          <li key={index} className="border-l-4 border-primary pl-3 py-1">
                            {pathway}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No learning pathways data available.</p>
                    )}
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            {/* Career Tab */}
            <TabsContent value="career" className="space-y-4">
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Career Insights</h2>
                <div>
                  <h3 className="text-xl font-medium mb-4">Career Suggestions</h3>
                  {analysis.career_suggestions && Array.isArray(analysis.career_suggestions) ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {analysis.career_suggestions.map((career: string, index: number) => (
                        <div key={index} className="bg-secondary/20 p-4 rounded-lg">
                          <p>{career}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No career suggestions available.</p>
                  )}
                </div>
                
                <div className="mt-8">
                  <h3 className="text-xl font-medium mb-4">Work Values</h3>
                  {analysis.value_system && Array.isArray(analysis.value_system) ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {analysis.value_system.slice(0, 9).map((value: string, index: number) => (
                        <div key={index} className="bg-primary/10 rounded-lg p-3 text-center">
                          {value}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No work values data available.</p>
                  )}
                </div>
              </Card>
            </TabsContent>
            
            {/* Growth Tab */}
            <TabsContent value="growth" className="space-y-4">
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Growth & Development</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-xl font-medium mb-4">Growth Areas</h3>
                    {analysis.growth_areas && Array.isArray(analysis.growth_areas) ? (
                      <ul className="space-y-3">
                        {analysis.growth_areas.map((area: string, index: number) => (
                          <li key={index} className="bg-secondary/20 p-3 rounded-lg">
                            {area}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No growth areas data available.</p>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-4">Weaknesses</h3>
                    {analysis.weaknesses && Array.isArray(analysis.weaknesses) ? (
                      <ul className="space-y-3">
                        {analysis.weaknesses.map((weakness: string, index: number) => (
                          <li key={index} className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No weaknesses data available.</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-4">Personal Growth Roadmap</h3>
                  <div className="prose max-w-none">
                    {analysis.roadmap ? (
                      <div className="bg-secondary/10 p-6 rounded-lg">
                        <p>{analysis.roadmap}</p>
                      </div>
                    ) : (
                      <p>No roadmap data available.</p>
                    )}
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <Card className="p-8 text-center">
          <h2 className="text-xl mb-4">No Analysis Found</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't find any comprehensive analysis for your profile.
          </p>
          <Button onClick={() => navigate("/comprehensive-assessment")}>
            Take Assessment
          </Button>
        </Card>
      )}
    </div>
  );
};

export default FullYou;
