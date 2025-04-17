
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Sparkles, Share2, History } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ResultsActionsProps {
  onSave: () => void;
  itemVariants: any;
}

export const ResultsActions: React.FC<ResultsActionsProps> = ({ onSave, itemVariants }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleShare = () => {
    // In a real implementation, this would open a sharing dialog
    // For now, we'll just show a toast
    toast.info("Sharing functionality will be available soon!");
  };

  const handleDownload = () => {
    // In a real implementation, this would generate and download a PDF
    // For now, we'll just show a toast
    toast.info("Download functionality will be available soon!");
  };

  const handleViewHistory = () => {
    navigate('/deep-insight');
  };

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      custom={6}
      className="flex flex-wrap justify-center gap-4"
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

      <Button 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={handleShare}
      >
        <Share2 className="h-4 w-4" />
        Share Results
      </Button>

      <Button 
        variant="secondary" 
        className="flex items-center gap-2"
        onClick={handleDownload}
      >
        <Download className="h-4 w-4" />
        Download PDF
      </Button>

      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={handleViewHistory}
      >
        <History className="h-4 w-4" />
        View History
      </Button>
    </motion.div>
  );
};
