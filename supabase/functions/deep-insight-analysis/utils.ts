
import { logError, logDebug } from "./logging.ts";

/**
 * Safely extracts a string value from a nested object structure
 * Returns a default value if the path doesn't exist
 */
export function getStringSafely(obj: any, path: string, defaultValue: string = ""): string {
  try {
    const value = getNestedValue(obj, path);
    return typeof value === 'string' && value.trim() !== '' ? value : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

/**
 * Safely extracts an array from a nested object structure
 * Returns a default array if the path doesn't exist or isn't an array
 */
export function getArraySafely(obj: any, path: string, minLength: number = 0): string[] {
  try {
    const array = getNestedValue(obj, path);
    
    // If we don't get a valid array back, return empty array
    if (!Array.isArray(array)) {
      return generateDummyArray(path, minLength);
    }
    
    // Filter out empty items and ensure we have strings
    const validItems = array
      .filter(item => item !== null && item !== undefined)
      .map(item => typeof item === 'string' ? item : 
        (typeof item === 'object' && item !== null ? 
          JSON.stringify(item) : String(item)));
    
    // If we don't have enough items, add some placeholders
    if (validItems.length < minLength) {
      const additionalItems = generateDummyArray(path, minLength - validItems.length);
      return [...validItems, ...additionalItems];
    }
    
    return validItems;
  } catch (e) {
    return generateDummyArray(path, minLength);
  }
}

/**
 * Helper function to get a value from a nested path like "a.b.c"
 */
function getNestedValue(obj: any, path: string): any {
  if (!obj || !path) return undefined;
  
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    current = current[key];
  }
  
  return current;
}

/**
 * Generate placeholder array items based on the path context
 */
function generateDummyArray(path: string, count: number): string[] {
  if (count <= 0) return [];
  
  const result: string[] = [];
  const context = path.toLowerCase();
  
  // Generate context-appropriate placeholder content
  let placeholders: string[] = [];
  
  if (context.includes('strength')) {
    placeholders = [
      "Adaptability in changing situations",
      "Balanced approach to problems",
      "Thoughtful consideration of options",
      "Integration of different perspectives"
    ];
  } else if (context.includes('challenge') || context.includes('inhibit')) {
    placeholders = [
      "Balancing multiple priorities effectively",
      "Moving from analysis to decisive action",
      "Maintaining focus during ambiguous situations",
      "Communicating complex ideas simply"
    ];
  } else if (context.includes('value')) {
    placeholders = [
      "Growth and continuous learning",
      "Authenticity and integrity",
      "Meaningful connection",
      "Balance and integration"
    ];
  } else if (context.includes('compatible') || context.includes('relation')) {
    placeholders = [
      "Growth-oriented individuals who value both emotional and intellectual connection",
      "People who balance structure with flexibility",
      "Those who communicate directly while remaining respectful"
    ];
  } else if (context.includes('career') || context.includes('role')) {
    placeholders = [
      "Positions requiring balanced analytical and interpersonal skills",
      "Roles integrating diverse knowledge domains",
      "Consultative positions utilizing adaptive problem-solving"
    ];
  } else {
    placeholders = [
      "Balanced perspective on complex situations",
      "Adaptive approach to changing circumstances",
      "Integration of different knowledge domains",
      "Thoughtful consideration of options"
    ];
  }
  
  // Fill the array with appropriate placeholders
  for (let i = 0; i < count; i++) {
    const index = i % placeholders.length;
    result.push(placeholders[index]);
  }
  
  return result;
}

/**
 * Generates a cohesive overview from analysis content
 */
export function generateOverview(analysisContent: any): string {
  try {
    // If we have an overview directly, use it
    if (analysisContent && analysisContent.overview && 
        typeof analysisContent.overview === 'string' && 
        analysisContent.overview.length > 50) {
      return analysisContent.overview;
    }
    
    // Extract key elements to build an overview
    const primary = getStringSafely(analysisContent, "coreTraits.primary", "");
    const secondary = getStringSafely(analysisContent, "coreTraits.secondary", "");
    const decisionMaking = getStringSafely(analysisContent, "cognitivePatterning.decisionMaking", "");
    const emotionalStyle = getStringSafely(analysisContent, "emotionalArchitecture.emotionalAwareness", "");
    const relationshipStyle = getStringSafely(analysisContent, "interpersonalDynamics.attachmentStyle", "");
    
    // If we have enough content, build a comprehensive overview
    if (primary && secondary && (decisionMaking || emotionalStyle || relationshipStyle)) {
      return `Your Deep Insight Analysis reveals a personality primarily characterized as ${primary}. ${secondary} In your thinking processes, ${decisionMaking} Emotionally, ${emotionalStyle} In your relationships with others, ${relationshipStyle} This multifaceted profile provides a foundation for understanding your unique psychological makeup and pathways for growth.`;
    }
    
    // Default overview if we can't extract enough elements
    return "Your Deep Insight Analysis reveals a multifaceted personality with unique cognitive patterns and emotional depths. You demonstrate a blend of analytical thinking and interpersonal awareness that shapes how you approach challenges, relationships, and personal growth. The following sections break down the key components of your psychological profile.";
  } catch (e) {
    logError(e, "Error generating overview");
    return "Your Deep Insight Analysis explores the unique dimensions of your personality across cognitive, emotional, and interpersonal domains. This comprehensive assessment identifies your core traits, strengths, potential growth areas, and compatibility patterns.";
  }
}

/**
 * Attempts to clean and parse JSON that may have formatting issues
 */
export function cleanAndParseJSON(jsonString: string): any {
  try {
    // Try direct parse first
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      // Continue with cleaning attempts
    }
    
    logDebug("Attempting to clean malformed JSON");
    
    // Remove markdown code blocks if present
    let cleaned = jsonString.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
    
    // Replace single quotes with double quotes for property names
    cleaned = cleaned.replace(/'([^']+)':/g, '"$1":');
    
    // Fix issues with trailing commas before closing brackets
    cleaned = cleaned.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
    
    // Attempt to parse the cleaned JSON
    return JSON.parse(cleaned);
  } catch (e) {
    logError(e, "Failed to clean and parse JSON");
    throw new Error("Could not parse response JSON even after cleaning");
  }
}
