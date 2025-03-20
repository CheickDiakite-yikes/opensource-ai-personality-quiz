
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

interface RoadmapSectionProps {
  roadmap: string;
}

const RoadmapSection: React.FC<RoadmapSectionProps> = ({ roadmap }) => {
  const navigate = useNavigate();
  
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
        <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-violet-500/10 pb-4">
          <CardTitle className="flex items-center">
            <ArrowRight className="h-5 w-5 mr-2 text-primary" /> Your Personalized Roadmap
          </CardTitle>
          <CardDescription>Steps to become your best self</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-lg leading-relaxed">{roadmap}</p>
          
          <div className="mt-8">
            <Button 
              className="w-full sm:w-auto" 
              onClick={() => navigate("/tracker")}
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
