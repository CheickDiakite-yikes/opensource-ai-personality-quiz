import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Brain, Heart, Lightbulb, Compass, Users, Briefcase, Sparkles, ScrollText } from "lucide-react";
import { motion } from "framer-motion";
import { AnalysisData } from "../utils/analysis/analysisGenerator";

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
                <Users className="h-5 w-5 text-primary" />
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
              <div className="mt-4">
                <h3 className="font-semibold mb-2 flex items-center">
                  <Sparkles className="h-4 w-4 text-primary mr-1" />
                  Relationship Compatibility
                </h3>
                <div className="bg-secondary/10 p-3 rounded-md">
                  <h4 className="text-sm font-medium mb-1">Most Compatible Types</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {analysis.relationshipPatterns.compatibleTypes?.map((type, index) => (
                      <li key={index}>{type}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        
        <TabsContent value="career">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Career Insights
              </CardTitle>
              <CardDescription>Career paths and workplace dynamics that align with your personality</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Recommended Career Paths</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {analysis.careerSuggestions.map((career, i) => (
                    <div key={i} className="flex items-center bg-secondary/10 p-2 rounded-md">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 text-xs text-primary">
                        {i + 1}
                      </div>
                      <span>{career}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Learning Pathways</h3>
                <div className="grid grid-cols-1 gap-2">
                  {analysis.learningPathways.map((pathway, i) => (
                    <div key={i} className="flex items-center bg-secondary/10 p-2 rounded-md">
                      <ScrollText className="h-4 w-4 text-primary mr-2" />
                      <span>{pathway}</span>
                    </div>
                  ))}
                </div>
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
