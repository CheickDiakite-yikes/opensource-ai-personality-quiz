
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface TestLogsProps {
  logs: string[];
}

export const TestLogs: React.FC<TestLogsProps> = ({ logs }) => {
  const [expandedJson, setExpandedJson] = useState<{[key: number]: boolean}>({});

  const toggleJsonExpansion = (index: number) => {
    setExpandedJson(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const isJsonLog = (log: string) => {
    return log.includes('{') && log.includes('}') && 
           (log.includes('Full response:') || log.includes('Analysis data:'));
  };

  const formatJsonLog = (log: string, index: number, isExpanded: boolean) => {
    if (!isJsonLog(log)) return log;
    
    try {
      // Extract the JSON part from the log
      const jsonStartIndex = log.indexOf('{');
      if (jsonStartIndex === -1) return log;
      
      const prefix = log.substring(0, jsonStartIndex);
      const jsonPart = log.substring(jsonStartIndex);
      
      let parsedJson;
      try {
        parsedJson = JSON.parse(jsonPart);
      } catch (e) {
        return log; // If parsing fails, return the original log
      }
      
      // If not expanded, just show the prefix and a summary
      if (!isExpanded) {
        return (
          <div className="flex items-start">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-1 p-0 h-5 w-5" 
              onClick={() => toggleJsonExpansion(index)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <span>
              {prefix} {'{...}'} (Click to expand)
            </span>
          </div>
        );
      }
      
      // If expanded, show formatted JSON
      return (
        <div>
          <div className="flex items-start">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-1 p-0 h-5 w-5" 
              onClick={() => toggleJsonExpansion(index)}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
            <span>{prefix}</span>
          </div>
          <pre className="bg-muted/50 p-2 rounded mt-1 overflow-auto text-xs">
            {JSON.stringify(parsedJson, null, 2)}
          </pre>
        </div>
      );
    } catch (e) {
      return log;
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium mb-2">Test Logs</h3>
      <ScrollArea className="bg-muted p-4 rounded-lg h-96 border border-muted-foreground/20">
        <pre
          className="text-sm whitespace-pre-wrap font-mono"
          role="document"
        >
          {logs.map((log, index) => {
            const isError = log.toLowerCase().includes('error') || log.toLowerCase().includes('warning');
            const isSuccess = log.toLowerCase().includes('success') || 
                            log.toLowerCase().includes('saved') || 
                            log.toLowerCase().includes('completed');
            const isJson = isJsonLog(log);
            const isExpanded = expandedJson[index] || false;
            
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
                  <Badge variant="secondary" className="mr-2 h-1.5 w-1.5 rounded-full p-0 inline-block bg-emerald-500" />
                )}
                {isJson ? formatJsonLog(log, index, isExpanded) : log}
              </div>
            );
          })}
        </pre>
      </ScrollArea>
    </div>
  );
};
