
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
    ? "space-y-3 mt-2 px-0 pb-16 w-full overflow-x-hidden" 
    : "space-y-8 mt-6 w-full";
    
  return (
    <>
      <TabsContent value="overview" className={tabContentClass}>
        <div className="w-full overflow-x-hidden">
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
        </div>
      </TabsContent>
      
      <TabsContent value="personality" className={tabContentClass}>
        <div className="w-full overflow-x-hidden">
          <SectionLoader>
            <PersonalityTraitsSection traits={traits} />
          </SectionLoader>
        </div>
      </TabsContent>
      
      <TabsContent value="intelligence" className={tabContentClass}>
        <div className="w-full overflow-x-hidden">
          <SectionLoader>
            <IntelligenceSection 
              intelligence={intelligence}
              intelligenceScore={intelligenceScore}
              emotionalIntelligenceScore={emotionalIntelligenceScore}
            />
          </SectionLoader>
        </div>
      </TabsContent>
      
      <TabsContent value="motivation" className={tabContentClass}>
        <div className="w-full overflow-x-hidden">
          <SectionLoader>
            <MotivationSection 
              motivators={motivators}
              inhibitors={inhibitors}
            />
          </SectionLoader>
        </div>
      </TabsContent>
      
      <TabsContent value="values" className={tabContentClass}>
        <div className="w-full overflow-x-hidden">
          <SectionLoader>
            <CoreValuesSection valueSystem={valueSystem} />
          </SectionLoader>
        </div>
      </TabsContent>
      
      <TabsContent value="growth" className={tabContentClass}>
        <div className="w-full overflow-x-hidden">
          <SectionLoader>
            <GrowthAreasSection 
              weaknesses={weaknesses}
              growthAreas={growthAreas}
            />
          </SectionLoader>
        </div>
      </TabsContent>
      
      <TabsContent value="relationships" className={tabContentClass}>
        <div className="w-full overflow-x-hidden">
          <SectionLoader>
            <RelationshipLearningSection 
              relationshipPatterns={processedRelationships}
              learningPathways={learningPathways}
            />
          </SectionLoader>
        </div>
      </TabsContent>
      
      <TabsContent value="career" className={tabContentClass}>
        <div className="w-full overflow-x-hidden">
          <SectionLoader>
            <CareerValuesSection 
              careerSuggestions={careerSuggestions}
              valueSystem={valueSystem}
            />
          </SectionLoader>
        </div>
      </TabsContent>
      
      <TabsContent value="roadmap" className={tabContentClass}>
        <div className="w-full overflow-x-hidden">
          <SectionLoader>
            <RoadmapSection roadmap={roadmap} />
          </SectionLoader>
        </div>
      </TabsContent>
    </>
  );
};

export default ReportTabContent;
