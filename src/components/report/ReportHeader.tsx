import React, { useState, useEffect, useCallback } from "react";
import { PersonalityAnalysis } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { Copy, Calendar, History, Check, RefreshCw } from "lucide-react";
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
import { useAIAnalysis } from "@/hooks/useAIAnalysis";

interface ReportHeaderProps {
  analysis: PersonalityAnalysis;
  analysisHistory?: PersonalityAnalysis[];
  onAnalysisChange?: (analysisId: string) => void;
  onManualRefresh?: () => Promise<void>;
}

const ReportHeader: React.FC<ReportHeaderProps> = ({ 
  analysis,
  analysisHistory = [],
  onAnalysisChange,
  onManualRefresh
}) => {
  const isMobile = useIsMobile();
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { loadAllAnalysesFromSupabase } = useAIAnalysis();
  const [localAnalysisHistory, setLocalAnalysisHistory] = useState<PersonalityAnalysis[]>(analysisHistory);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Update local history when prop changes
  useEffect(() => {
    if (analysisHistory && analysisHistory.length > 0) {
      setLocalAnalysisHistory(analysisHistory);
    }
  }, [analysisHistory]);
  
  // Generate a share URL for the current analysis
  const shareUrl = `${window.location.origin}/shared/${analysis.id}`;
  // Set the image URL for social media previews - updated to use new image
  const imageUrl = `/lovable-uploads/9a629d86-fdd2-4f3f-90a2-10826eb575d7.png`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied to clipboard", {
      description: "Share this link to let others view your personality analysis"
    });
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Handle refreshing all analyses from Supabase
  const handleRefreshAnalyses = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      if (onManualRefresh) {
        await onManualRefresh();
      } else {
        const allAnalyses = await loadAllAnalysesFromSupabase();
        if (allAnalyses && allAnalyses.length > 0) {
          setLocalAnalysisHistory(allAnalyses);
          toast.success(`Found ${allAnalyses.length} analysis reports`, {
            description: "Your analysis history has been updated"
          });
        } else {
          toast.info("No additional analyses found", {
            description: "We couldn't find any more analysis reports"
          });
        }
      }
    } catch (error) {
      console.error("Error refreshing analyses:", error);
      toast.error("Failed to load all analyses", {
        description: "Please try again later"
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  const renderDate = () => {
    try {
      const date = new Date(analysis.createdAt);
      return format(date, "MMMM d, yyyy");
    } catch (error) {
      return "Recent assessment";
    }
  };

  // Define a max number of items to show in dropdown
  const MAX_HISTORY_ITEMS = 30; // Increased from 10 to show more reports
  
  // Filter out the current analysis and get only the others
  const otherAnalyses = localAnalysisHistory
    .filter(item => item.id !== analysis.id)
    .slice(0, MAX_HISTORY_ITEMS);
    
  // Load more analyses when dropdown opens
  const handleDropdownOpen = useCallback(async (open: boolean) => {
    setIsDropdownOpen(open);
    
    // When dropdown opens, check if we need to load more analyses
    if (open && localAnalysisHistory.length < 2 && !isRefreshing) {
      console.log("Dropdown opened with few analyses, refreshing...");
      handleRefreshAnalyses();
    }
  }, [localAnalysisHistory.length, isRefreshing]);

  return (
    <div className="flex flex-col gap-4 sm:gap-1 max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{isMobile ? "Your Analysis" : "Your Personality Analysis"}</h1>
          <div className="flex items-center text-muted-foreground mt-1">
            <Calendar className="h-4 w-4 mr-1" />
            {renderDate()}
            {localAnalysisHistory.length > 1 && (
              <span className="ml-2 text-xs">
                ({localAnalysisHistory.length} reports available)
              </span>
            )}
          </div>
        </div>

        {isMobile ? (
          <div className="flex items-center gap-1 self-start w-full">
            <Button
              onClick={handleCopyLink}
              size="sm"
              variant="outline"
              className="flex-1 px-2"
            >
              {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />} 
              Copy
            </Button>
            
            <DropdownMenu open={isDropdownOpen} onOpenChange={handleDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 px-2"
                >
                  <History className="h-3 w-3 mr-1" /> Past
                  {localAnalysisHistory.length > 1 && <span className="ml-1 text-xs">({localAnalysisHistory.length})</span>}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <div className="flex items-center justify-between px-2">
                  <DropdownMenuLabel>Your Past Analyses</DropdownMenuLabel>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRefreshAnalyses();
                    }}
                    disabled={isRefreshing}
                  >
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
                <DropdownMenuSeparator />
                {otherAnalyses.length === 0 ? (
                  <>
                    <DropdownMenuItem disabled>No other reports available</DropdownMenuItem>
                    <DropdownMenuItem disabled className="italic text-xs text-muted-foreground">
                      Click refresh to try loading more reports
                    </DropdownMenuItem>
                  </>
                ) : (
                  otherAnalyses.map((item) => {
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
                  })
                )}
                {localAnalysisHistory.length > MAX_HISTORY_ITEMS + 1 && (
                  <DropdownMenuItem disabled className="italic text-xs text-muted-foreground">
                    + {localAnalysisHistory.length - MAX_HISTORY_ITEMS - 1} more reports
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRefreshAnalyses();
                  }}
                  disabled={isRefreshing}
                  className="flex items-center justify-center"
                >
                  <RefreshCw className={`h-3 w-3 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {isRefreshing ? "Loading..." : "Load All Reports"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              onClick={handleCopyLink}
              size={isMobile ? "sm" : "default"}
              variant="outline"
            >
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />} 
              {copied ? "Copied" : "Copy Link"}
            </Button>
            
            <DropdownMenu open={isDropdownOpen} onOpenChange={handleDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size={isMobile ? "sm" : "default"}
                >
                  <History className="h-4 w-4 mr-2" /> Past Reports
                  {localAnalysisHistory.length > 1 && <span className="ml-1">({localAnalysisHistory.length})</span>}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <div className="flex items-center justify-between px-2">
                  <DropdownMenuLabel>Your Past Analyses</DropdownMenuLabel>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRefreshAnalyses();
                    }}
                    disabled={isRefreshing}
                  >
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
                <DropdownMenuSeparator />
                {otherAnalyses.length === 0 ? (
                  <>
                    <DropdownMenuItem disabled>No other reports available</DropdownMenuItem>
                    <DropdownMenuItem disabled className="italic text-xs text-muted-foreground">
                      Click refresh to try loading more reports
                    </DropdownMenuItem>
                  </>
                ) : (
                  otherAnalyses.map((item) => {
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
                  })
                )}
                {localAnalysisHistory.length > MAX_HISTORY_ITEMS + 1 && (
                  <DropdownMenuItem disabled className="italic text-xs text-muted-foreground">
                    + {localAnalysisHistory.length - MAX_HISTORY_ITEMS - 1} more reports
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRefreshAnalyses();
                  }}
                  disabled={isRefreshing}
                  className="flex items-center justify-center"
                >
                  <RefreshCw className={`h-3 w-3 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {isRefreshing ? "Loading..." : "Load All Reports"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportHeader;
