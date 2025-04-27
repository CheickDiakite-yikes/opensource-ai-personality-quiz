
import React from "react";
import { motion } from "framer-motion";
import { useConciseInsightResults } from "@/features/concise-insight/hooks/useConciseInsightResults";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Share2, Download, Brain, HeartHandshake, Users, Lightbulb, Star } from "lucide-react";

// Loading component
const ResultsLoading = () => (
  <div className="container max-w-4xl py-12 px-4 flex flex-col items-center justify-center min-h-[400px]">
    <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4" />
    <h2 className="text-2xl font-bold">Generating Your Analysis</h2>
    <p className="text-muted-foreground max-w-md text-center mt-2">
      Our AI is analyzing your responses to create personalized insights.
      This may take a moment...
    </p>
  </div>
);

// Error component
const ResultsError = ({ error }: { error: string }) => (
  <div className="container max-w-4xl py-12 px-4 flex flex-col items-center justify-center min-h-[400px]">
    <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
      <span className="text-destructive text-2xl">!</span>
    </div>
    <h2 className="text-2xl font-bold">Analysis Error</h2>
    <p className="text-muted-foreground max-w-md text-center mt-2">
      {error || "There was an error generating your analysis. Please try again."}
    </p>
    <Button className="mt-6" onClick={() => window.location.reload()}>
      Try Again
    </Button>
  </div>
);

