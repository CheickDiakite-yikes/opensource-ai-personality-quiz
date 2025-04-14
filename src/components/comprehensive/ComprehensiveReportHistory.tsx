
import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { ComprehensiveAnalysis } from "@/utils/types";
import { Clock, ArrowRight } from "lucide-react";

interface ComprehensiveReportHistoryProps {
  reports: ComprehensiveAnalysis[];
  currentReportId: string;
  onSelectReport: (reportId: string) => void;
}

const ComprehensiveReportHistory: React.FC<ComprehensiveReportHistoryProps> = ({
  reports,
  currentReportId,
  onSelectReport
}) => {
  if (!reports || reports.length <= 1) return null;
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-2 flex items-center">
        <Clock className="h-4 w-4 mr-2" /> Report History
      </h3>
      <ScrollArea className="h-[120px] border rounded-md p-2">
        <div className="space-y-2 pr-4">
          {reports.map((report) => {
            const isActive = report.id === currentReportId;
            const date = report.created_at 
              ? format(new Date(report.created_at), 'MMM d, yyyy')
              : 'Unknown date';
            
            return (
              <Button
                key={report.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-between ${isActive ? "" : "text-muted-foreground"}`}
                onClick={() => onSelectReport(report.id)}
              >
                <span className="truncate">{date}</span>
                {isActive && <ArrowRight className="h-4 w-4 ml-2" />}
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ComprehensiveReportHistory;
