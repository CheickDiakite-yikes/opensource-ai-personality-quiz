
import { corsHeaders } from "../_shared/cors.ts";
import { logError } from "./logging.ts";

export function createErrorResponse(
  error: Error,
  status: number = 500,
  message?: string
) {
  logError(message || error.message, error);
  
  return new Response(
    JSON.stringify({
      error: message || error.message,
      success: false,
      status,
      analysis: {
        error_occurred: true,
        error_message: message || error.message
      }
    }),
    {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    }
  );
}
