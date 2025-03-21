
import React, { Suspense, useState, useEffect } from "react";
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
import { ErrorBoundary } from "@/components/ui/error-boundary";

interface ReportTabContentProps {
  analysis: PersonalityAnalysis;
}

// Error fallback component for sections
const SectionErrorFallback = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => (
  <div className="bg-card p-6 rounded-lg border border-destructive/30">
    <h3 className="text-lg font-medium mb-2">Section Load Error</h3>
    <p className="text-muted-foreground mb-4">
      There was a problem loading this section of your report.
    </p>
    <button 
      onClick={resetErrorBoundary}
      className="px-3 py-1.5 bg-primary text-primary-foreground text-sm rounded"
    >
      Try Again
    </button>
  </div>
);

// Creating a loading wrapper component for sections with error handling
const SectionLoader = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary FallbackComponent={SectionErrorFallback}>
    <Suspense fallback={<ReportSectionSkeleton />}>
      {children}
    </Suspense>
  </ErrorBoundary>
);

const ReportTabContent: React.FC<ReportTabContentProps> = ({ analysis }) => {
  const [isContentMounted, setIsContentMounted] = useState(false);
  
  useEffect(() => {
    // Small delay to ensure DOM is ready before mounting content
    // This can prevent some rendering issues
    const timer = setTimeout(() => {
      setIsContentMounted(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!isContentMounted) {
    return <div className="min-h-[200px]"><ReportSectionSkeleton /></div>;
  }
  
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
  
  // Convert relationshipPatterns to the correct format with error handling
  const processedRelationships = (() => {
    try {
      return isRelationshipObject(relationshipPatterns)
        ? relationshipPatterns
        : { strengths: relationshipPatterns || [], challenges: [], compatibleTypes: [] };
    } catch (error) {
      console.error("Error processing relationship patterns:", error);
      return { strengths: [], challenges: [], compatibleTypes: [] };
    }
  })();
    
  return (
    <>
      <TabsContent value="overview" className="space-y-10 mt-6">
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
      
      <TabsContent value="personality" className="space-y-10 mt-6">
        <SectionLoader>
          <PersonalityTraitsSection traits={traits} />
        </SectionLoader>
      </TabsContent>
      
      <TabsContent value="intelligence" className="space-y-10 mt-6">
        <SectionLoader>
          <IntelligenceSection 
            intelligence={intelligence}
            intelligenceScore={intelligenceScore}
            emotionalIntelligenceScore={emotionalIntelligenceScore}
          />
        </SectionLoader>
      </TabsContent>
      
      <TabsContent value="motivation" className="space-y-10 mt-6">
        <SectionLoader>
          <MotivationSection 
            motivators={motivators}
            inhibitors={inhibitors}
          />
        </SectionLoader>
      </TabsContent>
      
      <TabsContent value="values" className="space-y-10 mt-6">
        <SectionLoader>
          <CoreValuesSection valueSystem={valueSystem} />
        </SectionLoader>
      </TabsContent>
      
      <TabsContent value="growth" className="space-y-10 mt-6">
        <SectionLoader>
          <GrowthAreasSection 
            weaknesses={weaknesses}
            growthAreas={growthAreas}
          />
        </SectionLoader>
      </TabsContent>
      
      <TabsContent value="relationships" className="space-y-10 mt-6">
        <SectionLoader>
          <RelationshipLearningSection 
            relationshipPatterns={processedRelationships}
            learningPathways={learningPathways}
          />
        </SectionLoader>
      </TabsContent>
      
      <TabsContent value="career" className="space-y-10 mt-6">
        <SectionLoader>
          <CareerValuesSection 
            careerSuggestions={careerSuggestions}
            valueSystem={valueSystem}
          />
        </SectionLoader>
      </TabsContent>
      
      <TabsContent value="roadmap" className="space-y-10 mt-6">
        <SectionLoader>
          <RoadmapSection roadmap={roadmap} />
        </SectionLoader>
      </TabsContent>
    </>
  );
};

export default ReportTabContent;
