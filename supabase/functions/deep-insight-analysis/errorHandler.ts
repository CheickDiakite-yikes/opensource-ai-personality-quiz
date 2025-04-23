
import { corsHeaders } from "../_shared/cors.ts";

/**
 * Error categories for better error classification and handling
 */
enum ErrorCategory {
  VALIDATION = "VALIDATION_ERROR",
  OPENAI = "OPENAI_API_ERROR",
  RATE_LIMIT = "RATE_LIMIT_ERROR",
  TIMEOUT = "TIMEOUT_ERROR",
  PARSING = "PARSING_ERROR",
  SERVER = "SERVER_ERROR",
  UNKNOWN = "UNKNOWN_ERROR"
}

/**
 * Creates a standardized error response with proper logging and formatting
 * 
 * @param error The error object that was caught
 * @param status HTTP status code to return
 * @param message Optional custom message to return to the client
 * @returns Response object with formatted error details
 */
export function createErrorResponse(error: any, status: number = 500, message?: string) {
  const errorCategory = categorizeError(error, status);
  const errorId = crypto.randomUUID();
  
  // Enhanced structured error logging
  console.error(`[ERROR:${errorId}] ${errorCategory}:`, {
    message: error.message,
    name: error.name,
    stack: error.stack,
    status,
    category: errorCategory,
    timestamp: new Date().toISOString()
  });
  
  // Determine the appropriate error message to return
  const errorMessage = message || getErrorMessage(error, status, errorCategory);
  const retryable = isErrorRetryable(status, errorCategory);
  
  // Return a structured error response
  return new Response(
    JSON.stringify({ 
      error: errorMessage, 
      details: sanitizeErrorDetails(error.message),
      success: false,
      status,
      errorId,
      category: errorCategory,
      retryable
    }), 
    { 
      status, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    }
  );
}

/**
 * Categorizes errors based on their nature and status code
 */
function categorizeError(error: any, status: number): ErrorCategory {
  if (status === 400) return ErrorCategory.VALIDATION;
  if (status === 429) return ErrorCategory.RATE_LIMIT;
  if (error.name === "TimeoutError" || error.message?.includes("timeout")) return ErrorCategory.TIMEOUT;
  if (error.message?.includes("OpenAI") || status === 502) return ErrorCategory.OPENAI;
  if (error.message?.includes("JSON") || error.message?.includes("parse")) return ErrorCategory.PARSING;
  if (status >= 500) return ErrorCategory.SERVER;
  return ErrorCategory.UNKNOWN;
}

/**
 * Determines if an error is potentially retryable
 */
function isErrorRetryable(status: number, category: ErrorCategory): boolean {
  return (
    category === ErrorCategory.TIMEOUT || 
    category === ErrorCategory.RATE_LIMIT || 
    (category === ErrorCategory.OPENAI && status !== 400) ||
    (category === ErrorCategory.SERVER && status !== 501)
  );
}

/**
 * Sanitizes error details to avoid exposing sensitive information
 * 
 * @param errorMessage The raw error message
 * @returns A sanitized version of the error message
 */
function sanitizeErrorDetails(errorMessage: string): string {
  if (!errorMessage) return "Unknown error occurred";
  
  // Remove any potential API keys or sensitive data
  const sanitized = errorMessage
    .replace(/key-[a-zA-Z0-9-_]{20,}/g, "[REDACTED]")
    .replace(/sk-[a-zA-Z0-9-_]{20,}/g, "[REDACTED]")
    .replace(/https?:\/\/[^\s]*?key=[^\s&]*/g, "[URL_WITH_KEY_REDACTED]");
    
  return sanitized;
}

/**
 * Determines an appropriate user-facing error message based on the error and status code
 * 
 * @param error The error object
 * @param status HTTP status code
 * @param category Error category
 * @returns A user-friendly error message
 */
function getErrorMessage(error: any, status: number, category: ErrorCategory): string {
  switch(category) {
    case ErrorCategory.VALIDATION:
      return "The request data is invalid. Please check your responses and try again.";
    case ErrorCategory.OPENAI:
      return "There was an issue with the AI service. Please try again in a few moments.";
    case ErrorCategory.RATE_LIMIT:
      return "We've received too many requests. Please wait a minute and try again.";
    case ErrorCategory.TIMEOUT:
      return "The analysis took too long to complete. Please try again with a shorter assessment.";
    case ErrorCategory.PARSING:
      return "There was an issue processing the analysis results. Our team has been notified.";
    case ErrorCategory.SERVER:
      return "An unexpected server error occurred. Our team has been notified.";
    default:
      return "An error occurred during analysis. Please try again.";
  }
}

/**
 * Validates request data for completeness and structure
 * 
 * @param responses The responses data to validate
 * @throws Error if validation fails with detailed context
 */
export function handleRequestValidation(responses: any) {
  if (!responses) {
    throw new Error("No responses provided");
  }
  
  if (typeof responses !== 'object') {
    throw new Error("Invalid response format: must be an object");
  }
  
  if (Object.keys(responses).length === 0) {
    throw new Error("Empty responses object provided");
  }
  
  // Ensure we have enough data for a meaningful analysis
  if (Object.keys(responses).length < 20) {
    throw new Error(`Insufficient responses: received ${Object.keys(responses).length}, minimum 20 required for meaningful analysis`);
  }
  
  // Check for potentially problematic content
  Object.entries(responses).forEach(([id, answer]) => {
    const strAnswer = String(answer);
    
    if (strAnswer.length === 0) {
      throw new Error(`Empty response for question ${id}`);
    }
    
    if (strAnswer.length > 3000) {
      throw new Error(`Response for question ${id} exceeds maximum length (3000 characters)`);
    }
    
    // Ensure meaningful content (more than just a few characters)
    if (strAnswer.trim().length < 3) {
      throw new Error(`Response for question ${id} is too short for meaningful analysis`);
    }
    
    // Check for patterns that might indicate non-response data
    if (/^[\{\[\(].*[\}\]\)]$/.test(strAnswer) && strAnswer.includes('"') && strAnswer.includes(':')) {
      throw new Error(`Response for question ${id} appears to be JSON or code, not a valid answer`);
    }
  });
}
