
import React from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Heart } from "lucide-react";
import { RelationshipPatterns } from "@/utils/types";
import { safeString } from "@/utils/formatUtils";

interface ComprehensiveRelationshipsSectionProps {
  relationshipPatterns: RelationshipPatterns;
}

const ComprehensiveRelationshipsSection: React.FC<ComprehensiveRelationshipsSectionProps> = ({
  relationshipPatterns
}) => {
  return (
    <Card className="p-6 md:p-8 shadow-md">
      <div className="flex items-start mb-4">
        <Heart className="h-6 w-6 mr-2 text-primary mt-1" /> 
        <h2 className="text-2xl font-semibold">Relationship Patterns</h2>
      </div>
      
      <p className="mb-6 text-muted-foreground">
        This analysis reveals how you tend to connect and interact with others in relationships.
      </p>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Relationship Strengths</h3>
          <ul className="space-y-2">
            {relationshipPatterns.strengths.map((strength, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-flex items-center justify-center rounded-full bg-primary/10 h-6 w-6 text-sm text-primary mr-3 mt-0.5 flex-shrink-0">
                  {index + 1}
                </span>
                <span>{safeString(strength)}</span>
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-medium mb-3">Relationship Challenges</h3>
          <ul className="space-y-2">
            {relationshipPatterns.challenges.map((challenge, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-flex items-center justify-center rounded-full bg-primary/10 h-6 w-6 text-sm text-primary mr-3 mt-0.5 flex-shrink-0">
                  {index + 1}
                </span>
                <span>{safeString(challenge)}</span>
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-medium mb-3">Compatible Types</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {relationshipPatterns.compatibleTypes.length > 0 ? (
              relationshipPatterns.compatibleTypes.map((type, index) => (
                <div
                  key={index}
                  className="border border-border/40 p-2 rounded-md text-center bg-card/30"
                >
                  {safeString(type)}
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No compatibility data available</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ComprehensiveRelationshipsSection;
