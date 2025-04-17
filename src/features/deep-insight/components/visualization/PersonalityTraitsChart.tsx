
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
import { ChartContainer } from "@/components/ui/chart";

interface PersonalityTraitsChartProps {
  traits?: PersonalityTrait[];
}

const PersonalityTraitsChart: React.FC<PersonalityTraitsChartProps> = ({ traits }) => {
  // Safely handle undefined traits and transform to chart data
  const traitData = React.useMemo(() => {
    // Check if traits is valid
    if (!Array.isArray(traits) || traits.length === 0) {
      // Return sample data if no traits available
      return [
        { name: "Analytical Thinking", score: 85, description: "Sample trait data" },
        { name: "Emotional Intelligence", score: 78, description: "Sample trait data" },
        { name: "Adaptability", score: 72, description: "Sample trait data" },
        { name: "Conscientiousness", score: 80, description: "Sample trait data" },
        { name: "Openness", score: 75, description: "Sample trait data" }
      ];
    }
    
    // Map traits to chart data format, ensuring valid objects
    return traits
      .filter(trait => trait && typeof trait === 'object')
      .map(trait => ({
        name: trait.trait || "Unnamed Trait",
        score: typeof trait.score === 'number' ? trait.score : 50,
        description: trait.description || "",
        strengths: Array.isArray(trait.strengths) ? trait.strengths.join(", ") : ""
      }))
      .sort((a, b) => b.score - a.score) // Sort by score descending
      .slice(0, 10); // Limit to top 10 traits
  }, [traits]);

  // Generate a color array based on scores
  const barColors = React.useMemo(() => {
    return traitData.map(item => {
      if (item.score > 85) return "hsl(var(--primary))";
      if (item.score > 70) return "hsl(var(--accent))";
      return "hsl(var(--muted-foreground))";
    });
  }, [traitData]);

  const isDefaultData = !Array.isArray(traits) || traits.length === 0;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="h-[350px]">
          <ChartContainer
            config={{
              trait: { label: "Personality Trait", color: "#888" },
              score: { label: "Score", color: "hsl(var(--primary))" }
            }}
          >
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
                <YAxis 
                  domain={[0, 100]} 
                />
                <Tooltip 
                  formatter={(value) => [`${value}/100`, "Score"]}
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))"
                  }}
                  labelFormatter={(label) => `${label}`}
                />
                <Bar 
                  dataKey="score" 
                  name="Score" 
                  radius={[4, 4, 0, 0]}
                  opacity={isDefaultData ? 0.5 : 1} // Dim default data
                >
                  {traitData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={barColors[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
          
          {isDefaultData && (
            <div className="text-center mt-4 text-sm text-muted-foreground">
              <p>This is sample data. Complete an assessment to see your personal trait scores.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalityTraitsChart;
