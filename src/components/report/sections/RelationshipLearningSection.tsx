
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Heart, BookOpen } from "lucide-react";
import { safeString } from "@/utils/formatUtils";
import { RelationshipPatterns } from "@/utils/types";

interface RelationshipLearningSectionProps {
  relationshipPatterns: RelationshipPatterns;
  learningPathways: string[] | Array<{name: string, description: string}>;
}

const RelationshipLearningSection: React.FC<RelationshipLearningSectionProps> = ({ 
  relationshipPatterns, 
  learningPathways = []
}) => {
  // Ensure we have arrays to work with
  const strengths = relationshipPatterns?.strengths || [];
  const challenges = relationshipPatterns?.challenges || [];
  
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          <span>Relationship & Learning Styles</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Relationship Patterns</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Strengths</h4>
                <ul className="space-y-1 marker:text-green-500 list-disc pl-5">
                  {strengths?.slice(0, 3).map((item, index) => (
                    <li key={index}>{safeString(item)}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Challenges</h4>
                <ul className="space-y-1 marker:text-amber-500 list-disc pl-5">
                  {challenges?.slice(0, 3).map((item, index) => (
                    <li key={index}>{safeString(item)}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              Learning Pathways
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {learningPathways?.slice(0, 4).map((pathway, index) => (
                <div 
                  key={index} 
                  className="bg-muted/50 p-3 rounded-md text-sm"
                >
                  {safeString(pathway)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RelationshipLearningSection;
