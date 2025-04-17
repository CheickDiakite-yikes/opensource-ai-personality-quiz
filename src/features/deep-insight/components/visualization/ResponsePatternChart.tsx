
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { ResponsePatternAnalysis } from "@/features/deep-insight/utils/analysis/types";

interface ResponsePatternChartProps {
  patternData?: ResponsePatternAnalysis;
}

const ResponsePatternChart: React.FC<ResponsePatternChartProps> = ({ patternData }) => {
  // Enhanced data processing with improved fallbacks
  const data = React.useMemo(() => {
    // Debug the incoming data
    console.log("Response pattern data:", patternData);
    
    // Check for valid patternData with percentages
    if (!patternData) {
      console.log("No pattern data provided");
      return generateDefaultData();
    }
    
    // Handle direct percentages object
    if (patternData.percentages && typeof patternData.percentages === 'object') {
      const percentages = patternData.percentages;
      console.log("Using direct percentages:", percentages);
      
      // Filter out only keys with valid numeric values
      return Object.entries(percentages)
        .filter(([key, value]) => typeof value === 'number' && value > 0)
        .map(([key, value]) => ({
          name: getResponseName(key),
          value: value,
          key
        }));
    }
    
    // Handle legacy format where percentages might be nested differently
    if (typeof patternData === 'object') {
      // Try to extract percentages from potential nested structure
      const possiblePercentages = Object.entries(patternData)
        .filter(([key, value]) => 
          typeof value === 'number' && 
          ['a', 'b', 'c', 'd', 'e', 'f'].includes(key)
        );
      
      if (possiblePercentages.length > 0) {
        console.log("Found legacy percentages format:", possiblePercentages);
        return possiblePercentages.map(([key, value]) => ({
          name: getResponseName(key),
          value: value as number,
          key
        }));
      }
    }
    
    console.log("Could not process pattern data, using default");
    return generateDefaultData();
  }, [patternData]);
  
  // Generate default data for fallback
  function generateDefaultData() {
    return [
      { name: "Analytical (Default)", value: 20, key: 'a' },
      { name: "Emotional (Default)", value: 20, key: 'b' },
      { name: "Practical (Default)", value: 20, key: 'c' },
      { name: "Creative (Default)", value: 20, key: 'd' },
      { name: "Social (Default)", value: 10, key: 'e' },
      { name: "Organized (Default)", value: 10, key: 'f' }
    ];
  }
  
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
  
  // No data scenario - show helpful message instead of empty chart
  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">No Response Pattern Data</h3>
            <p className="text-muted-foreground mb-4">
              The analysis doesn't contain any response pattern data to visualize.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className={!isDefaultData ? "pb-0" : "pb-4"}>
        {!isDefaultData && (
          <>
            <CardTitle className="text-lg">Response Pattern Analysis</CardTitle>
            <CardDescription>
              Distribution of your response tendencies across different thinking styles
            </CardDescription>
          </>
        )}
      </CardHeader>
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
