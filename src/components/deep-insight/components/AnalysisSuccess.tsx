
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

interface AnalysisSuccessProps {
  analysisId: string;
}

export const AnalysisSuccess: React.FC<AnalysisSuccessProps> = ({ analysisId }) => {
  const [copied, setCopied] = useState(false);

  const copyIdToClipboard = () => {
    navigator.clipboard.writeText(analysisId);
    setCopied(true);
    toast.success("Analysis ID copied to clipboard");
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <Card className="mb-8 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-900">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          <CardTitle className="text-green-700 dark:text-green-300">Test Completed Successfully</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-green-700 dark:text-green-300 mb-4">
          Deep Insight analysis has been generated with ID: 
          <span 
            className="font-mono font-bold ml-1 cursor-pointer border-b border-dotted border-green-600" 
            onClick={copyIdToClipboard}
          >
            {analysisId} {copied ? "✓" : ""}
          </span>
        </p>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link to={`/deep-insight/results/${analysisId}`}>
              <ExternalLink size={16} className="mr-1" /> View Analysis Report
            </Link>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {
              const url = `/deep-insight/results/${analysisId}`;
              window.open(url, '_blank');
            }}
          >
            Open in New Tab
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
