
import { logInfo, logError } from "./logging.ts";

/**
 * Creates a retryable version of an async function
 * 
 * @param fn The function to make retryable
 * @param maxAttempts Maximum number of retry attempts
 * @param getDelay Function to calculate delay between retries
 * @returns A wrapped function that will retry on failure
 */
export function retryable<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  maxAttempts: number = 3,
  getDelay: (attempt: number) => number = (attempt) => Math.min(1000 * Math.pow(2, attempt), 10000)
): T {
  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        // If this isn't the first attempt, log that we're retrying
        if (attempt > 0) {
          logInfo(`Retry attempt ${attempt + 1}/${maxAttempts}`);
        }
        
        // Execute the function
        const result = await fn(...args);
        
        // If successful, return the result
        return result as ReturnType<T>;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        logError(`Attempt ${attempt + 1}/${maxAttempts} failed: ${lastError.message}`);
        
        // If this is the last attempt, don't wait
        if (attempt === maxAttempts - 1) {
          break;
        }
        
        // Calculate delay and wait before next attempt
        const delay = getDelay(attempt);
        logInfo(`Waiting ${delay}ms before next attempt...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    // If we get here, all attempts failed
    throw lastError || new Error("All retry attempts failed");
  }) as T;
}
