
// Add a new function to clean and parse malformed JSON
export async function cleanAndParseJSON(rawJSON: string): Promise<any | null> {
  try {
    // First try simple cleaning - remove any leading/trailing non-JSON content
    const jsonMatch = rawJSON.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const cleanedJSON = jsonMatch[0];
      try {
        return JSON.parse(cleanedJSON);
      } catch (e) {
        // Continue to more aggressive cleaning if this fails
        console.log("Simple JSON cleaning failed, trying more aggressive methods");
      }
    }
    
    // Fix common JSON syntax errors
    let fixedJSON = rawJSON
      // Fix unquoted property names
      .replace(/(\w+)(?=\s*:)/g, '"$1"')
      // Fix single quotes used instead of double quotes
      .replace(/'/g, '"')
      // Remove any markdown backticks if present
      .replace(/```json|```/g, '')
      // Remove trailing commas before closing brackets/braces
      .replace(/,(\s*[\]}])/g, '$1');

    try {
      return JSON.parse(fixedJSON);
    } catch (error) {
      console.log("Aggressive JSON cleaning failed:", error);
      return null;
    }
  } catch (error) {
    console.error("JSON cleaning error:", error);
    return null;
  }
}

export function getStringSafely(obj: any, path: string, defaultValue: string = "Not available"): string {
  try {
    const parts = path.split('.');
    let current = obj;
    
    for (const part of parts) {
      if (current === null || current === undefined || typeof current !== 'object') {
        return defaultValue;
      }
      current = current[part];
    }
    
    if (current === null || current === undefined || current === '') {
      return defaultValue;
    }
    
    return String(current);
  } catch (error) {
    console.error(`Error extracting ${path}:`, error);
    return defaultValue;
  }
}

export function getArraySafely(obj: any, path: string, defaultLength: number = 3): string[] {
  try {
    const parts = path.split('.');
    let current = obj;
    
    for (const part of parts) {
      if (current === null || current === undefined || typeof current !== 'object') {
        return generateDefaultArray(defaultLength);
      }
      current = current[part];
    }
    
    if (!Array.isArray(current) || current.length === 0) {
      return generateDefaultArray(defaultLength);
    }
    
    return current.map(item => typeof item === 'string' ? item : String(item));
  } catch (error) {
    console.error(`Error extracting array ${path}:`, error);
    return generateDefaultArray(defaultLength);
  }
}

function generateDefaultArray(count: number): string[] {
  const defaults = [
    "Analytical Thinking", 
    "Emotional Intelligence", 
    "Communication Skills", 
    "Adaptability",
    "Creative Problem Solving", 
    "Leadership Potential", 
    "Resilience",
    "Strategic Planning"
  ];
  
  return defaults.slice(0, count);
}

export function generateOverview(analysis: any): string {
  if (!analysis) {
    return "Your analysis reveals a well-balanced personality with diverse strengths across cognitive and emotional domains. You demonstrate adaptability and a thoughtful approach to challenges.";
  }
  
  let traits = "";
  if (analysis.coreTraits && analysis.coreTraits.primary) {
    traits = Array.isArray(analysis.coreTraits.primary) 
      ? analysis.coreTraits.primary.slice(0, 3).join(", ")
      : analysis.coreTraits.primary;
  } else {
    traits = "analytical thinking, adaptability, and balanced perspective";
  }
  
  let cognitive = getStringSafely(analysis, "cognitivePatterning.dominantPatterns", "rational and systematic");
  let emotional = getStringSafely(analysis, "emotionalArchitecture.emotionalProfile", "emotionally balanced");
  
  return `Your personality profile indicates key strengths in ${traits}. Your cognitive approach tends to be ${cognitive}, while your emotional architecture reveals ${emotional} tendencies. Your unique combination of traits suggests potential for growth in both professional and personal domains.`;
}
