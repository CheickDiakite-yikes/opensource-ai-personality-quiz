
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
import { toast } from "sonner";

interface DatabaseBigMeAnalysis {
  id: string;
  user_id: string;
  analysis_result: BigMeAnalysisResult;
  responses?: unknown;
  created_at: string;
}

// Default empty analysis with all required arrays initialized
const defaultAnalysis: BigMeAnalysisResult = {
  cognitivePatterning: {
    decisionMaking: "Not yet analyzed",
    learningStyle: "Not yet analyzed",
    attention: "Not yet analyzed",
    problemSolvingApproach: "Not yet analyzed",
    informationProcessing: "Not yet analyzed",
    analyticalTendencies: "Not yet analyzed"
  },
  emotionalArchitecture: {
    emotionalAwareness: "Not yet analyzed",
    regulationStyle: "Not yet analyzed",
    empathicCapacity: "Not yet analyzed",
    emotionalComplexity: "Not yet analyzed",
    stressResponse: "Not yet analyzed",
    emotionalResilience: "Not yet analyzed"
  },
  interpersonalDynamics: {
    attachmentStyle: "Not yet analyzed",
    communicationPattern: "Not yet analyzed",
    conflictResolution: "Not yet analyzed",
    relationshipNeeds: "Not yet analyzed",
    socialBoundaries: "Not yet analyzed",
    groupDynamics: "Not yet analyzed",
    compatibilityProfile: "Not yet analyzed",
    compatibleTypes: ["Not yet analyzed"],
    challengingRelationships: ["Not yet analyzed"]
  },
  coreTraits: {
    primary: "Not yet analyzed",
    secondary: "Not yet analyzed",
    tertiaryTraits: ["Not yet analyzed"],
    strengths: ["Not yet analyzed"],
    challenges: ["Not yet analyzed"],
    adaptivePatterns: ["Not yet analyzed"],
    potentialBlindSpots: ["Not yet analyzed"]
  },
  careerInsights: {
    naturalStrengths: ["Not yet analyzed"],
    workplaceNeeds: ["Not yet analyzed"],
    leadershipStyle: "Not yet analyzed",
    idealWorkEnvironment: "Not yet analyzed",
    careerPathways: ["Not yet analyzed"],
    professionalChallenges: ["Not yet analyzed"],
    potentialRoles: ["Not yet analyzed"]
  },
  motivationalProfile: {
    primaryDrivers: ["Not yet analyzed"],
    secondaryDrivers: ["Not yet analyzed"],
    inhibitors: ["Not yet analyzed"],
    values: ["Not yet analyzed"],
    aspirations: "Not yet analyzed",
    fearPatterns: "Not yet analyzed"
  },
  growthPotential: {
    developmentAreas: ["Not yet analyzed"],
    recommendations: ["Not yet analyzed"],
    specificActionItems: ["Not yet analyzed"],
    longTermTrajectory: "Not yet analyzed",
    potentialPitfalls: ["Not yet analyzed"],
    growthMindsetIndicators: "Not yet analyzed"
  }
};

// Helper function to ensure arrays exist
const ensureArray = (arr: any[] | undefined, defaultValue: string[] = ["Not available"]): string[] => {
  return Array.isArray(arr) && arr.length > 0 ? arr : defaultValue;
};

