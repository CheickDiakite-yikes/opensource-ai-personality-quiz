
// Function to format trait scores for display
export const formatTraitScore = (score: number): string => {
  if (score >= 9) return "Very High";
  if (score >= 7) return "High";
  if (score >= 5) return "Moderate";
  if (score >= 3) return "Low";
  return "Very Low";
};

// Enhanced safe string conversion utility
export const safeString = (value: any): string => {
  // Handle null or undefined
  if (value === null || value === undefined) {
    return '';
  }
  
  // Handle strings directly
  if (typeof value === 'string') {
    return value;
  }
  
  // Handle numbers
  if (typeof value === 'number') {
    return value.toString();
  }
  
  // Handle objects with common properties in our app
  if (typeof value === 'object') {
    // For objects with name or description properties (common in the app)
    if ('name' in value && typeof value.name === 'string') {
      return value.name;
    }
    if ('description' in value && typeof value.description === 'string') {
      return value.description;
    }
    if ('trait' in value && typeof value.trait === 'string') {
      return value.trait;
    }
    
    // For arrays, map and join the elements
    if (Array.isArray(value)) {
      return value.map(item => safeString(item)).join(', ');
    }
    
    // Fallback to JSON string representation
    try {
      return JSON.stringify(value);
    } catch (e) {
      return '[Object]';
    }
  }
  
  // Default toString for any other types
  return String(value);
};

/**
 * Ensures array items are properly stringified before rendering
 * For use in complex components that might receive objects in arrays
 */
export const ensureStringItems = <T>(array: T[] | null | undefined): string[] => {
  if (!array) return [];
  
  return array.map(item => safeString(item));
};

