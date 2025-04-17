
import React from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { PersonalityAnalysis } from "@/utils/types";
import { TabsScrollableNav } from "./tabs/TabsScrollableNav";
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
      className="px-4 py-6 bg-background/50 backdrop-blur-sm rounded-xl border border-border/50 shadow-md"
    >
      <h2 className="text-2xl font-bold mb-4">Detailed Analysis</h2>
      
      <Tabs defaultValue="cognitive" className="w-full">
        <TabsScrollableNav />
        
        <div className="mt-6">
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
        </div>
      </Tabs>
    </motion.div>
  );
};