// Helper to merge any psychological profile data into the core traits
const mergePsychologicalProfile = (analysis: BigMeAnalysisResult): BigMeAnalysisResult => {
  const result = { ...analysis };

  // If we have psychological profile data, use it to enhance the analysis
  if (analysis.psychologicalProfile) {
    const psychProfile = analysis.psychologicalProfile;
    
    // Update core traits if available
    if (psychProfile.coreTraits) {
      // If primary/secondary are empty, set from dominant traits
      if (result.coreTraits.primary === "Not yet analyzed" && psychProfile.coreTraits.dominantTraits?.length > 0) {
        result.coreTraits.primary = psychProfile.coreTraits.dominantTraits[0];
      }
      
      if (result.coreTraits.secondary === "Not yet analyzed" && psychProfile.coreTraits.dominantTraits?.length > 1) {
        result.coreTraits.secondary = psychProfile.coreTraits.dominantTraits[1];
      }
      
      // If tertiary traits are empty, use the ones from psych profile
      if (result.coreTraits.tertiaryTraits.length === 1 && 
          result.coreTraits.tertiaryTraits[0] === "Not yet analyzed" && 
          psychProfile.coreTraits.tertiaryTraits?.length > 0) {
        result.coreTraits.tertiaryTraits = psychProfile.coreTraits.tertiaryTraits.map(
          trait => typeof trait === 'string' ? trait : trait.label || ''
        );
      }
    }
    
    // Update strengths and challenges
    if (result.coreTraits.strengths.length === 1 && 
        result.coreTraits.strengths[0] === "Not yet analyzed" && 
        psychProfile.strengths?.length > 0) {
      result.coreTraits.strengths = psychProfile.strengths;
    }
    
    if (result.coreTraits.challenges.length === 1 && 
        result.coreTraits.challenges[0] === "Not yet analyzed" && 
        psychProfile.challenges?.length > 0) {
      result.coreTraits.challenges = psychProfile.challenges;
    }
    
    // Update values in motivational profile
    if (psychProfile.values?.coreValues && 
        result.motivationalProfile.values.length === 1 && 
        result.motivationalProfile.values[0] === "Not yet analyzed") {
      result.motivationalProfile.values = psychProfile.values.coreValues;
    }
    
    // Update cognitive patterning
    if (psychProfile.cognitivePatterns?.thinkingStyle && 
        result.cognitivePatterning.decisionMaking === "Not yet analyzed") {
      // Use the thinking style for decision making if it's empty
      result.cognitivePatterning.decisionMaking = psychProfile.cognitivePatterns.thinkingStyle.join(" ");
    }
    
    // Update interpersonal dynamics
    if (psychProfile.socialDynamics?.interpersonalStyle && 
        result.interpersonalDynamics.communicationPattern === "Not yet analyzed") {
      result.interpersonalDynamics.communicationPattern = 
        psychProfile.socialDynamics.interpersonalStyle.join(" ");
    }
    
    if (psychProfile.socialDynamics?.leadershipApproach && 
        result.careerInsights.leadershipStyle === "Not yet analyzed") {
      result.careerInsights.leadershipStyle = 
        psychProfile.socialDynamics.leadershipApproach.join(" ");
    }
  }
  
  return result;
};

const BigMeResultsPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState<BigMeAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rawResponse, setRawResponse] = useState<any | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        if (!user && !id) {
          throw new Error("Authentication required");
        }

        let analysisId = id;
        
        // If no specific ID is provided, fetch the most recent analysis for the user
        if (!analysisId && user) {
          const { data: recentAnalysis, error: recentError } = await supabase
            .from('big_me_analyses')
            .select('id')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
            
          if (recentError) throw recentError;
          if (recentAnalysis) {
            analysisId = recentAnalysis.id;
          }
        }
        
        if (!analysisId) {
          throw new Error("No analysis found");
        }
        
        // Fetch the analysis data
        const { data, error } = await supabase
          .from('big_me_analyses')
          .select('*')
          .eq('id', analysisId)
          .maybeSingle() as { data: DatabaseBigMeAnalysis | null, error: Error | null };
          
        if (error) throw error;
        if (!data) throw new Error("Analysis not found");
        
        // Store raw response for debugging
        console.log("Raw analysis data:", data);
        setRawResponse(data);
        
        // Check if analysis_result exists and directly use it
        if (!data.analysis_result) {
          console.error("Analysis result is missing or empty");
          throw new Error("Analysis data is incomplete");
        }
        
        // Extract the analysis result directly
        const analysisResult = data.analysis_result;
        console.log("Direct analysis_result content:", analysisResult);
        
        // Normalize the analysis data to ensure all required fields exist
        const normalizedAnalysis = {
          ...defaultAnalysis,
          ...analysisResult
        };
        
        // More thorough checking of each section
        // Check core sections existence
        if (!normalizedAnalysis.coreTraits) normalizedAnalysis.coreTraits = defaultAnalysis.coreTraits;
        if (!normalizedAnalysis.careerInsights) normalizedAnalysis.careerInsights = defaultAnalysis.careerInsights;
        if (!normalizedAnalysis.motivationalProfile) normalizedAnalysis.motivationalProfile = defaultAnalysis.motivationalProfile;
        if (!normalizedAnalysis.growthPotential) normalizedAnalysis.growthPotential = defaultAnalysis.growthPotential;
        if (!normalizedAnalysis.interpersonalDynamics) normalizedAnalysis.interpersonalDynamics = defaultAnalysis.interpersonalDynamics;
        if (!normalizedAnalysis.cognitivePatterning) normalizedAnalysis.cognitivePatterning = defaultAnalysis.cognitivePatterning;
        if (!normalizedAnalysis.emotionalArchitecture) normalizedAnalysis.emotionalArchitecture = defaultAnalysis.emotionalArchitecture;
        
        // Ensure all arrays exist
        if (normalizedAnalysis.coreTraits) {
          normalizedAnalysis.coreTraits.tertiaryTraits = ensureArray(normalizedAnalysis.coreTraits.tertiaryTraits);
          normalizedAnalysis.coreTraits.strengths = ensureArray(normalizedAnalysis.coreTraits.strengths);
          normalizedAnalysis.coreTraits.challenges = ensureArray(normalizedAnalysis.coreTraits.challenges);
          normalizedAnalysis.coreTraits.adaptivePatterns = ensureArray(normalizedAnalysis.coreTraits.adaptivePatterns);
          normalizedAnalysis.coreTraits.potentialBlindSpots = ensureArray(normalizedAnalysis.coreTraits.potentialBlindSpots);
        }
        
        if (normalizedAnalysis.careerInsights) {
          normalizedAnalysis.careerInsights.naturalStrengths = ensureArray(normalizedAnalysis.careerInsights.naturalStrengths);
          normalizedAnalysis.careerInsights.workplaceNeeds = ensureArray(normalizedAnalysis.careerInsights.workplaceNeeds);
          normalizedAnalysis.careerInsights.careerPathways = ensureArray(normalizedAnalysis.careerInsights.careerPathways);
          normalizedAnalysis.careerInsights.professionalChallenges = ensureArray(normalizedAnalysis.careerInsights.professionalChallenges);
          normalizedAnalysis.careerInsights.potentialRoles = ensureArray(normalizedAnalysis.careerInsights.potentialRoles);
        }
        
        if (normalizedAnalysis.motivationalProfile) {
          normalizedAnalysis.motivationalProfile.primaryDrivers = ensureArray(normalizedAnalysis.motivationalProfile.primaryDrivers);
          normalizedAnalysis.motivationalProfile.secondaryDrivers = ensureArray(normalizedAnalysis.motivationalProfile.secondaryDrivers);
          normalizedAnalysis.motivationalProfile.inhibitors = ensureArray(normalizedAnalysis.motivationalProfile.inhibitors);
          normalizedAnalysis.motivationalProfile.values = ensureArray(normalizedAnalysis.motivationalProfile.values);
        }
        
        if (normalizedAnalysis.growthPotential) {
          normalizedAnalysis.growthPotential.developmentAreas = ensureArray(normalizedAnalysis.growthPotential.developmentAreas);
          normalizedAnalysis.growthPotential.recommendations = ensureArray(normalizedAnalysis.growthPotential.recommendations);
          normalizedAnalysis.growthPotential.specificActionItems = ensureArray(normalizedAnalysis.growthPotential.specificActionItems);
          normalizedAnalysis.growthPotential.potentialPitfalls = ensureArray(normalizedAnalysis.growthPotential.potentialPitfalls);
        }
        
        if (normalizedAnalysis.interpersonalDynamics) {
          normalizedAnalysis.interpersonalDynamics.compatibleTypes = ensureArray(normalizedAnalysis.interpersonalDynamics.compatibleTypes);
          normalizedAnalysis.interpersonalDynamics.challengingRelationships = ensureArray(normalizedAnalysis.interpersonalDynamics.challengingRelationships);
        }
        
        // Merge any psychological profile data with the main analysis
        const enhancedAnalysis = mergePsychologicalProfile(normalizedAnalysis);
        
        // Add debug logging
        console.log("Enhanced analysis prepared:", enhancedAnalysis);
        
        toast.success("Analysis data loaded successfully");
        setAnalysis(enhancedAnalysis);
      } catch (error) {
        console.error("Error fetching analysis:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
        toast.error("Failed to load analysis");
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
          {rawResponse && (
            <div className="mt-4 text-left">
              <details>
                <summary className="cursor-pointer text-sm text-red-500 hover:text-red-700">
                  Show debug information
                </summary>
                <pre className="mt-2 p-4 bg-red-50 dark:bg-red-900/30 rounded text-xs overflow-auto max-h-60">
                  {JSON.stringify(rawResponse, null, 2)}
                </pre>
              </details>
            </div>
          )}
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
