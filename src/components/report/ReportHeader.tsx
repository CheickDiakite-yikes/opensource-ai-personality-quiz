
import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const ReportHeader: React.FC = () => {
  return (
    <div className="flex justify-between items-start mb-8 flex-col md:flex-row">
      <div>
        <h1 className="text-3xl font-bold">Your Analysis Report</h1>
        <p className="text-muted-foreground mt-2">
          Based on your assessment responses
        </p>
      </div>
      <Button 
        variant="outline" 
        className="flex items-center mt-4 md:mt-0" 
        onClick={() => console.log("Download report")}
      >
        <Download className="h-4 w-4 mr-2" /> Download Report
      </Button>
    </div>
  );
};

export default ReportHeader;
