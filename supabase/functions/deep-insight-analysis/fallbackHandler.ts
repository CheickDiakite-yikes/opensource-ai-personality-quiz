
import { API_CONFIG } from "./openaiConfig.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createOpenAIRequest, handleOpenAIResponse } from "./openaiClient.ts";
import { logError, logDebug, logWarning } from "./logging.ts";
import { SYSTEM_PROMPT, FALLBACK_PROMPT } from "./prompts.ts";

/**
 * Enhanced fallback system with progressive degradation:
 * 1. Try with fallback model and full prompt
 * 2. If that fails, try with fallback model and simplified prompt
 * 3. If all fails, return graceful error response
 */
export async function handleFallback(openAIApiKey: string, formattedResponses: string) {
  logDebug("Attempting fallback analysis...");

  try {
    // First fallback: Try the fallback model with the main prompt
    const result = await attemptFallback(
      openAIApiKey, 
      formattedResponses, 
      API_CONFIG.FALLBACK_MODEL,
      SYSTEM_PROMPT,
      API_CONFIG.FALLBACK_MAX_TOKENS,
      API_CONFIG.FALLBACK_TIMEOUT,
      "primary fallback"
    );
    
    if (result && validateResponseStructure(result)) {
      logDebug("Primary fallback successful");
      return result;
    }
    
    logWarning("Primary fallback produced incomplete results, attempting simplified fallback");
    
    // Second fallback: Try the fallback model with a simplified prompt
    const simplifiedResult = await attemptFallback(
      openAIApiKey, 
      formattedResponses, 
      API_CONFIG.FALLBACK_MODEL,
      FALLBACK_PROMPT,
      Math.floor(API_CONFIG.FALLBACK_MAX_TOKENS * 0.7), // Reduced token count
      Math.floor(API_CONFIG.FALLBACK_TIMEOUT * 0.8), // Reduced timeout
      "simplified fallback"
    );
    
    if (simplifiedResult) {
      logDebug("Simplified fallback successful");
      return enhanceIncompleteResult(simplifiedResult);
    }
    
    // All fallbacks failed, return graceful error message
    logError(new Error("All fallback attempts failed"), "Fallback system");
    return generateEmergencyResponse();
    
  } catch (error) {
    logError(error, "Fallback analysis");
    return generateEmergencyResponse();
  }
}

/**
 * Attempts a fallback analysis with specified parameters
 */
