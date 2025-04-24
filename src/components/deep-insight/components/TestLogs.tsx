
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TestLogsProps {
  logs: string[];
}

export const TestLogs = ({ logs }: TestLogsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="bg-muted p-4 rounded-lg text-sm font-mono whitespace-pre-wrap max-h-[400px] overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} className="pb-1">
              {log}
            </div>
          ))}
        </pre>
      </CardContent>
    </Card>
  );
};
