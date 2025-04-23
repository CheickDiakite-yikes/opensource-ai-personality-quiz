
/**
 * Retry configuration parameters
 */
export interface RetryConfig {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffFactor: number;
  retryableStatusCodes?: number[];
  retryableErrors?: string[];
  onRetry?: (attempt: number, error: Error) => void;
}

/**
 * Enhanced retry utility for more robust API calls
 * 
 * @param operation The async operation to retry
 * @param config Configuration options for retry behavior
 * @param operationName Name of operation for logging
 * @returns Result of the operation
 * @throws Last encountered error if all retries fail
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  config: Partial<RetryConfig> = {},
  operationName: string = 'operation'
): Promise<T> {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
    retryableStatusCodes = [408, 429, 500, 502, 503, 504],
    retryableErrors = ['timeout', 'ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND'],
    onRetry = (attempt, error) => console.log(`Retry ${attempt} after error: ${error.message}`)
  } = config;

  let lastError: Error | null = null;
  let delay = initialDelay;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${maxAttempts} for ${operationName}`);
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Determine if we should retry based on error type or status code
      const statusCode = (error as any).status || (error as any).statusCode;
      const errorMessage = lastError.message.toLowerCase();
      
      const isRetryableStatus = statusCode && retryableStatusCodes.includes(statusCode);
      const isRetryableError = retryableErrors.some(retryableError => 
        errorMessage.includes(retryableError.toLowerCase())
      );
      
      const shouldRetry = isRetryableStatus || isRetryableError;
      
      if (attempt === maxAttempts || !shouldRetry) {
        console.error(`${operationName} failed after ${attempt} attempts. Final error:`, lastError);
        throw lastError;
      }

      onRetry(attempt, lastError);
      
      console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Exponential backoff with jitter for distributed systems
      const jitter = Math.random() * 0.3 + 0.85; // Random value between 0.85 and 1.15
      delay = Math.min(delay * backoffFactor * jitter, maxDelay);
    }
  }

  throw lastError || new Error(`All ${maxAttempts} attempts failed`);
}

/**
 * Decorator for making a function retryable
 * 
 * @param config Retry configuration
 * @param operationName Name of operation for logging
 * @returns Decorated function with retry capability
 */
export function retryable<T extends (...args: any[]) => Promise<any>>(
  config: Partial<RetryConfig> = {},
  operationName?: string
) {
  return function(target: T): T {
    return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
      const opName = operationName || target.name || 'anonymous function';
      return withRetry(() => target(...args), config, opName);
    }) as T;
  };
}
