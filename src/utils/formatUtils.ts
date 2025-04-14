
/**
 * Utility functions for formatting and sanitizing data
 */

/**
 * Safely converts a value to string to avoid React render errors.
 * Handles objects with name, description, or trait properties.
 */
export const safeString = (value: any): string => {
  if (value === undefined || value === null) {
    return "";
  }
  
  if (typeof value === "string") {
    return value;
  }
  
  if (typeof value === "object") {
    // Handle objects with name, description, or trait properties
    if (value.name) return safeString(value.name);
    if (value.description) return safeString(value.description);
    if (value.trait) return safeString(value.trait);
    
    // For other objects, use JSON stringify
    try {
      return JSON.stringify(value);
    } catch (e) {
      console.error("Error stringifying object:", e);
      return "[Object]";
    }
  }
  
  // For other types like numbers, booleans, etc.
  return String(value);
};

/**
 * Ensure that every item in an array is a string.
 * Handles arrays of objects by extracting relevant properties.
 */
export const ensureStringItems = (items: any[] | undefined | null): string[] => {
  if (!items || !Array.isArray(items)) {
    return [];
  }
  
  return items.map(item => {
    // Convert each item to a safe string
    return safeString(item);
  }).filter(Boolean); // Remove any empty strings
};

/**
 * Deep recursive function to ensure all items in nested objects and arrays are strings
 */
export const deepEnsureString = (value: any): any => {
  if (value === null || value === undefined) {
    return '';
  }
  
  // Handle primitive types
  if (typeof value !== 'object') {
    return String(value);
  }
  
  // Handle arrays
  if (Array.isArray(value)) {
    return value.map(item => deepEnsureString(item));
  }
  
  // Handle objects
  const result: Record<string, any> = {};
  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      result[key] = deepEnsureString(value[key]);
    }
  }
  
  return result;
};

/**
 * Type for objects that can be stringified safely
 */
export type StringOrObject = string | { 
  name?: string; 
  description?: string;
  trait?: string;
  [key: string]: any;
};
