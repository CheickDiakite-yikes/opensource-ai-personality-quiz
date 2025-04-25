
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
      if (!analysis?.createdAt) return "Recent assessment";
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

  // Ensure we have a valid analysis object with an ID
  if (!analysis || !analysis.id) {
    return (
      <div className="flex flex-col gap-4 sm:gap-1 max-w-full overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold">
              {isMobile ? "Analysis" : "Personality Analysis"}
            </h1>
            <div className="flex items-center text-muted-foreground mt-1">
              <Calendar className="h-4 w-4 mr-1" />
              {analysisHistory.length > 0 ? "Select an analysis" : "No analyses available"}
            </div>
          </div>
          
          <HeaderActions 
            analysis={analysis || {} as PersonalityAnalysis} // Pass empty object as fallback
            analysisHistory={analysisHistory}
            isMobile={isMobile}
            isRefreshing={isRefreshing}
            onAnalysisChange={onAnalysisChange}
            onRefresh={handleRefresh}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-1 max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1">
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
