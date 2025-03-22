
import React from "react";
import { motion } from "framer-motion";
import RelationshipPatterns from "../RelationshipPatterns";
import LearningPathways from "../LearningPathways";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card } from "@/components/ui/card";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RelationshipLearningProps {
  relationshipPatterns: {
    strengths: string[];
    challenges: string[];
    compatibleTypes: string[];
  };
  learningPathways: string[];
}

const RelationshipLearningSection: React.FC<RelationshipLearningProps> = ({ 
  relationshipPatterns,
  learningPathways 
}) => {
  const isMobile = useIsMobile();
  const [patternsOpen, setPatternsOpen] = React.useState(!isMobile);
  const [pathwaysOpen, setPathwaysOpen] = React.useState(!isMobile);
  
  return (
    <motion.div variants={{
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1]
        }
      }
    }} className="flex flex-col w-full gap-2 md:gap-6">
      {isMobile ? (
        <>
          <Card className="overflow-hidden">
            <Collapsible open={patternsOpen} onOpenChange={setPatternsOpen}>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full flex items-center justify-between p-2 border-b"
                  size="sm"
                >
                  <span className="font-medium text-sm">Relationship Patterns</span>
                  {patternsOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-2">
                  <RelationshipPatterns relationshipPatterns={relationshipPatterns} />
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>
          
          <Card className="overflow-hidden">
            <Collapsible open={pathwaysOpen} onOpenChange={setPathwaysOpen}>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full flex items-center justify-between p-2 border-b"
                  size="sm"
                >
                  <span className="font-medium text-sm">Learning Pathways</span>
                  {pathwaysOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-2">
                  <LearningPathways pathways={learningPathways} />
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </>
      ) : (
        // Desktop view - side by side
        <div className="flex flex-row w-full gap-6">
          <div className="w-1/2">
            <RelationshipPatterns relationshipPatterns={relationshipPatterns} />
          </div>
          <div className="w-1/2">
            <LearningPathways pathways={learningPathways} />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default RelationshipLearningSection;
