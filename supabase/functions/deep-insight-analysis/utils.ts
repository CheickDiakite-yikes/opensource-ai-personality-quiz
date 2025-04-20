
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
      logDebug("Trimmed content before first {");
    }
    
    // Try parsing again after cleaning
    try {
      return JSON.parse(jsonString);
    } catch (cleanError) {
      logDebug("Comprehensive cleaning still produced invalid JSON, attempting JSON5 fallback parsing");
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
          throw finalError;
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
      return value;
    }
    // Return a fallback array if the original doesn't meet length requirements
    return Array.isArray(value) ? value : [];
  } catch (error) {
    return [];
  }
}

/**
 * Generates an overview summary from the analysis content
 * Creates a concise yet comprehensive summary of key personality traits
 */
export function generateOverview(analysisContent: any): string {
  try {
    // Get core traits if available
    const primaryTrait = getStringSafely(analysisContent, 'coreTraits.primary');
    const secondaryTraits = getArraySafely(analysisContent, 'coreTraits.secondaryTraits', 1);
    
    // Get cognitive information
    const cognitiveTrait = getStringSafely(
      analysisContent, 
      'cognitivePatterning.decisionMaking',
      'analytic thinking'
    );
    
    // Get emotional information
    const emotionalTraits = getArraySafely(
      analysisContent,
      'emotionalArchitecture.emotionalStrengths',
      1
    );
    
    // Get motivational information
    const motivators = getArraySafely(analysisContent, 'motivationalProfile.primaryDrivers', 1);
    
    // Construct the overview
    let overview = `You demonstrate a personality profile anchored in ${primaryTrait.toLowerCase() || 'adaptability'}`;
    
    if (secondaryTraits.length > 0) {
      overview += `, with notable strengths in ${secondaryTraits.slice(0, 2).join(' and ').toLowerCase()}`;
    }
    
    overview += `. Your cognitive style leans toward ${cognitiveTrait.toLowerCase()}`;
    
    if (emotionalTraits.length > 0) {
      overview += ` while emotionally exhibiting ${emotionalTraits[0].toLowerCase()}`;
    }
    
    if (motivators.length > 0) {
      overview += `. You appear primarily motivated by ${motivators[0].toLowerCase()}`;
    }
    
    overview += `. This distinctive combination shapes your unique approach to challenges and relationships.`;
    
    return overview;
  } catch (error) {
    return "Your analysis reveals a multifaceted personality with unique strengths and potential growth areas. Your cognitive patterns and emotional responses create a distinctive approach to life's challenges.";
  }
}
