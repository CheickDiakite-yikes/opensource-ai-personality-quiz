
import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Zap, ChevronDown, ChevronUp } from "lucide-react";
import { PersonalityTrait } from "@/utils/types";
import PersonalityTraitCard from "../PersonalityTraitCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface PersonalityTraitsSectionProps {
  traits: PersonalityTrait[];
}

const PersonalityTraitsSection: React.FC<PersonalityTraitsSectionProps> = ({ traits }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [expanded, setExpanded] = React.useState(!isMobile);
  
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
    }}>
      <Card className="glass-panel overflow-hidden">
        <CardHeader className={`bg-gradient-to-r from-purple-500/10 to-pink-500/10 ${isMobile ? 'px-3 py-2' : 'pb-4'}`}>
          <CardTitle className="flex items-center text-base md:text-xl">
            <Zap className="h-5 w-5 mr-2 text-primary" /> Top Personality Traits
          </CardTitle>
          <CardDescription>Your most prominent characteristics</CardDescription>
        </CardHeader>
        
        {isMobile ? (
          <>
            <Collapsible open={expanded} onOpenChange={setExpanded}>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full flex items-center justify-between py-1 px-3 border-t"
                  size="sm"
                >
                  <span className="text-xs">
                    {expanded ? "Collapse" : "Expand"} ({traits.length} traits)
                  </span>
                  {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="px-3 py-2">
                  <div className="space-y-2">
                    {traits.slice(0, 3).map((trait, index) => (
                      <PersonalityTraitCard key={index} trait={trait} index={index} />
                    ))}
                  </div>
                  
                  {traits.length > 3 && (
                    <CardFooter className="px-0 py-2 pt-3 flex justify-center">
                      <Button 
                        variant="outline" 
                        className="w-full text-xs py-1"
                        onClick={() => navigate("/traits")}
                        size="sm"
                      >
                        View All {traits.length} Traits
                      </Button>
                    </CardFooter>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </>
        ) : (
          <>
            <CardContent className="pt-6 pb-2">
              <div className="space-y-3 md:space-y-4">
                {traits.slice(0, 5).map((trait, index) => (
                  <PersonalityTraitCard key={index} trait={trait} index={index} />
                ))}
              </div>
            </CardContent>
            
            {traits.length > 5 && (
              <CardFooter className="px-6 py-4 pt-2 flex justify-center">
                <Button 
                  variant="outline" 
                  className="w-full text-sm md:text-base py-1.5 md:py-2"
                  onClick={() => navigate("/traits")}
                >
                  View All {traits.length} Traits
                </Button>
              </CardFooter>
            )}
          </>
        )}
      </Card>
    </motion.div>
  );
};

export default PersonalityTraitsSection;
