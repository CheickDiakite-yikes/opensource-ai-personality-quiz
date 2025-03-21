
import React, { useState } from "react";
import { PersonalityAnalysis } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { Share, Copy, Calendar, History } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

interface ReportHeaderProps {
  analysis: PersonalityAnalysis;
  analysisHistory?: PersonalityAnalysis[];
  onAnalysisChange?: (analysisId: string) => void;
}

const ReportHeader: React.FC<ReportHeaderProps> = ({ 
  analysis,
  analysisHistory = [],
  onAnalysisChange
}) => {
  const isMobile = useIsMobile();
  const [showHistoryTooltip, setShowHistoryTooltip] = useState(false);
  
  // Check if we have multiple analyses to show in history
  const hasMultipleAnalyses = analysisHistory.length > 1;
  
  const handleCopyLink = () => {
    const url = `${window.location.origin}/report/${analysis.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard", {
      description: "Share this link to let others view your personality analysis"
    });
  };

  const renderDate = () => {
    try {
      const date = new Date(analysis.createdAt);
      return format(date, "MMMM d, yyyy");
    } catch (error) {
      return "Recent assessment";
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-1">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Your Personality Analysis</h1>
            <div className="flex items-center text-muted-foreground mt-1">
              <Calendar className="h-4 w-4 mr-1" />
              {renderDate()}
            </div>
          </div>
          
          {/* History Dropdown - Placed next to the title for better visibility */}
          {hasMultipleAnalyses && (
            <div className="relative" onMouseEnter={() => setShowHistoryTooltip(true)} onMouseLeave={() => setShowHistoryTooltip(false)}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="secondary" 
                    size={isMobile ? "sm" : "default"}
                    className="ml-2 mt-0 sm:mt-1"
                  >
                    <History className="h-4 w-4 mr-2" /> Past Reports
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuLabel>Your Past Reports</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {analysisHistory.map((item) => {
                    // Skip the current analysis
                    if (item.id === analysis.id) return null;
                    
                    let dateLabel = "Unknown date";
                    try {
                      dateLabel = format(new Date(item.createdAt), "MMM d, yyyy");
                    } catch (e) {
                      console.error("Invalid date format", e);
                    }
                    
                    return (
                      <DropdownMenuItem 
                        key={item.id}
                        onClick={() => onAnalysisChange && onAnalysisChange(item.id)}
                      >
                        {dateLabel}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Optional tooltip that appears on hover */}
              {showHistoryTooltip && (
                <div className="absolute z-50 bg-popover text-popover-foreground rounded-md shadow-md p-2 text-xs -bottom-8 left-0 whitespace-nowrap">
                  View your previous assessments
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            onClick={handleCopyLink}
            size={isMobile ? "sm" : "default"}
            variant="outline"
          >
            <Copy className="h-4 w-4 mr-2" /> Copy Link
          </Button>

          <Button size={isMobile ? "sm" : "default"}>
            <Share className="h-4 w-4 mr-2" /> Share
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportHeader;
