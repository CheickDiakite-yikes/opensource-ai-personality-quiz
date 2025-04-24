
// Performance tracker utility
export function createPerformanceTracker(label: string) {
  const start = performance.now();
  return {
    end: () => {
      const end = performance.now();
      const duration = end - start;
      return duration;
    }
  };
}

// Log response statistics
export function logResponseStats(response: any) {
  if (!response || !response.usage) return;
  
  const { prompt_tokens, completion_tokens, total_tokens } = response.usage;
  console.log(`OpenAI API usage: ${prompt_tokens} prompt + ${completion_tokens} completion = ${total_tokens} total tokens`);
  
  if (response.model) {
    console.log(`Model used: ${response.model}`);
  }
}

// Debug logger
export function logDebug(message: string, data?: any) {
  console.log(`[DEBUG] ${message}`, data ? data : '');
}

// Info logger
export function logInfo(message: string, data?: any) {
  console.log(`[INFO] ${message}`, data ? data : '');
}

// Error logger
export function logError(message: string | Error | any, errorData?: any) {
  if (typeof message === 'object' && message instanceof Error) {
    console.error(`[ERROR] ${message.message}`, message.stack);
    if (errorData) console.error('Additional error data:', errorData);
  } else {
    console.error(`[ERROR] ${message}`, errorData ? errorData : '');
  }
}
