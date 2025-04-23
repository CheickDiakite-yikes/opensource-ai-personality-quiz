
import { corsHeaders } from "../_shared/cors.ts";

/**
 * Creates a standardized error response with proper logging and formatting
 * 
 * @param error The error object that was caught
 * @param status HTTP status code to return
 * @param message Optional custom message to return to the client
 * @returns Response object with formatted error details
 */
export function createErrorResponse(error: any, status: number = 500, message?: string) {
  // Enhanced error logging for better debugging
  console.error("Error encountered:", {
    message: error.message,
    name: error.name,
    stack: error.stack,
    status
  });
  
  // Determine the appropriate error message to return
  const errorMessage = message || getErrorMessage(error, status);
  
  // Return a structured error response
  return new Response(
    JSON.stringify({ 
      error: errorMessage, 
      details: sanitizeErrorDetails(error.message),
      success: false,
      status
    }), 
    { 
      status, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    }
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
    .replace(/sk-[a-zA-Z0-9-_]{20,}/g, "[REDACTED]");
    
  return sanitized;
}

/**
 * Determines an appropriate user-facing error message based on the error and status code
 * 
 * @param error The error object
 * @param status HTTP status code
 * @returns A user-friendly error message
 */
function getErrorMessage(error: any, status: number): string {
  if (status === 400) return "The request was invalid. Please check your responses and try again.";
  if (status === 401 || status === 403) return "Authentication error. Please log in again.";
  if (status === 404) return "The requested resource was not found.";
  if (status === 429) return "Too many requests. Please try again later.";
  if (status >= 500) return "An unexpected server error occurred. Our team has been notified.";
  
  return "An error occurred during analysis. Please try again.";
}

/**
 * Validates request data for completeness and structure
 * 
 * @param responses The responses data to validate
 * @throws Error if validation fails
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
  
  // Additional validation for array responses
  if (Array.isArray(responses)) {
    if (responses.length === 0) {
      throw new Error("Empty response array provided");
    }
    
    // Check that each response has required properties
    for (const [index, response] of responses.entries()) {
      if (!response.id || !response.question || !response.answer) {
        throw new Error(`Invalid response at index ${index}: missing required properties`);
      }
    }
  }
}
