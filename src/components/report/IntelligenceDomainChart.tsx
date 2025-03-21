
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
import { useIsMobile } from "@/hooks/use-mobile";

interface IntelligenceDomain {
  name: string;
  score: number;
  description: string;
}

interface IntelligenceDomainChartProps {
  domains: IntelligenceDomain[];
}

// Create a formatter function outside of the component
const formatScore = (value: number) => value.toFixed(1);

const IntelligenceDomainChart: React.FC<IntelligenceDomainChartProps> = ({ domains }) => {
  const isMobile = useIsMobile();
  
  // Prepare data for chart
  const chartData = domains?.map((domain) => ({
    name: domain.name,
    score: domain.score * 10, // Scale to 0-100 for better visualization
    description: domain.description,
    originalScore: domain.score, // Keep original score for tooltip
  })) || [];

  // Using fixed orange color for all bars to match the screenshot
  const barColor = "#f97316"; // orange-500

  // Fallback if no domains data
  if (!domains || domains.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center border border-dashed rounded-md">
        <p className="text-muted-foreground">No intelligence domains data available</p>
      </div>
    );
  }

  return (
    <div className="w-full mt-4">
      <div className={isMobile ? "h-[500px]" : "h-80"}>
        <ChartContainer
          config={{
            domain: { label: "Intelligence Domain", color: "#f97316" },
            score: { label: "Score", color: "#f97316" },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ 
                top: 5, 
                right: 30, 
                left: isMobile ? 5 : 20, 
                bottom: 5 
              }}
            >
              <XAxis 
                type="number" 
                domain={[0, 100]} 
                tickFormatter={(value) => `${(value / 10).toFixed(1)}`}
                stroke="#888"
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={isMobile ? 110 : 150} 
                tickLine={false}
                axisLine={false}
                tick={{ 
                  fontSize: isMobile ? 10 : 12, 
                  fill: "#f5f5f5",
                  width: isMobile ? 100 : 140,
                  // Truncate long domain names on mobile
                  formatter: (value) => isMobile && value.length > 15 ? `${value.substring(0, 15)}...` : value
                }}
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
                  <Cell key={`cell-${index}`} fill={barColor} />
                ))}
                <LabelList 
                  dataKey="originalScore" 
                  position="right" 
                  fill="#f5f5f5"
                  fontSize={isMobile ? 10 : 12}
                  fontWeight="bold"
                  formatter={formatScore}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};

export default IntelligenceDomainChart;
