
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heart } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { safeString, ensureStringItems, StringOrObject } from "@/utils/formatUtils";

interface RelationshipPatternsProps {
  relationshipPatterns: {
    strengths: StringOrObject[];
    challenges: StringOrObject[];
    compatibleTypes: StringOrObject[];
  };
}

const RelationshipPatterns: React.FC<RelationshipPatternsProps> = ({
  relationshipPatterns,
}) => {
  // Ensure we have arrays to work with and convert objects to strings
  const strengths = ensureStringItems(relationshipPatterns?.strengths || []);
  const challenges = ensureStringItems(relationshipPatterns?.challenges || []);
  const compatibleTypes = ensureStringItems(relationshipPatterns?.compatibleTypes || []);

  return (
    <Card className="glass-panel overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-rose-500/10 to-pink-500/10 pb-4">
        <CardTitle className="flex items-center">
          <Heart className="h-5 w-5 mr-2 text-primary" /> Relationship Patterns
        </CardTitle>
        <CardDescription>
          How you connect and interact with others
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Relationship Strengths</h3>
            <ul className="space-y-2">
              {strengths.map((strength, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-flex items-center justify-center rounded-full bg-primary/10 h-6 w-6 text-sm text-primary mr-3 mt-0.5 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span>{strength}</span>
                </li>
              ))}
              {strengths.length === 0 && (
                <li className="text-muted-foreground italic">No relationship strengths identified</li>
              )}
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-3">Relationship Challenges</h3>
            <ul className="space-y-2">
              {challenges.map((challenge, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-flex items-center justify-center rounded-full bg-primary/10 h-6 w-6 text-sm text-primary mr-3 mt-0.5 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span>{challenge}</span>
                </li>
              ))}
              {challenges.length === 0 && (
                <li className="text-muted-foreground italic">No relationship challenges identified</li>
              )}
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-3">Compatible Types</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {compatibleTypes.length > 0 ? (
                compatibleTypes.map((type, index) => (
                  <div
                    key={index}
                    className="border border-border/40 p-2 rounded-md text-center bg-card/30"
                  >
                    {type}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No compatibility data available</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RelationshipPatterns;
