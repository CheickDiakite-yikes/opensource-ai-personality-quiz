
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
  const shareUrl = `${window.location.origin}/shared/${analysis.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied to clipboard", {
      description: "Share this link to let others view your personality analysis"
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex items-center gap-2 ${isMobile ? 'self-start w-full' : 'self-end sm:self-auto'}`}>
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
    </div>
  );
};
