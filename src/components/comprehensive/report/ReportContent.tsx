
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Bug } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ComprehensiveAnalysis, RelationshipPatterns } from "@/utils/types";
import { isRelationshipObject } from "@/components/report/utils/typeGuards";

// Import components
import ComprehensiveOverviewSection from "../sections/ComprehensiveOverviewSection";
import ComprehensiveTraitsSection from "../sections/ComprehensiveTraitsSection"; 
import ComprehensiveIntelligenceSection from "../sections/ComprehensiveIntelligenceSection";
import ComprehensiveMotivationSection from "../sections/ComprehensiveMotivationSection";
import ComprehensiveRelationshipsSection from "../sections/ComprehensiveRelationshipsSection";
import ComprehensiveGrowthSection from "../sections/ComprehensiveGrowthSection";
import ComprehensiveCareerSection from "../sections/ComprehensiveCareerSection";

interface ReportContentProps {
  analysis: ComprehensiveAnalysis;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onGoBack: () => void;
  showAdvancedOptions: boolean;
  onToggleAdvancedOptions: () => void;
  testPrompt: string;
  onTestPromptChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isCreatingTest: boolean;
  onCreateTestAnalysis: () => void;
  isUserLoggedIn: boolean;
}

const ReportContent: React.FC<ReportContentProps> = ({
  analysis,
  activeTab,
  setActiveTab,
  onGoBack,
  showAdvancedOptions,
  onToggleAdvancedOptions,
  testPrompt,
  onTestPromptChange,
  isCreatingTest,
  onCreateTestAnalysis,
  isUserLoggedIn
}) => {
  // Process relationship patterns to handle both string[] and object formats
  const processedRelationships = isRelationshipObject(analysis.relationshipPatterns) 
    ? analysis.relationshipPatterns 
    : { 
        strengths: Array.isArray(analysis.relationshipPatterns) ? analysis.relationshipPatterns : [],
        challenges: [],
        compatibleTypes: []
      };

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
      
      <div className="flex flex-wrap gap-4 justify-center mt-8">
        <Button variant="outline" onClick={onGoBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Reports List
        </Button>
        {isUserLoggedIn && (
          <Button 
            variant="secondary" 
            onClick={onToggleAdvancedOptions}
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
                onChange={onTestPromptChange}
                placeholder="Describe your personality traits, preferences, and characteristics for the AI to analyze..."
                className="w-full p-3 border rounded-md h-24"
              />
              <p className="text-xs text-muted-foreground mt-1">
                The more detailed your description, the more accurate the analysis will be.
              </p>
            </div>
            <Button 
              onClick={onCreateTestAnalysis} 
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

export default ReportContent;
