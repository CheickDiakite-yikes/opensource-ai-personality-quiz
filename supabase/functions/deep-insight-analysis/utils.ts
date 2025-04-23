
import { logDebug, logError } from "./logging.ts";

/**
 * A robust function to clean and parse JSON from OpenAI responses
 * Handles various edge cases including markdown code blocks, single quotes,
 * unquoted property names, and other common JSON formatting issues
 */
export async function cleanAndParseJSON(rawContent: string): Promise<any> {
  logDebug("Starting advanced JSON cleaning and parsing process");
  
  // Remove any markdown code block formatting
  let jsonString = rawContent.trim();
  
  try {
    // First try direct parsing - maybe it's already valid JSON
    try {
      return JSON.parse(jsonString);
    } catch (directError) {
      logDebug("Direct JSON parse failed, attempting cleanup");
    }
    
    // Extract JSON from code blocks if present
    if (jsonString.includes("```")) {
      logDebug("Detected code blocks in response");
      const jsonBlockMatch = jsonString.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonBlockMatch && jsonBlockMatch[1]) {
        jsonString = jsonBlockMatch[1].trim();
        logDebug("Extracted content from code block");
      }
    }
    
    // Attempt to parse at this stage
    try {
      return JSON.parse(jsonString);
    } catch (blockError) {
      logDebug("Code block JSON parse failed, attempting more aggressive cleanup");
    }
    
    // Apply comprehensive JSON cleaning
    logDebug("Starting comprehensive JSON sanitization");
    
    // 1. Normalize string by replacing any unusual quotes or whitespace
    jsonString = jsonString.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
    
    // 2. Replace single-quoted property names with double quotes
    jsonString = jsonString.replace(/'([^']+?)'\s*:/g, '"$1":');
    
    // 3. Replace unquoted property names with double quotes (handles alphanumeric and underscores)
    jsonString = jsonString.replace(/([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '"$1":');
    
    // 4. Replace single-quoted string values with double quotes (avoiding apostrophes in words)
    jsonString = jsonString.replace(/:\s*'([^']*)'/g, ': "$1"');
    
    // 5. Fix trailing commas before closing braces and brackets
    jsonString = jsonString.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
    
    // 6. Fix missing commas between properties
    jsonString = jsonString.replace(/}(\s*)"([^"]+)":/g, '},$1"$2":');
    jsonString = jsonString.replace(/](\s*)"([^"]+)":/g, '],$1"$2":');
    
    // 7. Fix JavaScript values not valid in JSON
    jsonString = jsonString
      .replace(/:\s*undefined/g, ': null')
      .replace(/:\s*NaN/g, ': null')
      .replace(/:\s*Infinity/g, ': null');
    
    // 8. Balance brackets if needed
    const openBraces = (jsonString.match(/{/g) || []).length;
    const closeBraces = (jsonString.match(/}/g) || []).length;
    if (openBraces > closeBraces) {
      jsonString += '}';
      logDebug(`Balanced missing closing braces (${openBraces - closeBraces})`);
    }
    
    // 9. Ensure the string starts with a proper JSON object
    if (!jsonString.trim().startsWith('{')) {
      const objectStart = jsonString.indexOf('{');
      if (objectStart > -1) {
        jsonString = jsonString.substring(objectStart);
        logDebug("Trimmed content before first {");
      }
    }

    // 10. Ensure it ends with a proper JSON object close
    const lastBrace = jsonString.lastIndexOf('}');
    if (lastBrace > -1 && lastBrace < jsonString.length - 1) {
      jsonString = jsonString.substring(0, lastBrace + 1);
      logDebug("Trimmed content after last }");
    }
    
    // Try parsing again after cleaning
    try {
      return JSON.parse(jsonString);
    } catch (cleanError) {
      logDebug("Comprehensive cleaning still produced invalid JSON, attempting last resort parsing");
      throw cleanError;
    }
  } catch (error) {
    // Last resort: try to extract any valid JSON object
    logError(error, "JSON parsing process");
    logDebug("Attempting last-resort JSON extraction");
    
    try {
      // Try to find anything that looks like a JSON object
      const objMatch = rawContent.match(/{[\s\S]*}/);
      if (objMatch) {
        const extractedJson = objMatch[0];
        
        // Apply the same cleanups as before to this extracted content
        let finalJson = extractedJson
          .replace(/'([^']+?)'\s*:/g, '"$1":')
          .replace(/([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '"$1":')
          .replace(/:\s*'([^']*)'/g, ': "$1"')
          .replace(/,\s*}/g, '}')
          .replace(/,\s*]/g, ']');
        
        try {
          return JSON.parse(finalJson);
        } catch (finalError) {
          logError(finalError, "All JSON parsing attempts failed");
          
          // Create minimal valid JSON as last resort
          return {
            error: "Parsing failed",
            coreTraits: {
              primary: "Analysis could not be generated due to formatting issues."
            }
          };
        }
      } else {
        throw new Error("Could not find a valid JSON object in the response");
      }
    } catch (extractError) {
      logError(extractError, "All JSON parsing attempts failed");
      throw extractError;
    }
  }
}

/**
 * Helper function to safely get a string from a potentially complex object
 * using dot notation path, with a fallback value if not found
 */
export function getStringSafely(obj: any, path: string, fallback: string = ""): string {
  try {
    const value = path.split('.').reduce((o, key) => o?.[key], obj);
    return typeof value === 'string' ? value : fallback;
  } catch (error) {
    return fallback;
  }
}

