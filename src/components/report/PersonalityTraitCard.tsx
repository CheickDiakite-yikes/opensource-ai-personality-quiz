
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

interface PersonalityTraitCardProps {
  trait: PersonalityTrait;
  index: number;
}

const PersonalityTraitCard: React.FC<PersonalityTraitCardProps> = ({ trait, index }) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="mb-4"
    >
      <Card className="hover:shadow-md transition-all duration-300 overflow-hidden">
        <CardHeader className="pb-2 cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <div className="flex justify-between items-center">
            <div className="flex items-start">
              <span className="inline-flex items-center justify-center rounded-full bg-primary/10 h-7 w-7 text-sm text-primary mr-3 flex-shrink-0">
                {index + 1}
              </span>
              <div>
                <CardTitle className="text-lg">{trait.trait}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {trait.description}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center">
              <Badge variant="outline" className="mr-3">
                {trait.score.toFixed(1)}/10
              </Badge>
              {expanded ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          </div>
          <Progress value={trait.score * 10} className="h-2 mt-2" />
        </CardHeader>
        
        {expanded && (
          <CardContent className="pt-2 pb-4 animate-fade-in">
            <div className="grid md:grid-cols-3 gap-4 mt-2">
              <div>
                <h4 className="font-medium mb-2 text-sm text-primary">Strengths</h4>
                <ul className="space-y-1 text-sm">
                  {trait.strengths.map((strength, i) => (
                    <li key={i} className="text-muted-foreground">
                      • {strength}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2 text-sm text-primary">Challenges</h4>
                <ul className="space-y-1 text-sm">
                  {trait.challenges.map((challenge, i) => (
                    <li key={i} className="text-muted-foreground">
                      • {challenge}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2 text-sm text-primary">Growth Suggestions</h4>
                <ul className="space-y-1 text-sm">
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
