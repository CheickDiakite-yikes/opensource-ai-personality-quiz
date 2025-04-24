
import { corsHeaders } from "../_shared/cors.ts";
import { createErrorResponse } from "./errorHandler.ts";
import { logInfo, logError, logDebug } from "./logging.ts";

export async function processRequest(req: Request) {
  // Parse request body early to quickly return errors if needed
  let responses;
  try {
    if (!req || !req.body) {
      logError("Request or request body is null");
      return createErrorResponse(new Error("Invalid request"), 400, "Invalid request body");
    }
    
    const body = await req.json();
    responses = body?.responses;
    logInfo(`Request body parsed successfully, contains responses: ${!!responses}`);
    
    // Log more details about the request for debugging
    if (responses) {
      const responseCount = Object.keys(responses).length;
      logInfo(`Received ${responseCount} responses to analyze`);
      if (responseCount > 0) {
        logDebug(`First few response keys: ${Object.keys(responses).slice(0, 5).join(', ')}`);
      }
    } else {
      logError("No responses found in request body");
    }
  } catch (parseError) {
    logError("Error parsing request JSON:", parseError);
    return createErrorResponse(parseError, 400, "Invalid JSON in request body");
  }

  try {
    if (!responses || typeof responses !== 'object' || Object.keys(responses).length === 0) {
      logError("Empty or invalid responses object received");
      throw new Error("Invalid or empty responses object");
    }
    
    // Format the responses as a clean, well-structured string for the AI
    const formatted = Object.entries(responses)
      .map(([id, answer]) => `Question ${id}: ${answer || "No answer provided"}`)
      .join("\n\n");

    logInfo(`Processing ${Object.keys(responses).length} responses`);
    
    // Enhanced logging of response patterns
    const responseLengths = Object.values(responses).map((r: any) => String(r || "").length);
    const avgLength = responseLengths.reduce((a: number, b: number) => a + b, 0) / responseLengths.length || 0;
    const totalLength = formatted.length;
    
    logInfo(`Average response length: ${avgLength.toFixed(1)} chars`);
    logInfo(`Total response length: ${totalLength} characters`);
    
    // Ensure we have sufficient content to analyze
    if (totalLength < 100) {
      logError("Response content too short for meaningful analysis");
      return createErrorResponse(
        new Error("Insufficient response data"), 
        400, 
        "The provided responses are too short for meaningful analysis"
      );
    }
    
    // Log a sample of the formatted responses
    logDebug(`Formatted responses sample: ${formatted.substring(0, 500)}...`);
    
    return formatted;
  } catch (error) {
    logError("Error processing request:", error);
    return createErrorResponse(error, 400, error.message);
  }
}
