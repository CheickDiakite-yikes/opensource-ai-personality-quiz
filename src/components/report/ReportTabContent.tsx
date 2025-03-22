
import React, { Suspense } from "react";
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
import { isRelationshipObject } from "./utils/typeGuards";
import ReportSectionSkeleton from "./skeletons/ReportSectionSkeleton";
import { useIsMobile } from "@/hooks/use-mobile";

interface ReportTabContentProps {
  analysis: PersonalityAnalysis;
}

// Creating a loading wrapper component for sections
const SectionLoader = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<ReportSectionSkeleton />}>
    {children}
  </Suspense>
);

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
  
  const isMobile = useIsMobile();
  
  // Convert relationshipPatterns to the correct format
  const processedRelationships = isRelationshipObject(relationshipPatterns)
    ? relationshipPatterns
    : { strengths: relationshipPatterns, challenges: [], compatibleTypes: [] };
    
  const tabContentClass = isMobile 
    ? "space-y-4 mt-3 px-0 pb-16 w-full overflow-visible" 
    : "space-y-10 mt-6 w-full";
    
  return (
    <>
      <TabsContent value="overview" className={tabContentClass}>
        <SectionLoader>
          <OverviewSection 
            overview={overview} 
            cognitiveStyle={cognitiveStyle} 
          />
        </SectionLoader>
        
        <SectionLoader>
          <PersonalityTraitsSection traits={traits} />
        </SectionLoader>
        
        <SectionLoader>
          <IntelligenceSection 
            intelligence={intelligence}
            intelligenceScore={intelligenceScore}
            emotionalIntelligenceScore={emotionalIntelligenceScore}
          />
        </SectionLoader>
        
        <SectionLoader>
          <MotivationSection 
            motivators={motivators}
            inhibitors={inhibitors}
          />
        </SectionLoader>
        
        <SectionLoader>
          <CoreValuesSection valueSystem={valueSystem} />
        </SectionLoader>
        
        <SectionLoader>
          <GrowthAreasSection 
            weaknesses={weaknesses}
            growthAreas={growthAreas}
          />
        </SectionLoader>
        
        <SectionLoader>
          <RelationshipLearningSection 
            relationshipPatterns={processedRelationships}
            learningPathways={learningPathways}
          />
        </SectionLoader>
        
        <SectionLoader>
          <CareerValuesSection 
            careerSuggestions={careerSuggestions}
            valueSystem={valueSystem}
          />
        </SectionLoader>
        
        <SectionLoader>
          <RoadmapSection roadmap={roadmap} />
        </SectionLoader>
      </TabsContent>
      
      <TabsContent value="personality" className={tabContentClass}>
        <SectionLoader>
          <PersonalityTraitsSection traits={traits} />
        </SectionLoader>
      </TabsContent>
      
      <TabsContent value="intelligence" className={tabContentClass}>
        <SectionLoader>
          <IntelligenceSection 
            intelligence={intelligence}
            intelligenceScore={intelligenceScore}
            emotionalIntelligenceScore={emotionalIntelligenceScore}
          />
        </SectionLoader>
      </TabsContent>
      
      <TabsContent value="motivation" className={tabContentClass}>
        <SectionLoader>
          <MotivationSection 
            motivators={motivators}
            inhibitors={inhibitors}
          />
        </SectionLoader>
      </TabsContent>
      
      <TabsContent value="values" className={tabContentClass}>
        <SectionLoader>
          <CoreValuesSection valueSystem={valueSystem} />
        </SectionLoader>
      </TabsContent>
      
      <TabsContent value="growth" className={tabContentClass}>
        <SectionLoader>
          <GrowthAreasSection 
            weaknesses={weaknesses}
            growthAreas={growthAreas}
          />
        </SectionLoader>
      </TabsContent>
      
      <TabsContent value="relationships" className={tabContentClass}>
        <SectionLoader>
          <RelationshipLearningSection 
            relationshipPatterns={processedRelationships}
            learningPathways={learningPathways}
          />
        </SectionLoader>
      </TabsContent>
      
      <TabsContent value="career" className={tabContentClass}>
        <SectionLoader>
          <CareerValuesSection 
            careerSuggestions={careerSuggestions}
            valueSystem={valueSystem}
          />
        </SectionLoader>
      </TabsContent>
      
      <TabsContent value="roadmap" className={tabContentClass}>
        <SectionLoader>
          <RoadmapSection roadmap={roadmap} />
        </SectionLoader>
      </TabsContent>
    </>
  );
};

export default ReportTabContent;
