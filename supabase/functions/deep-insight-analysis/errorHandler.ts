
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
      status
    }),
    {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    }
  );
}

export function handleRequestValidation(responses: any) {
  if (!responses || typeof responses !== 'object') {
    throw new Error("Invalid responses format");
  }
  
  if (Object.keys(responses).length === 0) {
    throw new Error("No responses provided");
  }
}
