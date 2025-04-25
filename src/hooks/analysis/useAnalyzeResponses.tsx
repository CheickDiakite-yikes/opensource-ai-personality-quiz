
import { useState } from "react";
import { AssessmentResponse, PersonalityAnalysis } from "@/utils/types";
import { toast } from "sonner";
import { saveAssessmentToStorage } from "./useLocalStorage";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { v4 as uuidv4 } from "uuid";

// Helper function to convert data to JSON compatible format
const toJsonCompatible = (obj: any): any => {
  if (obj === null || obj === undefined) {
    return null;
  }
  
  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => toJsonCompatible(item));
  }
  
  // Handle objects
  if (typeof obj === 'object' && obj !== null) {
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = toJsonCompatible(value);
    }
    return result;
  }
  
  // Handle primitive values
  return obj;
};

export const useAnalyzeResponses = (
  saveToHistory: (analysis: PersonalityAnalysis) => PersonalityAnalysis, 
  setAnalysis: (analysis: PersonalityAnalysis) => void
) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { user } = useAuth();

  const analyzeResponses = async (responses: AssessmentResponse[]): Promise<PersonalityAnalysis> => {
    setIsAnalyzing(true);
    toast.info("Analyzing your responses with AI...");

    try {
      // Generate a unique assessment ID
      const assessmentId = `assessment-${Date.now()}`;
      
      // Save responses to localStorage
      saveAssessmentToStorage(responses);
      console.log(`Saved ${responses.length} responses to localStorage`);
      
      console.log(`Sending ${responses.length} responses to AI for analysis using gpt-4o model...`);
      
      // Log detailed response distribution
      const categoryDistribution = responses.reduce((acc: Record<string, number>, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + 1;
        return acc;
      }, {});
      
      console.log("Response distribution by category:", 
        Object.entries(categoryDistribution)
          .map(([category, count]) => `${category}: ${count} (${Math.round((count/responses.length)*100)}%)`)
          .join(', ')
      );
      
      // Store assessment responses in Supabase if user is logged in
      let savedToSupabase = false;
      if (user) {
        try {
          // We need to convert AssessmentResponse[] to a JSON-compatible format
          const jsonResponses = toJsonCompatible(responses);
          
          // Check if the assessment already exists
          const { data: existingAssessment } = await supabase
            .from('assessments')
            .select('id')
            .eq('id', assessmentId)
            .maybeSingle();
          
          if (!existingAssessment) {
            console.log(`Saving assessment ${assessmentId} to Supabase...`);
            
            const { error: assessmentError } = await supabase
              .from('assessments')
              .insert({
                id: assessmentId,
                user_id: user.id,
                responses: jsonResponses
              });
              
            if (assessmentError) {
              console.error("Error saving assessment to Supabase:", assessmentError);
              console.warn(`Failed to save assessment: ${assessmentError.message}`);
            } else {
              savedToSupabase = true;
              console.log("Successfully saved assessment to Supabase with ID:", assessmentId);
            }
          } else {
            console.log(`Assessment ${assessmentId} already exists in Supabase, skipping save`);
          }
        } catch (err) {
          console.error("Error saving assessment:", err);
          // Continue with analysis even if saving fails
        }
      }

      // Enhanced error handling and retry logic for edge function calls
      const MAX_RETRIES = 3; // Increased from 2 to 3 for more retries
      const functionTimeout = 240000; // 4 minutes timeout for analysis (increased from 3 mins)
      let result = null;
      let lastError = null;
      let successfulRetry = -1;
      
      for (let retryCount = 0; retryCount <= MAX_RETRIES; retryCount++) {
        try {
          if (retryCount > 0) {
            console.log(`Retry attempt ${retryCount}/${MAX_RETRIES} for analysis function call...`);
            toast.loading(`Retry ${retryCount}/${MAX_RETRIES}: Analyzing your responses...`, { 
              id: "analyze-responses",
              duration: 60000 // Increased duration
            });
            // Exponential backoff
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1500));
          } else {
            toast.loading("Analyzing your responses with AI...", { 
              id: "analyze-responses",
              duration: 60000
            });
          }

          console.time(`analyze-responses-call-${retryCount}`);
          
          // Create a timeout promise
          const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => {
              reject(new Error(`Analysis request timed out after ${functionTimeout/1000} seconds`));
            }, functionTimeout);
          });
          
          // Call Supabase function with detailed request info
          console.log(`Calling Supabase analyze-responses function with assessment ID ${assessmentId} (retry: ${retryCount})`);
          
          const functionPromise = supabase.functions.invoke("analyze-responses", {
            body: { 
              responses, 
              assessmentId,
              retryCount, // Pass retry count for logging purposes
              timestamp: Date.now() // Add timestamp for tracing
            }
          });
          
          // Race between function call and timeout
          result = await Promise.race([functionPromise, timeoutPromise]);
          console.timeEnd(`analyze-responses-call-${retryCount}`);
          
          // Validate the response before proceeding
          if (!result) {
            throw new Error("Empty response from Supabase function");
          }
          
          if (result.error) {
            throw new Error(`Supabase function error: ${result.error}`);
          }
          
          if (!result.data || !result.data.analysis) {
            throw new Error("Invalid response structure from analysis function - missing analysis data");
          }
          
          successfulRetry = retryCount;
          console.log(`Analysis successful on attempt ${retryCount+1}`);
          toast.success("Analysis complete!", { id: "analyze-responses" });
          break;
        } catch (error) {
          lastError = error;
          console.error(`Analysis attempt ${retryCount+1} failed:`, error);
          
          if (retryCount === MAX_RETRIES) {
            // All retries exhausted
            console.error(`All ${MAX_RETRIES+1} attempts failed. Last error:`, error);
            toast.error("Analysis failed after multiple attempts", { 
              id: "analyze-responses",
              description: "Falling back to local analysis"
            });
            throw error;
          }
        }
      }
      
      // Double check that we have a valid result before proceeding
      if (!result || !result.data || !result.data.analysis) {
        throw new Error("Failed to get valid analysis after all attempts");
      }
      
      console.log(`Analysis complete on retry ${successfulRetry} with ID: ${result?.data?.analysis?.id}`);
      console.log("Analysis overview length:", result?.data?.analysis?.overview?.length || 0);
      console.log("Analysis traits count:", result?.data?.analysis?.traits?.length || 0);
      
      // Add user ID to the analysis if user is logged in
      let analysisWithUser = result.data.analysis;
      if (user) {
        analysisWithUser = {
          ...result.data.analysis,
          userId: user.id,
          assessmentId: assessmentId
        };
        
        // Save analysis to Supabase with enhanced error handling
        try {
          // Create a JSON compatible object from the analysis
          const jsonCompatibleAnalysis = toJsonCompatible(result.data.analysis);
          
          console.log("Saving analysis to Supabase with ID:", result.data.analysis.id);
          
          // Create a clean insert object that matches the database schema exactly
          const insertObject = {
            id: result.data.analysis.id,
            user_id: user.id,
            assessment_id: assessmentId,
            result: jsonCompatibleAnalysis,
            overview: result.data.analysis.overview || "",
            traits: jsonCompatibleAnalysis.traits || [],
            intelligence: jsonCompatibleAnalysis.intelligence || null,
            intelligence_score: result.data.analysis.intelligenceScore || 0,
            emotional_intelligence_score: result.data.analysis.emotionalIntelligenceScore || 0,
            cognitive_style: jsonCompatibleAnalysis.cognitiveStyle || null,
            value_system: jsonCompatibleAnalysis.valueSystem || [],
            motivators: jsonCompatibleAnalysis.motivators || [],
            inhibitors: jsonCompatibleAnalysis.inhibitors || [],
            weaknesses: jsonCompatibleAnalysis.weaknesses || [],
            shadow_aspects: jsonCompatibleAnalysis.shadowAspects || [], 
            growth_areas: jsonCompatibleAnalysis.growthAreas || [],
            relationship_patterns: jsonCompatibleAnalysis.relationshipPatterns || null,
            career_suggestions: jsonCompatibleAnalysis.careerSuggestions || [],
            learning_pathways: jsonCompatibleAnalysis.learningPathways || [],
            roadmap: result.data.analysis.roadmap || "",
            // Add any additional fields that might be in the new analysis structure
            response_patterns: jsonCompatibleAnalysis.responsePatterns || null,
            core_traits: jsonCompatibleAnalysis.coreTraits || null,
            cognitive_patterning: jsonCompatibleAnalysis.cognitivePatterning || null,
            emotional_architecture: jsonCompatibleAnalysis.emotionalArchitecture || null,
            interpersonal_dynamics: jsonCompatibleAnalysis.interpersonalDynamics || null,
            growth_potential: jsonCompatibleAnalysis.growthPotential || null
          };
          
          // Log what we're about to save
          console.log("Analysis data that will be saved:", {
            id: insertObject.id,
            user_id: insertObject.user_id,
            assessment_id: insertObject.assessment_id,
            traitsCount: Array.isArray(insertObject.traits) ? insertObject.traits.length : 0,
            overviewLength: insertObject.overview ? insertObject.overview.length : 0
          });
          
          // Try up to 4 times to save to the database (increased from 3)
          let saveSuccess = false;
          for (let i = 0; i < 4; i++) {
            try {
              // First check if analysis already exists (to avoid duplicate errors)
              const { data: existingAnalysis } = await supabase
                .from('analyses')
                .select('id')
                .eq('id', result.data.analysis.id)
                .maybeSingle();
                
              if (existingAnalysis) {
                console.log(`Analysis ${result.data.analysis.id} already exists, updating instead of inserting`);
                const { error: updateError } = await supabase
                  .from('analyses')
                  .update(insertObject)
                  .eq('id', result.data.analysis.id);
                  
                if (updateError) {
                  console.error(`Update attempt ${i+1} failed:`, updateError);
                  if (i < 3) await new Promise(resolve => setTimeout(resolve, 1500 * (i+1)));
                } else {
                  console.log("Successfully updated analysis in Supabase with ID:", result.data.analysis.id);
                  saveSuccess = true;
                  break;
                }
              } else {
                // Try to insert
                const { error: insertError } = await supabase
                  .from('analyses')
                  .insert(insertObject);
                  
                if (insertError) {
                  console.error(`Insert attempt ${i+1} failed:`, insertError);
                  if (i < 3) await new Promise(resolve => setTimeout(resolve, 1500 * (i+1)));
                } else {
                  console.log("Successfully saved analysis to Supabase with ID:", result.data.analysis.id);
                  saveSuccess = true;
                  break;
                }
              }
            } catch (err) {
              console.error(`Save attempt ${i+1} exception:`, err);
              if (i < 3) await new Promise(resolve => setTimeout(resolve, 1500 * (i+1)));
            }
          }
          
          // Final verification that the analysis was saved
          if (!saveSuccess) {
            const { data: existingAnalysis } = await supabase
              .from('analyses')
              .select('id')
              .eq('id', result.data.analysis.id)
              .maybeSingle();
              
            if (existingAnalysis) {
              console.log("Analysis already exists in database with ID:", existingAnalysis.id);
              saveSuccess = true;
            } else {
              console.warn("Failed to save analysis to Supabase after multiple attempts");
              // Attempt one last upsert as a fallback
              try {
                const { error: upsertError } = await supabase
                  .from('analyses')
                  .upsert(insertObject);
                
                if (!upsertError) {
                  console.log("Successfully upserted analysis as final fallback");
                  saveSuccess = true;
                }
              } catch (e) {
                console.error("Final upsert attempt failed:", e);
              }
            }
          }
        } catch (err) {
          console.error("Error saving analysis:", err);
          console.warn(`Failed to save analysis: ${err instanceof Error ? err.message : String(err)}`);
        }
      }
      
      // Save to history and update the current analysis
      console.log("Saving analysis to local history");
      const savedAnalysis = saveToHistory(analysisWithUser);
      setAnalysis(savedAnalysis);
      
      toast.success("AI Analysis complete!", {
        description: "Your personality profile is ready to view"
      });
      
      return savedAnalysis;
    } catch (error) {
      console.error("Error analyzing responses:", error);
      toast.error(`Analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`, {
        description: "Using fallback analysis instead"
      });
      
      // Generate a more detailed fallback analysis
      const fallbackAnalysis = await generateFallbackAnalysis(responses);
      const savedAnalysis = saveToHistory(fallbackAnalysis);
      setAnalysis(savedAnalysis);
      return savedAnalysis;
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Enhanced fallback analysis generator
  const generateFallbackAnalysis = async (responses: AssessmentResponse[]): Promise<PersonalityAnalysis> => {
    console.log("Generating fallback analysis from responses");
    
    try {
      // Generate a unique ID for the fallback analysis
      const fallbackId = `fallback-${uuidv4()}`;
      
      // Extract some basic insights from the responses
      const topCategories = Object.entries(
        responses.reduce((acc: Record<string, number>, curr) => {
          acc[curr.category] = (acc[curr.category] || 0) + 1;
          return acc;
        }, {})
      )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category]) => category);
      
      // Count detailed responses
      const detailedResponses = responses.filter(r => 
        r.customResponse && r.customResponse.trim().length > 50
      ).length;
      
      const responseQuality = detailedResponses > 5 ? "detailed" : "brief";
      
      // Create a simple fallback analysis with some basic traits
      return {
        id: fallbackId,
        createdAt: new Date().toISOString(),
        overview: "This is a fallback analysis created when the AI analysis couldn't be completed.",
        traits: [
          {
            trait: "Resilience",
            score: 0.7,
            description: "You show ability to recover from setbacks and adapt to challenges.",
            strengths: ["Persistence", "Adaptability"],
            challenges: ["May push too hard sometimes"],
            growthSuggestions: ["Balance effort with rest"]
          }
        ],
        intelligence: {
          type: "General Intelligence",
          score: 0.5,
          description: "A balanced set of cognitive capabilities.",
          domains: []
        },
        intelligenceScore: 50,
        emotionalIntelligenceScore: 50,
        cognitiveStyle: "Balanced",
        valueSystem: ["Growth"],
        motivators: ["Learning"],
        inhibitors: [],
        weaknesses: [],
        growthAreas: [],
        relationshipPatterns: {
          strengths: [],
          challenges: [],
          compatibleTypes: []
        },
        careerSuggestions: [],
        learningPathways: [],
        roadmap: "",
        shadowAspects: []
      };
    } catch (error) {
      console.error("Error generating fallback analysis:", error);
      
      // If even the fallback generation fails, return an absolute minimal analysis
      return {
        id: `minimal-fallback-${Date.now()}`,
        createdAt: new Date().toISOString(),
        overview: "This is a minimal fallback analysis created when the AI analysis couldn't be completed.",
        traits: [
          {
            trait: "Resilience",
            score: 0.7,
            description: "You show ability to recover from setbacks and adapt to challenges.",
            strengths: ["Persistence", "Adaptability"],
            challenges: ["May push too hard sometimes"],
            growthSuggestions: ["Balance effort with rest"]
          }
        ],
        intelligence: {
          type: "General Intelligence",
          score: 0.5,
          description: "A balanced set of cognitive capabilities.",
          domains: []
        },
        intelligenceScore: 50,
        emotionalIntelligenceScore: 50,
        cognitiveStyle: "Balanced",
        valueSystem: ["Growth"],
        motivators: ["Learning"],
        inhibitors: [],
        weaknesses: [],
        growthAreas: [],
        relationshipPatterns: {
          strengths: [],
          challenges: [],
          compatibleTypes: []
        },
        careerSuggestions: [],
        learningPathways: [],
        roadmap: "",
        shadowAspects: []
      };
    }
  };

  return {
    isAnalyzing,
    analyzeResponses
  };
};
