
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Heart, ListChecks, AlertCircle, Lightbulb } from "lucide-react";
import { PersonalityAnalysis } from "@/utils/types";

interface EmotionalTabProps {
  analysis: PersonalityAnalysis;
}

export const EmotionalTab: React.FC<EmotionalTabProps> = ({ analysis }) => {
  const emotionalArchitecture = analysis.emotionalArchitecture || {
    emotionalAwareness: "You have a good understanding of your emotional states and can often identify the sources of your feelings.",
    regulationStyle: "You manage emotions through a balanced approach, using both cognitive strategies and healthy expression.",
    empathicCapacity: "You connect well with others' emotions and can offer meaningful support while maintaining healthy boundaries.",
    emotionalPatterns: "Your emotional patterns show a balanced approach to processing and expressing emotions.",
    emotionalStrengths: ["Strong emotional awareness", "Effective self-regulation", "Good empathic understanding"],
    emotionalChallenges: ["Managing intense emotions", "Balancing emotional needs", "Setting emotional boundaries"],
    recommendations: ["Practice mindfulness regularly", "Develop emotional vocabulary", "Establish emotional boundaries"]
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          Emotional Architecture
        </CardTitle>
        <CardDescription>How you experience and manage emotions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-3 text-lg">Emotional Awareness</h3>
          <p className="text-muted-foreground leading-relaxed">{emotionalArchitecture.emotionalAwareness}</p>
        </div>
        
        <div>
          <h3 className="font-semibold mb-3 text-lg">Regulation Style</h3>
          <p className="text-muted-foreground leading-relaxed">{emotionalArchitecture.regulationStyle}</p>
        </div>
        
        <div>
          <h3 className="font-semibold mb-3 text-lg">Empathic Capacity</h3>
          <p className="text-muted-foreground leading-relaxed">{emotionalArchitecture.empathicCapacity}</p>
        </div>
        
        <div>
          <h3 className="font-semibold mb-3 text-lg">Emotional Patterns</h3>
          <p className="text-muted-foreground leading-relaxed">{emotionalArchitecture.emotionalPatterns}</p>
        </div>
        
        <div>
          <h3 className="font-semibold mb-3 text-lg flex items-center">
            <ListChecks className="h-4 w-4 mr-2 text-primary" />
            Emotional Strengths
          </h3>
          <ul className="space-y-1 text-muted-foreground">
            {Array.isArray(emotionalArchitecture.emotionalStrengths) ? 
              emotionalArchitecture.emotionalStrengths.map((strength, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{strength}</span>
                </li>
              )) : 
              <li>Information not available</li>
            }
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold mb-3 text-lg flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 text-primary" />
            Emotional Challenges
          </h3>
          <ul className="space-y-1 text-muted-foreground">
            {Array.isArray(emotionalArchitecture.emotionalChallenges) ? 
              emotionalArchitecture.emotionalChallenges.map((challenge, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{challenge}</span>
                </li>
              )) : 
              <li>Information not available</li>
            }
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold mb-3 text-lg flex items-center">
            <Lightbulb className="h-4 w-4 mr-2 text-primary" />
            Recommendations
          </h3>
          <ul className="space-y-1 text-muted-foreground">
            {Array.isArray(emotionalArchitecture.recommendations) ? 
              emotionalArchitecture.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{recommendation}</span>
                </li>
              )) : 
              <li>Information not available</li>
            }
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
