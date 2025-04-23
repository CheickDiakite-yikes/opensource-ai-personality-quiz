
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Heart, Users, Sparkles } from "lucide-react";
import { DeepInsightAnalysis } from "../types/deepInsight";

interface AnalysisInsightsProps {
  analysis: DeepInsightAnalysis;
}

const AnalysisInsights: React.FC<AnalysisInsightsProps> = ({ analysis }) => {
  const {
    cognitive_patterning,
    emotional_architecture,
    interpersonal_dynamics,
    core_traits
  } = analysis;

  // Safety checks for null values
  const cognitiveData = cognitive_patterning || {};
  const emotionalData = emotional_architecture || {};
  const interpersonalData = interpersonal_dynamics || {};
  const traitsData = core_traits || {};

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-blue-200 dark:border-blue-900">
          <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
            <CardTitle className="flex items-center text-blue-700 dark:text-blue-400">
              <Brain className="h-5 w-5 mr-2" /> Cognitive Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {cognitiveData.decisionMaking && (
                <div>
                  <h4 className="font-medium mb-2">Decision Making</h4>
                  <p className="text-muted-foreground text-sm">{cognitiveData.decisionMaking}</p>
                </div>
              )}
              {cognitiveData.learningStyle && (
                <div>
                  <h4 className="font-medium mb-2">Learning Style</h4>
                  <p className="text-muted-foreground text-sm">{cognitiveData.learningStyle}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-rose-200 dark:border-rose-900">
          <CardHeader className="bg-rose-50 dark:bg-rose-900/20">
            <CardTitle className="flex items-center text-rose-700 dark:text-rose-400">
              <Heart className="h-5 w-5 mr-2" /> Emotional Architecture
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {emotionalData.emotionalAwareness && (
                <div>
                  <h4 className="font-medium mb-2">Emotional Awareness</h4>
                  <p className="text-muted-foreground text-sm">{emotionalData.emotionalAwareness}</p>
                </div>
              )}
              {emotionalData.regulationStyle && (
                <div>
                  <h4 className="font-medium mb-2">Regulation Style</h4>
                  <p className="text-muted-foreground text-sm">{emotionalData.regulationStyle}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-violet-200 dark:border-violet-900">
          <CardHeader className="bg-violet-50 dark:bg-violet-900/20">
            <CardTitle className="flex items-center text-violet-700 dark:text-violet-400">
              <Users className="h-5 w-5 mr-2" /> Interpersonal Dynamics
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {interpersonalData.attachmentStyle && (
                <div>
                  <h4 className="font-medium mb-2">Attachment Style</h4>
                  <p className="text-muted-foreground text-sm">{interpersonalData.attachmentStyle}</p>
                </div>
              )}
              {interpersonalData.communicationPattern && (
                <div>
                  <h4 className="font-medium mb-2">Communication Pattern</h4>
                  <p className="text-muted-foreground text-sm">{interpersonalData.communicationPattern}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 dark:border-green-900">
          <CardHeader className="bg-green-50 dark:bg-green-900/20">
            <CardTitle className="flex items-center text-green-700 dark:text-green-400">
              <Sparkles className="h-5 w-5 mr-2" /> Core Traits
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {traitsData.primary && (
                <div>
                  <h4 className="font-medium mb-2">Primary Trait</h4>
                  <p className="text-muted-foreground text-sm">{traitsData.primary}</p>
                </div>
              )}
              {traitsData.secondary && (
                <div>
                  <h4 className="font-medium mb-2">Secondary Trait</h4>
                  <p className="text-muted-foreground text-sm">{traitsData.secondary}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalysisInsights;
