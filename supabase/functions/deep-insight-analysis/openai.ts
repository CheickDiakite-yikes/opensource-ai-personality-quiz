import { SYSTEM_PROMPT } from "./prompts.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export async function callOpenAI(openAIApiKey: string, formattedResponses: string) {
  if (!openAIApiKey || openAIApiKey.trim() === "") {
    throw new Error("OpenAI API key is missing or invalid");
  }

  console.log("Starting OpenAI API call with model: gpt-4o");
  console.time("openai-api-call");

  try {
    // Use AbortController to add a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000); // 90-second timeout for longer processing
    
    const openAIRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: Bearer ${openAIApiKey},
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o", // Using the latest stable model
        max_tokens: 16000,
        temperature: 0.4,
        top_p: 0.9,
        frequency_penalty: 0.3,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: Please analyze these assessment responses with detailed rigorous scoring standards:\n${formattedResponses} },
        ],
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });
    
    // Clear the timeout since we got a response
    clearTimeout(timeoutId);

    console.timeEnd("openai-api-call");
    
    if (!openAIRes.ok) {
      const errorText = await openAIRes.text();
      console.error("OpenAI error →", errorText);
      console.error("OpenAI HTTP status:", openAIRes.status);
      console.error("OpenAI response headers:", Object.fromEntries(openAIRes.headers.entries()));
      throw new Error(OpenAI API Error: ${errorText});
    }

    const response = await openAIRes.json();
    console.log("OpenAI response tokens:", response.usage?.total_tokens || "N/A");
    console.log("OpenAI completion tokens:", response.usage?.completion_tokens || "N/A");
    return response;
  } catch (error) {
    console.error("OpenAI API call failed:", error);
    
    // Try a fallback with a simpler prompt if we timed out
    if (error.name === "AbortError") {
      console.log("API call timed out, trying fallback with simpler prompt...");
      try {
        const fallbackResponse = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: Bearer ${openAIApiKey},
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini", // Fallback to lighter model
            max_tokens: 16000,
            temperature: 0.3,
            messages: [
              { 
                role: "system", 
                content: "Create a long detailed personality analysis with core traits and scores. Return as JSON." 
              },
              { 
                role: "user", 
                content: Analyze these responses with detailed insights:\n${formattedResponses.substring(0, 10000)} 
              },
            ],
            response_format: { type: "json_object" },
          }),
        });
        
        if (!fallbackResponse.ok) {
          throw new Error(Fallback API call failed: ${fallbackResponse.status});
        }
        
        return await fallbackResponse.json();
      } catch (fallbackError) {
        console.error("Fallback API call failed:", fallbackError);
        throw fallbackError;
      }
    }
    
    throw error;
  }
}