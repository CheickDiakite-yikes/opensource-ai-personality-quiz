
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { ResponsePatternAnalysis } from "@/features/deep-insight/utils/analysis/types";

interface ResponsePatternChartProps {
  patternData?: ResponsePatternAnalysis;
}

const ResponsePatternChart: React.FC<ResponsePatternChartProps> = ({ patternData }) => {
  const data = React.useMemo(() => {
    if (!patternData || !patternData.percentages) {
      return [{ name: "No data", value: 100 }];
    }
    
    return Object.entries(patternData.percentages)
      .filter(([_, value]) => value > 0) // Only include non-zero values
      .map(([key, value]) => ({
        name: getResponseName(key),
        value
      }));
  }, [patternData]);
  
  const COLORS = ['#FF8042', '#FFBB28', '#00C49F', '#0088FE', '#8884d8', '#82ca9d'];
  
  function getResponseName(key: string): string {
    switch(key) {
      case 'a': return 'Analytical';
      case 'b': return 'Emotional';
      case 'c': return 'Practical';
      case 'd': return 'Creative';
      case 'e': return 'Social';
      case 'f': return 'Organized';
      default: return `Type ${key.toUpperCase()}`;
    }
  }
  
  const renderLabel = (entry: any) => {
    return `${entry.name}: ${entry.value}%`;
  };

  return (
    <Card className="w-full h-[300px] md:h-[400px]">
      <CardContent className="p-4">
        {data.length === 1 && data[0].name === "No data" ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No response pattern data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={renderLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `${value}%`}
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))"
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default ResponsePatternChart;
