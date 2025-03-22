
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

interface TraitsDetailProps {
  traits: PersonalityTrait[];
}

const TraitsDetail: React.FC<TraitsDetailProps> = ({ traits }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="w-full space-y-4 md:space-y-6 max-w-full overflow-x-hidden">
      {!isMobile ? (
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
                <TableCell className="font-medium py-2 md:py-4">{index + 1}</TableCell>
                <TableCell className="py-2 md:py-4">
                  <div className="font-semibold">{trait.trait}</div>
                  <div className="text-sm text-muted-foreground line-clamp-1">
                    {trait.description.substring(0, 60)}...
                  </div>
                </TableCell>
                <TableCell className="py-2 md:py-4">
                  <div className="inline-flex items-center justify-center h-7 w-7 md:h-8 md:w-8 rounded-full bg-primary/10 text-primary font-semibold">
                    {trait.score.toFixed(1)}
                  </div>
                </TableCell>
                <TableCell className="text-right py-2 md:py-4">
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
      ) : (
        // Mobile-optimized view
        <div className="pt-2 w-full overflow-hidden">
          <Accordion type="single" collapsible className="w-full">
            {traits.map((trait, index) => (
              <AccordionItem key={index} value={`trait-${index}`} className="border-b">
                <AccordionTrigger className="py-3 pr-2">
                  <div className="flex items-center justify-between w-full text-left">
                    <div className="flex items-center">
                      <span className="mr-2 text-sm">{index + 1}.</span>
                      <span className="max-w-[120px] text-sm truncate">{trait.trait}</span>
                    </div>
                    <div className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex-shrink-0">
                      {trait.score.toFixed(1)}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 p-3 bg-muted/30 rounded-md overflow-x-hidden">
                    <div className="space-y-1">
                      <h4 className="font-medium text-xs">Description</h4>
                      <p className="text-xs">{trait.description}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="font-medium text-xs">Strengths</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {trait.strengths.map((strength, i) => (
                          <Badge key={i} variant="outline" className="bg-green-50 text-green-900 border-green-200 text-[10px] px-1.5 py-0">
                            {strength}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="font-medium text-xs">Challenges</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {trait.challenges.map((challenge, i) => (
                          <Badge key={i} variant="outline" className="bg-amber-50 text-amber-900 border-amber-200 text-[10px] px-1.5 py-0">
                            {challenge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="font-medium text-xs">Growth Suggestions</h4>
                      <ul className="text-xs list-disc pl-4 space-y-0.5 overflow-x-hidden">
                        {trait.growthSuggestions.map((suggestion, i) => (
                          <li key={i} className="break-words">{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
};

export default TraitsDetail;
