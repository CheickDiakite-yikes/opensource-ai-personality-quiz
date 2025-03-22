
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
import { Zap } from "lucide-react";
import { PersonalityTrait } from "@/utils/types";
import PersonalityTraitCard from "../PersonalityTraitCard";
import { useIsMobile } from "@/hooks/use-mobile";

interface PersonalityTraitsSectionProps {
  traits: PersonalityTrait[];
}

const PersonalityTraitsSection: React.FC<PersonalityTraitsSectionProps> = ({ traits }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
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
        <CardHeader className={`bg-gradient-to-r from-purple-500/10 to-pink-500/10 ${isMobile ? 'px-3 py-3 pb-2' : 'pb-4'}`}>
          <CardTitle className="flex items-center text-lg md:text-xl">
            <Zap className="h-5 w-5 mr-2 text-primary" /> Top Personality Traits
          </CardTitle>
          <CardDescription>Your most prominent characteristics</CardDescription>
        </CardHeader>
        <CardContent className={`${isMobile ? "px-3 py-3 pt-2 pb-2" : "pt-6 pb-2"}`}>
          <div className="space-y-3 md:space-y-4">
            {traits.slice(0, isMobile ? 3 : 5).map((trait, index) => (
              <PersonalityTraitCard key={index} trait={trait} index={index} />
            ))}
          </div>
        </CardContent>
        
        {traits.length > (isMobile ? 3 : 5) && (
          <CardFooter className={`${isMobile ? "px-3 py-3" : "px-6 py-4"} pt-2 flex justify-center`}>
            <Button 
              variant="outline" 
              className="w-full text-sm md:text-base py-1.5 md:py-2"
              onClick={() => navigate("/traits")}
            >
              View All {traits.length} Traits
            </Button>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
};

export default PersonalityTraitsSection;
