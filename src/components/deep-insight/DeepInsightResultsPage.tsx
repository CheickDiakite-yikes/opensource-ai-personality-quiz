import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import PageTransition from "@/components/ui/PageTransition";
import { 
  ArrowLeft, Download, Brain, Share2, Briefcase, Heart, 
  Star, FlameIcon, Lightbulb, Flower, Users, Sparkles 
} from "lucide-react";

// Import new components
import DeepInsightHeader from "./components/DeepInsightHeader";
import PersonalityOverview from "./components/PersonalityOverview";
import AnalysisScores from "./components/AnalysisScores";
import AnalysisActions from "./components/AnalysisActions";

// Import existing section components
import CoreTraitsSection from "./results-sections/CoreTraitsSection";
import CognitivePatterningSection from "./results-sections/CognitivePatterningSection";
import EmotionalArchitectureSection from "./results-sections/EmotionalArchitectureSection";
import InterpersonalDynamicsSection from "./results-sections/InterpersonalDynamicsSection";
import GrowthPotentialSection from "./results-sections/GrowthPotentialSection";
import CareerInsightsSection from "./results-sections/CareerInsightsSection";
import MotivationSection from "./results-sections/MotivationSection";
import TopTraitsSection from "./results-sections/TopTraitsSection";

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
        <DeepInsightHeader />
        
        {analysis && (
          <>
            <PersonalityOverview overview={analysis.overview} />
            
            <AnalysisScores 
              intelligenceScore={analysis.intelligence_score}
              emotionalIntelligenceScore={analysis.emotional_intelligence_score}
              responsePatterns={analysis.response_patterns}
            />
            
            <TopTraitsSection coreTraits={analysis.core_traits} />
            
            <Tabs defaultValue="traits" className="mb-8">
              <TabsList className="grid grid-cols-4 gap-2 mb-6 p-1 bg-muted/30 rounded-lg">
                <TabsTrigger value="traits" className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Core Traits
                </TabsTrigger>
                <TabsTrigger value="cognitive" className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Cognitive
                </TabsTrigger>
                <TabsTrigger value="emotional" className="flex items-center gap-2">
                  <Flower className="h-4 w-4" />
                  Emotional
                </TabsTrigger>
                <TabsTrigger value="interpersonal" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Interpersonal
                </TabsTrigger>
                <TabsTrigger value="growth" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Growth
                </TabsTrigger>
                <TabsTrigger value="career" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Career
                </TabsTrigger>
                <TabsTrigger value="motivation" className="flex items-center gap-2">
                  <FlameIcon className="h-4 w-4" />
                  Motivation
                </TabsTrigger>
                <TabsTrigger value="relationships" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Relationships
                </TabsTrigger>
              </TabsList>

              <TabsContent value="traits">
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
              
              <TabsContent value="career">
                <CareerInsightsSection careerInsights={analysis.complete_analysis?.careerInsights || {}} />
              </TabsContent>
              
              <TabsContent value="motivation">
                <MotivationSection 
                  motivators={analysis.complete_analysis?.motivationalProfile?.primaryDrivers} 
                  inhibitors={analysis.complete_analysis?.motivationalProfile?.inhibitors}
                />
              </TabsContent>
              
              <TabsContent value="relationships">
                <InterpersonalDynamicsSection data={analysis.interpersonal_dynamics} />
              </TabsContent>
            </Tabs>
            
            <AnalysisActions analysis={analysis} />
          </>
        )}
      </div>
    </PageTransition>
  );
};

export default DeepInsightResultsPage;
