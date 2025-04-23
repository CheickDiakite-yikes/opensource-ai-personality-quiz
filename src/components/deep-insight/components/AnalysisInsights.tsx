
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Heart, Users, Sparkles } from "lucide-react";
import { DeepInsightAnalysis } from "../types/deepInsight";

interface AnalysisInsightsProps {
  analysis: DeepInsightAnalysis;
}

const AnalysisInsights: React.FC<AnalysisInsightsProps> = ({ analysis }) => {
  // Safety check for each data section
  const cognitiveData = analysis.cognitive_patterning || {};
  const emotionalData = analysis.emotional_architecture || {};
  const interpersonalData = analysis.interpersonal_dynamics || {};
  const traitsData = analysis.core_traits || {};
  
  // Helper function to check if a section has actual data
  const hasData = (obj: any) => {
    return obj && typeof obj === 'object' && Object.keys(obj).some(key => {
      const value = obj[key];
      return value !== null && value !== undefined && value !== '';
    });
  };
  
  // Check if we have enough real data to display
  const hasCognitiveData = hasData(cognitiveData);
  const hasEmotionalData = hasData(emotionalData);
  const hasInterpersonalData = hasData(interpersonalData);
  const hasTraitsData = hasData(traitsData);
  
  // Only render if we have at least some data
  if (!hasCognitiveData && !hasEmotionalData && !hasInterpersonalData && !hasTraitsData) {
    return (
      <Card className="mb-8 border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/20">
        <CardHeader>
          <CardTitle className="flex items-center text-amber-700 dark:text-amber-400">
            <Sparkles className="h-5 w-5 mr-2" /> Analysis in Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Your detailed analysis insights are still being processed. This may take a few minutes as our AI processes your responses.
            Check back soon to see your complete profile.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hasCognitiveData && (
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
                {!cognitiveData.decisionMaking && !cognitiveData.learningStyle && (
                  <p className="text-muted-foreground text-sm">Additional cognitive insights are being processed.</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {hasEmotionalData && (
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
                {!emotionalData.emotionalAwareness && !emotionalData.regulationStyle && (
                  <p className="text-muted-foreground text-sm">Additional emotional insights are being processed.</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {hasInterpersonalData && (
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
                {!interpersonalData.attachmentStyle && !interpersonalData.communicationPattern && (
                  <p className="text-muted-foreground text-sm">Additional interpersonal insights are being processed.</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {hasTraitsData && (
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
                {!traitsData.primary && !traitsData.secondary && (
                  <p className="text-muted-foreground text-sm">Your core traits are still being analyzed.</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AnalysisInsights;
