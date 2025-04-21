
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CoreTraits, CoreTraitItem } from "@/utils/big-me/types";

interface BigMeCoreTraitsSectionProps {
  data: CoreTraits;
}

const BigMeCoreTraitsSection: React.FC<BigMeCoreTraitsSectionProps> = ({ data }) => {
  // Helper function to render tertiary trait items that can be either strings or CoreTraitItem objects
  const renderTertiaryTrait = (trait: string | CoreTraitItem, index: number) => {
    if (typeof trait === 'string') {
      return <li key={index} className="text-muted-foreground">{trait}</li>;
    } else {
      return (
        <li key={index} className="text-muted-foreground">
          <span className="font-semibold">{trait.label || 'Unnamed trait'}</span>
          {trait.explanation && <span className="block text-sm mt-1 opacity-80">{trait.explanation}</span>}
        </li>
      );
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Core Personality Traits</h2>
      
      <Card className="border-primary/30 dark:border-primary/30">
        <CardHeader className="bg-primary/10 dark:bg-primary/10">
          <CardTitle className="text-primary">Primary Personality Orientation</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">{data.primary}</p>
        </CardContent>
      </Card>
      
      <Card className="border-secondary/30 dark:border-secondary/30">
        <CardHeader className="bg-secondary/10 dark:bg-secondary/10">
          <CardTitle className="text-secondary-foreground">Secondary Characteristics</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">{data.secondary}</p>
        </CardContent>
      </Card>
      
      <Card className="border-violet-200 dark:border-violet-900">
        <CardHeader className="bg-violet-50 dark:bg-violet-900/20">
          <CardTitle className="text-violet-700 dark:text-violet-400">Significant Traits</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ul className="list-disc ml-6 space-y-3">
            {data.tertiaryTraits.map((trait, index) => renderTertiaryTrait(trait, index))}
          </ul>
        </CardContent>
      </Card>
      
      <Card className="border-emerald-200 dark:border-emerald-900">
        <CardHeader className="bg-emerald-50 dark:bg-emerald-900/20">
          <CardTitle className="text-emerald-700 dark:text-emerald-400">Strengths</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ul className="list-disc ml-6 space-y-3">
            {data.strengths.map((strength, index) => (
              <li key={index} className="text-muted-foreground">{strength}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      <Card className="border-amber-200 dark:border-amber-900">
        <CardHeader className="bg-amber-50 dark:bg-amber-900/20">
          <CardTitle className="text-amber-700 dark:text-amber-400">Growth Areas</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ul className="list-disc ml-6 space-y-3">
            {data.challenges.map((challenge, index) => (
              <li key={index} className="text-muted-foreground">{challenge}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      <Card className="border-sky-200 dark:border-sky-900">
        <CardHeader className="bg-sky-50 dark:bg-sky-900/20">
          <CardTitle className="text-sky-700 dark:text-sky-400">Adaptive Patterns</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ul className="list-disc ml-6 space-y-3">
            {data.adaptivePatterns.map((pattern, index) => (
              <li key={index} className="text-muted-foreground">{pattern}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      <Card className="border-rose-200 dark:border-rose-900">
        <CardHeader className="bg-rose-50 dark:bg-rose-900/20">
          <CardTitle className="text-rose-700 dark:text-rose-400">Potential Blind Spots</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ul className="list-disc ml-6 space-y-3">
            {data.potentialBlindSpots.map((blindSpot, index) => (
              <li key={index} className="text-muted-foreground">{blindSpot}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default BigMeCoreTraitsSection;
