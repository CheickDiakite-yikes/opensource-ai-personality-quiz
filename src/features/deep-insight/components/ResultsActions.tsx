
import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

interface ResultsActionsProps {
  onSave: () => void;
  itemVariants: any;
}

export const ResultsActions: React.FC<ResultsActionsProps> = ({ onSave, itemVariants }) => {
  const { user } = useAuth();

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      custom={6}
      className="flex justify-center"
    >
      <Button 
        className="flex items-center gap-2" 
        onClick={() => {
          onSave();
          console.log("Analysis saved for user:", user?.id);
        }}
      >
        <Sparkles className="h-4 w-4" />
        Save This Analysis
      </Button>
    </motion.div>
  );
};
