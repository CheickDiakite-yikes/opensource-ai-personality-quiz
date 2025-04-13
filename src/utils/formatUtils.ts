// Function to format trait scores for display
export const formatTraitScore = (score: number): string => {
  if (score >= 9) return "Very High";
  if (score >= 7) return "High";
  if (score >= 5) return "Moderate";
  if (score >= 3) return "Low";
  return "Very Low";
};

// Add safe string conversion utility
export const safeString = (value: any): string => {
  if (value === null || value === undefined) {
    return '';
  }
  
  if (typeof value === 'string') {
    return value;
  }
  
  if (typeof value === 'object') {
    // For objects with name or description properties (common in the app)
    if (value.name) {
      return value.name;
    }
    if (value.description) {
      return value.description;
    }
    if (value.trait) {
      return value.trait;
    }
    
    // Fallback to JSON string representation
    try {
      return JSON.stringify(value);
    } catch (e) {
      return '[Object]';
    }
  }
  
  return String(value);
};
