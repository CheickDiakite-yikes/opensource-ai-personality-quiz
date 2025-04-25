import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PersonalityAnalysis } from '../../../supabase/functions/analyze-responses-deep/types'; // Adjust path if needed

// Extract the Trait type from the PersonalityAnalysis interface
type Trait = PersonalityAnalysis['traits'][number];

interface TraitDisplayProps {
  trait: Trait;
}

const TraitDisplay: React.FC<TraitDisplayProps> = ({ trait }) => {
  if (!trait) return null;

  // Basic score visualization (optional)
  const scoreColor = trait.score >= 7 ? "bg-green-500" : trait.score >= 4 ? "bg-yellow-500" : "bg-red-500";

  return (
    <Card className="mb-4 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">
          {trait.trait || "Unnamed Trait"}
        </CardTitle>
        {trait.score !== undefined && (
           <Badge variant="secondary" className="text-sm">
            Score: {trait.score} / 10
            {/* <span className={`ml-2 inline-block h-3 w-3 rounded-full ${scoreColor}`}></span> */}
           </Badge>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
            {trait.description || "No description provided."}
        </p>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="strengths">
            <AccordionTrigger>Strengths</AccordionTrigger>
            <AccordionContent>
              {trait.strengths && trait.strengths.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  {trait.strengths.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground italic">No specific strengths listed.</p>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="challenges">
            <AccordionTrigger>Challenges / Potential Downsides</AccordionTrigger>
            <AccordionContent>
              {trait.challenges && trait.challenges.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  {trait.challenges.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground italic">No specific challenges listed.</p>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="growth">
            <AccordionTrigger>Growth Suggestions</AccordionTrigger>
            <AccordionContent>
              {trait.growthSuggestions && trait.growthSuggestions.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  {trait.growthSuggestions.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground italic">No specific growth suggestions listed.</p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

      </CardContent>
    </Card>
  );
};

export default TraitDisplay; 