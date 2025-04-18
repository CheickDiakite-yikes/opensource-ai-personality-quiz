
export function getStringSafely(obj: any, path: string, defaultValue: string = ''): string {
  try {
    const parts = path.split('.');
    let current = obj;
    
    for (const part of parts) {
      if (current === null || current === undefined) {
        return defaultValue;
      }
      current = current[part];
    }
    
    return typeof current === 'string' ? current : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

export function getArraySafely(obj: any, path: string, minLength: number = 0): string[] {
  try {
    const parts = path.split('.');
    let current = obj;
    
    for (const part of parts) {
      if (current === null || current === undefined) {
        return minLength > 0 ? Array(minLength).fill('') : [];
      }
      current = current[part];
    }
    
    if (!Array.isArray(current)) {
      return minLength > 0 ? Array(minLength).fill('') : [];
    }
    
    // Filter out non-string values
    const filteredArray = current.filter(item => typeof item === 'string');
    
    // If we don't have enough items, pad the array
    if (minLength > 0 && filteredArray.length < minLength) {
      return [...filteredArray, ...Array(minLength - filteredArray.length).fill('')];
    }
    
    return filteredArray;
  } catch (e) {
    return minLength > 0 ? Array(minLength).fill('') : [];
  }
}

export function generateOverview(analysisContent: any): string {
  // Default overview if we can't generate a proper one
  const defaultOverview = "Your Deep Insight Analysis reveals a unique cognitive and emotional profile shaped by your individual experiences and perspectives. The analysis provides a comprehensive view of your personality traits, thinking patterns, emotional architecture, and interpersonal dynamics.";
  
  try {
    // Attempt to extract key components from various sections
    const primaryTrait = getStringSafely(analysisContent, 'coreTraits.primary');
    const cognitiveStyle = getStringSafely(analysisContent, 'cognitivePatterning.decisionMaking');
    const emotionalStyle = getStringSafely(analysisContent, 'emotionalArchitecture.emotionalAwareness');
    const interpersonalStyle = getStringSafely(analysisContent, 'interpersonalDynamics.communicationPattern');
    const primaryMotivators = getArraySafely(analysisContent, 'motivationalProfile.primaryDrivers', 1)[0];
    
    // Only generate a custom overview if we have enough data
    if (primaryTrait && cognitiveStyle && emotionalStyle) {
      return `Your personality analysis reveals you as primarily a ${primaryTrait}. ${cognitiveStyle} When it comes to emotions, ${emotionalStyle.toLowerCase()} In interpersonal dynamics, ${interpersonalStyle.toLowerCase()} ${primaryMotivators ? `You're primarily motivated by ${primaryMotivators.toLowerCase()}.` : ''}`;
    }
    
    return defaultOverview;
  } catch (e) {
    return defaultOverview;
  }
}
