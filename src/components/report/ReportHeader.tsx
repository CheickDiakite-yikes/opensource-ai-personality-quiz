
import React, { useState } from "react";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { PersonalityAnalysis } from "@/utils/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { HeaderActions } from "./header/HeaderActions";

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
  const [isRefreshing, setIsRefreshing] = useState(false);

  const renderDate = () => {
    try {
      const date = new Date(analysis.createdAt);
      return format(date, "MMMM d, yyyy");
    } catch (error) {
      return "Recent assessment";
    }
  };

  const handleRefresh = async () => {
    if (isRefreshing || !onManualRefresh) return;
    setIsRefreshing(true);
    try {
      await onManualRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-1 max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            {isMobile ? "Your Analysis" : "Your Personality Analysis"}
          </h1>
          <div className="flex items-center text-muted-foreground mt-1">
            <Calendar className="h-4 w-4 mr-1" />
            {renderDate()}
            {analysisHistory.length > 1 && (
              <span className="ml-2 text-xs">
                ({analysisHistory.length} reports available)
              </span>
            )}
          </div>
        </div>

        <HeaderActions 
          analysis={analysis}
          analysisHistory={analysisHistory}
          isMobile={isMobile}
          isRefreshing={isRefreshing}
          onAnalysisChange={onAnalysisChange}
          onRefresh={handleRefresh}
        />
      </div>
    </div>
  );
};

export default ReportHeader;
