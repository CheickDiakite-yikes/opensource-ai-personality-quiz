
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
    // Check for valid patternData with percentages
    if (!patternData || !patternData.percentages) {
      return [
        { name: "Analytical (Default)", value: 20 },
        { name: "Emotional (Default)", value: 20 },
        { name: "Practical (Default)", value: 20 },
        { name: "Creative (Default)", value: 20 },
        { name: "Social (Default)", value: 10 },
        { name: "Organized (Default)", value: 10 }
      ];
    }
    
    // Extract values from percentages, ensuring all keys exist
    const percentages = patternData.percentages;
    const requiredKeys = ['a', 'b', 'c', 'd', 'e', 'f'];
    
    // Create data array with proper labels
    return requiredKeys
      .filter(key => typeof percentages[key] === 'number' && percentages[key] > 0)
      .map(key => ({
        name: getResponseName(key),
        value: percentages[key],
        key
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
    // Only render labels for segments with significant values
    if (entry.value < 5) return null;
    return `${entry.name}: ${entry.value}%`;
  };

  const isDefaultData = !patternData || !patternData.percentages;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="h-[350px]">
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
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    opacity={isDefaultData ? 0.5 : 1} // Dim default data
                  />
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
          
          {isDefaultData && (
            <div className="text-center mt-4 text-sm text-muted-foreground">
              <p>This is sample data. Complete an assessment to see your personal response pattern.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResponsePatternChart;
