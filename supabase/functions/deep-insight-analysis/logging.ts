
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
