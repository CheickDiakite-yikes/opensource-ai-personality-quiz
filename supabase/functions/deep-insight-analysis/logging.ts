
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
  if (!response || !response.usage) {
    logInfo("No usage statistics available in response");
    return;
  }
  
  logInfo("OpenAI API Response Statistics", {
    promptTokens: response.usage.prompt_tokens,
    completionTokens: response.usage.completion_tokens,
    totalTokens: response.usage.total_tokens,
    model: response.model,
    finishReason: response.choices?.[0]?.finish_reason
  });
}

export function createPerformanceTracker(operationName: string) {
  const startTime = performance.now();
  return {
    end: () => {
      const duration = performance.now() - startTime;
      logDebug(`${operationName} completed in ${duration.toFixed(2)}ms`);
      return duration;
    }
  };
}
