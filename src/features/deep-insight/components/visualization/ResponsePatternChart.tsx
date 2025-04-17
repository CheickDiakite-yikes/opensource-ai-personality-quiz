
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartTooltip,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsePatternAnalysis } from "../../utils/analysis/types";

interface ResponsePatternChartProps {
  patternData: ResponsePatternAnalysis;
  title?: string;
  description?: string;
}

const ResponsePatternChart: React.FC<ResponsePatternChartProps> = ({
  patternData,
  title = "Response Pattern Distribution",
  description = "Analysis of your response patterns across different questions"
}) => {
  // Transform percentages into a format suitable for the pie chart
  const chartData = Object.entries(patternData.percentages).map(([key, value]) => ({
    name: getResponseLabel(key),
    value,
    color: getResponseColor(key)
  })).filter(item => item.value > 0); // Only include non-zero values
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-full md:w-1/2 h-[250px]">
            <ChartContainer
              config={{
                a: { label: "Analytical", color: "#8b5cf6" },     // violet-500
                b: { label: "Emotional", color: "#ec4899" },      // pink-500
                c: { label: "Practical", color: "#14b8a6" },      // teal-500
                d: { label: "Creative", color: "#f59e0b" },       // amber-500
                e: { label: "Cautious", color: "#6b7280" },       // gray-500
                f: { label: "Reflective", color: "#3b82f6" }      // blue-500
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                    paddingAngle={4}
                    label={(entry) => `${entry.name}: ${entry.value}%`}
                    labelLine={false}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent 
                        formatter={(value) => `${value}%`}
                      />
                    }
                  />
                  <ChartLegend
                    content={
                      <ChartLegendContent verticalAlign="bottom" />
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          
          <div className="w-full md:w-1/2 space-y-4">
            <div>
              <h3 className="font-medium text-sm">Primary Response Style</h3>
              <p className="text-lg font-semibold">{getResponseLabel(patternData.primaryChoice)}</p>
              <p className="text-sm text-muted-foreground">{getResponseDescription(patternData.primaryChoice)}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-sm">Secondary Response Style</h3>
              <p className="text-lg font-semibold">{getResponseLabel(patternData.secondaryChoice)}</p>
              <p className="text-sm text-muted-foreground">{getResponseDescription(patternData.secondaryChoice)}</p>
            </div>
            
            <div className="text-xs text-muted-foreground border-t pt-2 mt-4">
              <p>Response Signature: {patternData.responseSignature}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper functions for response pattern labels and descriptions
const getResponseLabel = (key: string): string => {
  switch (key) {
    case 'a': return 'Analytical';
    case 'b': return 'Emotional';
    case 'c': return 'Practical';
    case 'd': return 'Creative';
    case 'e': return 'Cautious';
    case 'f': return 'Reflective';
    default: return 'Other';
  }
};

const getResponseColor = (key: string): string => {
  switch (key) {
    case 'a': return '#8b5cf6'; // violet-500
    case 'b': return '#ec4899'; // pink-500
    case 'c': return '#14b8a6'; // teal-500
    case 'd': return '#f59e0b'; // amber-500
    case 'e': return '#6b7280'; // gray-500
    case 'f': return '#3b82f6'; // blue-500
    default: return '#94a3b8'; // slate-400
  }
};

const getResponseDescription = (key: string): string => {
  switch (key) {
    case 'a': 
      return 'You tend to approach situations with logic and analysis, focusing on systematic thinking and rational evaluation.';
    case 'b': 
      return 'You tend to prioritize feelings and relationships, with a focus on emotional understanding and interpersonal harmony.';
    case 'c': 
      return 'You tend to focus on practical solutions and real-world applications, valuing efficiency and tangible results.';
    case 'd': 
      return 'You tend to think outside the box and focus on innovation and possibilities, embracing new ideas and unconventional approaches.';
    case 'e': 
      return 'You tend to approach situations with careful consideration of risks and potential problems, prioritizing security and stability.';
    case 'f': 
      return 'You tend to engage in deep introspection and thoughtful contemplation, often examining your own thoughts and motivations.';
    default: 
      return 'No specific pattern detected.';
  }
};

export default ResponsePatternChart;
