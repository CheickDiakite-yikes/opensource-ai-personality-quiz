import { API_CONFIG } from "./openaiConfig.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { logError, logDebug } from "./logging.ts";

export async function createOpenAIRequest(openAIApiKey: string, messages: any[], maxTokens: number, signal: AbortSignal) {
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${openAIApiKey}`,
    ...corsHeaders,
  };

  const payload = {
    model: "gpt-4o",
    messages: messages,
    max_tokens: maxTokens,
    temperature: API_CONFIG.TEMPERATURE,
    top_p: API_CONFIG.TOP_P,
    frequency_penalty: API_CONFIG.FREQUENCY_PENALTY,
    stream: false,
  };

  logDebug("createOpenAIRequest payload:", payload);

  try {
    const response = await fetch(API_CONFIG.BASE_URL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
      signal: signal,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      logError(`OpenAI API Error: ${response.status} - ${errorBody}`);
      throw new Error(`OpenAI API Error: ${response.status} - ${errorBody}`);
    }

    return response;
  } catch (error) {
    logError("Error in createOpenAIRequest:", error);
    throw error;
  }
}

export async function handleOpenAIResponse(response: Response) {
  try {
    const data = await response.json();
    logDebug("OpenAI Response Data:", data);
    return data;
  } catch (error) {
    logError("Error parsing OpenAI response:", error);
    throw new Error("Failed to parse OpenAI response");
  }
}
