
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { Brain } from "lucide-react";

interface IntelligenceDomain {
  name: string;
  score: number;
  description: string;
}

interface IntelligenceDomainChartProps {
  domains: IntelligenceDomain[];
}

const IntelligenceDomainChart: React.FC<IntelligenceDomainChartProps> = ({ domains }) => {
  // Prepare data for chart
  const chartData = domains?.map((domain) => ({
    name: domain.name,
    score: domain.score * 10, // Scale to 0-100 for better visualization
    description: domain.description,
    originalScore: domain.score, // Keep original score for tooltip
  })) || [];

  // Custom gradient colors
  const getBarColor = (index: number) => {
    const colors = [
      "hsl(var(--primary))",
      "hsl(var(--primary) / 0.9)",
      "hsl(var(--primary) / 0.8)",
      "hsl(var(--primary) / 0.7)",
      "hsl(var(--primary) / 0.6)",
    ];
    return colors[index % colors.length];
  };

  // Fallback if no domains data
  if (!domains || domains.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center border border-dashed rounded-md">
        <p className="text-muted-foreground">No intelligence domains data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-64 mt-4">
      <ChartContainer
        config={{
          domain: { label: "Intelligence Domain", color: "hsl(var(--primary))" },
          score: { label: "Score", color: "hsl(var(--primary))" },
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis 
              type="number" 
              domain={[0, 100]} 
              tickFormatter={(value) => `${(value / 10).toFixed(1)}`}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={120} 
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent 
                  formatter={(value, name, props) => (
                    <div>
                      <p className="font-medium">{props.payload.name}</p>
                      <p className="text-muted-foreground text-xs mt-1">{props.payload.description}</p>
                      <p className="font-medium mt-2">{(props.payload.originalScore || 0).toFixed(1)}/10</p>
                    </div>
                  )}
                />
              }
            />
            <Bar dataKey="score" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(index)} />
              ))}
              <LabelList 
                dataKey="originalScore" 
                position="right" 
                formatter={(value: number) => value.toFixed(1)} 
                style={{ fill: 'hsl(var(--foreground))', fontSize: '12px' }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default IntelligenceDomainChart;
