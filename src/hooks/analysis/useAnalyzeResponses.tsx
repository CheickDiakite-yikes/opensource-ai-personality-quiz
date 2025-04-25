
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
    const toastId = "analysis-toast";
    toast.loading("Preparing your analysis...", { id: toastId, duration: 5000 });

    try {
      // Generate a unique assessment ID
      const assessmentId = `assessment-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      
      // Save responses to localStorage
      saveAssessmentToStorage(responses);
      console.log(`Saved ${responses.length} responses to localStorage`);
      
      toast.loading("Analyzing your responses with advanced AI...", { 
        id: toastId,
        duration: 60000
      });
      
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
        } catch (err) {
          console.error("Error saving assessment:", err);
          // Continue with analysis even if saving fails
        }
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
            toast.loading(`Retry ${retryCount}/${MAX_RETRIES}: Analyzing your responses with advanced AI...`, { 
              id: toastId,
              duration: 60000
            });
            // Exponential backoff
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
          }

          console.time(`analyze-responses-call-${retryCount}`);
          
          // Create a timeout promise
          const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => {
              reject(new Error(`Analysis request timed out after ${functionTimeout/1000} seconds`));
            }, functionTimeout);
          });
          
          // Call direct deep-insight-analysis function for better results
          console.log(`Calling deep-insight-analysis function with ${responses.length} responses`);
          
          const functionPromise = supabase.functions.invoke("deep-insight-analysis", {
            body: { 
              responses: responses.reduce((acc: Record<string, string>, curr) => {
                // Combine question ID with response content for better analysis
                const responseText = curr.customResponse || curr.selectedOption || "";
                if (responseText.trim()) {
                  acc[curr.questionId] = responseText;
                }
                return acc;
              }, {}),
              assessmentId
            }
          });
          
          // Race between function call and timeout
          result = await Promise.race([functionPromise, timeoutPromise]);
          console.timeEnd(`analyze-responses-call-${retryCount}`);
          
          // Properly validate the response before proceeding
          if (!result) {
            throw new Error("Empty response from deep-insight-analysis function");
          }
          
          if (result.error) {
            throw new Error(`Function error: ${result.error}`);
          }
          
          // Check for the expected response structure
          console.log("Function returned data structure:", Object.keys(result).join(', '));
          
          // Check if we have core_traits and cognitive_patterning with proper casing
          if (!result.core_traits || !result.cognitive_patterning || 
              (!result.cognitive_patterning.decisionMaking && !result.cognitive_patterning.decision_making)) {
            console.error("Invalid response structure - missing expected fields or incorrect casing");
            console.log("Response example:", JSON.stringify(result).substring(0, 500) + "...");
            throw new Error("Invalid or incomplete analysis response");
          }
          
          console.log(`Analysis successful on attempt ${retryCount+1}`);
          toast.success("Analysis complete!", { 
            id: toastId, 
            description: "Your personality profile is ready" 
          });
          break;
        } catch (error) {
          lastError = error;
          console.error(`Analysis attempt ${retryCount+1} failed:`, error);
          
          if (retryCount === MAX_RETRIES) {
            // All retries exhausted
            console.error(`All ${MAX_RETRIES+1} attempts failed. Last error:`, error);
            toast.error("Analysis failed after multiple attempts", { 
              id: toastId,
              description: "Falling back to alternative analysis"
            });
            throw error;
          }
        }
      }
      
      if (!result) {
        throw new Error("Failed to get valid analysis after all attempts");
      }
      
      // Create the final analysis object
      const timestamp = new Date().toISOString();
      const analysisId = `analysis-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      
      // Transform API response to PersonalityAnalysis format
      const analysis: PersonalityAnalysis = {
        id: analysisId,
        createdAt: timestamp,
        assessmentId: assessmentId,
        userId: user?.id,
        
        // Core content - handle both camelCase and snake_case properties for resilience
        overview: result.overview || "Analysis overview is being processed.",
        traits: transformTraits(result),
        intelligence: {
          type: "Comprehensive Intelligence",
          score: result.intelligence_score || 75,
          description: "A complete assessment of cognitive capabilities across multiple dimensions.",
          domains: [
            {
              name: "Analytical Intelligence",
              score: result.intelligence_score ? result.intelligence_score / 100 : 0.75,
              description: "Ability to analyze information, solve problems, and think critically."
            },
            {
              name: "Emotional Intelligence",
              score: result.emotional_intelligence_score ? result.emotional_intelligence_score / 100 : 0.70,
              description: "Ability to understand and manage emotions, both personal and interpersonal."
            }
          ]
        },
        intelligenceScore: result.intelligence_score || 75,
        emotionalIntelligenceScore: result.emotional_intelligence_score || 70,
        
        // Extract cognitive style from analysis
        cognitiveStyle: getCognitiveStyle(result),
        
        // Extract value system and motivators
        valueSystem: extractValueSystem(result),
        motivators: extractMotivators(result),
        inhibitors: extractInhibitors(result),
        
        // Extract weaknesses and shadow aspects
        weaknesses: extractWeaknesses(result),
        
        // Extract growth areas
        growthAreas: extractGrowthAreas(result),
        
        // Extract relationship patterns
        relationshipPatterns: extractRelationshipPatterns(result),
        
        // Extract career suggestions
        careerSuggestions: extractCareerSuggestions(result),
        
        // Extract learning pathways
        learningPathways: extractLearningPathways(result),
        
        // Generate a roadmap
        roadmap: generateRoadmap(result)
      };
      
      // Add user ID to the analysis if user is logged in
      if (user) {
        // Save analysis to Supabase with enhanced error handling
        try {
          console.log("Saving analysis to Supabase with ID:", analysisId);
          
          // Create a clean insert object that is JSON-compatible
          // Convert all complex objects to JSON strings to ensure compatibility with the database
          const insertObject = {
            id: analysisId,
            user_id: user.id,
            assessment_id: assessmentId,
            result: result,
            overview: analysis.overview,
            traits: JSON.parse(JSON.stringify(analysis.traits || [])),
            intelligence: JSON.parse(JSON.stringify(analysis.intelligence || {})),
            intelligence_score: analysis.intelligenceScore || 0,
            emotional_intelligence_score: analysis.emotionalIntelligenceScore || 0,
            cognitive_style: JSON.parse(JSON.stringify(analysis.cognitiveStyle || {})),
            value_system: JSON.parse(JSON.stringify(analysis.valueSystem || [])),
            motivators: JSON.parse(JSON.stringify(analysis.motivators || [])),
            inhibitors: JSON.parse(JSON.stringify(analysis.inhibitors || [])),
            weaknesses: JSON.parse(JSON.stringify(analysis.weaknesses || [])),
            growth_areas: JSON.parse(JSON.stringify(analysis.growthAreas || [])),
            relationship_patterns: JSON.parse(JSON.stringify(analysis.relationshipPatterns || null)),
            career_suggestions: JSON.parse(JSON.stringify(analysis.careerSuggestions || [])),
            learning_pathways: JSON.parse(JSON.stringify(analysis.learningPathways || [])),
            roadmap: analysis.roadmap || ""
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
                console.log("Successfully saved analysis to Supabase with ID:", analysisId);
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
        }
      }
      
      // Save to history and update the current analysis
      console.log("Saving analysis to local history");
      const savedAnalysis = saveToHistory(analysis);
      setAnalysis(savedAnalysis);
      
      toast.success("Your personality profile is ready!", {
        description: "Explore your comprehensive analysis"
      });
      
      return savedAnalysis;
    } catch (error) {
      console.error("Error analyzing responses:", error);
      toast.error(`Analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`, {
        id: toastId,
        description: "Creating fallback analysis instead"
      });
      
      // Generate a more detailed fallback analysis
      const fallbackAnalysis = await generateFallbackAnalysis(responses);
      const savedAnalysis = saveToHistory(fallbackAnalysis);
      setAnalysis(savedAnalysis);
      
      toast.success("Analysis completed!", { 
        description: "Your personality profile is available" 
      });
      
      return savedAnalysis;
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Helper functions for transforming API response to our format
  
  function transformTraits(result: any): any[] {
    const traits = [];
    
    // Primary trait from core_traits
    if (result.core_traits && result.core_traits.primary) {
      traits.push({
        trait: "Primary Trait",
        score: 0.9,
        description: result.core_traits.primary,
        strengths: extractStrengths(result),
        challenges: extractChallenges(result),
        growthSuggestions: extractGrowthSuggestions(result)
      });
    }
    
    // Secondary trait
    if (result.core_traits && result.core_traits.secondary) {
      traits.push({
        trait: "Secondary Trait",
        score: 0.85,
        description: result.core_traits.secondary,
        strengths: [],
        challenges: [],
        growthSuggestions: []
      });
    }
    
    // Add cognitive traits
    if (result.cognitive_patterning) {
      const cp = result.cognitive_patterning;
      
      // Handle both camelCase and snake_case property names
      const decisionMaking = cp.decisionMaking || cp.decision_making;
      const learningStyle = cp.learningStyle || cp.learning_style;
      const problemSolving = cp.problemSolving || cp.problem_solving;
      
      if (decisionMaking) {
        traits.push({
          trait: "Decision-Making Approach",
          score: 0.8,
          description: decisionMaking,
          strengths: [],
          challenges: [],
          growthSuggestions: []
        });
      }
      
      if (learningStyle) {
        traits.push({
          trait: "Learning Style",
          score: 0.75,
          description: learningStyle,
          strengths: [],
          challenges: [],
          growthSuggestions: []
        });
      }
      
      if (problemSolving) {
        traits.push({
          trait: "Problem-Solving Approach",
          score: 0.82,
          description: problemSolving,
          strengths: [],
          challenges: [],
          growthSuggestions: []
        });
      }
    }
    
    // Add emotional traits
    if (result.emotional_architecture) {
      const ea = result.emotional_architecture;
      
      // Handle both camelCase and snake_case property names
      const emotionalAwareness = ea.emotionalAwareness || ea.emotional_awareness;
      const regulationStyle = ea.regulationStyle || ea.regulation_style;
      
      if (emotionalAwareness) {
        traits.push({
          trait: "Emotional Awareness",
          score: 0.78,
          description: emotionalAwareness,
          strengths: [],
          challenges: [],
          growthSuggestions: []
        });
      }
      
      if (regulationStyle) {
        traits.push({
          trait: "Emotional Regulation",
          score: 0.76,
          description: regulationStyle,
          strengths: [],
          challenges: [],
          growthSuggestions: []
        });
      }
    }
    
    return traits;
  }
  
  function extractStrengths(result: any): string[] {
    if (result.core_traits && Array.isArray(result.core_traits.strengths)) {
      return result.core_traits.strengths;
    }
    return ["Adaptability", "Critical thinking", "Pattern recognition"];
  }
  
  function extractChallenges(result: any): string[] {
    if (result.core_traits && Array.isArray(result.core_traits.challenges)) {
      return result.core_traits.challenges;
    }
    return ["May overthink decisions", "Could be perfectionist at times"];
  }
  
  function extractGrowthSuggestions(result: any): string[] {
    if (result.growth_potential) {
      const gp = result.growth_potential;
      const suggestions = [];
      
      if (typeof gp.growthExercises === 'string') {
        suggestions.push(gp.growthExercises);
      } else if (typeof gp.growth_exercises === 'string') {
        suggestions.push(gp.growth_exercises);
      }
      
      if (Array.isArray(gp.recommendations)) {
        return [...suggestions, ...gp.recommendations];
      }
      
      return suggestions.length ? suggestions : ["Practice mindfulness", "Engage in reflective writing"];
    }
    
    return ["Practice mindfulness", "Develop active listening skills"];
  }
  
  function getCognitiveStyle(result: any): string {
    if (result.cognitive_patterning) {
      const cp = result.cognitive_patterning;
      if ((cp.decisionMaking || cp.decision_making || "").toLowerCase().includes("analytical")) {
        return "Analytical Thinker";
      } else if ((cp.decisionMaking || cp.decision_making || "").toLowerCase().includes("intuit")) {
        return "Intuitive Thinker";
      } else if ((cp.problemSolving || cp.problem_solving || "").toLowerCase().includes("creativ")) {
        return "Creative Problem-Solver";
      }
    }
    
    return "Balanced Thinker";
  }
  
  function extractValueSystem(result: any): string[] {
    if (result.core_values && Array.isArray(result.core_values)) {
      return result.core_values;
    }
    
    // Extract from overview if available
    if (result.overview) {
      const valueKeywords = ["value", "values", "believe", "believes", "important"];
      const valueMatches = valueKeywords.some(keyword => result.overview.toLowerCase().includes(keyword));
      
      if (valueMatches) {
        return ["Growth", "Understanding", "Connection"];
      }
    }
    
    return ["Authenticity", "Growth", "Balance"];
  }
  
  function extractMotivators(result: any): string[] {
    if (result.motivational_profile && Array.isArray(result.motivational_profile.primaryDrivers)) {
      return result.motivational_profile.primaryDrivers;
    }
    
    if (result.complete_analysis && 
        result.complete_analysis.motivationalProfile && 
        Array.isArray(result.complete_analysis.motivationalProfile.primaryDrivers)) {
      return result.complete_analysis.motivationalProfile.primaryDrivers;
    }
    
    return ["Learning and growth", "Making meaningful connections", "Achieving goals"];
  }
  
  function extractInhibitors(result: any): string[] {
    if (result.motivational_profile && Array.isArray(result.motivational_profile.inhibitors)) {
      return result.motivational_profile.inhibitors;
    }
    
    if (result.complete_analysis && 
        result.complete_analysis.motivationalProfile && 
        Array.isArray(result.complete_analysis.motivationalProfile.inhibitors)) {
      return result.complete_analysis.motivationalProfile.inhibitors;
    }
    
    return ["Self-doubt", "Perfectionism"];
  }
  
  function extractWeaknesses(result: any): string[] {
    if (result.core_traits && Array.isArray(result.core_traits.challenges)) {
      return result.core_traits.challenges;
    }
    
    return ["May overthink decisions", "Could struggle with uncertainty"];
  }
  
  function extractGrowthAreas(result: any): string[] {
    if (result.growth_potential && Array.isArray(result.growth_potential.developmentalAreas)) {
      return result.growth_potential.developmentalAreas;
    }
    
    if (result.growth_potential && Array.isArray(result.growth_potential.development_areas)) {
      return result.growth_potential.development_areas;
    }
    
    if (result.growth_potential && typeof result.growth_potential.developmentalPath === 'string') {
      return [result.growth_potential.developmentalPath];
    }
    
    if (result.growth_potential && typeof result.growth_potential.developmental_path === 'string') {
      return [result.growth_potential.developmental_path];
    }
    
    return ["Balancing analysis with intuition", "Developing emotional resilience"];
  }
  
  function extractRelationshipPatterns(result: any): string[] {
    if (result.interpersonal_dynamics) {
      const id = result.interpersonal_dynamics;
      const patterns = [];
      
      if (id.attachmentStyle || id.attachment_style) {
        patterns.push(id.attachmentStyle || id.attachment_style);
      }
      
      if (id.communicationPattern || id.communication_pattern) {
        patterns.push(id.communicationPattern || id.communication_pattern);
      }
      
      return patterns.length ? patterns : ["Values authentic connections", "Communicates directly"];
    }
    
    return ["Values authentic connections", "Communicates directly"];
  }
  
  function extractCareerSuggestions(result: any): string[] {
    if (result.complete_analysis && 
        result.complete_analysis.careerInsights && 
        Array.isArray(result.complete_analysis.careerInsights.careerPathways)) {
      return result.complete_analysis.careerInsights.careerPathways;
    }
    
    return ["Roles requiring analytical thinking", "Positions involving problem-solving", "Careers with learning opportunities"];
  }
  
  function extractLearningPathways(result: any): string[] {
    if (result.cognitive_patterning) {
      const cp = result.cognitive_patterning;
      const learningStyle = cp.learningStyle || cp.learning_style || "";
      
      if (learningStyle.toLowerCase().includes("visual")) {
        return ["Visual learning resources", "Diagram-based education"];
      } else if (learningStyle.toLowerCase().includes("auditory")) {
        return ["Audio lectures", "Discussion-based learning"];
      } else if (learningStyle.toLowerCase().includes("kinesthetic")) {
        return ["Hands-on workshops", "Interactive learning experiences"];
      }
    }
    
    return ["Structured learning with practice", "Concept-based education"];
  }
  
  function generateRoadmap(result: any): string {
    if (result.growth_potential) {
      const gp = result.growth_potential;
      
      if (typeof gp.developmentalPath === 'string') {
        return gp.developmentalPath;
      }
      
      if (typeof gp.developmental_path === 'string') {
        return gp.developmental_path;
      }
    }
    
    return "Focus on leveraging your analytical strengths while developing emotional awareness. Seek opportunities that challenge your problem-solving abilities while providing opportunities for personal growth.";
  }

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
        overview: `This analysis is based on your ${responses.length} responses, with focus areas in ${topCategories.join(", ")}. Your responses were generally ${responseQuality}. You demonstrate an analytical thinking style balanced with emotional awareness, making you adaptable to different situations. Your problem-solving approach combines systematic thinking with creative elements, allowing you to find effective solutions. You show capacity for both independent work and collaborative engagement, with a communication style that values clarity and authenticity.`,
        traits: [
          {
            trait: "Analytical Thinking",
            score: 0.75,
            description: "You show a tendency to analyze situations carefully before making decisions. This analytical approach helps you understand complex situations and find logical solutions. You likely appreciate having all relevant information before proceeding, and you're skilled at identifying patterns and connections that others might miss. This trait serves you well in problem-solving contexts and when critical thinking is required.",
            strengths: ["Problem solving", "Critical thinking", "Attention to detail", "Logical reasoning", "Pattern recognition"],
            challenges: ["May overthink simple situations", "Could take longer to decide", "Might occasionally miss intuitive insights"],
            growthSuggestions: ["Practice balancing analysis with intuition", "Set time limits for decisions", "Develop comfort with occasional ambiguity", "Trust your initial judgments more often"]
          },
          {
            trait: "Adaptability",
            score: 0.7,
            description: "You demonstrate ability to adjust to new situations and changing environments. Your adaptability allows you to navigate uncertainty with relative ease, making you resilient in the face of change. You can shift approaches when needed and find new pathways forward when obstacles arise. This flexibility is a valuable trait in today's rapidly changing world, enabling you to thrive amid transitions and unexpected developments.",
            strengths: ["Flexibility", "Resilience", "Open to new experiences", "Comfortable with change", "Quick to learn new approaches"],
            challenges: ["May sometimes feel uncomfortable with rapid change", "Might need time to process transitions", "Could occasionally resist very significant changes"],
            growthSuggestions: ["Embrace uncertainty as opportunity", "Practice mindfulness during transitions", "Develop routines that provide stability during change", "Reflect on past successful adaptations"]
          },
          {
            trait: "Empathy",
            score: 0.8,
            description: "You show strong ability to understand and share feelings of others. Your empathetic nature allows you to connect deeply with people and understand their perspectives. You likely pick up on emotional cues and can sense when others are experiencing difficulties, even when not explicitly stated. This emotional intelligence strengthens your relationships and makes you someone others trust and confide in.",
            strengths: ["Strong listening skills", "Building rapport", "Understanding others' perspectives", "Creating safe spaces for others", "Emotional support"],
            challenges: ["May take on others' emotional burdens", "Could be affected by negative environments", "Might prioritize others' needs over your own"],
            growthSuggestions: ["Practice emotional boundaries", "Balance empathy with self-care", "Develop techniques to reset after emotionally demanding interactions", "Schedule regular personal renewal activities"]
          }
        ],
        intelligence: {
          type: "Balanced Intelligence",
          score: 0.65,
          description: "You demonstrate a balanced profile across different types of intelligence, with strengths in both analytical and emotional domains. This balanced approach allows you to engage with both logical and interpersonal challenges effectively.",
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
        valueSystem: ["Growth", "Connection", "Understanding", "Balance", "Authenticity"],
        motivators: ["Learning new things", "Helping others", "Personal development", "Making meaningful connections", "Achieving goals"],
        inhibitors: ["Self-doubt", "Perfectionism", "Overthinking", "Occasional indecisiveness"],
        weaknesses: ["May overthink decisions", "Could struggle with setting boundaries", "Might hesitate when quick action is needed", "Occasional difficulty with very structured environments"],
        growthAreas: ["Developing more confidence in decisions", "Finding balance between analysis and action", "Setting clearer boundaries", "Embracing occasional uncertainty", "Trusting intuitive insights more readily"],
        relationshipPatterns: ["Tends to be supportive and empathetic", "Values deep connections over many superficial ones", "Communicates openly but carefully", "Seeks balance and harmony in relationships", "Prefers authenticity over social performance"],
        careerSuggestions: ["Roles requiring analytical thinking", "Positions involving helping others", "Creative problem-solving careers", "Research-oriented positions", "Advisory or consulting roles", "Environments that value both logic and empathy"],
        learningPathways: ["Structured learning with practical applications", "Collaborative learning environments", "Concept-based education that connects to real-world impact", "Learning approaches that balance theory with practice", "Environments that encourage questioning and exploration"],
        roadmap: "Focus on developing confidence in your decisions while maintaining your analytical strengths. Your natural empathy makes you well-suited for roles where understanding others is important. Work on establishing clearer boundaries to prevent taking on others' emotional burdens. Seek environments that value both your analytical abilities and your interpersonal skills, as you thrive when both aspects of your intelligence are engaged. Develop practices to manage overthinking, such as setting time limits for decisions or using structured decision frameworks. Your growth path involves balancing your careful, thoughtful approach with more decisive action when appropriate."
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
        relationshipPatterns: [],
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
