
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { PersonalityAnalysis, RelationshipPatterns } from "@/utils/types";
import OverviewSection from "./sections/OverviewSection";
import PersonalityTraitsSection from "./sections/PersonalityTraitsSection";
import IntelligenceSection from "./sections/IntelligenceSection";
import MotivationSection from "./sections/MotivationSection";
import CoreValuesSection from "./sections/CoreValuesSection";
import GrowthAreasSection from "./sections/GrowthAreasSection";
import RelationshipLearningSection from "./sections/RelationshipLearningSection";
import CareerValuesSection from "./sections/CareerValuesSection";
import RoadmapSection from "./sections/RoadmapSection";

// Type guards from ReportPage
const isRelationshipObject = (patterns: RelationshipPatterns | string[]): patterns is RelationshipPatterns => {
  return typeof patterns === 'object' && !Array.isArray(patterns) && 'strengths' in patterns;
};

interface ReportTabContentProps {
  analysis: PersonalityAnalysis;
}

const ReportTabContent: React.FC<ReportTabContentProps> = ({ analysis }) => {
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
  } = analysis;
  
  // Convert relationshipPatterns to the correct format
  const processedRelationships = isRelationshipObject(relationshipPatterns)
    ? relationshipPatterns
    : { strengths: relationshipPatterns, challenges: [], compatibleTypes: [] };
    
  return (
    <>
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
    </>
  );
};

export default ReportTabContent;
