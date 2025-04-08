
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { FixAnalysisButton } from '@/components/analysis/FixAnalysisButton';

interface AssessmentErrorProps {
  title?: string;
  description?: string;
  showRetry?: boolean;
}

export const AssessmentErrorHandler: React.FC<AssessmentErrorProps> = ({ 
  title = "Analysis Display Issue", 
  description = "We're having trouble displaying your analysis results. This can happen when the AI generates incomplete data.",
  showRetry = true
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="mx-auto max-w-3xl p-4">
      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </Alert>
      
      <div className="space-y-4">
        <div className="bg-card rounded-lg p-4 border">
          <h3 className="font-medium mb-2">Possible Solutions:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Try the Fix Analysis button below to reload your data</li>
            <li>Take the assessment again (sometimes the AI generates more complete data on subsequent attempts)</li>
            <li>Check that you answered all assessment questions thoroughly</li>
            <li>Try using different responses for key questions</li>
          </ol>
          
          <div className="mt-6 space-x-4 flex">
            <FixAnalysisButton />
            
            {showRetry && (
              <Button 
                variant="default" 
                onClick={() => navigate("/assessment")}
              >
                Retake Assessment
              </Button>
            )}
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Note: The AI analysis occasionally produces incomplete data when responses are too brief or don't provide enough personality information.
        </p>
      </div>
    </div>
  );
};
