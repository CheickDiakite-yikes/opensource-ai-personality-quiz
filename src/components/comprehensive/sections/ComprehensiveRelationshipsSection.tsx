
import React from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Heart, Users, UserCircle, ShieldQuestion } from "lucide-react";
import { RelationshipPatterns, RelationshipDynamic } from "@/utils/types";
import { Badge } from "@/components/ui/badge";

interface ComprehensiveRelationshipsSectionProps {
  relationshipPatterns: RelationshipPatterns;
  relationshipDynamics?: RelationshipDynamic;
}

const ComprehensiveRelationshipsSection: React.FC<ComprehensiveRelationshipsSectionProps> = ({
  relationshipPatterns,
  relationshipDynamics
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
      
      {/* Display relationship dynamics if available */}
      {relationshipDynamics && (
        <div className="mb-8 p-4 bg-muted/30 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">{relationshipDynamics.pattern}</h3>
          </div>
          
          <p className="mb-4 text-pretty">{relationshipDynamics.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {relationshipDynamics.idealPartnerQualities && relationshipDynamics.idealPartnerQualities.length > 0 && (
              <div>
                <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                  <UserCircle className="h-4 w-4 text-primary" />
                  Ideal Partner Qualities
                </h4>
                <div className="flex flex-wrap gap-2">
                  {relationshipDynamics.idealPartnerQualities.map((quality, idx) => (
                    <Badge key={idx} variant="outline" className="bg-primary/5">
                      {quality}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {relationshipDynamics.growthOpportunities && relationshipDynamics.growthOpportunities.length > 0 && (
              <div>
                <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                  <ShieldQuestion className="h-4 w-4 text-primary" />
                  Growth Opportunities
                </h4>
                <div className="flex flex-wrap gap-2">
                  {relationshipDynamics.growthOpportunities.map((opportunity, idx) => (
                    <Badge key={idx} variant="outline" className="bg-primary/5">
                      {opportunity}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Relationship Strengths</h3>
          <ul className="space-y-2">
            {relationshipPatterns.strengths.map((strength, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-flex items-center justify-center rounded-full bg-primary/10 h-6 w-6 text-sm text-primary mr-3 mt-0.5 flex-shrink-0">
                  {index + 1}
                </span>
                <span>{strength}</span>
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
                <span>{challenge}</span>
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
                  {type}
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
