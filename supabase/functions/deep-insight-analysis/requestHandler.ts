
import { corsHeaders } from "../_shared/cors.ts";
import { createErrorResponse } from "./errorHandler.ts";
import { logInfo, logError } from "./logging.ts";

export async function processRequest(req: Request) {
  // Parse request body early to quickly return errors if needed
  let responses;
  try {
    const body = await req.json();
    responses = body.responses;
    logInfo(`Request body parsed successfully, contains responses: ${!!responses}`);
  } catch (parseError) {
    logError("Error parsing request JSON:", parseError);
    return createErrorResponse(parseError, 400, "Invalid JSON in request body");
  }

  try {
    if (!responses || typeof responses !== 'object' || Object.keys(responses).length === 0) {
      throw new Error("Invalid or empty responses object");
    }
    
    const formatted = Object.entries(responses)
      .map(([id, answer]) => `Q${id}: ${answer}`)
      .join("\n");

    logInfo(`Processing ${Object.keys(responses).length} responses`);
    
    // Enhanced logging of response patterns
    const responseLengths = Object.values(responses).map(r => String(r).length);
    const avgLength = responseLengths.reduce((a: number, b: number) => a + b, 0) / responseLengths.length;
    logInfo(`Average response length: ${avgLength}`);
    logInfo(`Total response length: ${formatted.length} characters`);
    
    return formatted;
  } catch (error) {
    return createErrorResponse(error, 400, error.message);
  }
}
