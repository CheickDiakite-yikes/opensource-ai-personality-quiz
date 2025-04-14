
/**
 * Safely ensures that an input is an array, converting single items to arrays if needed
 * @param input The input that should be an array
 * @returns A guaranteed array
 */
export const ensureArray = <T>(input: T | T[] | null | undefined): T[] => {
  if (input === null || input === undefined) {
    return [];
  }
  
  return Array.isArray(input) ? input : [input];
};

/**
 * Safely ensures that all items in an array are properly stringified
 * @param input The input array or item
 * @returns A guaranteed array with string representation of each item
 */
export const safeStringArray = <T>(input: T | T[] | null | undefined): string[] => {
  const array = ensureArray(input);
  return array.map(item => {
    // For objects with name or description
    if (item !== null && typeof item === 'object') {
      if ('name' in item && typeof item.name === 'string') {
        return item.name;
      }
      if ('description' in item && typeof item.description === 'string') {
        return item.description;
      }
      if ('trait' in item && typeof item.trait === 'string') {
        return item.trait;
      }
      
      // Fallback to JSON
      try {
        return JSON.stringify(item);
      } catch (e) {
        return '[Object]';
      }
    }
    
    // Handle other types
    return item === null || item === undefined ? '' : String(item);
  });
};
