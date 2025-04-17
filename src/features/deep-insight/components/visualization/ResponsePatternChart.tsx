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
import { useIsMobile } from "@/hooks/use-mobile";

interface ResponsePatternChartProps {
  patternData: ResponsePatternAnalysis;
}

const ResponsePatternChart: React.FC<ResponsePatternChartProps> = ({ patternData }) => {
  const isMobile = useIsMobile();
  
  // Transform percentages into chart data
  const chartData = Object.entries(patternData.percentages)
    .map(([key, value]) => ({
      name: getResponseLabel(key),
      value,
      color: getResponseColor(key)
    }))
    .filter(item => item.value > 0);

  return (
    <Card>
      <CardHeader className={isMobile ? "px-3 py-2" : "p-4 md:p-6"}>
        <CardTitle className={isMobile ? "text-base" : "text-lg"}>Response Pattern Analysis</CardTitle>
        <CardDescription className={isMobile ? "text-xs" : "text-sm"}>
          Distribution of your response patterns
        </CardDescription>
      </CardHeader>
      <CardContent className={isMobile ? "p-2" : "p-4"}>
        <div className={`flex flex-col ${isMobile ? "gap-4" : "md:flex-row items-center gap-6"}`}>
          <div className={`w-full ${isMobile ? "h-[200px]" : "md:w-1/2 h-[250px]"}`}>
            <ChartContainer
              config={{
                a: { label: "Analytical", color: "#8b5cf6" },
                b: { label: "Emotional", color: "#ec4899" },
                c: { label: "Practical", color: "#14b8a6" },
                d: { label: "Creative", color: "#f59e0b" },
                e: { label: "Cautious", color: "#6b7280" },
                f: { label: "Reflective", color: "#3b82f6" }
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
                    outerRadius={isMobile ? 70 : 80}
                    innerRadius={isMobile ? 35 : 40}
                    paddingAngle={4}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent 
                        formatter={(value) => (
                          <div className={isMobile ? "text-xs" : "text-sm"}>
                            <p className="font-medium">{value}%</p>
                          </div>
                        )}
                      />
                    }
                  />
                  <ChartLegend
                    content={
                      <ChartLegendContent 
                        verticalAlign="bottom" 
                        hideIcon={isMobile}
                      />
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          
          <div className={`w-full ${isMobile ? "" : "md:w-1/2"} space-y-4`}>
            <div>
              <h3 className={`font-medium ${isMobile ? "text-xs" : "text-sm"}`}>Primary Response Style</h3>
              <p className={`${isMobile ? "text-sm" : "text-lg"} font-semibold`}>
                {getResponseLabel(patternData.primaryChoice)}
              </p>
              <p className={`${isMobile ? "text-xs" : "text-sm"} text-muted-foreground`}>
                {getResponseDescription(patternData.primaryChoice)}
              </p>
            </div>
            
            <div>
              <h3 className={`font-medium ${isMobile ? "text-xs" : "text-sm"}`}>Secondary Response Style</h3>
              <p className={`${isMobile ? "text-sm" : "text-lg"} font-semibold`}>
                {getResponseLabel(patternData.secondaryChoice)}
              </p>
              <p className={`${isMobile ? "text-xs" : "text-sm"} text-muted-foreground`}>
                {getResponseDescription(patternData.secondaryChoice)}
              </p>
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
