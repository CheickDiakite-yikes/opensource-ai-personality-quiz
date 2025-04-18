
import { SYSTEM_PROMPT } from "./prompts.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Calls the OpenAI API with GPT-4o model and falls back to GPT-4o-mini on failure.
 */
export async function callOpenAI(openAIApiKey: string, formattedResponses: string) {
  if (!openAIApiKey || openAIApiKey.trim() === "") {
    throw new Error("OpenAI API key is missing or invalid");
  }

  console.log("Starting OpenAI API call with model: gpt-4o");
  console.time("openai-api-call");

  // Build the messages payload with system and user content
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: formattedResponses }
  ];
  
  // Use AbortController to enforce a timeout on the request
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 90_000); // 90 seconds
  
  try {
    // Make the API call to GPT-4o
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openAIApiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: messages,
        temperature: 1,
        top_p: 1,
        max_tokens: 30000
      }),
      signal: controller.signal
    });
    
    // Clear the timeout since the request completed
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      // Log the error details for debugging
      const errText = await response.text();
      console.error(`OpenAI API call failed: ${response.status} - ${errText}`);
      throw new Error(`OpenAI call failed with status ${response.status}`);
    }
    
    // Parse the successful response
    const data = await response.json();
    console.timeEnd("openai-api-call");
    return data;
    
  } catch (error) {
    // If the primary call fails or times out, log the error and fall back to GPT-4o-mini
    if (error.name === "AbortError") {
      console.error("GPT-4o request timed out (90s). Falling back to GPT-4o-mini...");
    } else {
      console.error("GPT-4o request error:", error);
      console.error("Falling back to GPT-4o-mini with a simplified prompt...");
    }
    
    // Clear any existing timeout
    clearTimeout(timeoutId);
    
    // Fallback to GPT-4o-mini
    console.log("Starting fallback OpenAI API call with model: gpt-4o-mini");
    console.time("openai-api-fallback-call");
    
    // New AbortController for the fallback call
    const fallbackController = new AbortController();
    const fallbackTimeoutId = setTimeout(() => fallbackController.abort(), 90_000);
    
    try {
      const fallbackResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openAIApiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: messages,
          temperature: 1,
          top_p: 1,
          max_tokens: 30000
        }),
        signal: fallbackController.signal
      });
      
      clearTimeout(fallbackTimeoutId);
      
      if (!fallbackResponse.ok) {
        const errText = await fallbackResponse.text();
        console.error(`Fallback OpenAI API call failed: ${fallbackResponse.status} - ${errText}`);
        throw new Error(`Fallback OpenAI call failed with status ${fallbackResponse.status}`);
      }
      
      const fallbackData = await fallbackResponse.json();
      console.timeEnd("openai-api-fallback-call");
      return fallbackData;
    } catch (fallbackError) {
      clearTimeout(fallbackTimeoutId);
      console.error("Both primary and fallback OpenAI calls failed.", fallbackError);
      throw fallbackError;
    }
  }
}
