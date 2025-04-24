
import { logDebug } from "./logging.ts";

/**
 * Creates a retryable version of an async function
 * @param fn The function to make retryable
 * @param maxRetries Maximum number of retry attempts
 * @param baseDelay Base delay between retries in ms (will be multiplied by attempt)
 * @returns A new function that will retry on failure
 */
export function retryable<T>(
  fn: () => Promise<T>, 
  maxRetries: number = 2, 
  baseDelay: number = 1000
): () => Promise<T> {
  return async (): Promise<T> => {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          const delay = baseDelay * Math.pow(2, attempt - 1);
          logDebug(`Retry attempt ${attempt} after ${delay}ms delay`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
        
        return await fn();
      } catch (error) {
        lastError = error;
        logDebug(`Attempt ${attempt} failed: ${error.message}`);
        
        // If we've used all retries, throw the error
        if (attempt === maxRetries) {
          throw error;
        }
      }
    }
    
    // This should never execute but TypeScript requires a return
    throw lastError || new Error("Unknown error in retryable function");
  };
}
