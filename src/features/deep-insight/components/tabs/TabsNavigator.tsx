
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Heart, Users, Briefcase, Compass } from "lucide-react";

interface TabsNavigatorProps {
  defaultValue?: string;
}

export const TabsNavigator: React.FC<TabsNavigatorProps> = ({ defaultValue = "cognitive" }) => {
  return (
    <TabsList className="grid grid-cols-5 mb-4">
      <TabsTrigger value="cognitive" className="flex items-center gap-2">
        <Brain className="h-4 w-4" />
        <span className="hidden sm:inline">Cognitive</span>
      </TabsTrigger>
      <TabsTrigger value="emotional" className="flex items-center gap-2">
        <Heart className="h-4 w-4" />
        <span className="hidden sm:inline">Emotional</span>
      </TabsTrigger>
      <TabsTrigger value="interpersonal" className="flex items-center gap-2">
        <Users className="h-4 w-4" />
        <span className="hidden sm:inline">Interpersonal</span>
      </TabsTrigger>
      <TabsTrigger value="career" className="flex items-center gap-2">
        <Briefcase className="h-4 w-4" />
        <span className="hidden sm:inline">Career</span>
      </TabsTrigger>
      <TabsTrigger value="growth" className="flex items-center gap-2">
        <Compass className="h-4 w-4" />
        <span className="hidden sm:inline">Growth</span>
      </TabsTrigger>
    </TabsList>
  );
};
