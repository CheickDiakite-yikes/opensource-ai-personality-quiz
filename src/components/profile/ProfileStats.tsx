
import React from "react";
import { PersonalityAnalysis, RelationshipPatterns, ValueSystemType, CognitiveStyleType } from "@/utils/types";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface ProfileStatsProps {
  analysis: PersonalityAnalysis;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ analysis }) => {
  // Create a credit rating based on the intelligence and emotional intelligence
  const getCreditRating = (score: number): { rating: string; color: string } => {
    if (score >= 90) return { rating: "Exceptional", color: "text-emerald-600" };
    if (score >= 80) return { rating: "Excellent", color: "text-blue-600" };
    if (score >= 70) return { rating: "Very Good", color: "text-green-600" };
    if (score >= 60) return { rating: "Good", color: "text-yellow-600" };
    if (score >= 50) return { rating: "Average", color: "text-orange-600" };
    return { rating: "Developing", color: "text-red-600" };
  };
  
  const intelligenceRating = getCreditRating(analysis.intelligenceScore);
  const emotionalRating = getCreditRating(analysis.emotionalIntelligenceScore);
  
  // Calculate the average score of all traits
  const avgTraitScore = analysis.traits.reduce((acc, trait) => acc + trait.score, 0) / analysis.traits.length;
  const traitRating = getCreditRating(avgTraitScore * 10);
  
  // Type guards
  const isValueSystemArray = (value: ValueSystemType): value is string[] => {
    return Array.isArray(value);
  };
  
  const isCognitiveStyleObject = (value: CognitiveStyleType): value is { primary: string; secondary: string; description: string } => {
    return typeof value === 'object' && value !== null;
  };
  
  const isRelationshipPatternObject = (value: RelationshipPatterns | string[]): value is RelationshipPatterns => {
    return !Array.isArray(value) && typeof value === 'object' && value !== null;
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Intelligence Score */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="font-medium">Intelligence</div>
            <div className={`font-semibold ${intelligenceRating.color}`}>
              {intelligenceRating.rating}
            </div>
          </div>
          <Progress value={analysis.intelligenceScore} className="h-2" />
          <div className="text-sm text-muted-foreground">
            {analysis.intelligence.type}
          </div>
        </div>
        
        {/* Emotional Intelligence Score */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="font-medium">Emotional Intelligence</div>
            <div className={`font-semibold ${emotionalRating.color}`}>
              {emotionalRating.rating}
            </div>
          </div>
          <Progress value={analysis.emotionalIntelligenceScore} className="h-2" />
          <div className="text-sm text-muted-foreground">
            Based on relational patterns and empathy
          </div>
        </div>
        
        {/* Trait Average Score */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="font-medium">Trait Average</div>
            <div className={`font-semibold ${traitRating.color}`}>
              {traitRating.rating}
            </div>
          </div>
          <Progress value={avgTraitScore * 10} className="h-2" />
          <div className="text-sm text-muted-foreground">
            Average of all trait scores
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Value System */}
      <div className="space-y-3">
        <h3 className="font-semibold">Your Value System</h3>
        <div className="flex flex-wrap gap-2">
          {isValueSystemArray(analysis.valueSystem) ? 
            analysis.valueSystem.map((value, index) => (
              <div 
                key={index} 
                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
              >
                {value}
              </div>
            )) : 
            // If valueSystem is an object with strengths
            analysis.valueSystem.strengths.map((value, index) => (
              <div 
                key={index} 
                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
              >
                {value}
              </div>
            ))
          }
        </div>
      </div>
      
      <Separator />
      
      {/* Cognitive Style */}
      <div className="space-y-3">
        <h3 className="font-semibold">Your Cognitive Style</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Primary</div>
            <div className="font-medium">
              {isCognitiveStyleObject(analysis.cognitiveStyle) ? 
                analysis.cognitiveStyle.primary : 
                analysis.cognitiveStyle}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Secondary</div>
            <div className="font-medium">
              {isCognitiveStyleObject(analysis.cognitiveStyle) ? 
                analysis.cognitiveStyle.secondary : 
                'N/A'}
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {isCognitiveStyleObject(analysis.cognitiveStyle) ? 
            analysis.cognitiveStyle.description : 
            ''}
        </p>
      </div>
      
      <Separator />
      
      {/* Compatible Types */}
      <div className="space-y-3">
        <h3 className="font-semibold">Compatible With</h3>
        <div className="flex flex-wrap gap-2">
          {isRelationshipPatternObject(analysis.relationshipPatterns) ? 
            analysis.relationshipPatterns.compatibleTypes.map((type, index) => (
              <div 
                key={index} 
                className="px-3 py-1 bg-muted rounded-full text-sm"
              >
                {type}
              </div>
            )) :
            analysis.relationshipPatterns.map((type, index) => (
              <div 
                key={index} 
                className="px-3 py-1 bg-muted rounded-full text-sm"
              >
                {type}
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;
