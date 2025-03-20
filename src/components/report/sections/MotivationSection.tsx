
import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lightbulb, Heart } from "lucide-react";

interface MotivationSectionProps {
  motivators: string[];
  inhibitors: string[];
}

const MotivationSection: React.FC<MotivationSectionProps> = ({ 
  motivators,
  inhibitors 
}) => {
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
    }} className="grid md:grid-cols-2 gap-6">
      <Card className="glass-panel overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 pb-4">
          <CardTitle className="flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-primary" /> Motivators
          </CardTitle>
          <CardDescription>What drives you forward</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ul className="space-y-2">
            {motivators.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-flex items-center justify-center rounded-full bg-primary/10 h-6 w-6 text-sm text-primary mr-3 mt-0.5 flex-shrink-0">
                  {index + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      <Card className="glass-panel overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-red-500/10 to-orange-500/10 pb-4">
          <CardTitle className="flex items-center">
            <Heart className="h-5 w-5 mr-2 text-primary" /> Inhibitors
          </CardTitle>
          <CardDescription>What may hold you back</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ul className="space-y-2">
            {inhibitors.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-flex items-center justify-center rounded-full bg-primary/10 h-6 w-6 text-sm text-primary mr-3 mt-0.5 flex-shrink-0">
                  {index + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MotivationSection;
