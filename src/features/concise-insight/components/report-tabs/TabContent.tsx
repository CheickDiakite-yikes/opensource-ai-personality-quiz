
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, HeartHandshake, Users, Lightbulb } from 'lucide-react';
import { ConciseAnalysisResult } from '../../types';

interface TabContentProps {
  tabValue: string;
  analysis: ConciseAnalysisResult;
}

export const TabContent = ({ tabValue, analysis }: TabContentProps) => {
  switch (tabValue) {
    case 'cognitive':
      return (
        <Card>
          <CardHeader>
            <CardTitle>Cognitive Profile</CardTitle>
            <CardDescription>How you think, learn, and process information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Cognitive Style</h3>
              <p>{analysis.cognitiveProfile.style}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Cognitive Strengths</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {analysis.cognitiveProfile.strengths.map((strength, i) => (
                    <li key={i}>{strength}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Potential Blind Spots</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {analysis.cognitiveProfile.blindSpots.map((blindSpot, i) => (
                    <li key={i}>{blindSpot}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div>
              <p className="text-muted-foreground">{analysis.cognitiveProfile.description}</p>
            </div>
          </CardContent>
        </Card>
      );

    case 'emotional':
      return (
        <Card>
          <CardHeader>
            <CardTitle>Emotional Insights</CardTitle>
            <CardDescription>How you experience and manage emotions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Emotional Awareness</h3>
                <p className="text-muted-foreground">{analysis.emotionalInsights.awareness}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Emotional Regulation</h3>
                <p className="text-muted-foreground">{analysis.emotionalInsights.regulation}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Empathic Capacity</h3>
              <div className="w-full bg-muted rounded-full h-2.5 mb-1">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ width: `${analysis.emotionalInsights.empathy * 10}%` }}
                />
              </div>
              <div className="flex justify-between text-xs">
                <span>Self-focused</span>
                <span>Balanced</span>
                <span>Other-focused</span>
              </div>
            </div>
            
            <div>
              <p className="text-muted-foreground">{analysis.emotionalInsights.description}</p>
            </div>
          </CardContent>
        </Card>
      );

    case 'social':
      return (
        <Card>
          <CardHeader>
            <CardTitle>Interpersonal Dynamics</CardTitle>
            <CardDescription>How you interact and connect with others</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium mb-2">Communication Style</h3>
                <Badge variant="outline">{analysis.interpersonalDynamics.communicationStyle}</Badge>
              </div>
              <div>
                <h3 className="font-medium mb-2">Relationship Pattern</h3>
                <Badge variant="outline">{analysis.interpersonalDynamics.relationshipPattern}</Badge>
              </div>
              <div>
                <h3 className="font-medium mb-2">Conflict Approach</h3>
                <Badge variant="outline">{analysis.interpersonalDynamics.conflictApproach}</Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <Card className="border-muted bg-card/50">
                <CardHeader className="py-3">
                  <CardTitle className="text-base">Relationship Strengths</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {analysis.traits
                      .filter(t => t.trait.includes("Social") || t.trait.includes("Empathy") || t.trait.includes("Communication"))
                      .flatMap(t => t.strengths)
                      .slice(0, 3)
                      .map((strength, i) => (
                        <li key={i}>{strength}</li>
                      ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border-muted bg-card/50">
                <CardHeader className="py-3">
                  <CardTitle className="text-base">Relationship Challenges</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {analysis.traits
                      .filter(t => t.trait.includes("Social") || t.trait.includes("Empathy") || t.trait.includes("Communication"))
                      .flatMap(t => t.challenges)
                      .slice(0, 3)
                      .map((challenge, i) => (
                        <li key={i}>{challenge}</li>
                      ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      );

    case 'growth':
      return (
        <Card>
          <CardHeader>
            <CardTitle>Growth & Development</CardTitle>
            <CardDescription>Your potential for growth and personal development</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Areas for Development</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {analysis.growthPotential.areasOfDevelopment.map((area, i) => (
                  <li key={i}>{area}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Key Strengths to Leverage</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {analysis.growthPotential.keyStrengthsToLeverage.map((strength, i) => (
                  <li key={i}>{strength}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Personalized Recommendations</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {analysis.growthPotential.personalizedRecommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Career Insights</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.careerInsights.map((career, i) => (
                  <Badge key={i} variant="secondary">{career}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      );

    default:
      return null;
  }
};
