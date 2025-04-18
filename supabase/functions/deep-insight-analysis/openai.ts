
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
    // Log detailed configuration
    const config = {
      model: "gpt-4o",
      max_tokens: 4000,
      temperature: 0.4,
      top_p: 0.9,
      frequency_penalty: 0.3,
      totalPromptTokens: SYSTEM_PROMPT.length + formattedResponses.length,
      responsesCount: formattedResponses.split('\n').length
    };
    
    console.log("OpenAI request configuration:", config);
    console.log("System prompt length:", SYSTEM_PROMPT.length);
    console.log("Total responses to analyze:", formattedResponses.split('\n').length);
    
    // Use Promise.race for timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("OpenAI request timed out after 60 seconds")), 60000)
    );
    
    const fetchPromise = fetch("https://api.openai.com/v1/chat/completions", {
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
    });
    
    // Race between timeout and actual request
    const openAIRes = await Promise.race([fetchPromise, timeoutPromise]);
    console.timeEnd("openai-api-call");
    
    if (!openAIRes.ok) {
      const errorText = await openAIRes.text();
      console.error("OpenAI error details:", {
        status: openAIRes.status,
        statusText: openAIRes.statusText,
        headers: Object.fromEntries(openAIRes.headers.entries()),
        error: errorText
      });
      
      throw new Error(`OpenAI API Error (${openAIRes.status}): ${errorText}`);
    }

    const response = await openAIRes.json();
    
    // Log completion details
    console.log("OpenAI response stats:", {
      totalTokens: response.usage?.total_tokens || "N/A",
      completionTokens: response.usage?.completion_tokens || "N/A",
      promptTokens: response.usage?.prompt_tokens || "N/A",
      model: response.model || config.model,
      responseLength: response.choices?.[0]?.message?.content?.length || 0
    });
    
    return response;
  } catch (error) {
    console.error("OpenAI API call error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    
    // If it's a timeout or network error, try the fallback
    if (error.name === "AbortError" || error.message.includes("timeout") || error.message.includes("Failed to fetch")) {
      console.log("Attempting fallback with simpler prompt...");
      console.time("openai-fallback-call");
      
      try {
        const fallbackResponse = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openAIApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            max_tokens: 2000,
            temperature: 0.3,
            messages: [
              { role: "system", content: "Create a brief personality analysis with core traits and scores. Return as JSON." },
              { role: "user", content: `Analyze these responses with brief insights:\n${formattedResponses.substring(0, 2000)}` },
            ],
            response_format: { type: "json_object" },
          }),
        });
        
        console.timeEnd("openai-fallback-call");
        
        if (!fallbackResponse.ok) {
          const fallbackErrorText = await fallbackResponse.text();
          console.error("Fallback attempt failed:", {
            status: fallbackResponse.status,
            error: fallbackErrorText
          });
          throw new Error(`Fallback API call failed (${fallbackResponse.status}): ${fallbackErrorText}`);
        }
        
        const fallbackResult = await fallbackResponse.json();
        console.log("Fallback completed successfully with tokens:", fallbackResult.usage?.total_tokens || "N/A");
        return fallbackResult;
      } catch (fallbackError) {
        console.error("Fallback attempt error details:", {
          name: fallbackError.name,
          message: fallbackError.message,
          stack: fallbackError.stack
        });
        
        // Return a minimal valid response structure
        return {
          choices: [{
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
          }]
        };
      }
    }
    
    throw error;
  }
}