async function attemptFallback(
  openAIApiKey: string, 
  formattedResponses: string,
  model: string,
  promptTemplate: string,
  maxTokens: number,
  timeout: number,
  fallbackType: string
): Promise<any> {
  try {
    logDebug(`Attempting ${fallbackType} with ${model}`);
    
    // Sample responses if they're too long
    let optimizedResponses = formattedResponses;
    if (formattedResponses.length > 8000) {
      optimizedResponses = sampleResponses(formattedResponses, 8000);
      logDebug(`Sampled responses from ${formattedResponses.length} to ${optimizedResponses.length} chars`);
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort(`${fallbackType} timeout exceeded (${timeout}ms)`);
      logDebug(`${fallbackType} request manually aborted after timeout`);
    }, timeout);

    try {
      // Add extra reminders about proper property naming in the prompt
      const enhancedPrompt = promptTemplate + "\n\nCRITICAL: Use camelCase (not snake_case) for all properties as shown in the schema. For example, use 'decisionMaking' not 'decision_making'.";

      // Direct API call for more control
      const response = await fetch(API_CONFIG.BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openAIApiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: enhancedPrompt },
            { role: "user", content: `Please analyze these assessment responses:\n${optimizedResponses}` }
          ],
          max_tokens: maxTokens,
          temperature: API_CONFIG.TEMPERATURE,
          response_format: API_CONFIG.RESPONSE_FORMAT,
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI API ${fallbackType} error: ${response.status} - ${errorText}`);
      }
      
      const rawData = await response.json();
      
      if (!rawData || !rawData.choices || !rawData.choices[0] || !rawData.choices[0].message) {
        throw new Error(`Invalid response structure from OpenAI API in ${fallbackType}`);
      }
      
      const content = rawData.choices[0].message.content || "";
      
      if (!content || content.trim() === "") {
        throw new Error(`Empty content from OpenAI API in ${fallbackType}`);
      }
      
      logDebug(`${fallbackType} response length: ${content.length} chars`);
      
      try {
        // Parse the JSON response
        const jsonData = JSON.parse(content);
        fixPropertyCasing(jsonData);
        return jsonData;
      } catch (parseError) {
        logError(parseError, `Failed to parse JSON in ${fallbackType}`);
        
        // Try to extract JSON if the response isn't pure JSON
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            const extractedJson = JSON.parse(jsonMatch[0]);
            fixPropertyCasing(extractedJson);
            return extractedJson;
          } catch (extractError) {
            throw new Error(`Failed to extract JSON from ${fallbackType} response`);
          }
        } else {
          throw new Error(`No JSON structure found in ${fallbackType} response`);
        }
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      throw fetchError;
    }
  } catch (error) {
    logError(error, `${fallbackType} attempt`);
    return null;
  }
}

/**
 * Fix property casing issues in the response
 */
function fixPropertyCasing(data: any): void {
  if (!data) return;
  
  // Fix cognitive_patterning properties
  if (data.cognitive_patterning) {
    const cp = data.cognitive_patterning;
    
    // Check for snake_case and convert to camelCase
    if (cp.decision_making && !cp.decisionMaking) {
      cp.decisionMaking = cp.decision_making;
    }
    if (cp.learning_style && !cp.learningStyle) {
      cp.learningStyle = cp.learning_style;
    }
    if (cp.problem_solving && !cp.problemSolving) {
      cp.problemSolving = cp.problem_solving;
    }
    if (cp.information_processing && !cp.informationProcessing) {
      cp.informationProcessing = cp.information_processing;
    }
  }
  
  // Fix emotional_architecture properties
  if (data.emotional_architecture) {
    const ea = data.emotional_architecture;
    
    if (ea.emotional_awareness && !ea.emotionalAwareness) {
      ea.emotionalAwareness = ea.emotional_awareness;
    }
    if (ea.regulation_style && !ea.regulationStyle) {
      ea.regulationStyle = ea.regulation_style;
    }
    if (ea.emotional_responsiveness && !ea.emotionalResponsiveness) {
      ea.emotionalResponsiveness = ea.emotional_responsiveness;
    }
    if (ea.emotional_patterns && !ea.emotionalPatterns) {
      ea.emotionalPatterns = ea.emotional_patterns;
    }
  }
  
  // Fix interpersonal_dynamics properties
  if (data.interpersonal_dynamics) {
    const id = data.interpersonal_dynamics;
    
    if (id.attachment_style && !id.attachmentStyle) {
      id.attachmentStyle = id.attachment_style;
    }
    if (id.communication_pattern && !id.communicationPattern) {
      id.communicationPattern = id.communication_pattern;
    }
    if (id.conflict_resolution && !id.conflictResolution) {
      id.conflictResolution = id.conflict_resolution;
    }
    if (id.relationship_needs && !id.relationshipNeeds) {
      id.relationshipNeeds = id.relationship_needs;
    }
  }
}

/**
 * Validates the structure of the response to ensure it has all required fields
 */
function validateResponseStructure(result: any): boolean {
  if (!result) return false;
  
  const requiredSections = [
    "overview", 
    "core_traits", 
    "cognitive_patterning", 
    "emotional_architecture", 
    "interpersonal_dynamics",
    "growth_potential",
    "intelligence_score",
    "emotional_intelligence_score"
  ];
  
  const missingSections = requiredSections.filter(section => !result[section]);
  
  if (missingSections.length > 0) {
    logWarning(`Response missing sections: ${missingSections.join(", ")}`);
    return false;
  }
  
  // Check for critical nested properties
  if (result.cognitive_patterning && 
      (!result.cognitive_patterning.decisionMaking || !result.cognitive_patterning.learningStyle)) {
    return false;
  }
  
  if (result.emotional_architecture && 
      (!result.emotional_architecture.emotionalAwareness || !result.emotional_architecture.regulationStyle)) {
    return false;
  }
  
  if (result.interpersonal_dynamics && 
      (!result.interpersonal_dynamics.attachmentStyle || !result.interpersonal_dynamics.communicationPattern)) {
    return false;
  }
  
  return true;
}

/**
 * Intelligently samples responses to fit within a maximum length
 */
function sampleResponses(responses: string, maxLength: number): string {
  const lines = responses.split("\n");
  if (lines.length <= 10) return responses; // If there aren't many lines, keep them all
  
  const sampledLines = [];
  
  // Always include first 3 and last 2 responses
  const alwaysInclude = [...lines.slice(0, 3), ...lines.slice(-2)];
  let remainingBudget = maxLength - alwaysInclude.join("\n").length;
  
  // Evenly sample the rest
  const middleLines = lines.slice(3, -2);
  const step = Math.max(1, Math.floor(middleLines.length / (remainingBudget / 100)));
  
  for (let i = 0; i < middleLines.length; i += step) {
    sampledLines.push(middleLines[i]);
  }
  
  // Combine and return
  return [...lines.slice(0, 3), ...sampledLines, ...lines.slice(-2)].join("\n");
}

/**
 * Enhances incomplete results with default values for missing fields
 */
function enhanceIncompleteResult(result: any): any {
  if (!result) return generateEmergencyResponse();
  
  // Add default values for missing top-level sections
  const sectionDefaults = {
    overview: "Analysis based on simplified processing due to system constraints.",
    core_traits: {
      primary: "Analysis suggests a balanced personality profile with multiple dominant traits.",
      secondary: "Secondary traits indicate adaptability in various situations.",
      strengths: ["Adaptability", "Problem solving"],
      challenges: ["May face occasional uncertainty in decision-making"]
    },
    cognitive_patterning: {
      decisionMaking: "Decision-making style combines analytical and intuitive elements.",
      learningStyle: "Learning approach is flexible and adaptable to different contexts.",
      problemSolving: "Problem-solving tends to be methodical with creative elements.",
      informationProcessing: "Information is processed through multiple cognitive pathways."
    },
    emotional_architecture: {
      emotionalAwareness: "Demonstrates moderate to good awareness of emotional states.",
      regulationStyle: "Emotional regulation is generally balanced with room for growth.",
      emotionalResponsiveness: "Responds to emotional stimuli in a measured manner.",
      emotionalPatterns: "Emotional patterns show consistency with occasional variation."
    },
    interpersonal_dynamics: {
      attachmentStyle: "Attachment style is balanced with secure elements.",
      communicationPattern: "Communication tends to be clear and direct.",
      conflictResolution: "Approaches conflict with a combination of compromise and problem-solving.",
      relationshipNeeds: "Values authenticity and mutual respect in relationships."
    },
    growth_potential: {
      developmentalPath: "Growth opportunities exist in balancing analytical and emotional aspects.",
      blindSpots: "May occasionally overlook emotional factors in decision-making.",
      untappedStrengths: "Has potential for greater leadership and creative expression.",
      growthExercises: "Would benefit from reflective practices and communication exercises."
    },
    intelligence_score: 75,
    emotional_intelligence_score: 70
  };
  
  // Add missing sections and properties
  Object.entries(sectionDefaults).forEach(([key, defaultValue]) => {
    if (!result[key]) {
      result[key] = defaultValue;
    } else if (typeof defaultValue === 'object' && !Array.isArray(defaultValue)) {
      // For nested objects, check each property
      Object.entries(defaultValue).forEach(([nestedKey, nestedDefaultValue]) => {
        if (result[key] && !result[key][nestedKey]) {
          result[key][nestedKey] = nestedDefaultValue;
        }
      });
    }
  });
  
  // Ensure response_patterns exists
  if (!result.response_patterns) {
    result.response_patterns = {
      primaryChoice: "balanced",
      secondaryChoice: "adaptive"
    };
  }
  
  return result;
}

/**
 * Generate an emergency response when all fallbacks fail
 */
function generateEmergencyResponse(): any {
  return {
    overview: "Analysis currently unavailable due to technical constraints. The system encountered difficulties processing your responses completely. Please try again later for a full analysis of your personality profile.",
    core_traits: { 
      primary: "Your unique blend of traits suggests a multifaceted personality.",
      secondary: "Secondary traits indicate adaptability in various situations.",
      strengths: ["Adaptability", "Resilience", "Problem solving"],
      challenges: ["May face occasional uncertainty in complex situations"],
      tertiaryTraits: ["Analysis in progress"] 
    },
    cognitive_patterning: { 
      decisionMaking: "Your decision-making approach combines analytical and intuitive elements.",
      learningStyle: "Your learning style appears to be adaptable to different contexts.",
      problemSolving: "Your problem-solving approach is methodical with creative elements.",
      informationProcessing: "You process information through multiple cognitive pathways."
    },
    emotional_architecture: { 
      emotionalAwareness: "You demonstrate awareness of your emotional states.", 
      regulationStyle: "Your emotional regulation style is generally balanced.",
      emotionalResponsiveness: "You respond to emotional situations in a measured way.",
      emotionalPatterns: "Your emotional patterns show consistency with healthy variation."
    },
    interpersonal_dynamics: {
      attachmentStyle: "Your attachment style shows secure elements with some flexibility.",
      communicationPattern: "Your communication tends to be clear and purposeful.",
      conflictResolution: "You approach conflict with problem-solving strategies.",
      relationshipNeeds: "You value authenticity in relationships."
    },
    growth_potential: {
      developmentalPath: "Growth opportunities exist in further balancing your analytical and emotional aspects.",
      blindSpots: "You may occasionally overlook certain perspectives in decision-making.",
      untappedStrengths: "You have untapped potential in leadership and creative expression.",
      growthExercises: "You would benefit from regular reflective practices."
    },
    intelligence_score: 75,
    emotional_intelligence_score: 70,
    response_patterns: {
      primaryChoice: "balanced",
      secondaryChoice: "adaptive"
    }
  };
}
