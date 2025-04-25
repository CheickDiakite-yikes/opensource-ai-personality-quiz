
import React from 'react';
import { Button } from "@/components/ui/button";
import { AssessmentErrorHandler } from "../assessment/AssessmentErrorHandler";
import { useNavigate } from 'react-router-dom';
import { PersonalityAnalysis } from '@/utils/types';

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
    <div className="container py-4 px-2 mx-auto text-center">
      <h2 className="text-2xl font-bold">No Analysis Found</h2>
      <p className="mt-2 text-muted-foreground">
        We couldn't find any personality analysis reports. Please try taking the assessment.
      </p>
      <div className="space-y-4 mt-6">
        <Button onClick={() => navigate("/assessment")} className="w-full sm:w-auto">
          Take Assessment
        </Button>
        <Button onClick={onManualRefresh} variant="outline" className="w-full sm:w-auto">
          Manually Refresh Analyses
        </Button>
      </div>
      
      <AssessmentErrorHandler 
        title="Data Loading Issue"
        description="We're having trouble retrieving your analysis data from the server."
        showRetry={false}
        errorDetails={`Analysis ID: ${id}, History Size: ${analysisHistory.length}, Load Attempts: ${loadAttempts}`}
      />
    </div>
  );
};

export default ReportError;
