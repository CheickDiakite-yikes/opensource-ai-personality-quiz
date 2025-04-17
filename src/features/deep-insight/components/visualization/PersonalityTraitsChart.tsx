
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
import { PersonalityTrait } from "@/utils/types";
import { Card, CardContent } from "@/components/ui/card";

interface PersonalityTraitsChartProps {
  traits?: PersonalityTrait[];
}

const PersonalityTraitsChart: React.FC<PersonalityTraitsChartProps> = ({ traits }) => {
  // Safely handle undefined traits
  const traitData = React.useMemo(() => {
    if (!traits || traits.length === 0) {
      return [
        { name: "No data available", score: 0 }
      ];
    }
    
    return traits.map(trait => ({
      name: trait.trait,
      score: trait.score
    })).sort((a, b) => b.score - a.score);
  }, [traits]);

  // Generate a color array based on scores
  const barColors = React.useMemo(() => {
    return traitData.map(item => {
      if (item.score > 85) return "hsl(var(--primary))";
      if (item.score > 70) return "hsl(var(--accent))";
      return "hsl(var(--muted-foreground))";
    });
  }, [traitData]);

  return (
    <Card className="w-full h-[300px] md:h-[400px]">
      <CardContent className="p-4">
        {traitData[0].name === "No data available" ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No personality trait data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={traitData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={70}
                tick={{ fontSize: 12 }}
              />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                formatter={(value) => [`${value}/100`, "Score"]}
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))"
                }}
              />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {traitData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={barColors[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalityTraitsChart;
