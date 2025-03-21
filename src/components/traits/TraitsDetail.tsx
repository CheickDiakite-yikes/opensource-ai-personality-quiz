
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

interface TraitsDetailProps {
  traits: PersonalityTrait[];
}

const TraitsDetail: React.FC<TraitsDetailProps> = ({ traits }) => {
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
                              <Badge key={i} variant="outline" className="bg-green-50">
                                {strength}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Challenges</h4>
                          <div className="flex flex-wrap gap-2">
                            {trait.challenges.map((challenge, i) => (
                              <Badge key={i} variant="outline" className="bg-amber-50">
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
