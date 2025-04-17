
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { RefreshCw, Save, Share2 } from "lucide-react";
import { AnalysisData } from "../utils/analysis/types";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
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
      className={`
        flex flex-col sm:flex-row 
        items-center 
        justify-center 
        gap-4 
        w-full 
        max-w-4xl 
        mx-auto 
        p-6 
        rounded-xl
        backdrop-blur-sm
        bg-white/5
        border border-white/10
        ${isMobile ? 'space-y-3' : ''}
      `}
      variants={itemVariants}
      custom={5}
    >
      <Button 
        variant="elegant"
        size="lg"
        className={`
          w-full sm:w-auto 
          flex items-center gap-3
          justify-center
          min-w-[200px]
          transition-all
          duration-300
          hover:scale-105
        `} 
        onClick={onSave}
      >
        <Save className="h-5 w-5" />
        Save Analysis
      </Button>

      <Button 
        variant="elegant"
        size="lg" 
        className={`
          w-full sm:w-auto 
          flex items-center gap-3
          justify-center
          min-w-[200px]
          transition-all
          duration-300
          hover:scale-105
        `} 
        onClick={handleShare}
      >
        <Share2 className="h-5 w-5" />
        Share Results
      </Button>

      {onRefresh && (
        <Button 
          variant={loadedFromCache ? "warm" : "elegant"}
          size="lg"
          className={`
            w-full sm:w-auto 
            flex items-center gap-3
            justify-center
            min-w-[200px]
            transition-all
            duration-300
            hover:scale-105
          `} 
          onClick={onRefresh}
        >
          <RefreshCw className="h-5 w-5" />
          {loadedFromCache ? "Generate Fresh Analysis" : "Refresh Analysis"}
        </Button>
      )}
    </motion.div>
  );
};
