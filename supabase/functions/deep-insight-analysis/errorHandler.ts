
import { corsHeaders } from "../_shared/cors.ts";
import { logError } from "./logging.ts";

export function createErrorResponse(
  error: Error,
  status: number = 500,
  message?: string
) {
  logError(message || error.message, error);
  
  // Store error information in the complete_analysis JSON object
  return new Response(
    JSON.stringify({
      error: message || error.message,
      success: false,
      status,
      analysis: {
        overview: "Analysis processing encountered an error. Please try again later.",
        complete_analysis: {
          status: "error",
          error_occurred: true,
          error_message: message || error.message
        }
      }
    }),
    {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    }
  );
}
