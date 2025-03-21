
import React from "react";
import { PersonalityTrait } from "@/utils/types";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface TraitsDetailProps {
  traits: PersonalityTrait[];
}

const TraitsDetail: React.FC<TraitsDetailProps> = ({ traits }) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="space-y-4">
        {traits.map((trait, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="inline-flex items-center justify-center rounded-full bg-primary/10 h-6 w-6 text-sm text-primary">
                  {index + 1}
                </span>
                <Badge variant="outline">{trait.score.toFixed(1)}/10</Badge>
              </div>
              
              <h3 className="font-semibold text-base mb-1">{trait.trait}</h3>
              <p className="text-sm text-muted-foreground mb-2">{trait.description}</p>
              <Progress value={trait.score * 10} className="h-1.5 mb-3" />
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value={`trait-${index}`} className="border-b-0">
                  <AccordionTrigger className="py-2 text-sm">View Details</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <h4 className="font-medium text-xs text-primary">Strengths</h4>
                        <ul className="space-y-1 text-xs">
                          {trait.strengths.map((strength, i) => (
                            <li key={i} className="text-muted-foreground">
                              • {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-xs text-primary">Challenges</h4>
                        <ul className="space-y-1 text-xs">
                          {trait.challenges.map((challenge, i) => (
                            <li key={i} className="text-muted-foreground">
                              • {challenge}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-xs text-primary">Growth Suggestions</h4>
                        <ul className="space-y-1 text-xs">
                          {trait.growthSuggestions.map((suggestion, i) => (
                            <li key={i} className="text-muted-foreground">
                              • {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Rank</TableHead>
            <TableHead>Trait</TableHead>
            <TableHead>Score</TableHead>
            <TableHead className="text-right">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {traits.map((trait, index) => (
            <TableRow key={index} className="hover-lift">
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>
                <div className="font-semibold">{trait.trait}</div>
                <div className="text-sm text-muted-foreground line-clamp-1">
                  {trait.description.substring(0, 60)}...
                </div>
              </TableCell>
              <TableCell>
                <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-semibold">
                  {trait.score.toFixed(1)}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value={`trait-${index}`} className="border-b-0">
                    <AccordionTrigger className="py-2">View Details</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 p-4 bg-muted/30 rounded-md">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Description</h4>
                          <p className="text-sm">{trait.description}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Strengths</h4>
                          <div className="flex flex-wrap gap-2">
                            {trait.strengths.map((strength, i) => (
                              <Badge key={i} variant="outline" className="bg-green-50 text-green-900 border-green-200">
                                {strength}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Challenges</h4>
                          <div className="flex flex-wrap gap-2">
                            {trait.challenges.map((challenge, i) => (
                              <Badge key={i} variant="outline" className="bg-amber-50 text-amber-900 border-amber-200">
                                {challenge}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Growth Suggestions</h4>
                          <ul className="text-sm list-disc pl-5 space-y-1">
                            {trait.growthSuggestions.map((suggestion, i) => (
                              <li key={i}>{suggestion}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TraitsDetail;
