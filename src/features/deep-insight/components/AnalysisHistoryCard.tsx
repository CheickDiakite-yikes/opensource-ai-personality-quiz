
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { AnalysisData } from "../utils/analysis/types";

interface AnalysisHistoryCardProps {
  analysis: AnalysisData;
}

export const AnalysisHistoryCard: React.FC<AnalysisHistoryCardProps> = ({ analysis }) => {
  const navigate = useNavigate();
  
  const createdDate = analysis.createdAt ? new Date(analysis.createdAt) : new Date();
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });
  
  // Get a summary of traits
  const traitsList = analysis.traits && analysis.traits.length > 0 
    ? analysis.traits.slice(0, 3).map(t => t.trait).join(", ")
    : "No traits available";
  
  // Function to view this specific analysis
  const viewAnalysis = () => {
    navigate(`/deep-insight/results?id=${analysis.id}`);
  };
  
  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">
          Analysis from {timeAgo}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-sm text-muted-foreground">
          <p><strong>ID:</strong> {analysis.id?.substring(0, 8)}...</p>
          <p className="mt-2"><strong>Key traits:</strong> {traitsList}</p>
          {analysis.overview && (
            <p className="mt-2 line-clamp-3"><strong>Overview:</strong> {analysis.overview}</p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={viewAnalysis} variant="outline" className="w-full">
          View This Analysis
        </Button>
      </CardFooter>
    </Card>
  );
};
