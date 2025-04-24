
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
    const assessmentId = body?.assessmentId; // Extract assessmentId if provided
    
    if (assessmentId) {
      logInfo(`Processing request for assessment ID: ${assessmentId}`);
    }
    
    logInfo(`Request body parsed successfully, contains responses: ${!!responses}`);
    
    // Log more details about the request for debugging
    if (responses) {
      const responseCount = Array.isArray(responses) ? responses.length : Object.keys(responses).length;
      logInfo(`Received ${responseCount} responses to analyze`);
      if (responseCount > 0) {
        if (Array.isArray(responses)) {
          logDebug(`First few response IDs: ${responses.slice(0, 5).map(r => r.questionId || 'unknown').join(', ')}`);
        } else {
          logDebug(`First few response keys: ${Object.keys(responses).slice(0, 5).join(', ')}`);
        }
      }
    } else {
      logError("No responses found in request body");
    }
  } catch (parseError) {
    logError("Error parsing request JSON:", parseError);
    return createErrorResponse(parseError, 400, "Invalid JSON in request body");
  }

  try {
    if (!responses) {
      logError("Empty responses object received");
      throw new Error("Invalid or empty responses object");
    }
    
    // Handle both array format and object format
    let formatted = "";
    if (Array.isArray(responses)) {
      formatted = responses
        .map((item, index) => {
          const question = item.question || `Question ${item.questionId || index}`;
          const answer = item.answer || item.selectedOption || "No answer provided";
          return `Question ${index}: ${answer}`;
        })
        .join("\n\n");
        
      logInfo(`Processing ${responses.length} array-format responses`);
      logDebug(`Sample responses: ${JSON.stringify(responses.slice(0, 2))}`);
    } else if (typeof responses === 'object') {
      formatted = Object.entries(responses)
        .map(([id, answer]) => `Question ${id}: ${answer || "No answer provided"}`)
        .join("\n\n");
        
      logInfo(`Processing ${Object.keys(responses).length} object-format responses`);
      logDebug(`Sample response keys: ${JSON.stringify(Object.keys(responses).slice(0, 2))}`);
    } else {
      throw new Error("Responses must be an array or object");
    }

    // Log the formatted content for debugging
    logDebug(`Formatted request content (first 500 chars): ${formatted.substring(0, 500)}...`);
    
    return formatted;
  } catch (error) {
    logError("Error processing request:", error);
    return createErrorResponse(error, 400, error.message);
  }
}
