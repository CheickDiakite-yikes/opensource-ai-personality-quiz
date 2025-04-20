
import { corsHeaders } from "../_shared/cors.ts";

export function createErrorResponse(error: any, status: number = 500, message?: string) {
  console.error("Error details:", error);
  
  // Extract more information for debugging
  let errorDetails = {
    message: error.message || "Unknown error",
    name: error.name || "Error",
    stack: error.stack || "No stack trace",
    cause: error.cause || "No cause information"
  };
  
  console.error("Detailed error information:", JSON.stringify(errorDetails));
  
  return new Response(
    JSON.stringify({ 
      error: message || "An error occurred", 
      details: errorDetails.message,
      errorType: errorDetails.name,
      success: false,
      timestamp: new Date().toISOString()
    }), 
    { 
      status, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    }
  );
}

export function handleRequestValidation(responses: any) {
  if (!responses || Object.keys(responses).length === 0) {
    console.error("No responses provided in request");
    throw new Error("No responses provided");
  }
}
