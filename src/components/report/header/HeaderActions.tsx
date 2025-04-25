
import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShareDialog } from "./ShareDialog";
import { HistoryDropdown } from "./HistoryDropdown";
import { toast } from "sonner";
import { PersonalityAnalysis } from "@/utils/types";

interface HeaderActionsProps {
  analysis: PersonalityAnalysis;
  analysisHistory: PersonalityAnalysis[];
  isMobile?: boolean;
  isRefreshing?: boolean;
  onAnalysisChange?: (analysisId: string) => void;
  onRefresh: () => Promise<void>;
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({
  analysis,
  analysisHistory,
  isMobile,
  isRefreshing = false,
  onAnalysisChange,
  onRefresh
}) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/shared/${analysis.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied to clipboard", {
      description: "Share this link to let others view your personality analysis"
    });
    setTimeout(() => setCopied(false), 2000);
  };

  // Check if we have a valid analysis with a proper ID
  const hasValidAnalysis = analysis && analysis.id && analysis.id.length > 5;

  return (
    <div className={`flex items-center gap-2 ${isMobile ? 'self-start w-full' : 'self-end sm:self-auto'}`}>
      {hasValidAnalysis && (
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
            onRefresh={onRefresh}
          />
          
          <ShareDialog shareUrl={shareUrl} isMobile={isMobile} />
        </>
      )}
      
      {/* When there's no valid analysis, only show a refresh button */}
      {!hasValidAnalysis && (
        <Button
          onClick={onRefresh}
          size={isMobile ? "sm" : "default"}
          variant="outline"
          disabled={isRefreshing}
          className={isMobile ? "flex-1 px-2" : undefined}
        >
          {isRefreshing ? "Loading..." : "Refresh Analyses"}
        </Button>
      )}
    </div>
  );
};
