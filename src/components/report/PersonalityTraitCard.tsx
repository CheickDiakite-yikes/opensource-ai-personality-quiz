
import React from "react";
import { PersonalityTrait } from "@/utils/types";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useIsMobile } from "@/hooks/use-mobile";

interface PersonalityTraitCardProps {
  trait: PersonalityTrait;
  index: number;
}

const PersonalityTraitCard: React.FC<PersonalityTraitCardProps> = ({ trait, index }) => {
  const isMobile = useIsMobile();
  
  // Ensure score is properly normalized to a value between 0-100
  const normalizeScore = (score: number): number => {
    if (score > 0 && score <= 1) {
      return Math.round(score * 100);
    } else if (score > 1 && score <= 100) {
      return Math.round(score);
    } else if (score > 100) {
      return 100; // Cap at 100
    }
    return Math.round(score * 100); // Default normalization
  };
  
  const displayScore = normalizeScore(trait.score);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className={`${isMobile ? 'p-2' : 'p-3'} rounded-md bg-card hover:bg-accent/5 transition-colors`}
    >
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="trait-details" className="border-b-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center rounded-full bg-primary/10 w-6 h-6 text-primary text-xs font-semibold">
                    {index + 1}
                  </div>
                  <h3 className={`font-semibold ${isMobile ? 'text-sm' : 'text-base'}`}>{trait.trait}</h3>
                </div>
                <Badge variant="outline">
                  {displayScore}/100
                </Badge>
              </div>
              <div className="mt-2 mb-2">
                <Progress value={displayScore} className="h-2" />
              </div>
              <p className={`text-muted-foreground ${isMobile ? 'text-xs line-clamp-2' : 'text-sm line-clamp-2'}`}>
                {trait.description}
              </p>
            </div>
          </div>
          
          <AccordionTrigger className={`${isMobile ? 'pt-1 pb-0' : 'pt-2'} flex items-center text-xs text-muted-foreground hover:text-primary transition-colors`}>
            <span className="flex items-center">
              <span className="mr-1">View details</span> 
              <ChevronRight className="h-3 w-3 transition-transform ui-open:rotate-90" />
            </span>
          </AccordionTrigger>
          
          <AccordionContent>
            <div className={`${isMobile ? 'mt-2 p-2' : 'mt-3 p-3'} space-y-3 bg-muted/40 rounded-md`}>
              {/* Strengths */}
              <div className="space-y-1">
                <h4 className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>Strengths</h4>
                <div className="flex flex-wrap gap-1">
                  {trait.strengths.map((strength, i) => (
                    <Badge key={i} variant="outline" className={`bg-green-50 text-green-900 border-green-200 ${isMobile ? 'text-[10px] px-1' : ''}`}>
                      {strength}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Challenges */}
              <div className="space-y-1">
                <h4 className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>Challenges</h4>
                <div className="flex flex-wrap gap-1">
                  {trait.challenges.map((challenge, i) => (
                    <Badge key={i} variant="outline" className={`bg-amber-50 text-amber-900 border-amber-200 ${isMobile ? 'text-[10px] px-1' : ''}`}>
                      {challenge}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Growth Suggestions (only if we have any) */}
              {trait.growthSuggestions && trait.growthSuggestions.length > 0 && (
                <div className="space-y-1">
                  <h4 className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>Growth Suggestions</h4>
                  <ul className={`list-disc list-inside space-y-0.5 ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
                    {trait.growthSuggestions.slice(0, 2).map((suggestion, i) => (
                      <li key={i}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  );
};

export default PersonalityTraitCard;
