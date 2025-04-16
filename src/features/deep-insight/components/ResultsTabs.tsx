
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Brain, Heart, Lightbulb, Compass } from "lucide-react";
import { motion } from "framer-motion";
import { AnalysisData } from "../hooks/useDeepInsightResults";

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
    >
      <Tabs defaultValue="cognitive" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="cognitive" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">Cognitive</span>
          </TabsTrigger>
          <TabsTrigger value="emotional" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Emotional</span>
          </TabsTrigger>
          <TabsTrigger value="interpersonal" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            <span className="hidden sm:inline">Interpersonal</span>
          </TabsTrigger>
          <TabsTrigger value="growth" className="flex items-center gap-2">
            <Compass className="h-4 w-4" />
            <span className="hidden sm:inline">Growth</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="cognitive">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Cognitive Patterning
              </CardTitle>
              <CardDescription>How you process information and make decisions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Decision Making Style</h3>
                <p>{analysis.cognitivePatterning.decisionMaking}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Learning Approach</h3>
                <p>{analysis.cognitivePatterning.learningStyle}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Attention Pattern</h3>
                <p>{analysis.cognitivePatterning.attention}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="emotional">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Emotional Architecture
              </CardTitle>
              <CardDescription>How you experience and manage emotions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Emotional Awareness</h3>
                <p>{analysis.emotionalArchitecture.emotionalAwareness}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Regulation Style</h3>
                <p>{analysis.emotionalArchitecture.regulationStyle}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Empathic Capacity</h3>
                <p>{analysis.emotionalArchitecture.empathicCapacity}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="interpersonal">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Interpersonal Dynamics
              </CardTitle>
              <CardDescription>How you relate to and interact with others</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Attachment Style</h3>
                <p>{analysis.interpersonalDynamics.attachmentStyle}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Communication Pattern</h3>
                <p>{analysis.interpersonalDynamics.communicationPattern}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Conflict Resolution</h3>
                <p>{analysis.interpersonalDynamics.conflictResolution}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="growth">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Compass className="h-5 w-5 text-primary" />
                Growth Potential
              </CardTitle>
              <CardDescription>Areas for development and personal evolution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Development Areas</h3>
                <ul className="list-disc list-inside space-y-1">
                  {analysis.growthPotential.developmentAreas.map((area: string, i: number) => (
                    <li key={i}>{area}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Recommendations</h3>
                <ul className="list-disc list-inside space-y-1">
                  {analysis.growthPotential.recommendations.map((rec: string, i: number) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};
