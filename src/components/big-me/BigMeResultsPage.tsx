
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BigMeAnalysisResult } from "@/utils/big-me/types";
import { Button } from "@/components/ui/button";
import BigMeCognitiveSection from "./results-sections/BigMeCognitiveSection";
import BigMeEmotionalSection from "./results-sections/BigMeEmotionalSection";
import BigMeInterpersonalSection from "./results-sections/BigMeInterpersonalSection";
import BigMeCoreTraitsSection from "./results-sections/BigMeCoreTraitsSection";
import BigMeCareerSection from "./results-sections/BigMeCareerSection";
import BigMeMotivationSection from "./results-sections/BigMeMotivationSection";
import BigMeGrowthSection from "./results-sections/BigMeGrowthSection";
import BigMeResultsHeader from "./results-sections/BigMeResultsHeader";

const BigMeResultsPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState<BigMeAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        if (!user && !id) {
          throw new Error("Authentication required");
        }

        let analysisId = id;
        
        // If no specific ID is provided, fetch the most recent analysis for the user
        if (!analysisId && user) {
          const { data, error } = await supabase
            .from("big_me_analyses")
            .select("id")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(1);
            
          if (error) throw error;
          if (data && data.length > 0) {
            analysisId = data[0].id;
          }
        }
        
        if (!analysisId) {
          throw new Error("No analysis found");
        }
        
        // Fetch the analysis data
        const { data, error } = await supabase
          .from("big_me_analyses")
          .select("*")
          .eq("id", analysisId)
          .single();
          
        if (error) throw error;
        
        setAnalysis(data.analysis_result);
      } catch (error) {
        console.error("Error fetching analysis:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [id, user]);

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-lg text-center">Loading your comprehensive personality analysis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-2">Error Loading Analysis</h2>
          <p className="text-red-600 dark:text-red-300">{error}</p>
          <Button variant="outline" className="mt-4" asChild>
            <a href="/big-me">Start New Assessment</a>
          </Button>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-amber-700 dark:text-amber-400 mb-2">No Analysis Found</h2>
          <p className="text-amber-600 dark:text-amber-300">We couldn't find your personality analysis. You may need to complete the assessment first.</p>
          <Button className="mt-4" asChild>
            <a href="/big-me">Take the Assessment</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <BigMeResultsHeader />
      
      <Tabs defaultValue="core-traits" className="mt-8">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 w-full">
          <TabsTrigger value="core-traits">Core Traits</TabsTrigger>
          <TabsTrigger value="cognitive">Cognitive</TabsTrigger>
          <TabsTrigger value="emotional">Emotional</TabsTrigger>
          <TabsTrigger value="interpersonal">Interpersonal</TabsTrigger>
          <TabsTrigger value="career">Career</TabsTrigger>
          <TabsTrigger value="motivation">Motivation</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
        </TabsList>
        
        <TabsContent value="core-traits" className="mt-6">
          <BigMeCoreTraitsSection data={analysis.coreTraits} />
        </TabsContent>
        
        <TabsContent value="cognitive" className="mt-6">
          <BigMeCognitiveSection data={analysis.cognitivePatterning} />
        </TabsContent>
        
        <TabsContent value="emotional" className="mt-6">
          <BigMeEmotionalSection data={analysis.emotionalArchitecture} />
        </TabsContent>
        
        <TabsContent value="interpersonal" className="mt-6">
          <BigMeInterpersonalSection data={analysis.interpersonalDynamics} />
        </TabsContent>
        
        <TabsContent value="career" className="mt-6">
          <BigMeCareerSection data={analysis.careerInsights} />
        </TabsContent>
        
        <TabsContent value="motivation" className="mt-6">
          <BigMeMotivationSection data={analysis.motivationalProfile} />
        </TabsContent>
        
        <TabsContent value="growth" className="mt-6">
          <BigMeGrowthSection data={analysis.growthPotential} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BigMeResultsPage;
