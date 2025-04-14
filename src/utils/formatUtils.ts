
// Add the missing formatTraitScore function
export const formatTraitScore = (score: number | undefined): string => {
  if (score === undefined || score === null) {
    return "N/A";
  }
  
  // Format the score out of 10
  return `${score.toFixed(1)}/10`;
};

// Add safeString function to safely handle string values
export const safeString = (value: any): string => {
  if (value === undefined || value === null) {
    return "";
  }
  
  if (typeof value === "string") {
    return value;
  }
  
  try {
    return String(value);
  } catch (e) {
    return "";
  }
};

// Define StringOrObject type
export type StringOrObject = string | Record<string, any>;

// Add ensureStringItems function to convert array items to strings
export const ensureStringItems = (items: any[] | undefined | null): string[] => {
  if (!items || !Array.isArray(items)) {
    return [];
  }
  
  return items.map(item => {
    if (typeof item === "string") {
      return item;
    }
    
    // Handle common object formats with name/title/value properties
    if (item && typeof item === "object") {
      return item.name || item.title || item.value || item.trait || item.description || JSON.stringify(item);
    }
    
    // Convert to string as fallback
    try {
      return String(item);
    } catch (e) {
      return "";
    }
  }).filter(Boolean); // Remove empty strings
};

// Add deepEnsureString function for nested objects
export const deepEnsureString = (obj: any): any => {
  if (!obj) {
    return "";
  }
  
  if (typeof obj === "string") {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return ensureStringItems(obj);
  }
  
  if (typeof obj === "object") {
    const result: Record<string, any> = {};
    for (const key in obj) {
      result[key] = deepEnsureString(obj[key]);
    }
    return result;
  }
  
  return String(obj);
};
