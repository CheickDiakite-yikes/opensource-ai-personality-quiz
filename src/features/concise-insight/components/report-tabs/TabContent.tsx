import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, HeartHandshake, Users, Lightbulb, Star, Sparkles, Info } from 'lucide-react';
import { ConciseAnalysisResult } from '../../types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';

interface TabContentProps {
  tabValue: string;
  analysis: ConciseAnalysisResult;
}

// Helper to parse score strings like "85/100 - Strong: description" 
const parseScoreString = (scoreString: string | number): { 
  score: number; 
  label: string; 
  description: string;
} => {
  // Handle numeric values
  if (typeof scoreString === 'number') {
    let label = "Average";
    if (scoreString >= 90) label = "Exceptional";
    else if (scoreString >= 80) label = "Very High";
    else if (scoreString >= 70) label = "High";
    else if (scoreString >= 60) label = "Above Average";
    else if (scoreString <= 30) label = "Developing";
    else if (scoreString <= 20) label = "Emerging";
    
    return { score: scoreString, label, description: label };
  }
  
  // Handle string format like "85/100 - Strong: description"
  try {
    const scoreMatch = scoreString.match(/(\d+)\/100\s*-\s*([^:]+)(?::?\s*(.*))?/);
    if (scoreMatch) {
      return {
        score: parseInt(scoreMatch[1]),
        label: scoreMatch[2].trim(),
        description: scoreMatch[3] ? scoreMatch[3].trim() : scoreMatch[2].trim()
      };
    }
    
    // Try to extract just the number
    const numericMatch = scoreString.match(/(\d+)/);
    if (numericMatch) {
      const score = parseInt(numericMatch[1]);
      let label = "Average";
      if (score >= 90) label = "Exceptional";
      else if (score >= 80) label = "Very High";
      else if (score >= 70) label = "High";
      else if (score >= 60) label = "Above Average";
      else if (score <= 30) label = "Developing";
      else if (score <= 20) label = "Emerging";
      
      return { score, label, description: scoreString };
    }
    
    // Return a default for strings without recognizable scores
    return { score: 50, label: "Balanced", description: scoreString };
  } catch (e) {
    console.error("Error parsing score string:", e);
    return { score: 50, label: "Balanced", description: String(scoreString) };
  }
};

// Format Helper Component for Empathy Score
const EmpathyScoreDisplay = ({ empathy }: { empathy: string | number }) => {
  const parsedScore = parseScoreString(empathy);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Empathic Capacity</h3>
        <Badge variant="outline">{parsedScore.label}</Badge>
      </div>
      
      <div className="w-full bg-muted rounded-full h-2.5 mb-1">
        <div 
          className="bg-primary h-2.5 rounded-full" 
          style={{ width: `${parsedScore.score}%` }}
        />
      </div>
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Developing</span>
        <span>Balanced</span>
        <span>Advanced</span>
      </div>
      
      <p className="text-sm text-muted-foreground mt-1">
        {parsedScore.description}
      </p>
    </div>
  );
};

