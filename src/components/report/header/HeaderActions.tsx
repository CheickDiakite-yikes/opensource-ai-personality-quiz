
import React, { useState } from "react";
import { Copy, Check, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShareDialog } from "./ShareDialog";
import { HistoryDropdown } from "./HistoryDropdown";
import { toast } from "sonner";
import { PersonalityAnalysis } from "@/utils/types";

interface HeaderActionsProps {
  analysis: PersonalityAnalysis;
  analysisHistory: PersonalityAnalysis[];
  isMobile?: boolean;
  isRefreshing: boolean;
  onAnalysisChange?: (analysisId: string) => void;
  onRefresh: () => Promise<void>;
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({
  analysis,
  analysisHistory,
  isMobile,
  isRefreshing,
  onAnalysisChange,
  onRefresh
}) => {
  const [copied, setCopied] = useState(false);
  const [isRefreshingLocal, setIsRefreshingLocal] = useState(false);
  
  // Ensure we have a valid analysis ID before creating the share URL
  const shareUrl = analysis && analysis.id 
    ? `${window.location.origin}/shared/${analysis.id}`
    : '';

  const handleCopyLink = () => {
    if (!shareUrl) {
      toast.error("Cannot copy link", {
        description: "No valid analysis is currently selected"
      });
      return;
    }
    
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied to clipboard", {
      description: "Share this link to let others view your personality analysis"
    });
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Handle refresh with local state management
  const handleRefreshClick = async () => {
    setIsRefreshingLocal(true);
    try {
      await onRefresh();
    } finally {
      // Ensure we reset state even if there's an error
      setTimeout(() => setIsRefreshingLocal(false), 2000);
    }
  };

  // Check if we have a valid analysis with a proper ID
  const hasValidAnalysis = analysis && analysis.id && analysis.id.length > 5;

  return (
    <div className={`flex items-center gap-2 ${isMobile ? 'self-start w-full' : 'self-end sm:self-auto'}`}>
      {hasValidAnalysis ? (
        <>
          <Button
            onClick={handleCopyLink}
            size={isMobile ? "sm" : "default"}
            variant="outline"
            className={isMobile ? "flex-1 px-2" : undefined}
          >
            {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />} 
            {isMobile ? "Copy" : (copied ? "Copied" : "Copy Link")}
          </Button>
          
          <HistoryDropdown 
            localAnalysisHistory={analysisHistory}
            currentAnalysisId={analysis.id}
            isMobile={isMobile}
            isRefreshing={isRefreshing}
            onAnalysisChange={onAnalysisChange}
            onRefresh={handleRefreshClick}
          />
          
          <ShareDialog shareUrl={shareUrl} isMobile={isMobile} />
        </>
      ) : (
        // When there's no valid analysis, show a refresh button
        <Button
          onClick={handleRefreshClick}
          size={isMobile ? "sm" : "default"}
          variant="outline"
          disabled={isRefreshing || isRefreshingLocal}
          className={isMobile ? "flex-1 px-2" : undefined}
        >
          <RefreshCcw className={`h-4 w-4 mr-2 ${isRefreshing || isRefreshingLocal ? 'animate-spin' : ''}`} />
          {isRefreshing || isRefreshingLocal ? "Loading..." : "Refresh Analyses"}
        </Button>
      )}
    </div>
  );
};
