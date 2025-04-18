
import { SYSTEM_PROMPT } from "./prompts.ts";

/**
 * Calls the OpenAI API using GPT-4.1 with advanced config, and falls back to GPT-4o on failure.
 */
async function callOpenAI(): Promise<any> {
  // Prepare the API endpoint and authorization (using raw fetch, not OpenAI SDK).
  const OPENAI_API_URL = "https://api.openai.com/v1/responses";  // Using the Responses API endpoint for advanced features
  const apiKey = process.env.OPENAI_API_KEY;  // Assume API key is set in environment
  
  // Build the messages payload with system and user content.
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },                   // System prompt with detailed instructions
    { role: "user", content: formattedResponses }                // User content from formattedResponses (already formatted)
  ];
  
  // Construct the request body for GPT-4.1 with advanced configuration.
  const requestBody: any = {
    model: "gpt-4.1",                                           // **Model update:** use GPT-4.1 instead of GPT-4o
    messages: messages,
    text: { format: { type: "json_object" } },                  // **New:** request structured JSON object output
    reasoning: {},                                              // **New:** include reasoning chain (if model supports it)
    tools: [                                                    // **New:** enable web search tool for additional context
      { 
        type: "web_search_preview", 
        user_location: { type: "approximate", country: "US" },  // approximate user location (country-level)
        search_context_size: "medium"                           // medium search context for web results
      }
    ],
    temperature: 1,                                             // preserve temperature setting (1 for maximum creativity)
    top_p: 1,                                                   // preserve top_p setting (1 for full distribution)
    store: true,                                                // **New:** store conversation state on OpenAI side for continuity
    max_output_tokens: 30009                                    // **New:** allow up to 30009 tokens in the output (long context support)
    // Note: 'max_output_tokens' replaces any 'max_tokens' usage for the Responses API.
  };
  
  // Use AbortController to enforce a 90s timeout on the request.
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 90_000);  // 90,000 ms = 90 seconds
  
  try {
    // Make the primary API call to GPT-4.1
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });
    clearTimeout(timeoutId);  // Clear the timeout since the request completed
    
    if (!response.ok) {
      // Log the error details for debugging (preserving existing error logging behavior)
      const errText = await response.text();
      console.error(`GPT-4.1 API call failed: ${response.status} - ${errText}`);
      throw new Error(`GPT-4.1 call failed with status ${response.status}`);
    }
    
    // Parse the successful response from GPT-4.1
    const data = await response.json();
    return data;  // Return the entire response data (includes assistant message content in JSON format)
    
  } catch (primaryError) {
    // If the primary call fails or times out, log the error and fall back to GPT-4o
    if (primaryError.name === "AbortError") {
      console.error("GPT-4.1 request timed out (90s). Falling back to GPT-4o...");
    } else {
      console.error("GPT-4.1 request error:", primaryError);
      console.error("Falling back to GPT-4o with a simplified prompt...");
    }
    
    // **Fallback:** Use GPT-4o (full model) with a simpler version of the prompt (no web search tool or reasoning).
    const fallbackBody: any = {
      model: "gpt-4o",                                         // Fallback to original GPT-4 model
      messages: messages,                                      // Reuse the same system and user messages
      text: { format: { type: "json_object" } },               // Still request JSON formatted output for consistency
      // We omit 'reasoning' and 'tools' for the fallback to simplify the request
      temperature: 1,
      top_p: 1,
      store: true,                                             // Still store the conversation (if supported)
      max_output_tokens: 30009
    };
    
    // (Optional) Use a new AbortController for the fallback call to enforce the same 90s timeout
    const fallbackController = new AbortController();
    const fallbackTimeoutId = setTimeout(() => fallbackController.abort(), 90_000);
    try {
      const fallbackResponse = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify(fallbackBody),
        signal: fallbackController.signal
      });
      clearTimeout(fallbackTimeoutId);
      
      if (!fallbackResponse.ok) {
        // Log error from fallback attempt as well
        const errText = await fallbackResponse.text();
        console.error(`GPT-4o fallback call failed: ${fallbackResponse.status} - ${errText}`);
        throw new Error(`GPT-4o fallback failed with status ${fallbackResponse.status}`);
      }
      
      const fallbackData = await fallbackResponse.json();
      return fallbackData;
    } catch (fallbackError) {
      clearTimeout(fallbackTimeoutId);
      console.error("Both GPT-4.1 and GPT-4o calls failed.", fallbackError);
      // Propagate the error up (or handle it according to the app's error strategy)
      throw fallbackError;
    }
  }
}