/**
 * Helper function to safely get an array from a potentially complex object
 * using dot notation path, with a fallback empty array if not found
 */
export function getArraySafely(obj: any, path: string, minLength: number = 0): string[] {
  try {
    const value = path.split('.').reduce((o, key) => o?.[key], obj);
    if (Array.isArray(value) && value.length >= minLength) {
      // Ensure that all items are strings
      return value.map(item => typeof item === 'string' ? item : 
                              (item === null || item === undefined) ? '' : 
                              (typeof item === 'object') ? JSON.stringify(item) : 
                              String(item));
    }
    // Return a fallback array if the original doesn't meet length requirements
    return Array.isArray(value) ? value.map(v => String(v)) : [];
  } catch (error) {
    return [];
  }
}

/**
 * Validates the structure of the API response against expected schema
 * 
 * @param data The API response data
 * @returns True if valid, false if not
 */
export function validateResponseStructure(data: any): boolean {
  if (!data || typeof data !== 'object') return false;
  
  // Check for required top-level sections
  const requiredSections = [
    'cognitivePatterning', 
    'emotionalArchitecture', 
    'coreTraits',
    'interpersonalDynamics'
  ];
  
  const hasSections = requiredSections.every(section => 
    data.hasOwnProperty(section) && 
    typeof data[section] === 'object' &&
    Object.keys(data[section]).length > 0
  );
  
  return hasSections;
}

/**
 * Generates an overview summary from the analysis content
 * Creates a concise yet comprehensive summary of key personality traits
 */
export function generateOverview(analysisContent: any): string {
  try {
    // Get core traits if available
    const primaryTrait = getStringSafely(analysisContent, 'coreTraits.primary');
    
    // Get cognitive information
    const cognitiveTrait = getStringSafely(
      analysisContent, 
      'cognitivePatterning.decisionMaking',
      'analytical thinking'
    );
    
    // Get emotional information
    const emotionalTrait = getStringSafely(
      analysisContent,
      'emotionalArchitecture.emotionalAwareness',
      'emotional awareness'
    );
    
    // Get strengths
    const strengths = getArraySafely(analysisContent, 'coreTraits.strengths', 2);
    
    // Get motivations
    const motivators = getArraySafely(analysisContent, 'motivationalProfile.primaryDrivers', 1);
    
    // Construct the overview
    let overview = `Your personality profile reveals ${primaryTrait.toLowerCase() || 'a multifaceted individual'} `;
    
    if (strengths.length > 0) {
      overview += `with notable strengths in ${strengths.slice(0, 2).join(' and ').toLowerCase()}. `;
    } else {
      overview += `with a unique combination of traits. `;
    }
    
    overview += `Your cognitive approach tends toward ${cognitiveTrait.toLowerCase()}, `;
    overview += `while your emotional landscape is characterized by ${emotionalTrait.toLowerCase()}. `;
    
    if (motivators.length > 0) {
      overview += `You appear to be primarily motivated by ${motivators[0].toLowerCase()}, `;
    }
    
    overview += `creating a distinctive personality pattern that influences how you approach life's challenges and relationships.`;
    
    return overview;
  } catch (error) {
    return "Your analysis reveals a multifaceted personality with unique strengths and potential growth areas. Your cognitive patterns and emotional responses create a distinctive approach to life's challenges.";
  }
}

/**
 * Function to extract and structure response metrics for improved diagnostics
 * 
 * @param responses The user responses
 * @returns Metrics about the responses
 */
export function analyzeResponses(responses: Record<string, string>): Record<string, any> {
  try {
    const responseLengths = Object.values(responses).map(r => String(r).length);
    const totalResponses = responseLengths.length;
    const totalLength = responseLengths.reduce((sum, len) => sum + len, 0);
    const averageLength = totalResponses ? Math.round(totalLength / totalResponses) : 0;
    
    // Count detailed vs. brief responses
    const detailedResponses = responseLengths.filter(len => len > 100).length;
    const briefResponses = responseLengths.filter(len => len < 30).length;
    
    // Estimate response quality based on length distribution
    let responseQuality = "moderate";
    if (averageLength > 120 && detailedResponses > totalResponses * 0.6) {
      responseQuality = "high";
    } else if (averageLength < 40 || briefResponses > totalResponses * 0.5) {
      responseQuality = "low";
    }
    
    // Find keywords that might indicate response quality
    const allText = Object.values(responses).join(" ").toLowerCase();
    const introspectionKeywords = ["feel", "think", "believe", "because", "however", "although", "reflect"];
    const introspectionScore = introspectionKeywords.reduce(
      (score, word) => score + (allText.split(word).length - 1), 
      0
    );
    
    return {
      responseCount: totalResponses,
      averageLength,
      detailedResponses,
      briefResponses,
      totalLength,
      estimatedQuality: responseQuality,
      introspectionScore,
      analysisComplexity: determineAnalysisComplexity(totalResponses, averageLength, introspectionScore)
    };
  } catch (error) {
    return {
      responseCount: Object.keys(responses).length,
      estimatedQuality: "unknown",
      analysisComplexity: "standard"
    };
  }
}

/**
 * Determine the appropriate complexity level for the analysis
 * based on response characteristics
 */
function determineAnalysisComplexity(
  responseCount: number, 
  averageLength: number, 
  introspectionScore: number
): string {
  if (responseCount >= 40 && averageLength > 100 && introspectionScore > 50) {
    return "high";
  } else if (responseCount < 30 || averageLength < 40 || introspectionScore < 20) {
    return "low";
  } else {
    return "standard";
  }
}
