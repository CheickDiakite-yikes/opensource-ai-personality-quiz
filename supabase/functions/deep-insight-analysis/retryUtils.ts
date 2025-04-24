
import { logError, logWarning } from "./logging.ts";

// Utility to make functions retryable with exponential backoff
export function retryable<T>(fn: Function, maxRetries: number = 3) {
  return async (...args: any[]): Promise<T> => {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff: 2s, 4s, 8s, etc.
          logWarning(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms delay`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
        
        return await fn(...args);
      } catch (error) {
        lastError = error;
        logError(`Attempt ${attempt + 1}/${maxRetries} failed:`, error);
      }
    }
    
    throw lastError || new Error(`Failed after ${maxRetries} attempts`);
  };
}
