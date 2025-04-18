
import { API_CONFIG } from "./openaiConfig.ts";
import { logRequestConfig, logResponseStats } from "./logging.ts";

export async function createOpenAIRequest(openAIApiKey: string, messages: Array<{ role: string; content: string }>, maxTokens: number = API_CONFIG.MAIN_MAX_TOKENS) {
  return await fetch(API_CONFIG.BASE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openAIApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: API_CONFIG.DEFAULT_MODEL,
      max_tokens: maxTokens,
      temperature: API_CONFIG.TEMPERATURE,
      top_p: API_CONFIG.TOP_P,
      frequency_penalty: API_CONFIG.FREQUENCY_PENALTY,
      messages,
      response_format: { type: "json_object" },
    }),
  });
}

export async function handleOpenAIResponse(response: Response) {
  if (!response.ok) {
    const errorText = await response.text();
    console.error("OpenAI error details:", {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      error: errorText
    });
    
    throw new Error(`OpenAI API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  logResponseStats(data);
  return data;
}

