
import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Briefcase } from "lucide-react";

interface CareerSuggestionsProps {
  careers: string[];
}

const CareerSuggestions: React.FC<CareerSuggestionsProps> = ({ careers }) => {
  return (
    <Card className="glass-panel overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500/10 to-violet-500/10 pb-4">
        <CardTitle className="flex items-center">
          <Briefcase className="h-5 w-5 mr-2 text-primary" /> Career Suggestions
        </CardTitle>
        <CardDescription>
          Potential career paths aligned with your personality
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {careers.map((career, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center p-3 rounded-md border border-border/40 bg-card/30"
            >
              <div className="inline-flex items-center justify-center rounded-full bg-primary/10 h-8 w-8 text-sm text-primary mr-3 flex-shrink-0">
                {index + 1}
              </div>
              <span>{career}</span>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CareerSuggestions;
