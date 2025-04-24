
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useTestLogs } from './hooks/useTestLogs';
import { useE2ETest } from './hooks/useE2ETest';
import { TestLogs } from './components/TestLogs';
import { AnalysisSuccess } from './components/AnalysisSuccess';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const DeepInsightE2ETest = () => {
  const { user } = useAuth();
  const { logs, addLog, clearLogs } = useTestLogs();
  const { isRunning, analysisId, runE2ETest, rawResponse } = useE2ETest(user, addLog);

  // Setup special E2E test function if needed
  useEffect(() => {
    const checkOrCreateE2eTestFunction = async () => {
      try {
        // Check if the function exists
        const { error: checkError } = await supabase
          .rpc('create_e2e_test_analysis', {
            analysis_id: '00000000-0000-0000-0000-000000000000',
            analysis_title: 'Test Check',
            analysis_overview: 'Just checking if function exists'
          });
        
        // If function doesn't exist, warn the user
        if (checkError && checkError.message.includes('does not exist')) {
          console.warn('E2E test helper function not found in database');
          toast.warning('E2E test helper function not found', {
            description: 'Some test features may not work properly',
            duration: 5000
          });
        }
      } catch (e) {
        console.error('Error checking for E2E test function:', e);
      }
    };
    
    checkOrCreateE2eTestFunction();
  }, []);

  const handleRunTest = async () => {
    clearLogs();
    await runE2ETest();
  };

  return (
    <div className="container max-w-4xl py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Deep Insight E2E Test</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleRunTest} 
            disabled={isRunning}
            className="w-full"
          >
            {isRunning ? 'Running Test...' : 'Run E2E Test'}
          </Button>
        </CardContent>
      </Card>

      {analysisId && <AnalysisSuccess analysisId={analysisId} />}
      
      <TestLogs logs={logs} />
    </div>
  );
};

export default DeepInsightE2ETest;
