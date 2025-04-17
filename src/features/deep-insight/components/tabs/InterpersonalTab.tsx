
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Users, Sparkles, MessageCircle, Handshake, UserCheck } from "lucide-react";
import { PersonalityAnalysis } from "@/utils/types";

interface InterpersonalTabProps {
  analysis: PersonalityAnalysis;
}

export const InterpersonalTab: React.FC<InterpersonalTabProps> = ({ analysis }) => {
  const interpersonalDynamics = analysis.interpersonalDynamics || {
    attachmentStyle: "Your attachment style shows a balanced approach to relationships, valuing both connection and independence.",
    communicationPattern: "You communicate thoughtfully and prefer depth over small talk. You listen well and generally express your thoughts clearly.",
    conflictResolution: "Your approach to conflict emphasizes finding common ground while addressing issues directly but tactfully.",
    socialNeedsBalance: "You value a blend of social connection and personal space, finding energy in quality interactions while also needing time to yourself.",
    trustBuilding: "You tend to build trust gradually through consistent actions and authentic communication.",
    boundarySettings: "You generally maintain healthy boundaries in relationships, though you may occasionally struggle with saying no to those closest to you."
  };

  const relationshipPatterns = analysis.relationshipPatterns || {
    strengths: ["Active listening", "Emotional support", "Loyalty"],
    challenges: ["May avoid confrontation", "Sometimes sacrifice needs for others"],
    compatibleTypes: ["Thoughtful Communicators", "Supportive Motivators", "Growth-Oriented Partners"]
  };

  // Extract relationship data with proper type checking
  const compatibleTypes = Array.isArray(relationshipPatterns.compatibleTypes) 
    ? relationshipPatterns.compatibleTypes 
    : Array.isArray(relationshipPatterns) 
      ? relationshipPatterns 
      : ["Thoughtful Communicators", "Supportive Motivators", "Growth-Oriented Partners"];
      
  const relationshipStrengths = Array.isArray(relationshipPatterns.strengths)
    ? relationshipPatterns.strengths
    : ["Active listening", "Emotional support", "Loyalty"];
    
  const relationshipChallenges = Array.isArray(relationshipPatterns.challenges)
    ? relationshipPatterns.challenges
    : ["May avoid confrontation", "Sometimes sacrifice needs for others"];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Interpersonal Dynamics
        </CardTitle>
        <CardDescription>How you relate to and connect with others</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-background/80 rounded-lg border border-border/30 hover:border-border/60 transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <UserCheck className="h-4 w-4 text-blue-500" />
            <h3 className="font-semibold text-lg">Attachment Style</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            {interpersonalDynamics.attachmentStyle}
          </p>
        </div>
        
        <div className="p-4 bg-background/80 rounded-lg border border-border/30 hover:border-border/60 transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="h-4 w-4 text-green-500" />
            <h3 className="font-semibold text-lg">Communication Pattern</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            {interpersonalDynamics.communicationPattern}
          </p>
        </div>
        
        <div className="p-4 bg-background/80 rounded-lg border border-border/30 hover:border-border/60 transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <Handshake className="h-4 w-4 text-amber-500" />
            <h3 className="font-semibold text-lg">Conflict Resolution</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            {interpersonalDynamics.conflictResolution}
          </p>
        </div>
        
        {interpersonalDynamics.socialNeedsBalance && (
          <div className="p-4 bg-background/80 rounded-lg border border-border/30 hover:border-border/60 transition-colors">
            <h3 className="font-semibold mb-3 text-lg">Social Needs Balance</h3>
            <p className="text-muted-foreground leading-relaxed">
              {interpersonalDynamics.socialNeedsBalance}
            </p>
          </div>
        )}
        
        {interpersonalDynamics.trustBuilding && (
          <div className="p-4 bg-background/80 rounded-lg border border-border/30 hover:border-border/60 transition-colors">
            <h3 className="font-semibold mb-3 text-lg">Trust Building</h3>
            <p className="text-muted-foreground leading-relaxed">
              {interpersonalDynamics.trustBuilding}
            </p>
          </div>
        )}
        
        {interpersonalDynamics.boundarySettings && (
          <div className="p-4 bg-background/80 rounded-lg border border-border/30 hover:border-border/60 transition-colors">
            <h3 className="font-semibold mb-3 text-lg">Boundary Setting</h3>
            <p className="text-muted-foreground leading-relaxed">
              {interpersonalDynamics.boundarySettings}
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-secondary/10 p-4 rounded-md">
            <h4 className="text-sm font-medium mb-2">Relationship Strengths</h4>
            <ul className="list-disc list-inside space-y-2 text-sm">
              {relationshipStrengths.map((strength, index) => (
                <li key={index} className="text-muted-foreground">{strength}</li>
              ))}
            </ul>
          </div>
          
          <div className="bg-secondary/10 p-4 rounded-md">
            <h4 className="text-sm font-medium mb-2">Relationship Challenges</h4>
            <ul className="list-disc list-inside space-y-2 text-sm">
              {relationshipChallenges.map((challenge, index) => (
                <li key={index} className="text-muted-foreground">{challenge}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="font-semibold mb-3 text-lg flex items-center">
            <Sparkles className="h-4 w-4 text-primary mr-1" />
            Relationship Compatibility
          </h3>
          <div className="bg-secondary/10 p-4 rounded-md">
            <h4 className="text-sm font-medium mb-2">Most Compatible Types</h4>
            <ul className="list-disc list-inside space-y-2 text-sm">
              {compatibleTypes.map((type, index) => (
                <li key={index} className="text-muted-foreground">{type}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
