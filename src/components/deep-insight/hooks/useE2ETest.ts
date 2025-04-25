
import { useState } from 'react';

// This is a stub file to prevent build errors
// The deep insight feature has been removed
export const useE2ETest = (user: any, addLog: (message: string) => void) => {
  const [isRunning, setIsRunning] = useState(false);
  const [analysisId, setAnalysisId] = useState<string | null>(null);

  const runE2ETest = async () => {
    setIsRunning(true);
    addLog('E2E test functionality has been removed');
    setIsRunning(false);
    return null;
  };

  return {
    isRunning,
    analysisId,
    runE2ETest
  };
};

export default useE2ETest;
