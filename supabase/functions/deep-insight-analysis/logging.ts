
/**
 * Enhanced logging system with structured output and levels
 */

// Log levels for better filtering and clarity
export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR"
}

// Base interface for all log entries
interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  [key: string]: any;
}

/**
 * Create a standardized log entry
 */
function createLogEntry(level: LogLevel, message: string, data?: any): LogEntry {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message
  };
  
  if (data) {
    // Handle special case for Error objects
    if (data instanceof Error) {
      entry.error = {
        name: data.name,
        message: data.message,
        stack: data.stack
      };
    } 
    // Handle circular references and non-serializable data
    else {
      try {
        const safeData = JSON.parse(JSON.stringify(data));
        entry.data = safeData;
      } catch (e) {
        entry.data = "[Circular or non-serializable data]";
        entry.dataError = (e as Error).message;
      }
    }
  }
  
  return entry;
}

/**
 * Log debug level information
 */
export function logDebug(message: string, data?: any): void {
  const entry = createLogEntry(LogLevel.DEBUG, message, data);
  console.log(JSON.stringify(entry));
}

/**
 * Log informational messages
 */
export function logInfo(message: string, data?: any): void {
  const entry = createLogEntry(LogLevel.INFO, message, data);
  console.log(JSON.stringify(entry));
}

/**
 * Log warning messages
 */
export function logWarning(message: string, data?: any): void {
  const entry = createLogEntry(LogLevel.WARNING, message, data);
  console.warn(JSON.stringify(entry));
}

/**
 * Log error messages with enhanced context
 */
export function logError(error: any, context: string): void {
  const entry = createLogEntry(LogLevel.ERROR, `${context} error`, error);
  console.error(JSON.stringify(entry));
}

/**
 * Log details about request configuration
 */
export function logRequestConfig(config: any): void {
  logInfo("OpenAI request configuration", {
    model: config.model || "unknown",
    max_tokens: config.max_tokens || "unknown",
    temperature: config.temperature || "unknown",
    totalPromptTokens: config.totalPromptTokens || "unknown",
    responsesCount: config.responsesCount || "unknown"
  });
}

/**
 * Log statistics about API response
 */
export function logResponseStats(response: any): void {
  if (!response) {
    logWarning("No response data to log");
    return;
  }
  
  logInfo("OpenAI response stats", {
    totalTokens: response.usage?.total_tokens || "N/A",
    completionTokens: response.usage?.completion_tokens || "N/A",
    promptTokens: response.usage?.prompt_tokens || "N/A",
    model: response.model || "N/A",
    responseLength: response.choices?.[0]?.message?.content?.length || 0,
    finishReason: response.choices?.[0]?.finish_reason || "N/A"
  });
}

/**
 * Log function execution time
 */
export function logExecutionTime(operation: string, startTime: number): void {
  const endTime = performance.now();
  const duration = endTime - startTime;
  logInfo(`${operation} completed in ${duration.toFixed(2)}ms`);
}

/**
 * Performance tracking utility
 */
export function createPerformanceTracker(operationName: string) {
  const start = performance.now();
  return {
    end: () => {
      const duration = performance.now() - start;
      logInfo(`${operationName} completed in ${duration.toFixed(2)}ms`);
      return duration;
    }
  };
}