// Helper function to render career insights
const renderCareerInsights = (careerInsights: string[] | {
  environmentFit?: string;
  challengeAreas?: string;
  roleAlignments: string[];
  workStyles?: {
    collaboration: string;
    autonomy: string;
    structure: string;
  };
}) => {
  if (Array.isArray(careerInsights)) {
    return (
      <div>
        <h3 className="font-medium mb-2">Career Insights</h3>
        <div className="flex flex-wrap gap-2">
          {careerInsights.map((career, i) => (
            <Badge key={i} variant="secondary">{career}</Badge>
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <h3 className="font-medium mb-2">Career Insights</h3>
        <div className="flex flex-wrap gap-2">
          {careerInsights.roleAlignments.map((role, i) => (
            <Badge key={i} variant="secondary">{role}</Badge>
          ))}
        </div>
      </div>
    );
  }
};

// Main component
const ConciseInsightResults: React.FC = () => {
  const { analysis, loading, error } = useConciseInsightResults();
  
  if (loading) {
    return <ResultsLoading />;
  }
  
  if (error || !analysis) {
    return <ResultsError error={error || "No analysis data found"} />;
  }
  
  return (
    <motion.div 
      className="container max-w-4xl py-8 px-4 md:px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex flex-col gap-8">
        <header className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Personality Analysis</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover insights about your personality traits, cognitive patterns, and emotional architecture
          </p>
        </header>
        
        {/* Overview Card */}
        <Card className="border-2 border-primary/10">
          <CardHeader>
            <CardTitle className="text-2xl">Personal Overview</CardTitle>
            <CardDescription>A summary of your core personality traits and patterns</CardDescription>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>{analysis.overview}</p>
          </CardContent>
        </Card>
        
        {/* Core Archetype */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Your Core Archetype
            </CardTitle>
            <CardDescription>Your dominant personality pattern</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">
                  Primary: <Badge variant="outline" className="ml-2">{analysis.coreProfiling.primaryArchetype}</Badge>
                </h3>
                <h4 className="text-lg font-medium mb-2">
                  Secondary: <Badge variant="outline" className="ml-2">{analysis.coreProfiling.secondaryArchetype}</Badge>
                </h4>
              </div>
            </div>
            <p className="text-muted-foreground">{analysis.coreProfiling.description}</p>
          </CardContent>
        </Card>
        
        {/* Main Tabs */}
        <Tabs defaultValue="cognitive">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="cognitive" className="flex items-center gap-1">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">Cognitive</span>
            </TabsTrigger>
            <TabsTrigger value="emotional" className="flex items-center gap-1">
              <HeartHandshake className="h-4 w-4" />
              <span className="hidden sm:inline">Emotional</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Social</span>
            </TabsTrigger>
            <TabsTrigger value="growth" className="flex items-center gap-1">
              <Lightbulb className="h-4 w-4" />
              <span className="hidden sm:inline">Growth</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="cognitive" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Cognitive Profile</CardTitle>
                <CardDescription>How you think, learn, and process information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Cognitive Style</h3>
                  <p>{analysis.cognitiveProfile.style}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">Cognitive Strengths</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {analysis.cognitiveProfile.strengths.map((strength, i) => (
                        <li key={i}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Potential Blind Spots</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {analysis.cognitiveProfile.blindSpots.map((blindSpot, i) => (
                        <li key={i}>{blindSpot}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div>
                  <p className="text-muted-foreground">{analysis.cognitiveProfile.description}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="emotional" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Emotional Insights</CardTitle>
                <CardDescription>How you experience and manage emotions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">Emotional Awareness</h3>
                    <p className="text-muted-foreground">{analysis.emotionalInsights.awareness}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Emotional Regulation</h3>
                    <p className="text-muted-foreground">{analysis.emotionalInsights.regulation}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Empathic Capacity</h3>
                  <div className="w-full bg-muted rounded-full h-2.5 mb-1">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${analysis.emotionalInsights.empathy * 10}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Self-focused</span>
                    <span>Balanced</span>
                    <span>Other-focused</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-muted-foreground">{analysis.emotionalInsights.description}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="social" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Interpersonal Dynamics</CardTitle>
                <CardDescription>How you interact and connect with others</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">Communication Style</h3>
                    <Badge variant="outline">{analysis.interpersonalDynamics.communicationStyle}</Badge>
                    
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Relationship Pattern</h3>
                    <Badge variant="outline">{analysis.interpersonalDynamics.relationshipPattern}</Badge>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Conflict Approach</h3>
                    <Badge variant="outline">{analysis.interpersonalDynamics.conflictApproach}</Badge>
                  </div>
                </div>
                
                {/* Relationship Strengths & Challenges */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <Card className="border-muted bg-card/50">
                    <CardHeader className="py-3">
                      <CardTitle className="text-base">Relationship Strengths</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {analysis.traits.filter(t => t.trait.includes("Social") || t.trait.includes("Empathy") || t.trait.includes("Communication")).flatMap(t => t.strengths).slice(0, 3).map((strength, i) => (
                          <li key={i}>{strength}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-muted bg-card/50">
                    <CardHeader className="py-3">
                      <CardTitle className="text-base">Relationship Challenges</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {analysis.traits.filter(t => t.trait.includes("Social") || t.trait.includes("Empathy") || t.trait.includes("Communication")).flatMap(t => t.challenges).slice(0, 3).map((challenge, i) => (
                          <li key={i}>{challenge}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="growth" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Growth & Development</CardTitle>
                <CardDescription>Your potential for growth and personal development</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Areas for Development</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {analysis.growthPotential.areasOfDevelopment.map((area, i) => (
                      <li key={i}>{area}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Key Strengths to Leverage</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {analysis.growthPotential.keyStrengthsToLeverage.map((strength, i) => (
                      <li key={i}>{strength}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Personalized Recommendations</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {Array.isArray(analysis.growthPotential.personalizedRecommendations) && 
                     typeof analysis.growthPotential.personalizedRecommendations[0] === 'string' ? 
                      (analysis.growthPotential.personalizedRecommendations as string[]).map((rec, i) => (
                        <li key={i}>{rec}</li>
                      )) : 
                      (analysis.growthPotential.personalizedRecommendations as {
                        area: string;
                        why: string;
                        action: string;
                        resources: string;
                      }[]).map((rec, i) => (
                        <li key={i}>{rec.area}: {rec.action}</li>
                      ))
                    }
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Career Insights</h3>
                  {renderCareerInsights(analysis.careerInsights)}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" /> Download PDF
          </Button>
          <Button variant="secondary" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" /> Share Results
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ConciseInsightResults;
