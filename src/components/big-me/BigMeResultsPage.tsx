
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BigMeAnalysisResult } from "@/utils/big-me/types";
import { AssessmentErrorHandler } from "@/components/assessment/AssessmentErrorHandler";
import { useAuth } from "@/contexts/AuthContext";
import BigMeResultsHeader from "./results-sections/BigMeResultsHeader";
import BigMeCognitiveSection from "./results-sections/BigMeCognitiveSection";
import BigMeEmotionalSection from "./results-sections/BigMeEmotionalSection";
import BigMeInterpersonalSection from "./results-sections/BigMeInterpersonalSection";
import BigMeCoreTraitsSection from "./results-sections/BigMeCoreTraitsSection";
import BigMeCareerSection from "./results-sections/BigMeCareerSection";
import BigMeMotivationSection from "./results-sections/BigMeMotivationSection";
import BigMeGrowthSection from "./results-sections/BigMeGrowthSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

const BigMeResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState<BigMeAnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("core-traits");

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('big_me_analyses')
          .select('*');

        // If ID is provided, fetch that specific analysis, otherwise get the latest
        if (id) {
          query = query.eq('id', id);
        } else {
          query = query
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) {
          throw new Error(`Failed to fetch analysis: ${fetchError.message}`);
        }

        if (!data || data.length === 0) {
          throw new Error("No analysis found. You may need to complete the assessment first.");
        }

        console.log("Fetched analysis data:", data[0]);

        // Fix the type conversion issue here
        const analysisResult = data[0].analysis_result as unknown;
        
        // Validate the structure is what we expect before casting to our type
        if (!analysisResult || typeof analysisResult !== 'object') {
          throw new Error("Analysis result is missing or has an invalid format");
        }
        
        // Cast to our expected type after validation
        const typedResult = analysisResult as BigMeAnalysisResult;
        
        // Check core sections
        if (!typedResult.coreTraits || 
            !typedResult.cognitivePatterning || 
            !typedResult.emotionalArchitecture || 
            !typedResult.interpersonalDynamics) {
          throw new Error("Analysis data is incomplete or corrupted");
        }

        setAnalysis(typedResult);
      } catch (err) {
        console.error("Error fetching analysis:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        toast.error("Failed to load analysis data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [user, id]);

  // Error state
  if (error) {
    return (
      <AssessmentErrorHandler 
        title="Analysis Error" 
        description={error} 
        errorDetails={`Failed to load Big Me analysis. ${error}`} 
      />
    );
  }

  // Loading state
  if (loading || !analysis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-12">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <h2 className="text-2xl font-bold">Loading Your Analysis...</h2>
        <p className="text-muted-foreground mt-2">Please wait while we retrieve your personality insights.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <BigMeResultsHeader />

      <Tabs defaultValue="core-traits" className="w-full mt-8" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 w-full">
          <TabsTrigger value="core-traits">Core Traits</TabsTrigger>
          <TabsTrigger value="cognitive">Cognitive</TabsTrigger>
          <TabsTrigger value="emotional">Emotional</TabsTrigger>
          <TabsTrigger value="interpersonal">Interpersonal</TabsTrigger>
          <TabsTrigger value="career">Career</TabsTrigger>
          <TabsTrigger value="motivation">Motivation</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
        </TabsList>

        <div className="mt-8">
          <TabsContent value="core-traits" className="mt-0">
            <BigMeCoreTraitsSection data={analysis.coreTraits} />
          </TabsContent>
          
          <TabsContent value="cognitive" className="mt-0">
            <BigMeCognitiveSection data={analysis.cognitivePatterning} />
          </TabsContent>
          
          <TabsContent value="emotional" className="mt-0">
            <BigMeEmotionalSection data={analysis.emotionalArchitecture} />
          </TabsContent>
          
          <TabsContent value="interpersonal" className="mt-0">
            <BigMeInterpersonalSection data={analysis.interpersonalDynamics} />
          </TabsContent>
          
          <TabsContent value="career" className="mt-0">
            <BigMeCareerSection data={analysis.careerInsights} />
          </TabsContent>
          
          <TabsContent value="motivation" className="mt-0">
            <BigMeMotivationSection data={analysis.motivationalProfile} />
          </TabsContent>
          
          <TabsContent value="growth" className="mt-0">
            <BigMeGrowthSection data={analysis.growthPotential} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default BigMeResultsPage;
