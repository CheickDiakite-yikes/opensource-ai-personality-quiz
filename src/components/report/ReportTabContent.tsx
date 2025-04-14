
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
import { safeString, ensureStringItems, deepEnsureString } from "@/utils/formatUtils";

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
  
  // Process data safely to prevent React render errors
  const processedTraits = Array.isArray(traits) ? traits : [];
  const processedIntelligence = intelligence || {};
  
  // Ensure everything is properly stringified
  const safeMotivators = ensureStringItems(motivators || []);
  const safeInhibitors = ensureStringItems(inhibitors || []);
  const safeWeaknesses = ensureStringItems(weaknesses || []);
  const safeGrowthAreas = ensureStringItems(growthAreas || []);
  const safeLearningPathways = ensureStringItems(learningPathways || []);
  const safeCareerSuggestions = ensureStringItems(careerSuggestions || []);
  const safeRoadmap = safeString(roadmap || "");
  const safeCognitiveStyle = typeof cognitiveStyle === 'string' ? cognitiveStyle : 
                           (cognitiveStyle && typeof cognitiveStyle === 'object') ? 
                           safeString(cognitiveStyle.primary || cognitiveStyle.description) : '';
  
  // Convert relationshipPatterns to the correct format and ensure values are strings
  const processedRelationships = isRelationshipObject(relationshipPatterns)
    ? {
        strengths: ensureStringItems(relationshipPatterns.strengths || []),
        challenges: ensureStringItems(relationshipPatterns.challenges || []),
        compatibleTypes: ensureStringItems(relationshipPatterns.compatibleTypes || [])
      }
    : { 
        strengths: ensureStringItems(relationshipPatterns || []),
        challenges: [], 
        compatibleTypes: [] 
      };
    
  const tabContentClass = isMobile 
    ? "space-y-3 mt-2 px-0 pb-16 w-full overflow-x-hidden max-w-full-mobile" 
    : "space-y-8 mt-6 w-full";
    
  return (
    <>
      <TabsContent value="overview" className={tabContentClass}>
        <SectionLoader>
          <OverviewSection 
            overview={safeString(overview)} 
            cognitiveStyle={safeCognitiveStyle} 
          />
        </SectionLoader>
        
        <SectionLoader>
          <PersonalityTraitsSection traits={processedTraits} />
        </SectionLoader>
        
        <SectionLoader>
          <IntelligenceSection 
            intelligence={processedIntelligence}
            intelligenceScore={intelligenceScore}
            emotionalIntelligenceScore={emotionalIntelligenceScore}
          />
        </SectionLoader>
        
        <SectionLoader>
          <MotivationSection 
            motivators={safeMotivators}
            inhibitors={safeInhibitors}
          />
        </SectionLoader>
        
        <SectionLoader>
          <CoreValuesSection valueSystem={valueSystem} />
        </SectionLoader>
        
        <SectionLoader>
          <GrowthAreasSection 
            weaknesses={safeWeaknesses}
            growthAreas={safeGrowthAreas}
          />
        </SectionLoader>
        
        <SectionLoader>
          <RelationshipLearningSection 
            relationshipPatterns={processedRelationships}
            learningPathways={safeLearningPathways}
          />
        </SectionLoader>
        
        <SectionLoader>
          <CareerValuesSection 
            careerSuggestions={safeCareerSuggestions}
            valueSystem={valueSystem}
          />
        </SectionLoader>
        
        <SectionLoader>
          <RoadmapSection roadmap={safeRoadmap} />
        </SectionLoader>
      </TabsContent>
      
      <TabsContent value="personality" className={tabContentClass}>
        <SectionLoader>
          <PersonalityTraitsSection traits={processedTraits} />
        </SectionLoader>
      </TabsContent>
      
      <TabsContent value="intelligence" className={tabContentClass}>
        <SectionLoader>
          <IntelligenceSection 
            intelligence={processedIntelligence}
            intelligenceScore={intelligenceScore}
            emotionalIntelligenceScore={emotionalIntelligenceScore}
          />
        </SectionLoader>
      </TabsContent>
      
      <TabsContent value="motivation" className={tabContentClass}>
        <SectionLoader>
          <MotivationSection 
            motivators={safeMotivators}
            inhibitors={safeInhibitors}
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
            weaknesses={safeWeaknesses}
            growthAreas={safeGrowthAreas}
          />
        </SectionLoader>
      </TabsContent>
      
      <TabsContent value="relationships" className={tabContentClass}>
        <SectionLoader>
          <RelationshipLearningSection 
            relationshipPatterns={processedRelationships}
            learningPathways={safeLearningPathways}
          />
        </SectionLoader>
      </TabsContent>
      
      <TabsContent value="career" className={tabContentClass}>
        <SectionLoader>
          <CareerValuesSection 
            careerSuggestions={safeCareerSuggestions}
            valueSystem={valueSystem}
          />
        </SectionLoader>
      </TabsContent>
      
      <TabsContent value="roadmap" className={tabContentClass}>
        <SectionLoader>
          <RoadmapSection roadmap={safeRoadmap} />
        </SectionLoader>
      </TabsContent>
    </>
  );
};

export default ReportTabContent;
