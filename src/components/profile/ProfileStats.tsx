
import React from "react";
import { PersonalityAnalysis, RelationshipPatterns, ValueSystemType, CognitiveStyleType } from "@/utils/types";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  
  // Convert scores to percentages for display (0-100 scale)
  const intelligenceScoreNormalized = analysis.intelligenceScore;
  const emotionalScoreNormalized = analysis.emotionalIntelligenceScore;
  
  const intelligenceRating = getCreditRating(intelligenceScoreNormalized);
  const emotionalRating = getCreditRating(emotionalScoreNormalized);
  
  // Format trait score for consistent display across the app
  const formatTraitScore = (score: number): number => {
    // If score is already between 0 and 10 (but greater than 1), use it directly
    if (score > 1 && score <= 10) {
      return Math.round(score);
    }
    // If score is between 0 and 1, scale to 0-10
    else if (score >= 0 && score <= 1) {
      return Math.round(score * 10);
    }
    // If score is greater than 10 (e.g., 0-100 scale), convert to 0-10
    else {
      return Math.round((score / 100) * 10);
    }
  };
  
  // Calculate the average score of all traits with consistent formatting
  const avgTraitScore = analysis.traits.length > 0 
    ? analysis.traits.reduce((acc, trait) => {
        // Normalize trait score to 0-1 scale for calculation
        const normalizedTraitScore = trait.score >= 0 && trait.score <= 1 
          ? trait.score 
          : (trait.score >= 0 && trait.score <= 10) 
            ? trait.score / 10 
            : trait.score / 100;
        return acc + normalizedTraitScore;
      }, 0) / analysis.traits.length
    : 0.5;
    
  const traitRating = getCreditRating(avgTraitScore * 100);
  
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
        {/* Cognitive Flexibility Score */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="font-medium flex items-center">
              Cognitive Flexibility
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-3.5 w-3.5 ml-1 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[250px]">
                    <p className="text-xs">Measures how adaptable your thinking processes are across different contexts and challenges.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className={`font-semibold ${intelligenceRating.color}`}>
              {intelligenceRating.rating}
            </div>
          </div>
          <Progress value={analysis.intelligenceScore} className="h-2" />
          <div className="text-sm text-muted-foreground">
            {analysis.intelligence.type} - {Math.round(intelligenceScoreNormalized)}/100
          </div>
        </div>
        
        {/* Emotional Intelligence Score */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="font-medium flex items-center">
              Emotional Intelligence
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-3.5 w-3.5 ml-1 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[250px]">
                    <p className="text-xs">Measures your ability to understand, manage emotions and connect with others.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className={`font-semibold ${emotionalRating.color}`}>
              {emotionalRating.rating}
            </div>
          </div>
          <Progress value={analysis.emotionalIntelligenceScore} className="h-2" />
          <div className="text-sm text-muted-foreground">
            Based on relational patterns and empathy - {Math.round(emotionalScoreNormalized)}/100
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
          <Progress value={avgTraitScore * 100} className="h-2" />
          <div className="text-sm text-muted-foreground">
            Average of all trait scores - {formatTraitScore(avgTraitScore * 10)}/10
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
