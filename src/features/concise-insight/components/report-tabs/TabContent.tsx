import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, HeartHandshake, Users, Lightbulb } from 'lucide-react';
import { ConciseAnalysisResult } from '../../types';
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

interface TabContentProps {
  tabValue: string;
  analysis: ConciseAnalysisResult;
}

export const TabContent = ({ tabValue, analysis }: TabContentProps) => {
  // Helper function to render the career insights section based on type
  const renderCareerInsights = () => {
    if (Array.isArray(analysis.careerInsights)) {
      return (
        <div>
          <h3 className="font-medium mb-2">Career Insights</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.careerInsights.map((career, i) => (
              <Badge key={i} variant="secondary">{career}</Badge>
            ))}
          </div>
        </div>
      );
    } else if (typeof analysis.careerInsights === 'object') {
      return (
        <div className="space-y-4">
          {analysis.careerInsights.environmentFit && (
            <div>
              <h3 className="font-medium mb-2">Ideal Work Environment</h3>
              <p className="text-muted-foreground">{analysis.careerInsights.environmentFit}</p>
            </div>
          )}
          
          {analysis.careerInsights.challengeAreas && (
            <div>
              <h3 className="font-medium mb-2">Potential Challenges</h3>
              <p className="text-muted-foreground">{analysis.careerInsights.challengeAreas}</p>
            </div>
          )}
          
          <div>
            <h3 className="font-medium mb-2">Aligned Roles</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.careerInsights.roleAlignments.map((role, i) => (
                <Badge key={i} variant="secondary">{role}</Badge>
              ))}
            </div>
          </div>
          
          {analysis.careerInsights.workStyles && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div>
                <h4 className="text-sm font-medium">Collaboration Style</h4>
                <p className="text-xs text-muted-foreground">{analysis.careerInsights.workStyles.collaboration}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Autonomy Needs</h4>
                <p className="text-xs text-muted-foreground">{analysis.careerInsights.workStyles.autonomy}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Structure Preference</h4>
                <p className="text-xs text-muted-foreground">{analysis.careerInsights.workStyles.structure}</p>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };
  
  // Helper function to render personalized recommendations
  const renderRecommendations = () => {
    if (Array.isArray(analysis.growthPotential.personalizedRecommendations) && 
        typeof analysis.growthPotential.personalizedRecommendations[0] === 'string') {
      return (
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          {(analysis.growthPotential.personalizedRecommendations as string[]).map((rec, i) => (
            <li key={i}>{rec}</li>
          ))}
        </ul>
      );
    } else {
      return (
        <div className="space-y-3">
          {(analysis.growthPotential.personalizedRecommendations as {
            area: string;
            why: string;
            action: string;
            resources: string;
          }[]).map((rec, i) => (
            <div key={i} className="p-3 border rounded-lg">
              <h4 className="font-medium">{rec.area}</h4>
              <p className="text-sm text-muted-foreground mt-1">{rec.why}</p>
              <div className="mt-2 flex flex-col gap-1">
                <div className="text-sm"><span className="font-medium">Action:</span> {rec.action}</div>
                <div className="text-sm"><span className="font-medium">Resource:</span> {rec.resources}</div>
              </div>
            </div>
          ))}
        </div>
      );
    }
  };
  
  // Display unique markers if they exist in the analysis
  const renderUniquenessMarkers = () => {
    if (analysis.uniquenessMarkers && Array.isArray(analysis.uniquenessMarkers) && analysis.uniquenessMarkers.length > 0) {
      return (
        <div className="mb-4">
          <h3 className="font-medium mb-2">What Makes You Distinctive</h3>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            {analysis.uniquenessMarkers.map((marker, i) => (
              <li key={i}>{marker}</li>
            ))}
          </ul>
        </div>
      );
    }
    return null;
  };
  
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
            
            {analysis.cognitiveProfile.learningStyle && (
              <div>
                <h3 className="font-medium mb-2">Learning Style</h3>
                <p className="text-muted-foreground">{analysis.cognitiveProfile.learningStyle}</p>
              </div>
            )}
            
            {analysis.cognitiveProfile.decisionMakingProcess && (
              <div>
                <h3 className="font-medium mb-2">Decision Making Process</h3>
                <p className="text-muted-foreground">{analysis.cognitiveProfile.decisionMakingProcess}</p>
              </div>
            )}
            
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
              <HoverCard>
                <HoverCardTrigger>
                  <div className="relative">
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
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Empathy Score: {analysis.emotionalInsights.empathy}/10</h4>
                    <p className="text-sm text-muted-foreground">
                      This score represents your capacity to understand and share the feelings of others. A higher score (7-10) indicates strong other-focused empathy, while a lower score (1-4) suggests a more self-focused perspective. A balanced score (5-6) shows a healthy mix of both self-awareness and understanding of others.
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
            
            {analysis.emotionalInsights.stressResponse && (
              <div>
                <h3 className="font-medium mb-2">Stress Response</h3>
                <p className="text-muted-foreground">{analysis.emotionalInsights.stressResponse}</p>
              </div>
            )}
            
            {analysis.emotionalInsights.emotionalTriggersAndCoping && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Potential Triggers</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {analysis.emotionalInsights.emotionalTriggersAndCoping.triggers.map((trigger, i) => (
                      <li key={i}>{trigger}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Effective Coping Strategies</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {analysis.emotionalInsights.emotionalTriggersAndCoping.copingStrategies.map((strategy, i) => (
                      <li key={i}>{strategy}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
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
            
            {analysis.interpersonalDynamics.socialNeeds && (
              <div>
                <h3 className="font-medium mb-2">Social Needs</h3>
                <p className="text-muted-foreground">{analysis.interpersonalDynamics.socialNeeds}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analysis.interpersonalDynamics.leadershipStyle && (
                <div>
                  <h3 className="font-medium mb-2">Leadership Style</h3>
                  <p className="text-muted-foreground">{analysis.interpersonalDynamics.leadershipStyle}</p>
                </div>
              )}
              
              {analysis.interpersonalDynamics.teamRole && (
                <div>
                  <h3 className="font-medium mb-2">Team Role</h3>
                  <p className="text-muted-foreground">{analysis.interpersonalDynamics.teamRole}</p>
                </div>
              )}
            </div>
            
            {analysis.coreProfiling.compatibilityInsights && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <Card className="border-muted bg-card/50">
                  <CardHeader className="py-3">
                    <CardTitle className="text-base">Compatibility Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {analysis.coreProfiling.compatibilityInsights.map((insight, i) => (
                        <li key={i}>{insight}</li>
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
                      {analysis.traits.filter(t => t.trait.includes("Social") || t.trait.includes("Empathy") || t.trait.includes("Communication")).flatMap(t => t.challenges).slice(0, 3).map((challenge, i) => (
                        <li key={i}>{challenge}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {!analysis.coreProfiling.compatibilityInsights && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <Card className="border-muted bg-card/50">
                  <CardHeader className="py-3">
                    <CardTitle className="text-base">Relationship Strengths</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {analysis.traits.filter(t => t.trait.includes("Social") || t.trait.includes("Empathy") || t.trait.includes("Communication")).flatMap(t => t.strengths).slice(0, 3).map((strength, i) => (
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
                      {analysis.traits.filter(t => t.trait.includes("Social") || t.trait.includes("Empathy") || t.trait.includes("Communication")).flatMap(t => t.challenges).slice(0, 3).map((challenge, i) => (
                        <li key={i}>{challenge}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}
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
            {renderUniquenessMarkers()}
            
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
              {renderRecommendations()}
            </div>
            
            {analysis.growthPotential.developmentTimeline && (
              <div className="pt-2">
                <h3 className="font-medium mb-2">Development Timeline</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-muted bg-card/50">
                    <CardHeader className="py-2">
                      <CardTitle className="text-sm">Short Term (30 days)</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                      <p className="text-xs text-muted-foreground">{analysis.growthPotential.developmentTimeline.shortTerm}</p>
                    </CardContent>
                  </Card>
                  <Card className="border-muted bg-card/50">
                    <CardHeader className="py-2">
                      <CardTitle className="text-sm">Medium Term (3-6 months)</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                      <p className="text-xs text-muted-foreground">{analysis.growthPotential.developmentTimeline.mediumTerm}</p>
                    </CardContent>
                  </Card>
                  <Card className="border-muted bg-card/50">
                    <CardHeader className="py-2">
                      <CardTitle className="text-sm">Long Term</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                      <p className="text-xs text-muted-foreground">{analysis.growthPotential.developmentTimeline.longTerm}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
            
            {analysis.valueSystem && (
              <div className="pt-2">
                <h3 className="font-medium mb-2">Value System</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Core Values</h4>
                    <div className="flex flex-wrap gap-1">
                      {analysis.valueSystem.coreValues.map((value, i) => (
                        <Badge key={i} variant="outline">{value}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Key Motivators</h4>
                    <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                      {analysis.valueSystem.motivationSources.map((source, i) => (
                        <li key={i}>{source}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            <div>
              {renderCareerInsights()}
            </div>
          </CardContent>
        </Card>
      );

    default:
      return null;
  }
};
