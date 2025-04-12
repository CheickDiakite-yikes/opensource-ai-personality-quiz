
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { ComprehensiveAnalysis, RelationshipPatterns } from "@/utils/types";
import { useAuth } from "@/contexts/AuthContext";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isRelationshipObject } from "@/components/report/utils/typeGuards";

// Import components
import ComprehensiveOverviewSection from "./sections/ComprehensiveOverviewSection";
import ComprehensiveTraitsSection from "./sections/ComprehensiveTraitsSection"; 
import ComprehensiveIntelligenceSection from "./sections/ComprehensiveIntelligenceSection";
import ComprehensiveMotivationSection from "./sections/ComprehensiveMotivationSection";
import ComprehensiveRelationshipsSection from "./sections/ComprehensiveRelationshipsSection";
import ComprehensiveGrowthSection from "./sections/ComprehensiveGrowthSection";
import ComprehensiveCareerSection from "./sections/ComprehensiveCareerSection";

const ComprehensiveReportPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState<ComprehensiveAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Fetch comprehensive analysis
  useEffect(() => {
    async function fetchComprehensiveAnalysis() {
      if (!id) {
        setIsLoading(false);
        setError("No analysis ID provided");
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
          </div>
        </Card>
      </div>
    );
  }

  // No analysis state - show coming soon placeholder
  if (!analysis) {
    return (
      <div className="container py-6 md:py-10 px-4 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Comprehensive Report</h1>
          <p className="text-muted-foreground">
            ID: {id || "No report ID provided"}
          </p>
        </div>
        
        <Card className="p-8 text-center">
          <h2 className="text-xl mb-4">Coming Soon</h2>
          <p className="text-muted-foreground mb-6">
            The comprehensive report feature is currently under development.
            This will provide a more detailed analysis based on our 100-question assessment.
          </p>
          
          <div className="space-y-4 max-w-md mx-auto">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            
            <div className="py-4">
              <Skeleton className="h-24 w-full rounded-md" />
            </div>
            
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/6" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </Card>
      </div>
    );
  }

  // Process relationship patterns to handle both string[] and object formats
  const processedRelationships = isRelationshipObject(analysis.relationshipPatterns) 
    ? analysis.relationshipPatterns 
    : { 
        strengths: Array.isArray(analysis.relationshipPatterns) ? analysis.relationshipPatterns : [],
        challenges: [],
        compatibleTypes: []
      };

  // Render analysis data
  return (
    <div className="container py-6 md:py-10 px-4 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Comprehensive Report</h1>
        <p className="text-muted-foreground">
          Analysis ID: {analysis.id}
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
        
        {/* Overview tab */}
        <TabsContent value="overview" className="space-y-6">
          <ComprehensiveOverviewSection 
            overview={analysis.overview}
            traits={analysis.traits}
            intelligenceScore={analysis.intelligenceScore}
            emotionalIntelligenceScore={analysis.emotionalIntelligenceScore}
            motivators={analysis.motivators}
            growthAreas={analysis.growthAreas}
          />
        </TabsContent>
        
        {/* Personality tab */}
        <TabsContent value="personality" className="space-y-6">
          <ComprehensiveTraitsSection
            traits={analysis.traits}
          />
        </TabsContent>
        
        {/* Intelligence tab */}
        <TabsContent value="intelligence" className="space-y-6">
          <ComprehensiveIntelligenceSection
            intelligence={analysis.intelligence}
            intelligenceScore={analysis.intelligenceScore}
            emotionalIntelligenceScore={analysis.emotionalIntelligenceScore}
          />
        </TabsContent>
        
        {/* Motivation tab */}
        <TabsContent value="motivation" className="space-y-6">
          <ComprehensiveMotivationSection
            motivators={analysis.motivators}
            inhibitors={analysis.inhibitors}
          />
        </TabsContent>
        
        {/* Relationships tab */}
        <TabsContent value="relationships" className="space-y-6">
          <ComprehensiveRelationshipsSection
            relationshipPatterns={processedRelationships}
          />
        </TabsContent>
        
        {/* Growth tab */}
        <TabsContent value="growth" className="space-y-6">
          <ComprehensiveGrowthSection
            growthAreas={analysis.growthAreas}
            weaknesses={analysis.weaknesses}
            learningPathways={analysis.learningPathways}
          />
        </TabsContent>
        
        {/* Career tab */}
        <TabsContent value="career" className="space-y-6">
          <ComprehensiveCareerSection
            careerSuggestions={analysis.careerSuggestions}
            roadmap={analysis.roadmap}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComprehensiveReportPage;
