
import { useState } from "react";
import { AssessmentResponse, PersonalityAnalysis } from "@/utils/types";
import { toast } from "sonner";
import { saveAssessmentToStorage } from "./useLocalStorage";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { v4 as uuidv4 } from "uuid";

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
      
      // Check for empty responses that might cause issues
      const emptyResponses = responses.filter(r => 
        (!r.selectedOption || r.selectedOption.trim() === "") && 
        (!r.customResponse || r.customResponse.trim() === "")
      );
      
      if (emptyResponses.length > 0) {
        console.warn(`Found ${emptyResponses.length} empty responses that may affect analysis quality`);
        console.warn("Empty response IDs:", emptyResponses.map(r => r.questionId).join(", "));
      }
      
      // Store assessment responses in Supabase if user is logged in
      let savedToSupabase = false;
      if (user) {
        try {
          // We need to convert AssessmentResponse[] to a JSON-compatible format
          const jsonResponses = JSON.parse(JSON.stringify(responses));
          
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
              console.error("Error details:", JSON.stringify(assessmentError));
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
          console.error("Error stack:", err instanceof Error ? err.stack : "No stack available");
          // Continue with analysis even if saving fails
        }
      }
      
      if (!savedToSupabase) {
        console.warn("Assessment was not saved to Supabase, continuing with local analysis");
      }

      // Enhanced error handling and retry logic for edge function calls
      const MAX_RETRIES = 2;
      const functionTimeout = 180000; // 3 minutes timeout for analysis
      let result = null;
      let lastError = null;
      
      for (let retryCount = 0; retryCount <= MAX_RETRIES; retryCount++) {
        try {
          if (retryCount > 0) {
            console.log(`Retry attempt ${retryCount}/${MAX_RETRIES} for analysis function call...`);
            toast.loading(`Retry ${retryCount}/${MAX_RETRIES}: Analyzing your responses...`, { 
              id: "analyze-responses",
              duration: 30000
            });
            // Exponential backoff
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
          } else {
            toast.loading("Analyzing your responses with AI...", { 
              id: "analyze-responses",
              duration: 30000
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
          console.log(`Calling Supabase analyze-responses function with assessment ID ${assessmentId}`);
          
          const functionPromise = supabase.functions.invoke("analyze-responses", {
            body: { 
              responses, 
              assessmentId,
              retryCount // Pass retry count for logging purposes
            }
          });
          
          // Race between function call and timeout
          result = await Promise.race([functionPromise, timeoutPromise]);
          console.timeEnd(`analyze-responses-call-${retryCount}`);
          
          // CRITICAL FIX: Properly validate the response before proceeding
          if (!result) {
            throw new Error("Empty response from Supabase function");
          }
          
          if (result.error) {
            throw new Error(`Supabase function error: ${result.error}`);
          }
          
          if (!result.data || !result.data.analysis) {
            throw new Error("Invalid response structure from analysis function - missing analysis data");
          }
          
          // CRITICAL FIX: Only if we have a valid result, we break here
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
      
      // CRITICAL FIX: Double check that we have a valid result before proceeding
      if (!result || !result.data || !result.data.analysis) {
        throw new Error("Failed to get valid analysis after all attempts");
      }
      
      console.log("Received AI analysis:", result?.data?.analysis?.id);
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
          // Convert all JSON fields to their string representation to ensure compatibility
          const jsonAnalysis = JSON.parse(JSON.stringify(result.data.analysis));
          
          console.log("Saving analysis to Supabase with ID:", result.data.analysis.id);
          
          // Create a clean insert object that matches the database schema exactly
          const insertObject = {
            id: result.data.analysis.id,
            user_id: user.id,
            assessment_id: assessmentId,
            result: jsonAnalysis,
            overview: result.data.analysis.overview || "",
            traits: Array.isArray(jsonAnalysis.traits) ? jsonAnalysis.traits : [],
            intelligence: jsonAnalysis.intelligence || null,
            intelligence_score: result.data.analysis.intelligenceScore || 0,
            emotional_intelligence_score: result.data.analysis.emotionalIntelligenceScore || 0,
            cognitive_style: jsonAnalysis.cognitiveStyle || null,
            value_system: Array.isArray(jsonAnalysis.valueSystem) ? jsonAnalysis.valueSystem : [],
            motivators: Array.isArray(jsonAnalysis.motivators) ? jsonAnalysis.motivators : [],
            inhibitors: Array.isArray(jsonAnalysis.inhibitors) ? jsonAnalysis.inhibitors : [],
            weaknesses: Array.isArray(jsonAnalysis.weaknesses) ? jsonAnalysis.weaknesses : [],
            shadow_aspects: Array.isArray(jsonAnalysis.shadowAspects) ? jsonAnalysis.shadowAspects : [], 
            growth_areas: Array.isArray(jsonAnalysis.growthAreas) ? jsonAnalysis.growthAreas : [],
            relationship_patterns: jsonAnalysis.relationshipPatterns || null,
            career_suggestions: Array.isArray(jsonAnalysis.careerSuggestions) ? jsonAnalysis.careerSuggestions : [],
            learning_pathways: Array.isArray(jsonAnalysis.learningPathways) ? jsonAnalysis.learningPathways : [],
            roadmap: result.data.analysis.roadmap || ""
          };
          
          // Try up to 3 times to save to the database
          let saveSuccess = false;
          for (let i = 0; i < 3; i++) {
            try {
              const { error: analysisError } = await supabase
                .from('analyses')
                .insert(insertObject);
                
              if (analysisError) {
                console.error(`Save attempt ${i+1} failed:`, analysisError);
                if (i < 2) await new Promise(resolve => setTimeout(resolve, 1000 * (i+1)));
              } else {
                console.log("Successfully saved analysis to Supabase with ID:", result.data.analysis.id);
                saveSuccess = true;
                break;
              }
            } catch (err) {
              console.error(`Save attempt ${i+1} exception:`, err);
              if (i < 2) await new Promise(resolve => setTimeout(resolve, 1000 * (i+1)));
            }
          }
          
          if (!saveSuccess) {
            console.warn("Failed to save analysis to Supabase after multiple attempts");
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
      console.error("Error stack:", error instanceof Error ? error.stack : "No stack available");
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

  // Enhanced fallback analysis generator that attempts to create a more useful analysis
  // when the AI analysis fails
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
        overview: `This is a fallback analysis generated when the AI analysis couldn't be completed. Based on your ${responses.length} responses, you seem most interested in ${topCategories.join(", ")}. Your responses were generally ${responseQuality}.`,
        traits: [
          {
            trait: "Analytical Thinking",
            score: 0.75,
            description: "You show a tendency to analyze situations carefully before making decisions.",
            strengths: ["Problem solving", "Critical thinking", "Attention to detail"],
            challenges: ["May overthink simple situations", "Could take longer to decide"],
            growthSuggestions: ["Practice balancing analysis with intuition", "Set time limits for decisions"]
          },
          {
            trait: "Adaptability",
            score: 0.7,
            description: "You demonstrate ability to adjust to new situations and changing environments.",
            strengths: ["Flexibility", "Resilience", "Open to new experiences"],
            challenges: ["May sometimes feel uncomfortable with rapid change", "Might need time to process transitions"],
            growthSuggestions: ["Embrace uncertainty as opportunity", "Practice mindfulness during transitions"]
          },
          {
            trait: "Empathy",
            score: 0.8,
            description: "You show strong ability to understand and share feelings of others.",
            strengths: ["Strong listening skills", "Building rapport", "Understanding others' perspectives"],
            challenges: ["May take on others' emotional burdens", "Could be affected by negative environments"],
            growthSuggestions: ["Practice emotional boundaries", "Balance empathy with self-care"]
          }
        ],
        intelligence: {
          type: "Balanced Intelligence",
          score: 0.65,
          description: "You demonstrate a balanced profile across different types of intelligence.",
          domains: [
            {
              name: "Analytical Intelligence",
              score: 0.68,
              description: "Your ability to solve problems, analyze information and think critically."
            },
            {
              name: "Emotional Intelligence",
              score: 0.72,
              description: "Your ability to understand and manage emotions, both yours and others'."
            }
          ]
        },
        intelligenceScore: 65,
        emotionalIntelligenceScore: 72,
        cognitiveStyle: "Balanced Thinker",
        valueSystem: ["Growth", "Connection", "Understanding"],
        motivators: ["Learning new things", "Helping others", "Personal development"],
        inhibitors: ["Self-doubt", "Perfectionism"],
        weaknesses: ["May overthink decisions", "Could struggle with setting boundaries"],
        growthAreas: ["Developing more confidence in decisions", "Finding balance between analysis and action"],
        relationshipPatterns: {
          strengths: ["Tends to be supportive", "Values deep connections"],
          challenges: ["May avoid conflict", "Could struggle with setting boundaries"],
          compatibleTypes: ["Independent thinkers", "Growth-oriented individuals"]
        },
        careerSuggestions: ["Roles requiring analytical thinking", "Positions involving helping others", "Creative problem-solving careers"],
        learningPathways: ["Structured learning with practical applications", "Collaborative learning environments"],
        roadmap: "Focus on developing confidence in your decisions while maintaining your analytical strengths. Your natural empathy makes you well-suited for roles where understanding others is important."
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
        roadmap: ""
      };
    }
  };

  return {
    isAnalyzing,
    analyzeResponses
  };
};
