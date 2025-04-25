
import React, { useCallback } from "react";
import { History, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PersonalityAnalysis } from "@/utils/types";

interface HistoryDropdownProps {
  localAnalysisHistory: PersonalityAnalysis[];
  currentAnalysisId: string;
  isMobile?: boolean;
  isRefreshing: boolean;
  onAnalysisChange?: (analysisId: string) => void;
  onRefresh: () => Promise<void>;
}

const MAX_HISTORY_ITEMS = 30;

export const HistoryDropdown: React.FC<HistoryDropdownProps> = ({
  localAnalysisHistory,
  currentAnalysisId,
  isMobile,
  isRefreshing,
  onAnalysisChange,
  onRefresh
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const handleDropdownOpen = useCallback(async (open: boolean) => {
    setIsDropdownOpen(open);
    if (open && localAnalysisHistory.length < 2 && !isRefreshing) {
      console.log("Dropdown opened with few analyses, refreshing...");
      onRefresh();
    }
  }, [localAnalysisHistory.length, isRefreshing, onRefresh]);

  const otherAnalyses = localAnalysisHistory
    .filter(item => item.id !== currentAnalysisId)
    .slice(0, MAX_HISTORY_ITEMS);

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={handleDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={isMobile ? "sm" : "default"}
          className="flex-1 px-2"
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
              onRefresh();
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
            onRefresh();
          }}
          disabled={isRefreshing}
          className="flex items-center justify-center"
        >
          <RefreshCw className={`h-3 w-3 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? "Loading..." : "Load All Reports"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
