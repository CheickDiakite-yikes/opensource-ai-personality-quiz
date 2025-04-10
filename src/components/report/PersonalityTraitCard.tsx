
import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PersonalityTrait } from "@/utils/types";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface PersonalityTraitCardProps {
  trait: PersonalityTrait;
  index: number;
}

const PersonalityTraitCard: React.FC<PersonalityTraitCardProps> = ({ trait, index }) => {
  const [expanded, setExpanded] = React.useState(false);
  const isMobile = useIsMobile();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="mb-2"
    >
      <Card className="hover:shadow-md transition-all duration-300 overflow-hidden">
        <CardHeader 
          className={`${isMobile ? 'px-2 py-1.5' : 'pb-2'} cursor-pointer`} 
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-start gap-1.5">
              <span className={`inline-flex items-center justify-center rounded-full bg-primary/10 ${isMobile ? 'h-4 w-4 text-[0.65rem]' : 'h-6 w-6 text-xs'} text-primary flex-shrink-0`}>
                {index + 1}
              </span>
              <div>
                <CardTitle className={`${isMobile ? 'text-sm' : 'text-lg'}`}>{trait.trait}</CardTitle>
                <CardDescription className={`${isMobile ? 'text-[0.65rem]' : ''} line-clamp-1`}>
                  {trait.description.length > 80 && isMobile 
                    ? `${trait.description.substring(0, 80)}...` 
                    : trait.description
                  }
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center">
              <Badge variant="outline" className={`${isMobile ? 'text-[0.6rem] mr-1 px-1 py-0' : 'mr-3'}`}>
                {Math.round(trait.score * 10)}/10
              </Badge>
              {expanded ? (
                <ChevronUp className={`${isMobile ? 'h-3 w-3' : 'h-5 w-5'} text-muted-foreground`} />
              ) : (
                <ChevronDown className={`${isMobile ? 'h-3 w-3' : 'h-5 w-5'} text-muted-foreground`} />
              )}
            </div>
          </div>
          <Progress value={trait.score * 100} className={`h-1.5 ${isMobile ? 'mt-1' : 'mt-2'}`} />
        </CardHeader>
        
        {expanded && (
          <CardContent className={`${isMobile ? 'px-2 py-1.5' : 'pt-2 pb-4'} animate-fade-in`}>
            <div className={`grid ${isMobile ? 'grid-cols-1 gap-2' : 'md:grid-cols-3 gap-4'} mt-1`}>
              {isMobile ? (
                // Collapsed view on mobile
                <>
                  <div>
                    <h4 className="font-medium mb-0.5 text-[0.7rem] text-primary">Strengths</h4>
                    <ul className="space-y-0.5 text-[0.65rem]">
                      {trait.strengths.slice(0, 2).map((strength, i) => (
                        <li key={i} className="text-muted-foreground">
                          • {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-0.5 text-[0.7rem] text-primary">Challenges</h4>
                    <ul className="space-y-0.5 text-[0.65rem]">
                      {trait.challenges.slice(0, 2).map((challenge, i) => (
                        <li key={i} className="text-muted-foreground">
                          • {challenge}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-0.5 text-[0.7rem] text-primary">Growth Tips</h4>
                    <ul className="space-y-0.5 text-[0.65rem]">
                      {trait.growthSuggestions.slice(0, 2).map((suggestion, i) => (
                        <li key={i} className="text-muted-foreground">
                          • {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                // Full view on desktop
                <>
                  <div>
                    <h4 className="font-medium mb-1 text-xs md:text-sm text-primary">Strengths</h4>
                    <ul className="space-y-1 text-xs md:text-sm">
                      {trait.strengths.map((strength, i) => (
                        <li key={i} className="text-muted-foreground">
                          • {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1 text-xs md:text-sm text-primary">Challenges</h4>
                    <ul className="space-y-1 text-xs md:text-sm">
                      {trait.challenges.map((challenge, i) => (
                        <li key={i} className="text-muted-foreground">
                          • {challenge}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1 text-xs md:text-sm text-primary">Growth Suggestions</h4>
                    <ul className="space-y-1 text-xs md:text-sm">
                      {trait.growthSuggestions.map((suggestion, i) => (
                        <li key={i} className="text-muted-foreground">
                          • {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
};

export default PersonalityTraitCard;
