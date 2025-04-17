
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartTooltip
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PersonalityTrait } from "@/utils/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PersonalityTraitsChartProps {
  traits: PersonalityTrait[];
  title?: string;
  description?: string;
  maxItems?: number;
}

const PersonalityTraitsChart: React.FC<PersonalityTraitsChartProps> = ({
  traits,
  title = "Personality Trait Distribution",
  description = "Breakdown of your most prominent traits",
  maxItems = 8
}) => {
  const isMobile = useIsMobile();
  
  // Prepare data for the chart
  const normalizedTraits = traits
    .slice(0, maxItems)
    .map(trait => ({
      name: trait.trait,
      score: trait.score >= 0 && trait.score <= 1
        ? Math.round(trait.score * 10 * 10) / 10
        : trait.score > 10
          ? Math.round((trait.score / 100) * 10 * 10) / 10
          : Math.round(trait.score * 10) / 10,
      description: trait.description
    }))
    .sort((a, b) => b.score - a.score);

  // Generate colors with decreasing opacity based on score rank
  const getBarColor = (index: number) => {
    return `rgba(124, 58, 237, ${1 - (index * 0.09)})`;
  };

  // Dynamic height calculation based on number of traits
  const chartHeight = Math.max(280, normalizedTraits.length * (isMobile ? 50 : 60));

  return (
    <Card>
      <CardHeader className={isMobile ? "px-3 py-2" : "p-4 md:p-6"}>
        <CardTitle className={isMobile ? "text-base" : "text-lg"}>{title}</CardTitle>
        <CardDescription className={isMobile ? "text-xs" : "text-sm"}>{description}</CardDescription>
      </CardHeader>
      <CardContent className={isMobile ? "p-2" : "p-4"}>
        <ScrollArea className="w-full" style={{ height: isMobile ? 300 : 400 }}>
          <div style={{ height: chartHeight, minWidth: "100%", paddingRight: isMobile ? 10 : 20 }}>
            <ChartContainer
              config={{
                trait: { label: "Personality Trait" },
                score: { label: "Score", color: "#7C3AED" }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={normalizedTraits}
                  layout="vertical"
                  margin={isMobile ? 
                    { top: 5, right: 30, left: 80, bottom: 5 } : 
                    { top: 5, right: 30, left: 120, bottom: 5 }
                  }
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis 
                    type="number" 
                    domain={[0, 10]} 
                    tickCount={6} 
                    fontSize={isMobile ? 10 : 12}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    width={isMobile ? 80 : 120}
                    tickLine={false}
                    axisLine={false}
                    fontSize={isMobile ? 10 : 12}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent 
                        formatter={(value, name, props) => (
                          <div className={isMobile ? "text-xs" : "text-sm"}>
                            <p className="font-medium">{props.payload.name}</p>
                            <p className="text-muted-foreground mt-1">{props.payload.description}</p>
                            <p className="font-medium mt-2">{value}/10</p>
                          </div>
                        )}
                      />
                    }
                  />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                    {normalizedTraits.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getBarColor(index)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default PersonalityTraitsChart;
