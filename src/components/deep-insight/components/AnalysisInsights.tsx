
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Heart, Users, Star } from "lucide-react";
import { DeepInsightAnalysis } from "../types/deepInsight";

interface AnalysisInsightsProps {
  analysis: DeepInsightAnalysis;
}

const AnalysisInsights: React.FC<AnalysisInsightsProps> = ({ analysis }) => {
  const cognitiveData = analysis.cognitive_patterning || {};
  const emotionalData = analysis.emotional_architecture || {};
  const interpersonalData = analysis.interpersonal_dynamics || {};
  const traitsData = analysis.core_traits || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Cognitive Profile Card */}
      <Card className="bg-slate-900/95 border-slate-800/50 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="h-6 w-6 text-blue-400" />
            <h3 className="text-xl font-serif text-blue-400">Cognitive Profile</h3>
          </div>
          <div className="text-slate-300">
            {cognitiveData.decisionMaking || cognitiveData.learningStyle ? (
              <div className="space-y-4">
                {cognitiveData.decisionMaking && <p>{cognitiveData.decisionMaking}</p>}
                {cognitiveData.learningStyle && <p>{cognitiveData.learningStyle}</p>}
              </div>
            ) : (
              <p className="text-slate-400">No cognitive insights available.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Emotional Architecture Card */}
      <Card className="bg-rose-950/95 border-rose-900/50 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="h-6 w-6 text-rose-400" />
            <h3 className="text-xl font-serif text-rose-400">Emotional Architecture</h3>
          </div>
          <div className="text-rose-100">
            {emotionalData.emotionalAwareness || emotionalData.regulationStyle ? (
              <div className="space-y-4">
                {emotionalData.emotionalAwareness && <p>{emotionalData.emotionalAwareness}</p>}
                {emotionalData.regulationStyle && <p>{emotionalData.regulationStyle}</p>}
              </div>
            ) : (
              <p className="text-rose-300">No emotional insights available.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Interpersonal Dynamics Card */}
      <Card className="bg-purple-950/95 border-purple-900/50 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-6 w-6 text-purple-400" />
            <h3 className="text-xl font-serif text-purple-400">Interpersonal Dynamics</h3>
          </div>
          <div className="text-purple-100">
            {interpersonalData.attachmentStyle || interpersonalData.communicationPattern ? (
              <div className="space-y-4">
                {interpersonalData.attachmentStyle && <p>{interpersonalData.attachmentStyle}</p>}
                {interpersonalData.communicationPattern && <p>{interpersonalData.communicationPattern}</p>}
              </div>
            ) : (
              <p className="text-purple-300">No interpersonal insights available.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Core Traits Card */}
      <Card className="bg-emerald-950/95 border-emerald-900/50 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Star className="h-6 w-6 text-emerald-400" />
            <h3 className="text-xl font-serif text-emerald-400">Core Traits</h3>
          </div>
          <div className="text-emerald-100">
            {traitsData.primary || traitsData.secondary ? (
              <div className="space-y-4">
                {traitsData.primary && (
                  <div>
                    <h4 className="font-medium text-emerald-300 mb-1">Primary Trait</h4>
                    <p>{traitsData.primary}</p>
                  </div>
                )}
                {traitsData.secondary && (
                  <div>
                    <h4 className="font-medium text-emerald-300 mb-1">Secondary Trait</h4>
                    <p>{traitsData.secondary}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-emerald-300">No core traits available.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisInsights;
