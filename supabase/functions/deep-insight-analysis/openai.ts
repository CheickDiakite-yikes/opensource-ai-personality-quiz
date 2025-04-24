
import { API_CONFIG } from "./openaiConfig.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { logError, logDebug } from "./logging.ts";
import { SYSTEM_PROMPT, USER_PROMPT } from "./prompts.ts";

export async function callOpenAI(apiKey: string, formattedResponses: string) {
  const messages = [
    {
      role: "system",
      content: SYSTEM_PROMPT
    },
    {
      role: "user",
      content: USER_PROMPT(formattedResponses)
    }
  ];

  logDebug("Sending request to OpenAI API");
  logDebug(`Request payload size: ${JSON.stringify(messages).length} characters`);
  
  const response = await fetch(API_CONFIG.BASE_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...corsHeaders
    },
    body: JSON.stringify({
      model: API_CONFIG.DEFAULT_MODEL,
      messages: messages,
      temperature: API_CONFIG.TEMPERATURE,
      top_p: API_CONFIG.TOP_P,
      frequency_penalty: API_CONFIG.FREQUENCY_PENALTY, 
      presence_penalty: API_CONFIG.PRESENCE_PENALTY,
      response_format: API_CONFIG.RESPONSE_FORMAT,
      max_tokens: 4000
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    logError(`OpenAI API error: ${response.status}`, error);
    throw new Error(`OpenAI API error: ${response.status} - ${error?.error?.message || 'Unknown error'}`);
  }

  logDebug("Received successful response from OpenAI API");
  return response.json();
}
