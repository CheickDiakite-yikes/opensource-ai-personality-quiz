
import { API_CONFIG } from "./openaiConfig.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { logError, logDebug } from "./logging.ts";

export async function callOpenAI(apiKey: string, formattedResponses: string) {
  const messages = [
    {
      role: "system",
      content: "You are an expert psychological profiler specializing in deep insight analysis. Analyze the assessment responses to create a comprehensive personality profile that covers cognitive patterns, emotional architecture, and interpersonal dynamics."
    },
    {
      role: "user",
      content: `Please analyze these assessment responses and provide a detailed psychological profile:\n\n${formattedResponses}`
    }
  ];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...corsHeaders
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: messages,
      temperature: 0.7,
      response_format: { type: "json_object" },
      max_tokens: 4000
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    logError("OpenAI API error:", error);
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  return response.json();
}
