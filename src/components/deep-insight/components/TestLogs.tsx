
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface TestLogsProps {
  logs: string[];
}

export const TestLogs: React.FC<TestLogsProps> = ({ logs }) => {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium mb-2">Test Logs</h3>
      <ScrollArea className="bg-muted p-4 rounded-lg h-80 border border-muted-foreground/20">
        <pre
          className="text-sm whitespace-pre-wrap font-mono"
          role="document"
        >
          {logs.map((log, index) => {
            const isError = log.toLowerCase().includes('error') || log.toLowerCase().includes('warning');
            const isSuccess = log.toLowerCase().includes('success') || 
                            log.toLowerCase().includes('saved') || 
                            log.toLowerCase().includes('completed');
            
            return (
              <div 
                key={index} 
                className={`py-1 ${
                  isError ? 'text-destructive font-medium' : 
                  isSuccess ? 'text-emerald-500' : 'text-foreground'
                }`}
              >
                {isError && (
                  <Badge variant="destructive" className="mr-2 h-1.5 w-1.5 rounded-full p-0 inline-block" />
                )}
                {isSuccess && (
                  <Badge variant="success" className="mr-2 h-1.5 w-1.5 rounded-full p-0 inline-block bg-emerald-500" />
                )}
                {log}
              </div>
            );
          })}
        </pre>
      </ScrollArea>
    </div>
  );
};
