import React from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartTooltip
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AnalysisData } from "../../utils/analysis/types";
import { useIsMobile } from "@/hooks/use-mobile";

interface CognitiveStrengthsChartProps {
  analysis: AnalysisData;
  title?: string;
  description?: string;
}

const CognitiveStrengthsChart: React.FC<CognitiveStrengthsChartProps> = ({
  analysis,
  title = "Cognitive Strengths Profile",
  description = "Visualization of your cognitive abilities across different domains"
}) => {
  const isMobile = useIsMobile();
  
  // Extract and prepare data for the radar chart
  const radarData = prepareRadarData(analysis);
  
  return (
    <Card>
      <CardHeader className={isMobile ? "px-3 py-2" : "p-4 md:p-6"}>
        <CardTitle className={isMobile ? "text-base" : "text-lg"}>{title}</CardTitle>
        <CardDescription className={isMobile ? "text-xs" : "text-sm"}>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className={isMobile ? "p-2" : "p-4"}>
        <div className={`h-[${isMobile ? "280px" : "350px"}]`}>
          <ChartContainer
            config={{
              value: { label: "Score", color: "rgba(124, 58, 237, 0.8)" },
              fullMark: { label: "Maximum" }
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart 
                cx="50%" 
                cy="50%" 
                outerRadius={isMobile ? "65%" : "70%"} 
                data={radarData}
              >
                <PolarGrid stroke="rgba(124, 58, 237, 0.2)" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ 
                    fill: 'var(--foreground)',
                    fontSize: isMobile ? 10 : 12 
                  }}
                />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[0, 10]} 
                  tick={{ 
                    fill: 'var(--muted-foreground)',
                    fontSize: isMobile ? 8 : 10 
                  }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent 
                      formatter={(value, name, props) => (
                        <div className={isMobile ? "text-xs" : "text-sm"}>
                          <p className="font-medium">{props.payload.subject}</p>
                          <p className="text-muted-foreground mt-1">{props.payload.description}</p>
                          <p className="font-medium mt-2">{value}/10</p>
                        </div>
                      )}
                    />
                  }
                />
                <Radar 
                  name="Cognitive Strengths" 
                  dataKey="value" 
                  stroke="#7C3AED" 
                  fill="#8B5CF6" 
                  fillOpacity={0.6} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to prepare data for the radar chart
function prepareRadarData(analysis: AnalysisData) {
  // Extract relevant data points from the analysis
  const cognitiveData = [
    {
      subject: "Decision Making",
      value: mapScoreToValue(analysis.cognitivePatterning.decisionMaking),
      description: analysis.cognitivePatterning.decisionMaking,
    },
    {
      subject: "Learning Ability",
      value: mapScoreToValue(analysis.cognitivePatterning.learningStyle),
      description: analysis.cognitivePatterning.learningStyle,
    },
    {
      subject: "Focus",
      value: mapScoreToValue(analysis.cognitivePatterning.attention),
      description: analysis.cognitivePatterning.attention,
    },
    {
      subject: "Emotional Awareness",
      value: mapScoreToValue(analysis.emotionalArchitecture.emotionalAwareness),
      description: analysis.emotionalArchitecture.emotionalAwareness,
    },
    {
      subject: "Emotional Regulation",
      value: mapScoreToValue(analysis.emotionalArchitecture.regulationStyle),
      description: analysis.emotionalArchitecture.regulationStyle,
    },
    {
      subject: "Empathy",
      value: mapScoreToValue(analysis.emotionalArchitecture.empathicCapacity),
      description: analysis.emotionalArchitecture.empathicCapacity,
    },
  ];

  return cognitiveData;
}

// Helper function to map cognitive descriptions to numeric scores (1-10)
// This is a placeholder - in a real app, these would be calculated based on analysis
function mapScoreToValue(description: string): number {
  // Sample implementation: calculate score based on word count and positive terms
  const wordCount = description.split(' ').length;
  
  // Count positive terms
  const positiveTerms = [
    "excellent", "strong", "advanced", "skilled", "efficient",
    "effective", "developed", "high", "significant", "notable"
  ];
  
  let positiveScore = 0;
  positiveTerms.forEach(term => {
    if (description.toLowerCase().includes(term)) {
      positiveScore += 1;
    }
  });
  
  // Sample algorithm - adjust as needed
  const calculatedScore = Math.min(
    10, 
    5 + (wordCount > 30 ? 1 : 0) + 
    (wordCount > 50 ? 1 : 0) + 
    Math.min(3, positiveScore)
  );
  
  return calculatedScore;
}

export default CognitiveStrengthsChart;
