
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
import { ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface RoadmapSectionProps {
  roadmap: string;
}

const RoadmapSection: React.FC<RoadmapSectionProps> = ({ roadmap }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Format the roadmap text to make it more readable on mobile
  const formattedRoadmap = React.useMemo(() => {
    if (!roadmap) return "";
    
    // On mobile, break longer paragraphs into bullet points if they have certain patterns
    if (isMobile) {
      // Split by sentences and create bullet points for better mobile readability
      const sentences = roadmap.split(/\.(?:\s|$)/);
      if (sentences.length > 3) {
        // Only convert to bullet points if there are several sentences
        return sentences
          .filter(s => s.trim().length > 0)
          .map((sentence, i) => 
            i < 3 ? `${sentence.trim()}.` : `• ${sentence.trim()}${!sentence.endsWith('.') ? '.' : ''}`)
          .join("\n");
      }
    }
    
    return roadmap;
  }, [roadmap, isMobile]);
  
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
        <CardHeader className={`bg-gradient-to-r from-indigo-500/10 to-violet-500/10 ${isMobile ? 'px-3 py-3 pb-2' : 'pb-4'}`}>
          <CardTitle className="flex items-center text-base md:text-lg">
            <ArrowRight className="h-5 w-5 mr-2 text-primary flex-shrink-0" /> 
            <span className="break-words">Your Personalized Roadmap</span>
          </CardTitle>
          <CardDescription>Steps to become your best self</CardDescription>
        </CardHeader>
        <CardContent className={`${isMobile ? 'px-3 py-3 pt-2' : 'pt-6'}`}>
          <p className={`${isMobile ? 'text-xs leading-snug' : 'text-base md:text-lg'} whitespace-pre-line break-words`}>
            {formattedRoadmap}
          </p>
          
          <div className="mt-4 md:mt-6">
            <Button 
              className="w-full" 
              onClick={() => navigate("/tracker")}
              size={isMobile ? "sm" : "default"}
            >
              Begin Your Growth Journey
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RoadmapSection;
