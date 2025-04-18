
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import PageTransition from "@/components/ui/PageTransition";
import { ArrowLeft, Download, Brain, Share2 } from "lucide-react";

import CoreTraitsSection from "./results-sections/CoreTraitsSection";
import CognitivePatterningSection from "./results-sections/CognitivePatterningSection";
import EmotionalArchitectureSection from "./results-sections/EmotionalArchitectureSection";
import InterpersonalDynamicsSection from "./results-sections/InterpersonalDynamicsSection";
import GrowthPotentialSection from "./results-sections/GrowthPotentialSection";

const DeepInsightResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('deep_insight_analyses')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setAnalysis(data[0]);
        } else {
          setError("No analysis found. Please complete the assessment first.");
        }
      } catch (err) {
        console.error("Error fetching analysis:", err);
        setError("Failed to load analysis. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalysis();
  }, [user, id]);
  
  if (loading) {
    return (
      <PageTransition>
        <div className="container max-w-4xl py-8 md:py-12 px-4 md:px-6">
          <div className="flex items-center justify-center mb-8">
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
          <Skeleton className="h-10 w-3/4 mx-auto mb-4" />
          <Skeleton className="h-6 w-1/2 mx-auto mb-8" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
          
          <Skeleton className="h-[400px] w-full mb-8" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      </PageTransition>
    );
  }
  
  if (error) {
    return (
      <PageTransition>
        <div className="container max-w-4xl py-8 md:py-12 px-4 md:px-6 flex flex-col items-center">
          <Brain className="h-16 w-16 text-muted mb-4" />
          <h1 className="text-2xl font-bold mb-4 text-center">Analysis Unavailable</h1>
          <p className="text-muted-foreground text-center mb-6">{error}</p>
          <Button onClick={() => navigate("/deep-insight")}>
            Take the Assessment
          </Button>
        </div>
      </PageTransition>
    );
  }
  
  return (
    <PageTransition>
      <div className="container max-w-4xl py-8 md:py-12 px-4 md:px-6">
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <Brain className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-center">Your Deep Insight Analysis</h1>
          <p className="text-muted-foreground text-center mt-2">
            A comprehensive analysis of your personality traits, cognitive patterns, and emotional architecture
          </p>
        </div>
        
        {analysis && (
          <>
            <Card className="mb-8 border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle>Personality Overview</CardTitle>
                <CardDescription>Summary of your core personality traits and tendencies</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed">
                  {analysis.overview || "Your Deep Insight Analysis reveals a multifaceted personality with unique cognitive patterns and emotional depths. The following sections break down the key components of your psychological profile."}
                </p>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-lg font-medium">Cognitive Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-center">
                    {analysis.intelligence_score || 75}/100
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-lg font-medium">Emotional Intelligence</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-center">
                    {analysis.emotional_intelligence_score || 70}/100
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-lg font-medium">Response Pattern</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    {analysis.response_patterns?.primaryChoice ? (
                      <span className="text-lg font-medium capitalize">Type {analysis.response_patterns.primaryChoice}-{analysis.response_patterns.secondaryChoice}</span>
                    ) : (
                      <span className="text-lg font-medium">Balanced</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Tabs defaultValue="core-traits" className="mb-8">
              <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-6">
                <TabsTrigger value="core-traits">Core Traits</TabsTrigger>
                <TabsTrigger value="cognitive">Cognitive</TabsTrigger>
                <TabsTrigger value="emotional">Emotional</TabsTrigger>
                <TabsTrigger value="interpersonal">Interpersonal</TabsTrigger>
                <TabsTrigger value="growth">Growth</TabsTrigger>
              </TabsList>
              
              <TabsContent value="core-traits">
                <CoreTraitsSection data={analysis.core_traits} />
              </TabsContent>
              
              <TabsContent value="cognitive">
                <CognitivePatterningSection data={analysis.cognitive_patterning} />
              </TabsContent>
              
              <TabsContent value="emotional">
                <EmotionalArchitectureSection data={analysis.emotional_architecture} />
              </TabsContent>
              
              <TabsContent value="interpersonal">
                <InterpersonalDynamicsSection data={analysis.interpersonal_dynamics} />
              </TabsContent>
              
              <TabsContent value="growth">
                <GrowthPotentialSection data={analysis.growth_potential} />
              </TabsContent>
            </Tabs>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline" 
                onClick={() => navigate("/deep-insight")}
                className="flex items-center"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retake Assessment
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => {
                  // Download as JSON
                  const blob = new Blob([JSON.stringify(analysis, null, 2)], { type: 'application/json' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'deep-insight-analysis.json';
                  a.click();
                  window.URL.revokeObjectURL(url);
                  
                  toast.success("Analysis downloaded");
                }}
                className="flex items-center"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Analysis
              </Button>
              
              <Button 
                onClick={() => {
                  // Copy share link
                  const shareUrl = `${window.location.origin}/deep-insight/results/${analysis.id}`;
                  navigator.clipboard.writeText(shareUrl);
                  
                  toast.success("Share link copied to clipboard");
                }}
                className="flex items-center bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share Results
              </Button>
            </div>
          </>
        )}
      </div>
    </PageTransition>
  );
};

export default DeepInsightResultsPage;
