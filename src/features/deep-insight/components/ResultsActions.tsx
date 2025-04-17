
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Sparkles, Share2, History, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface ResultsActionsProps {
  onSave: () => void;
  saveSuccess?: boolean;
  itemVariants: any;
}

export const ResultsActions: React.FC<ResultsActionsProps> = ({ 
  onSave, 
  saveSuccess = false, 
  itemVariants 
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleShare = () => {
    toast.info("Sharing functionality will be available soon!");
  };

  const handleDownload = () => {
    toast.info("Download functionality will be available soon!");
  };

  const handleViewHistory = () => {
    navigate('/deep-insight');
  };

  const handleSave = () => {
    if (!user) {
      toast.error("You must be logged in to save your analysis", {
        description: "Please sign in to save your results."
      });
      return;
    }
    onSave();
  };

  const buttonClasses = isMobile ? "w-full" : "";

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      custom={6}
      className="px-4 py-6 my-6 bg-background/50 backdrop-blur-sm rounded-xl border border-border/50 shadow-md"
    >
      <h2 className="text-xl font-bold mb-4 text-center">Save or Share Your Results</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Button 
          className={`flex items-center gap-2 ${buttonClasses} ${saveSuccess ? 'bg-green-600 hover:bg-green-700' : ''}`}
          onClick={handleSave}
          disabled={saveSuccess}
        >
          {saveSuccess ? <Check className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
          {saveSuccess ? "Saved Successfully" : "Save Analysis"}
        </Button>

        <Button 
          variant="outline" 
          className={`flex items-center gap-2 ${buttonClasses}`}
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4" />
          Share Results
        </Button>

        <Button 
          variant="secondary" 
          className={`flex items-center gap-2 ${buttonClasses}`}
          onClick={handleDownload}
        >
          <Download className="h-4 w-4" />
          Download PDF
        </Button>

        <Button
          variant="outline"
          className={`flex items-center gap-2 ${buttonClasses}`}
          onClick={handleViewHistory}
        >
          <History className="h-4 w-4" />
          View History
        </Button>
      </div>
    </motion.div>
  );
};
