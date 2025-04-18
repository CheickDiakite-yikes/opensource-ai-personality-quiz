
interface RetryConfig {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

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
  } = config;

  let lastError: Error | null = null;
  let delay = initialDelay;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${maxAttempts} for ${operationName}`);
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxAttempts) {
        console.error(`All ${maxAttempts} attempts failed for ${operationName}:`, error);
        throw error;
      }

      console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Exponential backoff with max delay cap
      delay = Math.min(delay * backoffFactor, maxDelay);
    }
  }

  // This should never be reached due to the throw in the loop
  throw lastError || new Error(`All ${maxAttempts} attempts failed`);
}
