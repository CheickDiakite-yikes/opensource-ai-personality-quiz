
// Enhanced logging module with detailed info for debugging

export function logInfo(message: string): void {
  console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
}

export function logError(message: string, error?: unknown): void {
  console.error(`[ERROR] ${new Date().toISOString()} - ${message}`);
  
  if (error) {
    if (error instanceof Error) {
      console.error(`[ERROR DETAILS] ${error.message}`);
      if (error.stack) {
        console.error(`[ERROR STACK] ${error.stack.split('\n').slice(0, 3).join('\n')}`);
      }
    } else {
      console.error(`[ERROR DETAILS] ${String(error)}`);
    }
  }
}

export function logDebug(message: string): void {
  console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`);
}

export function logWarning(message: string): void {
  console.warn(`[WARNING] ${new Date().toISOString()} - ${message}`);
}

export function logAnalysisProgress(stage: string, status: string): void {
  console.log(`[ANALYSIS PROGRESS] ${new Date().toISOString()} - Stage: ${stage}, Status: ${status}`);
}

export function createPerformanceTracker(operation: string) {
  const startTime = Date.now();
  logDebug(`Starting operation: ${operation}`);
  
  return {
    end: () => {
      const duration = Date.now() - startTime;
      logDebug(`Completed operation: ${operation} in ${duration}ms`);
      return duration;
    },
    checkpoint: (stage: string) => {
      const checkpointTime = Date.now();
      const elapsed = checkpointTime - startTime;
      logDebug(`Checkpoint "${stage}" for operation: ${operation} at ${elapsed}ms`);
      return elapsed;
    }
  };
}

export function logResponseStats(data: any): void {
  if (!data) {
    logWarning("Cannot log response stats: data is null");
    return;
  }
  
  try {
    // Log token usage if available
    if (data.usage) {
      logInfo(`Token usage: ${data.usage.total_tokens} total (${data.usage.prompt_tokens} prompt, ${data.usage.completion_tokens} completion)`);
    }
    
    // Log choices information
    if (data.choices && Array.isArray(data.choices)) {
      logInfo(`Received ${data.choices.length} choices from API`);
      
      // Log first choice details
      if (data.choices.length > 0) {
        const firstChoice = data.choices[0];
        if (firstChoice.message && firstChoice.message.content) {
          const contentLength = firstChoice.message.content.length;
          logDebug(`First choice content length: ${contentLength} characters`);
          logDebug(`Content starts with: ${firstChoice.message.content.substring(0, 50)}...`);
        } else {
          logWarning("First choice has no message or content");
        }
        
        if (firstChoice.finish_reason) {
          logInfo(`Finish reason for first choice: ${firstChoice.finish_reason}`);
        }
      }
    } else {
      logWarning("Response has no choices array");
    }
  } catch (error) {
    logError("Error while logging response stats:", error);
  }
}
