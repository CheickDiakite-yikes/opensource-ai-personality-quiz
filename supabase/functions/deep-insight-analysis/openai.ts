
import { SYSTEM_PROMPT } from "./prompts.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export async function callOpenAI(openAIApiKey: string, formattedResponses: string) {
  if (!openAIApiKey || openAIApiKey.trim() === "") {
    console.error("OpenAI API key missing or empty");
    throw new Error("OpenAI API key is missing or invalid");
  }

  console.log("Starting OpenAI API call with model: gpt-4o");
  console.time("openai-api-call");

  try {
    // Use AbortController to add a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn("OpenAI API call timeout after 60 seconds");
      controller.abort();
    }, 60000); // 60-second timeout
    
    // Log the API request details without sensitive data
    console.log("Sending request to OpenAI API with prompt length:", formattedResponses.length);
    console.log("Request configuration:", {
      model: "gpt-4o",
      max_tokens: 4000,
      temperature: 0.4,
      hasSystemPrompt: !!SYSTEM_PROMPT,
      systemPromptLength: SYSTEM_PROMPT?.length || 0,
      userPromptSample: formattedResponses.substring(0, 100) + "..." // Log just a sample
    });
    
    const openAIRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        max_tokens: 4000,
        temperature: 0.4,
        top_p: 0.9,
        frequency_penalty: 0.3,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Please analyze these assessment responses with rigorous scoring standards:\n${formattedResponses}` },
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
      
      // Enhanced error info with status code
      throw new Error(`OpenAI API Error (${openAIRes.status}): ${errorText}`);
    }

    const response = await openAIRes.json();
    console.log("OpenAI response tokens:", response.usage?.total_tokens || "N/A");
    console.log("OpenAI completion tokens:", response.usage?.completion_tokens || "N/A");
    
    return response;
  } catch (error) {
    console.error("OpenAI API call failed:", error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    // Try a fallback with a simpler prompt if we timed out or had another error
    if (error.name === "AbortError" || error.toString().includes("timeout")) {
      console.log("API call timed out or aborted, trying fallback with simpler prompt...");
      try {
        // Log the fallback attempt
        console.time("openai-fallback-call");
        
        const fallbackResponse = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openAIApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini", // Use a smaller, faster model for fallback
            max_tokens: 2000,
            temperature: 0.3,
            messages: [
              { 
                role: "system", 
                content: "Create a brief personality analysis with core traits and scores. Return as JSON." 
              },
              { 
                role: "user", 
                content: `Analyze these responses with brief insights:\n${formattedResponses.substring(0, 2000)}` 
              },
            ],
            response_format: { type: "json_object" },
          }),
        });
        
        console.timeEnd("openai-fallback-call");
        
        if (!fallbackResponse.ok) {
          const fallbackErrorText = await fallbackResponse.text();
          console.error("Fallback OpenAI error:", fallbackErrorText);
          throw new Error(`Fallback API call failed (${fallbackResponse.status}): ${fallbackErrorText}`);
        }
        
        const fallbackResult = await fallbackResponse.json();
        console.log("Fallback response tokens:", fallbackResult.usage?.total_tokens || "N/A");
        return fallbackResult;
      } catch (fallbackError) {
        console.error("Fallback API call failed:", fallbackError);
        console.error("Fallback error name:", fallbackError.name);
        console.error("Fallback error message:", fallbackError.message);
        
        // Return a minimal valid response structure that the frontend can handle
        return {
          choices: [
            {
              message: {
                content: JSON.stringify({
                  overview: "Unable to complete analysis due to API timeout. Please try again later.",
                  coreTraits: {
                    primary: "Analysis unavailable",
                    tertiaryTraits: ["Please try again"]
                  },
                  intelligenceScore: 50,
                  emotionalIntelligenceScore: 50
                })
              }
            }
          ]
        };
      }
    }
    
    // If it wasn't an abort error, re-throw
    throw error;
  }
}
