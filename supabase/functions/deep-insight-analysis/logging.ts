
export function logDebug(message: string, data?: any) {
  console.debug(`[DEBUG] ${message}`, data ? data : '');
}

export function logError(message: string, error?: any) {
  console.error(`[ERROR] ${message}`, error ? error : '');
}

export function logInfo(message: string, data?: any) {
  console.info(`[INFO] ${message}`, data ? data : '');
}

export function logResponseStats(response: any) {
  if (!response) return;
  
  logInfo('Response statistics:', {
    choicesLength: response.choices?.length,
    tokensUsed: response.usage?.total_tokens,
    model: response.model
  });
}

export function createPerformanceTracker(label: string) {
  const start = performance.now();
  return {
    end: () => {
      const duration = performance.now() - start;
      logDebug(`${label} took ${duration.toFixed(2)}ms`);
      return duration;
    }
  };
}
