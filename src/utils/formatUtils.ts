// Function to format trait scores for display
export const formatTraitScore = (score: number): string => {
  if (score >= 9) return "Very High";
  if (score >= 7) return "High";
  if (score >= 5) return "Moderate";
  if (score >= 3) return "Low";
  return "Very Low";
};

// Define a type that represents either a string or object with name/description/trait
export type StringOrObject = string | { name: string, description?: string } | { trait: string } | { [key: string]: any };

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
 * For use in components that might receive objects in arrays
 */
export const ensureStringItems = <T extends StringOrObject>(array: T[] | null | undefined): string[] => {
  if (!array) return [];
  
  return array.map(item => safeString(item));
};

/**
 * Deep ensures all nested arrays and objects are properly converted to strings
 * For more complex nested data structures
 */
export const deepEnsureStringItems = (data: any): any => {
  // Handle null or undefined
  if (data === null || data === undefined) {
    return '';
  }
  
  // Handle arrays (convert each item)
  if (Array.isArray(data)) {
    return data.map(item => deepEnsureStringItems(item));
  }
  
  // Handle objects (convert to string or process their properties)
  if (typeof data === 'object') {
    // If it looks like a common named object in our system, extract the name
    if ('name' in data && typeof data.name === 'string') {
      return data.name;
    }
    if ('description' in data && typeof data.description === 'string') {
      return data.description;
    }
    if ('trait' in data && typeof data.trait === 'string') {
      return data.trait;
    }
    
    // Otherwise process each property in the object
    const result: Record<string, any> = {};
    for (const key in data) {
      result[key] = deepEnsureStringItems(data[key]);
    }
    return result;
  }
  
  // Return primitives as is
  return data;
};
