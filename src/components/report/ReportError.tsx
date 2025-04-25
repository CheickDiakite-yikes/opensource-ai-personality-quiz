
import React from 'react';
import { Button } from "@/components/ui/button";
import { AssessmentErrorHandler } from "../assessment/AssessmentErrorHandler";
import { useNavigate } from 'react-router-dom';
import { PersonalityAnalysis } from '@/utils/types';
import { RefreshCcw, FileText, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ReportErrorProps {
  id?: string;
  analysisHistory: PersonalityAnalysis[];
  loadAttempts: number;
  onManualRefresh: () => void;
}

const ReportError: React.FC<ReportErrorProps> = ({
  id,
  analysisHistory,
  loadAttempts,
  onManualRefresh
}) => {
  const navigate = useNavigate();

  return (
    <div className="container py-6 px-2 mx-auto text-center">
      <Card className="p-6 max-w-lg mx-auto">
        <div className="flex justify-center mb-6">
          <AlertCircle className="h-12 w-12 text-orange-500" />
        </div>
        
        <h2 className="text-2xl font-bold">Analysis Report Not Found</h2>
        <p className="mt-2 text-muted-foreground">
          {id ? 
            `We couldn't find an analysis with ID: ${id.slice(0, 8)}...` : 
            "No analysis reports were found in your account."
          }
        </p>
        
        <CardContent className="space-y-6 pt-6">
          {analysisHistory.length > 0 ? (
            <div className="text-left">
              <p className="font-medium mb-2">Available reports:</p>
              <ul className="space-y-2">
                {analysisHistory.slice(0, 3).map((item, index) => (
                  <li key={item.id} className="flex">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-left" 
                      onClick={() => navigate(`/report/${item.id}`)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      {new Date(item.createdAt).toLocaleDateString() || `Report ${index + 1}`}
                    </Button>
                  </li>
                ))}
                {analysisHistory.length > 3 && (
                  <li className="text-sm text-muted-foreground pl-2">+ {analysisHistory.length - 3} more reports</li>
                )}
              </ul>
            </div>
          ) : (
            <p className="mt-2 text-muted-foreground">
              We couldn't find any personality analysis reports. Please try taking the assessment.
            </p>
          )}
          
          <div className="space-y-3 pt-2">
            <Button onClick={() => navigate("/assessment")} className="w-full">
              Take Assessment
            </Button>
            <Button onClick={onManualRefresh} variant="outline" className="w-full">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Manually Refresh Analyses
            </Button>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <AssessmentErrorHandler 
              title="Data Loading Issue"
              description="We're having trouble retrieving your analysis data from the server."
              showRetry={false}
              errorDetails={`Analysis ID: ${id || 'none'}, History Size: ${analysisHistory.length}, Load Attempts: ${loadAttempts}`}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportError;
