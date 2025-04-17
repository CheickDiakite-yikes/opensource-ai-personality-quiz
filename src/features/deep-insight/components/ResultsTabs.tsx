
import React from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { PersonalityAnalysis } from "@/utils/types";
import { TabsNavigator } from "./tabs/TabsNavigator";
import { CognitiveTab } from "./tabs/CognitiveTab";
import { EmotionalTab } from "./tabs/EmotionalTab";
import { InterpersonalTab } from "./tabs/InterpersonalTab";
import { CareerTab } from "./tabs/CareerTab";
import { GrowthTab } from "./tabs/GrowthTab";

interface ResultsTabsProps {
  analysis: PersonalityAnalysis;
  itemVariants: any;
}

export const ResultsTabs: React.FC<ResultsTabsProps> = ({ analysis, itemVariants }) => {
  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      custom={4}
    >
      <Tabs defaultValue="cognitive" className="w-full">
        <TabsNavigator />
        
        <TabsContent value="cognitive">
          <CognitiveTab analysis={analysis} />
        </TabsContent>
        
        <TabsContent value="emotional">
          <EmotionalTab analysis={analysis} />
        </TabsContent>
        
        <TabsContent value="interpersonal">
          <InterpersonalTab analysis={analysis} />
        </TabsContent>
        
        <TabsContent value="career">
          <CareerTab analysis={analysis} />
        </TabsContent>
        
        <TabsContent value="growth">
          <GrowthTab analysis={analysis} />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};
