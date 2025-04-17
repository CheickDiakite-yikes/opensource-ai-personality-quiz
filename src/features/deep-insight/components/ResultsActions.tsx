
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { RefreshCw, Save, Share2 } from "lucide-react";
import { AnalysisData } from "../utils/analysis/types";
import { toast } from "sonner";

interface ResultsActionsProps {
  onSave: () => void;
  onRefresh?: () => void;
  itemVariants: any;
  analysis: AnalysisData;
  loadedFromCache?: boolean;
}

export const ResultsActions = ({ 
  onSave, 
  itemVariants, 
  analysis,
  onRefresh,
  loadedFromCache
}: ResultsActionsProps) => {
  const handleShare = () => {
    try {
      // Create a shareable URL with the analysis ID
      const shareableUrl = `${window.location.origin}/deep-insight/results?id=${analysis.id}`;
      navigator.clipboard.writeText(shareableUrl);
      toast.success("Link copied to clipboard", {
        description: "You can now share this link with others"
      });
    } catch (err) {
      console.error("Error sharing analysis:", err);
      toast.error("Failed to create shareable link");
    }
  };

  return (
    <motion.div 
      className="flex flex-wrap gap-3 justify-center"
      variants={itemVariants}
      custom={5}
    >
      <Button 
        variant="outline" 
        className="flex items-center gap-1" 
        onClick={onSave}
      >
        <Save className="h-4 w-4" />
        Save Analysis
      </Button>

      <Button 
        variant="outline" 
        className="flex items-center gap-1" 
        onClick={handleShare}
      >
        <Share2 className="h-4 w-4" />
        Share Results
      </Button>

      {onRefresh && (
        <Button 
          variant={loadedFromCache ? "default" : "outline"} 
          className="flex items-center gap-1" 
          onClick={onRefresh}
        >
          <RefreshCw className="h-4 w-4" />
          {loadedFromCache ? "Generate Fresh Analysis" : "Refresh Analysis"}
        </Button>
      )}
    </motion.div>
  );
};
