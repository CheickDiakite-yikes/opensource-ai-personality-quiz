
import { logInfo, logError } from "./logging.ts";

type RetryableFunction<T> = () => Promise<T>;

interface RetryOptions {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffFactor: number;
  retryOnStatus?: number[];
}

export async function retryable<T>(
  fn: RetryableFunction<T>,
  options: RetryOptions = {
    maxRetries: 3,
    initialDelay: 500,
    maxDelay: 5000,
    backoffFactor: 2,
    retryOnStatus: [429, 500, 502, 503, 504],
  }
): Promise<T> {
  let lastError: Error;
  let delay = options.initialDelay;

  for (let attempt = 0; attempt <= options.maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        logInfo(`Retry attempt ${attempt} of ${options.maxRetries}`);
      }
      
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Determine if we should retry based on error.status
      if ((error as any).status && 
          options.retryOnStatus && 
          options.retryOnStatus.includes((error as any).status)) {
        if (attempt < options.maxRetries) {
          logInfo(`Operation failed with status ${(error as any).status}, retrying in ${delay}ms`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay = Math.min(delay * options.backoffFactor, options.maxDelay);
          continue;
        }
      } else {
        // Non-retryable error or max retries reached
        logError(`Operation failed after ${attempt} retries`, error);
        break;
      }
    }
  }
  
  throw lastError;
}