// Render list with heading
const RenderList = ({ 
  items, 
  title, 
  emptyMessage = "No data available" 
}: { 
  items: string[] | undefined; 
  title: string; 
  emptyMessage?: string; 
}) => {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return (
      <div>
        <h3 className="font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-medium mb-2">{title}</h3>
      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

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
          <h3 className="flex items-center gap-2 text-lg font-medium border-b pb-1">
            <Sparkles className="h-5 w-5 text-primary" /> What Makes You Distinctive
          </h3>
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
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Cognitive Profile
            </CardTitle>
            <CardDescription>How you think, learn, and process information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Cognitive Style</h3>
              <p className="text-muted-foreground">{analysis.cognitiveProfile.style}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RenderList 
                title="Cognitive Strengths" 
                items={analysis.cognitiveProfile.strengths}
              />
              
              <RenderList 
                title="Potential Blind Spots" 
                items={analysis.cognitiveProfile.blindSpots}
              />
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
            <CardTitle className="flex items-center gap-2">
              <HeartHandshake className="h-5 w-5 text-primary" />
              Emotional Insights
            </CardTitle>
            <CardDescription>How you experience and manage emotions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-medium">Emotional Awareness</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground cursor-help">
                        <Info className="h-3.5 w-3.5" />
                        <span>Understanding your own emotions</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Emotional awareness reflects your ability to recognize and understand your emotions as they occur</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                {typeof analysis.emotionalInsights.awareness === 'string' ? (
                  <p className="text-muted-foreground">{analysis.emotionalInsights.awareness}</p>
                ) : (
                  // If it's just a number, display with progress bar
                  <div className="space-y-1">
                    <Progress value={analysis.emotionalInsights.awareness as number * 10} className="h-2" />
                    <div className="flex justify-between text-xs">
                      <span>Developing</span>
                      <span>Advanced</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Emotional Regulation</h3>
                <p className="text-muted-foreground">{analysis.emotionalInsights.regulation}</p>
              </div>
            </div>
            
            <EmpathyScoreDisplay empathy={analysis.emotionalInsights.empathy} />
            
            {analysis.emotionalInsights.stressResponse && (
              <div>
                <h3 className="font-medium mb-2">Stress Response</h3>
                <p className="text-muted-foreground">{analysis.emotionalInsights.stressResponse}</p>
              </div>
            )}
            
            {analysis.emotionalInsights.emotionalTriggersAndCoping && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RenderList 
                  title="Potential Triggers" 
                  items={analysis.emotionalInsights.emotionalTriggersAndCoping.triggers}
                />
                
                <RenderList 
                  title="Effective Coping Strategies" 
                  items={analysis.emotionalInsights.emotionalTriggersAndCoping.copingStrategies}
                />
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
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Interpersonal Dynamics
            </CardTitle>
            <CardDescription>How you interact and connect with others</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <h3 className="font-medium mb-1">Communication Style</h3>
                <Badge variant="outline" className="mb-2">{analysis.interpersonalDynamics.communicationStyle.split(':')[0]}</Badge>
                <p className="text-sm text-muted-foreground">
                  {analysis.interpersonalDynamics.communicationStyle.includes(':') 
                    ? analysis.interpersonalDynamics.communicationStyle.split(':')[1].trim()
                    : ''}
                </p>
              </div>
              
              <div className="space-y-1">
                <h3 className="font-medium mb-1">Relationship Pattern</h3>
                <Badge variant="outline" className="mb-2">{analysis.interpersonalDynamics.relationshipPattern.split(':')[0]}</Badge>
                <p className="text-sm text-muted-foreground">
                  {analysis.interpersonalDynamics.relationshipPattern.includes(':') 
                    ? analysis.interpersonalDynamics.relationshipPattern.split(':')[1].trim() 
                    : ''}
                </p>
              </div>
              
              <div className="space-y-1">
                <h3 className="font-medium mb-1">Conflict Approach</h3>
                <Badge variant="outline" className="mb-2">{analysis.interpersonalDynamics.conflictApproach.split(':')[0]}</Badge>
                <p className="text-sm text-muted-foreground">
                  {analysis.interpersonalDynamics.conflictApproach.includes(':') 
                    ? analysis.interpersonalDynamics.conflictApproach.split(':')[1].trim() 
                    : ''}
                </p>
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
                      {analysis.traits.filter(t => 
                        t.trait.includes("Social") || 
                        t.trait.includes("Empathy") || 
                        t.trait.includes("Communication") || 
                        t.trait.includes("Interpersonal")
                      ).flatMap(t => t.challenges).slice(0, 3).map((challenge, i) => (
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
                      {analysis.traits.filter(t => 
                        t.trait.includes("Social") || 
                        t.trait.includes("Empathy") || 
                        t.trait.includes("Communication") || 
                        t.trait.includes("Interpersonal")
                      ).flatMap(t => t.strengths).slice(0, 3).map((strength, i) => (
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
                      {analysis.traits.filter(t => 
                        t.trait.includes("Social") || 
                        t.trait.includes("Empathy") || 
                        t.trait.includes("Communication") || 
                        t.trait.includes("Interpersonal")
                      ).flatMap(t => t.challenges).slice(0, 3).map((challenge, i) => (
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
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Growth & Development
            </CardTitle>
            <CardDescription>Your potential for growth and personal development</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderUniquenessMarkers()}
            
            <RenderList 
              title="Areas for Development" 
              items={analysis.growthPotential.areasOfDevelopment}
            />
            
            <RenderList 
              title="Key Strengths to Leverage" 
              items={analysis.growthPotential.keyStrengthsToLeverage}
            />
            
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
            
            {/* Conditionally render value system if available */}
            {analysis.valueSystem && (
              <div className="pt-2">
                <h3 className="font-medium mb-2">Value System</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {analysis.valueSystem.coreValues && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">Core Values</h4>
                      <div className="flex flex-wrap gap-1">
                        {analysis.valueSystem.coreValues.map((value, i) => (
                          <Badge key={i} variant="outline">{value}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {analysis.valueSystem.motivationSources && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">Key Motivators</h4>
                      <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                        {analysis.valueSystem.motivationSources.map((source, i) => (
                          <li key={i}>{source}</li>
                        ))}
                      </ul>
                    </div>
                  )}
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
