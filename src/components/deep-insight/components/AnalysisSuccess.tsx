
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AnalysisSuccessProps {
  analysisId: string;
}

export const AnalysisSuccess = ({ analysisId }: AnalysisSuccessProps) => {
  return (
    <Card className="mb-8 bg-green-50 dark:bg-green-900/20">
      <CardHeader>
        <CardTitle className="text-green-600 dark:text-green-400">
          Test Completed Successfully
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>Analysis ID: {analysisId}</p>
      </CardContent>
    </Card>
  );
};
