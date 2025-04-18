
// Helper function to safely access nested properties from a potentially undefined object
export function getStringSafely(obj: any, path: string, defaultValue: string = ""): string {
  try {
    const parts = path.split('.');
    let current = obj;
    
    for (const part of parts) {
      if (current === undefined || current === null) {
        return defaultValue;
      }
      current = current[part];
    }
    
    return typeof current === 'string' ? current : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

// Helper function to safely get an array from a potentially undefined object
export function getArraySafely(obj: any, path: string, limit: number = 0): any[] {
  try {
    const parts = path.split('.');
    let current = obj;
    
    for (const part of parts) {
      if (current === undefined || current === null) {
        return [];
      }
      current = current[part];
    }
    
    if (!Array.isArray(current)) {
      return [];
    }
    
    return limit > 0 ? current.slice(0, limit) : current;
  } catch (e) {
    return [];
  }
}

// Helper function to generate an overview from the analysis content
export function generateOverview(analysisContent: any): string {
  try {
    const primary = getStringSafely(analysisContent, "coreTraits.primary", "introspective");
    const secondary = getStringSafely(analysisContent, "coreTraits.secondary", "analytical");
    const decisionMaking = getStringSafely(analysisContent, "cognitivePatterning.decisionMaking", "structured decision-making");
    const emotional = getStringSafely(analysisContent, "emotionalArchitecture.emotionalAwareness", "emotional awareness");
    
    return `Based on your assessment responses, you exhibit ${primary} tendencies combined with ${secondary} characteristics. Your cognitive style shows ${decisionMaking}, while your emotional landscape reveals ${emotional}.`;
  } catch (e) {
    return "Your assessment reveals a unique blend of cognitive patterns, emotional traits, and interpersonal dynamics.";
  }
}

