
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface AnalysisSuccessProps {
  analysisId: string;
}

export const AnalysisSuccess: React.FC<AnalysisSuccessProps> = ({ analysisId }) => {
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
          Deep Insight analysis has been generated with ID: <span className="font-mono font-bold">{analysisId}</span>
        </p>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link to={`/deep-insight/results/${analysisId}`}>
              View Analysis Report
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/profile">
              Go to Profile
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
