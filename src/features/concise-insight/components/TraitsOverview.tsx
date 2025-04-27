
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ConciseAnalysisResult } from '../types';

interface TraitsOverviewProps {
  traits: ConciseAnalysisResult['traits'];
}

export const TraitsOverview = ({ traits }: TraitsOverviewProps) => {
  if (!traits || traits.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trait Analysis</CardTitle>
          <CardDescription>No trait data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {traits.map((trait, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">{trait.trait}</CardTitle>
              <Badge variant="outline">Score: {trait.score}/100</Badge>
            </div>
            <CardDescription>{trait.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Progress value={trait.score} className="h-2" />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">0</span>
                <span className="text-xs text-muted-foreground">100</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Strengths</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {trait.strengths.map((strength, idx) => (
                    <li key={idx}>{strength}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Areas for Growth</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {trait.challenges.map((challenge, idx) => (
                    <li key={idx}>{challenge}</li>
                  ))}
                </ul>
              </div>
            </div>

            {trait.developmentStrategies && trait.developmentStrategies.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Development Strategies</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {trait.developmentStrategies.map((strategy, idx) => (
                    <li key={idx}>{strategy}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
