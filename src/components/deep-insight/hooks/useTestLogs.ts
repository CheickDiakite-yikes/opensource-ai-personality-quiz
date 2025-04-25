
import { useState } from 'react';

export const useTestLogs = () => {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString()} - ${message}`]);
  };

  const clearLogs = () => setLogs([]);

  return {
    logs,
    addLog,
    clearLogs
  };
};
