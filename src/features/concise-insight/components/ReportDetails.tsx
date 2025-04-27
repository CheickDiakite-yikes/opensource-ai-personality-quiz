
import React from 'react';
import { Share2, Download, Brain, HeartHandshake, Users, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { TabContent } from './report-tabs/TabContent';
import { ConciseAnalysisResult } from '../types';

interface ReportDetailsProps {
  analysis: ConciseAnalysisResult;
}

export const ReportDetails = ({ analysis }: ReportDetailsProps) => {
  console.log('Analysis data received:', analysis);
  
  return (
    <div className="flex flex-col gap-8">
      <header className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Personality Analysis</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {analysis.overview}
        </p>
      </header>
      
      <Card className="border-2 border-primary/10">
        <CardHeader>
          <CardTitle className="text-2xl">Core Profiling</CardTitle>
          <CardDescription>Your personality profile and key characteristics</CardDescription>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">
                Primary Archetype: <Badge variant="outline" className="ml-2">{analysis.coreProfiling.primaryArchetype}</Badge>
              </h3>
              <h4 className="text-lg font-medium mb-2">
                Secondary: <Badge variant="outline" className="ml-2">{analysis.coreProfiling.secondaryArchetype}</Badge>
              </h4>
            </div>
          </div>
          <p className="text-muted-foreground">{analysis.coreProfiling.description}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" /> 
            Cognitive & Behavioral Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Cognitive Style</h3>
              <p className="text-muted-foreground">{analysis.cognitiveProfile.style}</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Learning Approach</h3>
              <p className="text-muted-foreground">{analysis.cognitiveProfile.learningStyle}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="cognitive">
        <TabsList className="grid grid-cols-4 mb-4">
          {['cognitive', 'emotional', 'social', 'growth'].map((tab) => (
            <TabsTrigger key={tab} value={tab} className="flex items-center gap-1">
              {tab === 'cognitive' && <Brain className="h-4 w-4" />}
              {tab === 'emotional' && <HeartHandshake className="h-4 w-4" />}
              {tab === 'social' && <Users className="h-4 w-4" />}
              {tab === 'growth' && <Lightbulb className="h-4 w-4" />}
              <span className="hidden sm:inline">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {['cognitive', 'emotional', 'social', 'growth'].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-0">
            <TabContent tabValue={tab} analysis={analysis} />
          </TabsContent>
        ))}
      </Tabs>
      
      <div className="flex flex-wrap gap-4 justify-center">
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" /> Download PDF
        </Button>
        <Button variant="secondary" className="flex items-center gap-2">
          <Share2 className="h-4 w-4" /> Share Results
        </Button>
      </div>
    </div>
  );
};
