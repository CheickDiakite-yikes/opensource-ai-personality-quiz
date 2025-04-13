
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatTraitScore } from "@/utils/formatUtils";
import { PersonalityTrait } from "@/utils/types";
import { ChevronRight, Lightbulb, Sparkles } from "lucide-react";

interface ComprehensiveOverviewSectionProps {
  overview: string;
  traits: PersonalityTrait[];
  intelligenceScore: number;
  emotionalIntelligenceScore: number;
  motivators: string[];
  growthAreas: string[];
}

const ComprehensiveOverviewSection: React.FC<ComprehensiveOverviewSectionProps> = ({
  overview,
  traits,
  intelligenceScore,
  emotionalIntelligenceScore,
  motivators,
  growthAreas
}) => {
  // Format the overview text with proper paragraphs
  const formattedOverview = overview?.split('\n\n').map((paragraph, index) => (
    <p key={index} className={index > 0 ? "mt-4" : ""}>{paragraph}</p>
  )) || <p>Analysis overview not available.</p>;

  // Select top traits to highlight
  const topTraits = traits?.slice(0, 5).sort((a, b) => b.score - a.score) || [];
  
  // Format trait description for tooltip
  const getTraitDescription = (trait: PersonalityTrait) => {
    return trait.description.length > 100 
      ? `${trait.description.substring(0, 100)}...` 
      : trait.description;
  };

  return (
    <>
      <Card className="p-6 md:p-8 shadow-md border-l-4 border-l-primary/70">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Personality Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="mb-6 text-pretty leading-relaxed prose dark:prose-invert max-w-none">
            {formattedOverview}
          </div>
          
          {/* Key traits section with improved visual hierarchy */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary/80" />
              Key Personality Traits
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {topTraits.map((trait, index) => (
                <div key={index} className="group relative">
                  <Badge 
                    variant="secondary" 
                    className="px-3 py-1.5 text-sm hover:bg-secondary/80 transition-all cursor-help"
                    title={getTraitDescription(trait)}
                  >
                    {trait.trait}: {formatTraitScore(trait.score)}
                  </Badge>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-2 p-3 bg-popover border rounded-lg shadow-lg z-10 w-64 text-xs pointer-events-none">
                    <p className="font-medium mb-1">{trait.trait}</p>
                    <p className="mb-2">{trait.description}</p>
                    <p className="italic text-muted-foreground">Score: {formatTraitScore(trait.score)}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground italic">
              Hover over traits for more details
            </p>
          </div>
          
          {/* Intelligence scores with contextual description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="p-5 bg-muted/30 rounded-lg border border-border/50 hover:border-border transition-all">
              <h4 className="font-medium text-lg mb-1">Intelligence Score</h4>
              <p className="text-2xl font-bold mb-2">{formatTraitScore(intelligenceScore || 0)}</p>
              <p className="text-sm text-muted-foreground">
                {intelligenceScore >= 80 ? "Exceptional cognitive abilities" : 
                 intelligenceScore >= 70 ? "Strong analytical capabilities" : 
                 intelligenceScore >= 60 ? "Above average intellectual capacity" : 
                 intelligenceScore >= 50 ? "Average cognitive processing" : 
                 "Developing intellectual strengths"}
              </p>
            </div>
            
            <div className="p-5 bg-muted/30 rounded-lg border border-border/50 hover:border-border transition-all">
              <h4 className="font-medium text-lg mb-1">Emotional Intelligence</h4>
              <p className="text-2xl font-bold mb-2">{formatTraitScore(emotionalIntelligenceScore || 0)}</p>
              <p className="text-sm text-muted-foreground">
                {emotionalIntelligenceScore >= 80 ? "Exceptional emotional awareness and regulation" : 
                 emotionalIntelligenceScore >= 70 ? "Strong empathetic abilities" : 
                 emotionalIntelligenceScore >= 60 ? "Good social and emotional processing" : 
                 emotionalIntelligenceScore >= 50 ? "Developing emotional awareness" : 
                 "Growing emotional recognition"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card className="p-6 shadow-sm hover:shadow-md transition-shadow border-t-4 border-t-primary/50">
          <h3 className="text-lg font-medium mb-4">Core Motivators</h3>
          <ul className="space-y-3">
            {motivators?.slice(0, 5).map((motivator, index) => (
              <li key={index} className="flex items-start group">
                <span className="inline-flex items-center justify-center rounded-full bg-primary/10 h-7 w-7 text-sm text-primary mr-3 mt-0.5 flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <span className="font-medium">{motivator}</span>
                  {index === 0 && (
                    <p className="text-sm text-muted-foreground mt-1">Your primary driver influences many of your decisions and actions.</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
          {motivators?.length > 5 && (
            <p className="text-sm text-muted-foreground mt-4 italic flex items-center gap-1">
              <ChevronRight className="h-4 w-4" />
              Additional motivators available in the detailed report
            </p>
          )}
        </Card>
        
        <Card className="p-6 shadow-sm hover:shadow-md transition-shadow border-t-4 border-t-primary/50">
          <h3 className="text-lg font-medium mb-4">Growth Opportunities</h3>
          <ul className="space-y-3">
            {growthAreas?.slice(0, 5).map((area, index) => (
              <li key={index} className="flex items-start group">
                <span className="inline-flex items-center justify-center rounded-full bg-primary/10 h-7 w-7 text-sm text-primary mr-3 mt-0.5 flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <span className="font-medium">{area}</span>
                  {index === 0 && (
                    <p className="text-sm text-muted-foreground mt-1">Focusing on this area could significantly enhance your personal effectiveness.</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
          {growthAreas?.length > 5 && (
            <p className="text-sm text-muted-foreground mt-4 italic flex items-center gap-1">
              <ChevronRight className="h-4 w-4" />
              Additional growth areas explored in the detailed report
            </p>
          )}
        </Card>
      </div>
    </>
  );
};

export default ComprehensiveOverviewSection;
