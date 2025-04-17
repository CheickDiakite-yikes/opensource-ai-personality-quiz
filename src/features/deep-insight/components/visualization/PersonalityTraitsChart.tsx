
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PersonalityTrait } from "@/utils/types";

interface PersonalityTraitsChartProps {
  traits?: PersonalityTrait[];
}

const PersonalityTraitsChart: React.FC<PersonalityTraitsChartProps> = ({ traits = [] }) => {
  // Added a default empty array to prevent slice errors
  const topTraits = traits?.slice(0, 7) || [];
  
  // Filter out any traits that don't have scores
  const validTraits = topTraits.filter(trait => trait && typeof trait.score === 'number');
  
  // If there are no valid traits, provide sample data
  const chartData = validTraits.length > 0 
    ? validTraits.map(trait => ({
        name: trait.trait,
        score: trait.score,
        fill: `hsl(${25 + (trait.score % 10) * 15}, ${75 + (trait.score % 5) * 5}%, 53%)`,
      }))
    : [
        { name: "No trait data", score: 0, fill: "hsl(25, 95%, 53%)" }
      ];

  return (
    <Card className="w-full">
      <CardContent className="p-4 md:p-6">
        <div className="h-[300px] md:h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 70,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={70}
                tick={{fontSize: 12}}
              />
              <YAxis 
                domain={[0, 100]}
                label={{ 
                  value: 'Score', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' } 
                }}
              />
              <Tooltip 
                formatter={(value) => [`${value}/100`, 'Score']}
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  borderRadius: 'var(--radius)',
                }}
              />
              <Bar 
                dataKey="score" 
                fill="hsl(25, 95%, 53%)"
                radius={[4, 4, 0, 0]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            {validTraits.length > 0 
              ? "Your strongest personality traits based on assessment responses"
              : "Complete the assessment to view your personality traits"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalityTraitsChart;
