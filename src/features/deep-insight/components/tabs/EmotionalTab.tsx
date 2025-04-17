
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Heart, Sparkles, ShieldCheck, Scale } from "lucide-react";
import { PersonalityAnalysis } from "@/utils/types";

interface EmotionalTabProps {
  analysis: PersonalityAnalysis;
}

export const EmotionalTab: React.FC<EmotionalTabProps> = ({ analysis }) => {
  const emotionalArchitecture = analysis.emotionalArchitecture || {
    emotionalAwareness: "You have a good understanding of your emotional states and can often identify the sources of your feelings.",
    regulationStyle: "You manage emotions through a balanced approach, using both cognitive strategies and healthy expression.",
    empathicCapacity: "You connect well with others' emotions and can offer meaningful support while maintaining healthy boundaries.",
    emotionalPatterns: "Your emotional responses tend to be measured and appropriate to situations. You generally recover well from emotional setbacks.",
    emotionalStrengths: ["Self-awareness", "Balanced expression", "Recovery capacity"],
    emotionalChallenges: ["May occasionally suppress emotions", "Could benefit from more emotional vocabulary"],
    recommendations: ["Practice naming specific emotions", "Journal about emotional experiences", "Engage in regular reflection"]
  };

  // Extract additional fields with fallbacks
  const emotionalPatterns = emotionalArchitecture.emotionalPatterns || 
    "Your emotional responses tend to be measured and appropriate to situations.";
    
  const emotionalStrengths = Array.isArray(emotionalArchitecture.emotionalStrengths) 
    ? emotionalArchitecture.emotionalStrengths 
    : ["Self-awareness", "Balanced expression", "Recovery capacity"];
    
  const emotionalChallenges = Array.isArray(emotionalArchitecture.emotionalChallenges)
    ? emotionalArchitecture.emotionalChallenges
    : ["May occasionally suppress emotions", "Could benefit from more emotional vocabulary"];
    
  const recommendations = Array.isArray(emotionalArchitecture.recommendations)
    ? emotionalArchitecture.recommendations
    : ["Practice naming specific emotions", "Journal about emotional experiences", "Engage in regular reflection"];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          Emotional Architecture
        </CardTitle>
        <CardDescription>How you experience, process, and express emotions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-background/80 rounded-lg border border-border/30 hover:border-border/60 transition-colors">
          <h3 className="font-semibold mb-3 text-lg">Emotional Awareness</h3>
          <p className="text-muted-foreground leading-relaxed">{emotionalArchitecture.emotionalAwareness}</p>
        </div>
        
        <div className="p-4 bg-background/80 rounded-lg border border-border/30 hover:border-border/60 transition-colors">
          <h3 className="font-semibold mb-3 text-lg">Regulation Style</h3>
          <p className="text-muted-foreground leading-relaxed">{emotionalArchitecture.regulationStyle}</p>
        </div>
        
        <div className="p-4 bg-background/80 rounded-lg border border-border/30 hover:border-border/60 transition-colors">
          <h3 className="font-semibold mb-3 text-lg">Empathic Capacity</h3>
          <p className="text-muted-foreground leading-relaxed">{emotionalArchitecture.empathicCapacity}</p>
        </div>
        
        <div className="p-4 bg-background/80 rounded-lg border border-border/30 hover:border-border/60 transition-colors">
          <h3 className="font-semibold mb-3 text-lg">Emotional Patterns</h3>
          <p className="text-muted-foreground leading-relaxed">{emotionalPatterns}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-background/80 rounded-lg border border-border/30">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-green-500" />
              <h3 className="font-semibold">Emotional Strengths</h3>
            </div>
            <ul className="space-y-2">
              {emotionalStrengths.map((strength, index) => (
                <li key={index} className="text-muted-foreground flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 mt-2"></div>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="p-4 bg-background/80 rounded-lg border border-border/30">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="h-4 w-4 text-amber-500" />
              <h3 className="font-semibold">Growth Areas</h3>
            </div>
            <ul className="space-y-2">
              {emotionalChallenges.map((challenge, index) => (
                <li key={index} className="text-muted-foreground flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-amber-500 mt-2"></div>
                  <span>{challenge}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="p-4 bg-secondary/10 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Scale className="h-4 w-4 text-blue-500" />
            <h3 className="font-semibold">Recommended Practices</h3>
          </div>
          <ul className="space-y-2">
            {recommendations.map((rec, index) => (
              <li key={index} className="text-muted-foreground flex items-start gap-2">
                <span className="text-primary font-medium">{index + 1}.</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
