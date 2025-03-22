
import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface GrowthAreasSectionProps {
  weaknesses: string[];
  growthAreas: string[];
}

const GrowthAreasSection: React.FC<GrowthAreasSectionProps> = ({ 
  weaknesses,
  growthAreas 
}) => {
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
    }} className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'md:grid-cols-2 gap-6'}`}>
      <Card className="glass-panel overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-rose-500/10 to-red-500/10 pb-3 md:pb-4">
          <CardTitle>Weaknesses</CardTitle>
          <CardDescription>Areas that may need attention</CardDescription>
        </CardHeader>
        <CardContent className="pt-3 md:pt-6">
          <ul className="space-y-2">
            {weaknesses.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-flex items-center justify-center rounded-full bg-primary/10 h-6 w-6 text-sm text-primary mr-3 mt-0.5 flex-shrink-0">
                  {index + 1}
                </span>
                <span className="text-sm md:text-base">{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      <Card className="glass-panel overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 pb-3 md:pb-4">
          <CardTitle>Growth Areas</CardTitle>
          <CardDescription>Opportunities for development</CardDescription>
        </CardHeader>
        <CardContent className="pt-3 md:pt-6">
          <ul className="space-y-2">
            {growthAreas.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-flex items-center justify-center rounded-full bg-primary/10 h-6 w-6 text-sm text-primary mr-3 mt-0.5 flex-shrink-0">
                  {index + 1}
                </span>
                <span className="text-sm md:text-base">{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GrowthAreasSection;
