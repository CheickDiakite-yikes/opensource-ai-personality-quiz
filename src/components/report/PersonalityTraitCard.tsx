
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
      className="mb-3"
    >
      <Card className="hover:shadow-md transition-all duration-300 overflow-hidden">
        <CardHeader className={`${isMobile ? 'px-3 py-2' : 'pb-2'} cursor-pointer`} onClick={() => setExpanded(!expanded)}>
          <div className="flex justify-between items-center">
            <div className="flex items-start gap-2">
              <span className="inline-flex items-center justify-center rounded-full bg-primary/10 h-6 w-6 text-xs text-primary flex-shrink-0">
                {index + 1}
              </span>
              <div>
                <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'}`}>{trait.trait}</CardTitle>
                <CardDescription className={`${isMobile ? 'text-xs' : ''} line-clamp-2`}>
                  {trait.description}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center">
              <Badge variant="outline" className={`${isMobile ? 'text-xs mr-1' : 'mr-3'}`}>
                {trait.score.toFixed(1)}/10
              </Badge>
              {expanded ? (
                <ChevronUp className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-muted-foreground`} />
              ) : (
                <ChevronDown className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-muted-foreground`} />
              )}
            </div>
          </div>
          <Progress value={trait.score * 10} className="h-2 mt-2" />
        </CardHeader>
        
        {expanded && (
          <CardContent className={`${isMobile ? 'px-3 py-2' : 'pt-2 pb-4'} animate-fade-in`}>
            <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'md:grid-cols-3 gap-4'} mt-2`}>
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
            </div>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
};

export default PersonalityTraitCard;
