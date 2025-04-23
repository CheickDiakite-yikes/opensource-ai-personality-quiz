
export function logDebug(message: string, data?: any) {
  console.debug(`[DEBUG] ${message}`, data ? data : '');
}

export function logError(message: string, error?: any) {
  console.error(`[ERROR] ${message}`, error ? error : '');
}

export function logInfo(message: string, data?: any) {
  console.info(`[INFO] ${message}`, data ? data : '');
}
