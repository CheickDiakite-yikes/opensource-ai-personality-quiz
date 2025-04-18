import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DeepInsightAnalysis } from "../types/deepInsight";

interface AnalysisActionsProps {
  analysis: DeepInsightAnalysis;
}

const AnalysisActions: React.FC<AnalysisActionsProps> = ({ analysis }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button 
        variant="outline" 
        onClick={() => navigate("/deep-insight")}
        className="flex items-center"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retake Assessment
      </Button>
      
      <Button 
        variant="outline"
        onClick={() => {
          const blob = new Blob([JSON.stringify(analysis, null, 2)], { type: 'application/json' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'deep-insight-analysis.json';
          a.click();
          window.URL.revokeObjectURL(url);
          
          toast.success("Analysis downloaded");
        }}
        className="flex items-center"
      >
        <Download className="mr-2 h-4 w-4" />
        Download Analysis
      </Button>
      
      <Button 
        onClick={() => {
          const shareUrl = `${window.location.origin}/deep-insight/results/${analysis.id}`;
          navigator.clipboard.writeText(shareUrl);
          
          toast.success("Share link copied to clipboard");
        }}
        className="flex items-center bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
      >
        <Share2 className="mr-2 h-4 w-4" />
        Share Results
      </Button>
    </div>
  );
};

export default AnalysisActions;
