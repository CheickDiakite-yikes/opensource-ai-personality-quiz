
import React from 'react';

interface TestLogsProps {
  logs: string[];
}

export const TestLogs: React.FC<TestLogsProps> = ({ logs }) => {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium mb-2">Test Logs</h3>
      <pre
        className="bg-muted p-4 rounded-lg overflow-auto max-h-80 text-sm"
        role="document"
      >
        {logs.join('\n')}
      </pre>
    </div>
  );
};
