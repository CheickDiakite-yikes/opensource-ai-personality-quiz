
import { corsHeaders } from "../_shared/cors.ts";

export function createErrorResponse(error: any, status: number = 500, message?: string) {
  console.error("Error details:", error);
  console.error("Error message:", error.message);
  console.error("Error name:", error.name);
  console.error("Error stack:", error.stack);
  
  return new Response(
    JSON.stringify({ 
      error: message || "An error occurred", 
      details: error.message,
      success: false 
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

