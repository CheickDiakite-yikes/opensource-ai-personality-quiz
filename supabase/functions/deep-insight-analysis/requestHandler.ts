
import { corsHeaders } from "../_shared/cors.ts";
import { callOpenAI } from "./openai.ts";
import { handleRequestValidation, createErrorResponse } from "./errorHandler.ts";

export async function processRequest(req: Request) {
  // Parse request body early to quickly return errors if needed
  let responses;
  try {
    const body = await req.json();
    responses = body.responses;
    console.log(`Request body parsed successfully, contains responses: ${!!responses}`);
  } catch (parseError) {
    console.error("Error parsing request JSON:", parseError);
    return createErrorResponse(parseError, 400, "Invalid JSON in request body");
  }

  try {
    handleRequestValidation(responses);
    
    const formatted = Object.entries(responses)
      .map(([id, answer]) => `Q${id}: ${answer}`)
      .join("\n");

    console.log(`Processing ${Object.keys(responses).length} responses`);
    
    // Enhanced logging of response patterns
    console.log("Response distribution analysis:");
    const responseLengths = Object.values(responses).map(r => String(r).length);
    const avgLength = responseLengths.reduce((a, b) => a + b, 0) / responseLengths.length;
    console.log(`Average response length: ${avgLength}`);
    console.log(`Total response length: ${formatted.length} characters`);
    
    return formatted;
  } catch (error) {
    return createErrorResponse(error, 400, error.message);
  }
}
