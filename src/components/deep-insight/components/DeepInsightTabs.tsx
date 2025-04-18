
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Star, Lightbulb, Flower, Users, 
  Sparkles, Briefcase, FlameIcon, Heart 
} from "lucide-react";
import { DeepInsightAnalysis } from "../types/deepInsight";

// Import all section components
import CoreTraitsSection from "../results-sections/CoreTraitsSection";
import CognitivePatterningSection from "../results-sections/CognitivePatterningSection";
import EmotionalArchitectureSection from "../results-sections/EmotionalArchitectureSection";
import InterpersonalDynamicsSection from "../results-sections/InterpersonalDynamicsSection";
import GrowthPotentialSection from "../results-sections/GrowthPotentialSection";
import CareerInsightsSection from "../results-sections/CareerInsightsSection";
import MotivationSection from "../results-sections/MotivationSection";

interface DeepInsightTabsProps {
  analysis: DeepInsightAnalysis;
}

const DeepInsightTabs: React.FC<DeepInsightTabsProps> = ({ analysis }) => {
  return (
    <Tabs defaultValue="traits" className="mb-8">
      <TabsList className="grid grid-cols-4 grid-rows-2 gap-2 mb-6 p-1.5 bg-muted/30 rounded-lg h-auto">
        <TabsTrigger value="traits" className="flex items-center gap-2">
          <Star className="h-4 w-4" />
          Core Traits
        </TabsTrigger>
        <TabsTrigger value="cognitive" className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4" />
          Cognitive
        </TabsTrigger>
        <TabsTrigger value="emotional" className="flex items-center gap-2">
          <Flower className="h-4 w-4" />
          Emotional
        </TabsTrigger>
        <TabsTrigger value="interpersonal" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Interpersonal
        </TabsTrigger>
        <TabsTrigger value="growth" className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Growth
        </TabsTrigger>
        <TabsTrigger value="career" className="flex items-center gap-2">
          <Briefcase className="h-4 w-4" />
          Career
        </TabsTrigger>
        <TabsTrigger value="motivation" className="flex items-center gap-2">
          <FlameIcon className="h-4 w-4" />
          Motivation
        </TabsTrigger>
        <TabsTrigger value="relationships" className="flex items-center gap-2">
          <Heart className="h-4 w-4" />
          Relationships
        </TabsTrigger>
      </TabsList>

      <TabsContent value="traits">
        <CoreTraitsSection data={analysis.core_traits} />
      </TabsContent>
      
      <TabsContent value="cognitive">
        <CognitivePatterningSection data={analysis.cognitive_patterning} />
      </TabsContent>
      
      <TabsContent value="emotional">
        <EmotionalArchitectureSection data={analysis.emotional_architecture} />
      </TabsContent>
      
      <TabsContent value="interpersonal">
        <InterpersonalDynamicsSection data={analysis.interpersonal_dynamics} />
      </TabsContent>
      
      <TabsContent value="growth">
        <GrowthPotentialSection data={analysis.growth_potential} />
      </TabsContent>
      
      <TabsContent value="career">
        <CareerInsightsSection careerInsights={analysis.complete_analysis?.careerInsights || {}} />
      </TabsContent>
      
      <TabsContent value="motivation">
        <MotivationSection 
          motivators={analysis.complete_analysis?.motivationalProfile?.primaryDrivers} 
          inhibitors={analysis.complete_analysis?.motivationalProfile?.inhibitors}
        />
      </TabsContent>
      
      <TabsContent value="relationships">
        <InterpersonalDynamicsSection data={analysis.interpersonal_dynamics} />
      </TabsContent>
    </Tabs>
  );
};

export default DeepInsightTabs;
