
// Simple logging utilities with timestamps and log levels

export function logDebug(message: string, data?: any) {
  const timestamp = new Date().toISOString();
  console.debug(`[${timestamp}] [DEBUG] ${message}`, data !== undefined ? data : '');
}

export function logInfo(message: string, data?: any) {
  const timestamp = new Date().toISOString();
  console.info(`[${timestamp}] [INFO] ${message}`, data !== undefined ? data : '');
}

export function logError(message: string, error?: any) {
  const timestamp = new Date().toISOString();
  if (error) {
    if (error instanceof Error) {
      console.error(`[${timestamp}] [ERROR] ${message}`, error.message, '\n', error.stack || '');
    } else {
      console.error(`[${timestamp}] [ERROR] ${message}`, error);
    }
  } else {
    console.error(`[${timestamp}] [ERROR] ${message}`);
  }
}
