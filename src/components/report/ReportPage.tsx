
import React from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { PersonalityAnalysis, ValueSystemType, RelationshipPatterns, CognitiveStyleType } from "@/utils/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReportHeader from "./ReportHeader";
import OverviewSection from "./sections/OverviewSection";
import PersonalityTraitsSection from "./sections/PersonalityTraitsSection";
import IntelligenceSection from "./sections/IntelligenceSection";
import MotivationSection from "./sections/MotivationSection";
import CoreValuesSection from "./sections/CoreValuesSection";
import GrowthAreasSection from "./sections/GrowthAreasSection";
import RelationshipLearningSection from "./sections/RelationshipLearningSection";
import CareerValuesSection from "./sections/CareerValuesSection";
import RoadmapSection from "./sections/RoadmapSection";
import { useAIAnalysis } from "@/hooks/useAIAnalysis";

// Type guard to check if valueSystem is an object or array
const isValueSystemObject = (valueSystem: ValueSystemType): valueSystem is {
  strengths: string[];
  challenges: string[];
  compatibleTypes: string[];
} => {
  return typeof valueSystem === 'object' && !Array.isArray(valueSystem) && 'strengths' in valueSystem;
};

// Type guard to check if relationshipPatterns is an object or array
const isRelationshipObject = (patterns: RelationshipPatterns | string[]): patterns is RelationshipPatterns => {
  return typeof patterns === 'object' && !Array.isArray(patterns) && 'strengths' in patterns;
};

// Type guard for cognitive style
const isCognitiveStyleObject = (style: CognitiveStyleType): style is {
  primary: string;
  secondary: string;
  description: string;
} => {
  return typeof style === 'object' && 'primary' in style;
};

const ReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { analysis, isLoading, analyzeResponses, getAnalysisHistory } = useAIAnalysis();
  
  // Get all analyses and find the one that matches the ID
  const analyses = getAnalysisHistory();
  const analysisResult = analyses.find(a => a.id === id) || analysis;
  
  if (isLoading) {
    return <div className="container py-10">Loading analysis...</div>;
  }
  
  if (!analysisResult) {
    toast({
      title: "Error loading analysis",
      description: "We couldn't load the personality analysis. Please try again.",
      variant: "destructive",
    });
    return <div className="container py-10">Error loading analysis. Please refresh the page.</div>;
  }
  
  // Extract analysis sections with appropriate type handling
  const {
    overview,
    traits,
    intelligence,
    intelligenceScore,
    emotionalIntelligenceScore,
    cognitiveStyle,
    valueSystem,
    motivators,
    inhibitors,
    weaknesses,
    growthAreas,
    relationshipPatterns,
    careerSuggestions,
    learningPathways,
    roadmap,
  } = analysisResult;
  
  // Convert valueSystem to the correct format for the CoreValuesSection
  const processedValueSystem = isValueSystemObject(valueSystem) 
    ? valueSystem 
    : { strengths: valueSystem, challenges: [], compatibleTypes: [] };
  
  // Convert relationshipPatterns to the correct format
  const processedRelationships = isRelationshipObject(relationshipPatterns)
    ? relationshipPatterns
    : { strengths: relationshipPatterns, challenges: [], compatibleTypes: [] };
  
  return (
    <div className="container py-6 space-y-8">
      <ReportHeader analysis={analysisResult} />
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="personality">Personality</TabsTrigger>
          <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
          <TabsTrigger value="motivation">Motivation</TabsTrigger>
          <TabsTrigger value="values">Values</TabsTrigger>
          <TabsTrigger value="growth">Growth Areas</TabsTrigger>
          <TabsTrigger value="relationships">Relationships</TabsTrigger>
          <TabsTrigger value="career">Career</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
        </TabsList>

        {/* Tab Content */}
        <TabsContent value="overview" className="space-y-10 mt-6">
          <OverviewSection 
            overview={overview} 
            cognitiveStyle={cognitiveStyle} 
          />
          
          <PersonalityTraitsSection traits={traits} />
          
          <IntelligenceSection 
            intelligence={intelligence}
            intelligenceScore={intelligenceScore}
            emotionalIntelligenceScore={emotionalIntelligenceScore}
          />
          
          <MotivationSection 
            motivators={motivators}
            inhibitors={inhibitors}
          />
          
          <CoreValuesSection valueSystem={valueSystem} />
          
          <GrowthAreasSection 
            weaknesses={weaknesses}
            growthAreas={growthAreas}
          />
          
          <RelationshipLearningSection 
            relationshipPatterns={processedRelationships}
            learningPathways={learningPathways}
          />
          
          <CareerValuesSection 
            careerSuggestions={careerSuggestions}
            valueSystem={valueSystem}
          />
          
          <RoadmapSection roadmap={roadmap} />
        </TabsContent>
        
        <TabsContent value="personality" className="space-y-10 mt-6">
          <PersonalityTraitsSection traits={traits} />
        </TabsContent>
        
        <TabsContent value="intelligence" className="space-y-10 mt-6">
          <IntelligenceSection 
            intelligence={intelligence}
            intelligenceScore={intelligenceScore}
            emotionalIntelligenceScore={emotionalIntelligenceScore}
          />
        </TabsContent>
        
        <TabsContent value="motivation" className="space-y-10 mt-6">
          <MotivationSection 
            motivators={motivators}
            inhibitors={inhibitors}
          />
        </TabsContent>
        
        <TabsContent value="values" className="space-y-10 mt-6">
          <CoreValuesSection valueSystem={valueSystem} />
        </TabsContent>
        
        <TabsContent value="growth" className="space-y-10 mt-6">
          <GrowthAreasSection 
            weaknesses={weaknesses}
            growthAreas={growthAreas}
          />
        </TabsContent>
        
        <TabsContent value="relationships" className="space-y-10 mt-6">
          <RelationshipLearningSection 
            relationshipPatterns={processedRelationships}
            learningPathways={learningPathways}
          />
        </TabsContent>
        
        <TabsContent value="career" className="space-y-10 mt-6">
          <CareerValuesSection 
            careerSuggestions={careerSuggestions}
            valueSystem={valueSystem}
          />
        </TabsContent>
        
        <TabsContent value="roadmap" className="space-y-10 mt-6">
          <RoadmapSection roadmap={roadmap} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportPage;
