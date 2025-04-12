
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { ComprehensiveAnalysis } from "@/utils/types";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { formatTraitScore } from "@/utils/formatUtils";
import { AlertTriangle, ExternalLink, BrainCircuit, Heart, Star, TrendingUp, Users, Briefcase } from "lucide-react";
import { toast } from "sonner";

const ComprehensiveReportPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState<ComprehensiveAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Sample data for the preview mode
  const sampleAnalysis: ComprehensiveAnalysis = {
    id: "preview-sample",
    createdAt: new Date().toISOString(),
    overview: "This sample report provides a preview of what your comprehensive assessment results will look like. The comprehensive analysis offers deeper insights into personality traits, cognitive patterns, and behavioral tendencies based on our 100-question assessment.",
    traits: [
      { trait: "Openness", score: 8.2, description: "High openness indicates curiosity and preference for variety.", strengths: ["Creative", "Imaginative"], challenges: ["Can be impractical"], growthSuggestions: ["Balance creativity with practicality"] },
      { trait: "Conscientiousness", score: 7.5, description: "Above average conscientiousness shows reliability and organization.", strengths: ["Organized", "Dependable"], challenges: ["Can be rigid"], growthSuggestions: ["Practice flexibility"] },
      { trait: "Extraversion", score: 6.8, description: "Moderate extraversion indicates balance between sociability and independence.", strengths: ["Sociable", "Engaging"], challenges: ["Energy depletion in crowds"], growthSuggestions: ["Schedule alone time"] },
      { trait: "Agreeableness", score: 7.9, description: "High agreeableness shows empathy and cooperation.", strengths: ["Cooperative", "Empathetic"], challenges: ["Can be too accommodating"], growthSuggestions: ["Practice saying no"] },
      { trait: "Neuroticism", score: 5.4, description: "Moderate emotional stability with some sensitivity.", strengths: ["Emotionally aware", "Empathetic"], challenges: ["Occasional anxiety"], growthSuggestions: ["Mindfulness practices"] }
    ],
    intelligence: {
      type: "Analytical-Creative",
      score: 8.4,
      description: "Strong analytical ability balanced with creative thinking.",
      domains: [
        { name: "Logical-Mathematical", score: 8.7, description: "Excellent pattern recognition and logical reasoning." },
        { name: "Verbal-Linguistic", score: 8.2, description: "Strong communication skills and language processing." },
        { name: "Visual-Spatial", score: 7.9, description: "Good visualization abilities and spatial awareness." }
      ]
    },
    intelligenceScore: 8.4,
    emotionalIntelligenceScore: 7.8,
    cognitiveStyle: { primary: "Analytical", secondary: "Intuitive", description: "Tends to analyze situations thoroughly while also trusting intuition." },
    valueSystem: ["Intellectual growth", "Authenticity", "Balance", "Connection", "Achievement"],
    motivators: ["Personal growth", "Making an impact", "Learning", "Recognition"],
    inhibitors: ["Fear of failure", "Perfectionism", "Overthinking"],
    weaknesses: ["Can be indecisive", "Occasional procrastination", "Difficulty with routine tasks"],
    growthAreas: ["Decision-making confidence", "Consistent follow-through", "Setting boundaries"],
    relationshipPatterns: {
      strengths: ["Empathetic listening", "Loyalty", "Open communication"],
      challenges: ["Can be conflict-avoidant", "May sacrifice needs for others"],
      compatibleTypes: ["Independent thinkers", "Authentic communicators", "Growth-oriented people"]
    },
    careerSuggestions: ["Research", "Creative direction", "Psychology", "Education", "Entrepreneurship"],
    learningPathways: ["Structured learning with creative elements", "Hands-on experiences", "Discussion-based learning"],
    roadmap: "Focus first on developing decision-making confidence through small daily choices. Then work on implementing systems for consistent follow-through on projects. Finally, practice setting and maintaining healthy boundaries in relationships and work.",
    detailedTraits: {
      primary: [
        { trait: "Openness", score: 8.2, description: "High openness indicates curiosity and preference for variety.", strengths: ["Creative", "Imaginative"], challenges: ["Can be impractical"], growthSuggestions: ["Balance creativity with practicality"] },
        { trait: "Conscientiousness", score: 7.5, description: "Above average conscientiousness shows reliability and organization.", strengths: ["Organized", "Dependable"], challenges: ["Can be rigid"], growthSuggestions: ["Practice flexibility"] }
      ],
      secondary: [
        { trait: "Adaptability", score: 7.8, description: "Good ability to adapt to changing circumstances.", strengths: ["Flexible", "Resilient"], challenges: ["May lack consistency"], growthSuggestions: ["Create flexible routines"] },
        { trait: "Risk Tolerance", score: 6.2, description: "Moderate comfort with risk and uncertainty.", strengths: ["Cautious when needed", "Thoughtful"], challenges: ["May miss opportunities"], growthSuggestions: ["Take small calculated risks"] }
      ]
    },
    shadowAspects: [
      {
        trait: "Perfectionism",
        description: "Your high standards can become self-defeating when they transform into perfectionism.",
        impactAreas: ["Work productivity", "Stress levels", "Project completion"],
        integrationSuggestions: ["Practice 'good enough' completion", "Set time limits for tasks"]
      },
      {
        trait: "People-pleasing",
        description: "Your natural empathy can lead to neglecting your own needs to please others.",
        impactAreas: ["Personal boundaries", "Relationships", "Self-care"],
        integrationSuggestions: ["Practice saying no", "Check in with your own needs regularly"]
      }
    ]
  };

  // Fetch comprehensive analysis
  useEffect(() => {
    async function fetchComprehensiveAnalysis() {
      // If no ID is provided, show the sample report
      if (!id) {
        // Set a small delay to simulate loading
        setTimeout(() => {
          setAnalysis(sampleAnalysis);
          setIsLoading(false);
        }, 800);
        return;
      }

      try {
        setIsLoading(true);
        
        // Call the edge function to get the comprehensive analysis
        const { data, error: functionError } = await supabase.functions.invoke(
          "get-comprehensive-analysis",
          {
            body: { id },
          }
        );

        if (functionError) {
          throw new Error(`Edge function error: ${functionError.message}`);
        }

        if (!data) {
          throw new Error("No analysis data returned");
        }

        console.log("Comprehensive analysis data:", data);
        setAnalysis(data as ComprehensiveAnalysis);
      } catch (err) {
        console.error("Error fetching comprehensive analysis:", err);
        setError(err instanceof Error ? err.message : "Failed to load analysis");
        toast.error("Failed to load analysis", {
          description: "There was a problem retrieving your comprehensive analysis"
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchComprehensiveAnalysis();
  }, [id]);

  const handleStartAssessment = () => {
    navigate("/comprehensive-assessment");
  };

  // Loading state
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
  if (error) {
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
            <p className="text-muted-foreground max-w-md mx-auto">
              {error}
            </p>
            <Button onClick={handleStartAssessment}>
              Take Comprehensive Assessment
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Render preview or actual analysis data
  const displayAnalysis = analysis || sampleAnalysis;
  const isPreview = !id || displayAnalysis.id === "preview-sample";

  return (
    <div className="container py-6 md:py-10 px-4 space-y-8 mb-20">
      <div className="text-center relative">
        {isPreview && (
          <Badge variant="outline" className="absolute right-0 top-0 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
            Preview
          </Badge>
        )}
        <h1 className="text-3xl font-bold mb-2">Comprehensive Report</h1>
        <p className="text-muted-foreground">
          {isPreview ? "Sample Report Preview" : `Analysis ID: ${displayAnalysis.id}`}
        </p>
      </div>
      
      <Tabs 
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="sticky top-16 z-10 bg-background/80 backdrop-blur-sm pt-1 shadow-sm">
          <TabsList className="w-full max-w-3xl mx-auto h-auto flex flex-nowrap overflow-x-auto p-1 gap-1 justify-start sm:justify-center">
            <TabsTrigger value="overview" className="rounded-md">
              Overview
            </TabsTrigger>
            <TabsTrigger value="traits" className="rounded-md">
              <Star className="w-4 h-4 mr-1 hidden sm:inline" />
              Traits
            </TabsTrigger>
            <TabsTrigger value="intelligence" className="rounded-md">
              <BrainCircuit className="w-4 h-4 mr-1 hidden sm:inline" />
              Intelligence
            </TabsTrigger>
            <TabsTrigger value="shadow" className="rounded-md">
              Shadow
            </TabsTrigger>
            <TabsTrigger value="growth" className="rounded-md">
              <TrendingUp className="w-4 h-4 mr-1 hidden sm:inline" />
              Growth
            </TabsTrigger>
            <TabsTrigger value="relationships" className="rounded-md">
              <Users className="w-4 h-4 mr-1 hidden sm:inline" />
              Relationships
            </TabsTrigger>
            <TabsTrigger value="career" className="rounded-md">
              <Briefcase className="w-4 h-4 mr-1 hidden sm:inline" />
              Career
            </TabsTrigger>
          </TabsList>
        </div>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <Card className="p-6 md:p-8 shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Personality Overview</h2>
            <p className="mb-6">{displayAnalysis.overview}</p>
            
            {/* Key traits section */}
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-3">Key Personality Traits</h3>
              <div className="flex flex-wrap gap-2">
                {displayAnalysis.traits?.slice(0, 5).map((trait, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                    {trait.trait}: {formatTraitScore(trait.score)}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Intelligence scores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium">Intelligence Score</h4>
                <p className="text-2xl font-bold">{formatTraitScore(displayAnalysis.intelligenceScore || 0)}</p>
              </div>
              
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium">Emotional Intelligence</h4>
                <p className="text-2xl font-bold">{formatTraitScore(displayAnalysis.emotionalIntelligenceScore || 0)}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 md:p-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Top Insights</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Cognitive Style</h4>
                </div>
                <p className="text-muted-foreground">
                  {typeof displayAnalysis.cognitiveStyle === 'string' 
                    ? displayAnalysis.cognitiveStyle 
                    : displayAnalysis.cognitiveStyle?.description || 'Not available'}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Core Values</h4>
                </div>
                <p className="text-muted-foreground">
                  {Array.isArray(displayAnalysis.valueSystem) 
                    ? displayAnalysis.valueSystem.slice(0, 3).join(', ')
                    : 'Not available'}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Growth Focus</h4>
                </div>
                <p className="text-muted-foreground">
                  {displayAnalysis.growthAreas?.slice(0, 2).join(', ') || 'Not available'}
                </p>
              </div>
            </div>
          </Card>
          
          {isPreview && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 text-center">
              <h3 className="font-semibold mb-2">Ready to discover your complete personality profile?</h3>
              <p className="mb-4 text-muted-foreground">Take the comprehensive assessment to receive your personalized in-depth report.</p>
              <Button onClick={handleStartAssessment}>
                Start Comprehensive Assessment
              </Button>
            </div>
          )}
        </TabsContent>
        
        {/* Traits Tab */}
        <TabsContent value="traits" className="space-y-6 mt-6">
          <Card className="p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4">Detailed Personality Traits</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Primary Traits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(displayAnalysis.detailedTraits?.primary || displayAnalysis.traits?.slice(0, 2))?.map((trait, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-muted/10">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{trait.trait}</h4>
                      <Badge variant="outline">{formatTraitScore(trait.score)}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{trait.description}</p>
                    
                    <div className="text-sm">
                      <div className="mb-2">
                        <span className="font-medium block">Strengths:</span>
                        <span>{trait.strengths?.join(", ")}</span>
                      </div>
                      <div>
                        <span className="font-medium block">Challenges:</span>
                        <span>{trait.challenges?.join(", ")}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Secondary Traits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(displayAnalysis.detailedTraits?.secondary || displayAnalysis.traits?.slice(2, 4))?.map((trait, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-muted/10">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{trait.trait}</h4>
                      <Badge variant="outline">{formatTraitScore(trait.score)}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{trait.description}</p>
                    
                    <div className="text-sm">
                      <div className="mb-2">
                        <span className="font-medium block">Strengths:</span>
                        <span>{trait.strengths?.join(", ")}</span>
                      </div>
                      <div>
                        <span className="font-medium block">Challenges:</span>
                        <span>{trait.challenges?.join(", ")}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {isPreview && (
              <div className="mt-8 pt-6 border-t border-border text-center">
                <p className="mb-4 text-muted-foreground">The comprehensive assessment provides deeper analysis of 12+ personality traits.</p>
                <Button onClick={handleStartAssessment} variant="outline">
                  Take Full Assessment
                </Button>
              </div>
            )}
          </Card>
        </TabsContent>
        
        {/* Intelligence Tab */}
        <TabsContent value="intelligence" className="space-y-6 mt-6">
          <Card className="p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4">Intelligence Profile</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="md:col-span-2">
                <h3 className="text-lg font-medium mb-3">Intelligence Type</h3>
                <p className="text-muted-foreground mb-4">{displayAnalysis.intelligence?.description}</p>
                
                <h4 className="font-medium mb-2">Overall Intelligence</h4>
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-3xl font-bold">{formatTraitScore(displayAnalysis.intelligenceScore || 0)}</div>
                  <div className="h-3 bg-muted rounded-full flex-1 overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${((displayAnalysis.intelligenceScore || 0) / 10) * 100}%` }} 
                    />
                  </div>
                </div>
                
                <h4 className="font-medium mb-2">Emotional Intelligence</h4>
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold">{formatTraitScore(displayAnalysis.emotionalIntelligenceScore || 0)}</div>
                  <div className="h-3 bg-muted rounded-full flex-1 overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${((displayAnalysis.emotionalIntelligenceScore || 0) / 10) * 100}%` }} 
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-muted/10 p-4 rounded-lg border">
                <h3 className="font-medium mb-3">Type: {displayAnalysis.intelligence?.type}</h3>
                <div className="space-y-4">
                  {displayAnalysis.intelligence?.domains.map((domain, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{domain.name}</span>
                        <span className="font-medium">{formatTraitScore(domain.score)}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${(domain.score / 10) * 100}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {isPreview && (
              <div className="mt-8 pt-6 border-t border-border text-center">
                <p className="mb-4 text-muted-foreground">The comprehensive assessment provides a more detailed intelligence analysis across 7 domains.</p>
                <Button onClick={handleStartAssessment}>
                  Get Your Full Intelligence Profile
                </Button>
              </div>
            )}
          </Card>
        </TabsContent>
        
        {/* Shadow Tab */}
        <TabsContent value="shadow" className="space-y-6 mt-6">
          <Card className="p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4">Shadow Aspects</h2>
            <p className="text-muted-foreground mb-6">
              Shadow aspects are unconscious patterns that can influence behavior in subtle ways. 
              Understanding these aspects can lead to profound personal growth.
            </p>
            
            <div className="space-y-6">
              {displayAnalysis.shadowAspects?.map((shadow, index) => (
                <div key={index} className="border p-5 rounded-lg bg-muted/5">
                  <h3 className="text-lg font-medium mb-2">{shadow.trait}</h3>
                  <p className="text-muted-foreground mb-4">{shadow.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Impact Areas</h4>
                      <ul className="list-disc pl-5 text-sm text-muted-foreground">
                        {shadow.impactAreas.map((area, i) => (
                          <li key={i}>{area}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm mb-2">Integration Suggestions</h4>
                      <ul className="list-disc pl-5 text-sm text-muted-foreground">
                        {shadow.integrationSuggestions.map((suggestion, i) => (
                          <li key={i}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
              
              {(!displayAnalysis.shadowAspects || displayAnalysis.shadowAspects.length === 0) && (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">Shadow analysis is only available in the full comprehensive report.</p>
                </div>
              )}
            </div>
            
            {isPreview && (
              <div className="mt-8 pt-6 border-t border-border text-center">
                <p className="mb-4 text-muted-foreground">The comprehensive assessment identifies your unique shadow aspects and provides integration strategies.</p>
                <Button onClick={handleStartAssessment}>
                  Discover Your Shadow Aspects
                </Button>
              </div>
            )}
          </Card>
        </TabsContent>
        
        {/* Growth Tab */}
        <TabsContent value="growth" className="space-y-6 mt-6">
          <Card className="p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4">Personal Growth</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Areas for Development</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted/10 p-4 rounded-lg border">
                    <h4 className="font-medium mb-2">Growth Areas</h4>
                    <ul className="list-disc pl-5 text-muted-foreground">
                      {displayAnalysis.growthAreas?.map((area, index) => (
                        <li key={index} className="mb-1">{area}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-muted/10 p-4 rounded-lg border">
                    <h4 className="font-medium mb-2">Potential Blockers</h4>
                    <ul className="list-disc pl-5 text-muted-foreground">
                      {displayAnalysis.inhibitors?.map((inhibitor, index) => (
                        <li key={index} className="mb-1">{inhibitor}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Development Roadmap</h3>
                <div className="bg-muted/10 p-5 rounded-lg border">
                  <p className="text-muted-foreground whitespace-pre-line">{displayAnalysis.roadmap}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Learning Pathways</h3>
                <div className="bg-muted/10 p-4 rounded-lg border">
                  <ul className="list-disc pl-5 text-muted-foreground">
                    {displayAnalysis.learningPathways?.map((pathway, index) => (
                      <li key={index} className="mb-1">{pathway}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            {isPreview && (
              <div className="mt-8 pt-6 border-t border-border text-center">
                <p className="mb-4 text-muted-foreground">Get your personalized growth roadmap based on your comprehensive assessment results.</p>
                <Button onClick={handleStartAssessment}>
                  Create Your Growth Roadmap
                </Button>
              </div>
            )}
          </Card>
        </TabsContent>
        
        {/* Relationships Tab */}
        <TabsContent value="relationships" className="space-y-6 mt-6">
          <Card className="p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4">Relationship Patterns</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Relationship Strengths</h3>
                <div className="bg-muted/10 p-4 rounded-lg border h-full">
                  <ul className="list-disc pl-5 text-muted-foreground">
                    {(typeof displayAnalysis.relationshipPatterns === 'object' 
                      ? displayAnalysis.relationshipPatterns.strengths 
                      : displayAnalysis.relationshipPatterns)?.map((strength, index) => (
                        <li key={index} className="mb-1">{strength}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Relationship Challenges</h3>
                <div className="bg-muted/10 p-4 rounded-lg border h-full">
                  <ul className="list-disc pl-5 text-muted-foreground">
                    {(typeof displayAnalysis.relationshipPatterns === 'object' 
                      ? displayAnalysis.relationshipPatterns.challenges 
                      : [])?.map((challenge, index) => (
                        <li key={index} className="mb-1">{challenge}</li>
                    ))}
                    {typeof displayAnalysis.relationshipPatterns !== 'object' && (
                      <li className="text-muted-foreground">Full relationship challenges available in comprehensive report</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Compatible Types</h3>
              <div className="bg-muted/10 p-4 rounded-lg border">
                {typeof displayAnalysis.relationshipPatterns === 'object' && displayAnalysis.relationshipPatterns.compatibleTypes ? (
                  <div className="flex flex-wrap gap-2">
                    {displayAnalysis.relationshipPatterns.compatibleTypes.map((type, index) => (
                      <Badge key={index} variant="outline" className="px-3 py-1">{type}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Compatibility analysis available in full comprehensive report</p>
                )}
              </div>
            </div>
            
            {isPreview && (
              <div className="mt-8 pt-6 border-t border-border text-center">
                <p className="mb-4 text-muted-foreground">The comprehensive assessment provides a detailed analysis of your relationship patterns and compatibility insights.</p>
                <Button onClick={handleStartAssessment}>
                  Get Your Relationship Analysis
                </Button>
              </div>
            )}
          </Card>
        </TabsContent>
        
        {/* Career Tab */}
        <TabsContent value="career" className="space-y-6 mt-6">
          <Card className="p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4">Career Insights</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Suggested Career Paths</h3>
              <div className="bg-muted/10 p-4 rounded-lg border">
                <div className="flex flex-wrap gap-2">
                  {displayAnalysis.careerSuggestions?.map((career, index) => (
                    <Badge key={index} variant="outline" className="px-3 py-1">{career}</Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Work Values</h3>
              <div className="bg-muted/10 p-4 rounded-lg border">
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(displayAnalysis.valueSystem) 
                    ? displayAnalysis.valueSystem.slice(0, 5)
                    : ['Autonomy', 'Growth', 'Impact']).map((value, index) => (
                      <Badge key={index} variant="outline" className="px-3 py-1">{value}</Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Work Environment Fit</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted/10 p-4 rounded-lg border">
                  <h4 className="font-medium mb-2">Thrives In</h4>
                  <ul className="list-disc pl-5 text-muted-foreground">
                    <li>Environments that value {displayAnalysis.traits?.[0]?.trait.toLowerCase() || 'creativity'}</li>
                    <li>Teams that encourage open communication</li>
                    <li>Roles with a balance of structure and autonomy</li>
                  </ul>
                </div>
                
                <div className="bg-muted/10 p-4 rounded-lg border">
                  <h4 className="font-medium mb-2">Challenges In</h4>
                  <ul className="list-disc pl-5 text-muted-foreground">
                    <li>Highly regimented environments</li>
                    <li>Positions without growth opportunities</li>
                    <li>Work that conflicts with core values</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {isPreview && (
              <div className="mt-8 pt-6 border-t border-border text-center">
                <p className="mb-4 text-muted-foreground">Get detailed career insights and workplace compatibility analysis based on your comprehensive assessment.</p>
                <Button onClick={handleStartAssessment}>
                  Get Your Career Analysis
                </Button>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Footer section with call to action */}
      <div className="text-center pt-4">
        {isPreview ? (
          <Button className="mt-2" onClick={handleStartAssessment}>
            Take Comprehensive Assessment
          </Button>
        ) : (
          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={() => navigate("/assessment")}>
              Standard Assessment
            </Button>
            <Button variant="outline" onClick={() => navigate("/report")}>
              View Standard Report
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComprehensiveReportPage;
