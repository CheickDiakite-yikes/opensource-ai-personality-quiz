
import React from 'react';
import { ConciseAnalysisResult } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface TabContentProps {
  tabValue: string;
  analysis: ConciseAnalysisResult;
}

export const TabContent: React.FC<TabContentProps> = ({ tabValue, analysis }) => {
  // Validate growth data before rendering
  const hasGrowthData = analysis.growthPotential && (
    (Array.isArray(analysis.growthPotential.areasOfDevelopment) && analysis.growthPotential.areasOfDevelopment.length > 0) ||
    (Array.isArray(analysis.growthPotential.personalizedRecommendations) && analysis.growthPotential.personalizedRecommendations.length > 0) ||
    (Array.isArray(analysis.growthPotential.keyStrengthsToLeverage) && analysis.growthPotential.keyStrengthsToLeverage.length > 0)
  );

  console.log('[TabContent] Rendering tab:', tabValue);
  console.log('[TabContent] Analysis data:', analysis);
  console.log('[TabContent] Has growth data:', hasGrowthData);
  
  if (tabValue === 'growth' && !hasGrowthData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Growth & Development</CardTitle>
          <CardDescription>
            No growth and development data available for this analysis.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  switch (tabValue) {
    case 'traits':
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personality Traits</CardTitle>
              <CardDescription>Your key personality characteristics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {analysis.traits && analysis.traits.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {analysis.traits.map((trait, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{trait.trait}</span>
                        <Badge variant="outline">{trait.score}%</Badge>
                      </div>
                      <Progress value={typeof trait.score === 'number' ? trait.score : parseInt(String(trait.score))} />
                      <p className="text-sm text-muted-foreground">{trait.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No trait data available for this analysis.</p>
              )}
            </CardContent>
          </Card>
        </div>
      );

    case 'cognitive':
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cognitive Style</CardTitle>
              <CardDescription>How you process information and make decisions</CardDescription>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              {analysis.cognitiveProfile?.style ? (
                <div dangerouslySetInnerHTML={{ __html: analysis.cognitiveProfile.style }} />
              ) : (
                <p className="text-muted-foreground">No cognitive style data available for this analysis.</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Decision Making</CardTitle>
              <CardDescription>Your approach to problem-solving and decisions</CardDescription>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              {analysis.cognitiveProfile?.decisionMakingProcess ? (
                <div dangerouslySetInnerHTML={{ __html: analysis.cognitiveProfile.decisionMakingProcess }} />
              ) : (
                <p className="text-muted-foreground">No decision making data available for this analysis.</p>
              )}
            </CardContent>
          </Card>
        </div>
      );

    case 'emotional':
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Emotional Architecture</CardTitle>
              <CardDescription>How you experience and process emotions</CardDescription>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              {analysis.emotionalInsights?.description ? (
                <div dangerouslySetInnerHTML={{ __html: analysis.emotionalInsights.description }} />
              ) : (
                <p className="text-muted-foreground">No emotional architecture data available for this analysis.</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Stress Response</CardTitle>
              <CardDescription>How you typically respond to stress and pressure</CardDescription>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              {analysis.emotionalInsights?.stressResponse ? (
                <div dangerouslySetInnerHTML={{ __html: analysis.emotionalInsights.stressResponse }} />
              ) : (
                <p className="text-muted-foreground">No stress response data available for this analysis.</p>
              )}
            </CardContent>
          </Card>
        </div>
      );

    case 'social':
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Interaction Style</CardTitle>
              <CardDescription>How you engage with others and navigate social situations</CardDescription>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              {analysis.interpersonalDynamics?.relationshipPattern ? (
                <div dangerouslySetInnerHTML={{ __html: analysis.interpersonalDynamics.relationshipPattern }} />
              ) : (
                <p className="text-muted-foreground">No social interaction data available for this analysis.</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Communication Style</CardTitle>
              <CardDescription>Your preferred methods of expression and communication</CardDescription>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              {analysis.interpersonalDynamics?.communicationStyle ? (
                <div dangerouslySetInnerHTML={{ __html: analysis.interpersonalDynamics.communicationStyle }} />
              ) : (
                <p className="text-muted-foreground">No communication style data available for this analysis.</p>
              )}
            </CardContent>
          </Card>
        </div>
      );

    case 'growth':
      return (
        <div className="space-y-6">
          {analysis.growthPotential?.areasOfDevelopment && analysis.growthPotential.areasOfDevelopment.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Areas for Development</CardTitle>
                <CardDescription>Key areas where you can focus your growth</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2">
                  {analysis.growthPotential.areasOfDevelopment.map((area, index) => (
                    <li key={index}>{area}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {analysis.growthPotential?.personalizedRecommendations && analysis.growthPotential.personalizedRecommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Personalized Recommendations</CardTitle>
                <CardDescription>Actionable steps for your development</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2">
                  {Array.isArray(analysis.growthPotential.personalizedRecommendations) && 
                   analysis.growthPotential.personalizedRecommendations.map((rec, index) => (
                    <li key={index}>
                      {typeof rec === 'string' ? rec : (
                        <div>
                          <strong>{rec.area}</strong>: {rec.action} 
                          {rec.why && <span className="block text-sm text-muted-foreground mt-1">Why: {rec.why}</span>}
                          {rec.resources && <span className="block text-sm text-muted-foreground">Resources: {rec.resources}</span>}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {analysis.growthPotential?.keyStrengthsToLeverage && analysis.growthPotential.keyStrengthsToLeverage.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Key Strengths to Leverage</CardTitle>
                <CardDescription>Build upon these strengths in your growth journey</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2">
                  {analysis.growthPotential.keyStrengthsToLeverage.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {analysis.growthPotential?.developmentTimeline && (
            <Card>
              <CardHeader>
                <CardTitle>Development Timeline</CardTitle>
                <CardDescription>A roadmap for your personal growth</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysis.growthPotential.developmentTimeline.shortTerm && (
                  <div>
                    <h3 className="font-semibold mb-2">Short Term</h3>
                    <p className="text-muted-foreground">{analysis.growthPotential.developmentTimeline.shortTerm}</p>
                  </div>
                )}
                
                {analysis.growthPotential.developmentTimeline.mediumTerm && (
                  <div>
                    <h3 className="font-semibold mb-2">Medium Term</h3>
                    <p className="text-muted-foreground">{analysis.growthPotential.developmentTimeline.mediumTerm}</p>
                  </div>
                )}
                
                {analysis.growthPotential.developmentTimeline.longTerm && (
                  <div>
                    <h3 className="font-semibold mb-2">Long Term</h3>
                    <p className="text-muted-foreground">{analysis.growthPotential.developmentTimeline.longTerm}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      );

    default:
      return (
        <Card>
          <CardHeader>
            <CardTitle>Tab Content</CardTitle>
            <CardDescription>No content available for this tab.</CardDescription>
          </CardHeader>
        </Card>
      );
  }
};

