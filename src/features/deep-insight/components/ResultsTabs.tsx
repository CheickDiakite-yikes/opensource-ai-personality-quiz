
import React from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { AnalysisData } from "../utils/analysis/types";
import { TabsScrollableNav } from "./tabs/TabsScrollableNav";
import { CognitiveTab } from "./tabs/CognitiveTab";
import { EmotionalTab } from "./tabs/EmotionalTab";
import { InterpersonalTab } from "./tabs/InterpersonalTab";
import { CareerTab } from "./tabs/CareerTab";
import { GrowthTab } from "./tabs/GrowthTab";

interface ResultsTabsProps {
  analysis: AnalysisData;
  itemVariants: any;
}

export const ResultsTabs: React.FC<ResultsTabsProps> = ({ analysis, itemVariants }) => {
  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      custom={4}
      className="w-full max-w-4xl mx-auto"
    >
      <Tabs defaultValue="cognitive" className="w-full">
        <div className="sticky top-0 z-10 backdrop-blur-sm pb-1">
          <TabsScrollableNav />
        </div>
        
        <div className="mt-6 space-y-6 px-4">
          <TabsContent value="cognitive" className="m-0 focus-visible:outline-none focus-visible:ring-0">
            <CognitiveTab analysis={analysis} />
          </TabsContent>
          
          <TabsContent value="emotional" className="m-0 focus-visible:outline-none focus-visible:ring-0">
            <EmotionalTab analysis={analysis} />
          </TabsContent>
          
          <TabsContent value="interpersonal" className="m-0 focus-visible:outline-none focus-visible:ring-0">
            <InterpersonalTab analysis={analysis} />
          </TabsContent>
          
          <TabsContent value="career" className="m-0 focus-visible:outline-none focus-visible:ring-0">
            <CareerTab analysis={analysis} />
          </TabsContent>
          
          <TabsContent value="growth" className="m-0 focus-visible:outline-none focus-visible:ring-0">
            <GrowthTab analysis={analysis} />
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  );
};
