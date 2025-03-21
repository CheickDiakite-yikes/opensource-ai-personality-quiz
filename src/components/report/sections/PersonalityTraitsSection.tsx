
import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  
  // Show fewer traits on mobile to save space
  const displayTraits = isMobile ? traits.slice(0, 3) : traits.slice(0, 5);
  const remainingCount = traits.length - displayTraits.length;
  
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
        <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 pb-4">
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-primary" /> Top Personality Traits
          </CardTitle>
          <CardDescription>Your most prominent characteristics</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {displayTraits.map((trait, index) => (
              <PersonalityTraitCard key={index} trait={trait} index={index} />
            ))}
            
            {remainingCount > 0 && (
              <Button 
                variant="outline" 
                className="w-full mt-4 py-3 text-base sticky bottom-2"
                onClick={() => navigate("/traits")}
              >
                View All {traits.length} Traits
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PersonalityTraitsSection;
