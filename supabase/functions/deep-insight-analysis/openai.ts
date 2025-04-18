// src/utils/openai.ts
//--------------------------------------------------------------
//  OpenAI → GPT‑4.1 personality‑analysis call (no fallback)
//--------------------------------------------------------------

import { SYSTEM_PROMPT } from "./prompts.ts";

/**
 * CORS headers for Supabase Edge Functions (if you expose this handler)
 * – keep them exactly as before so nothing breaks.
 */
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

/**
 * Call GPT‑4.1 with the advanced “responses” API.
 * @param openAIApiKey Your OpenAI secret key (e.g. from env or header)
 * @param formattedResponses The user’s quiz answers, already formatted
 * @returns The full JSON the model returns (includes your JSON‑object output)
 * @throws Any network / HTTP / Abort errors
 */
export async function callOpenAI(
  openAIApiKey: string,
  formattedResponses: string,
) {
  if (!openAIApiKey?.trim()) {
    throw new Error("OpenAI API key is missing or invalid");
  }

  // ————————————————————————————————————————————————
  // Build request payload for GPT‑4.1 “responses” API
  // ————————————————————————————————————————————————
  const requestBody = {
    model: "gpt-4.1",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Please analyze these assessment responses with rigorous scoring standards:\n${formattedResponses}`,
      },
    ],

    /* NEW RESPONSE‑API FIELDS */
    text: { format: { type: "json_object" } },
    reasoning: {}, // Enables chain‑of‑thought internally (you won’t see it)
    tools: [
      {
        type: "web_search_preview",
        user_location: { type: "approximate", country: "US" },
        search_context_size: "medium",
      },
    ],

    /* Sampling & output controls */
    temperature: 1,
    top_p: 1,
    max_output_tokens: 30_009,
    store: true, // Persist thread on OpenAI’s side for follow‑ups
  };

  // ————————————————————————————————————————————————
  // Fire the request with a 90‑second hard timeout
  // ————————————————————————————————————————————————
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 90_000);

  try {
    const openAIRes = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!openAIRes.ok) {
      const errorText = await openAIRes.text();
      console.error("OpenAI error →", errorText);
      console.error("OpenAI HTTP status:", openAIRes.status);
      throw new Error(`GPT‑4.1 API Error (${openAIRes.status}): ${errorText}`);
    }

    const data = await openAIRes.json();

    // Optional logging for cost / usage tracking
    console.log("GPT‑4.1 total tokens:", data.usage?.total_tokens ?? "N/A");
    console.log(
      "GPT‑4.1 completion tokens:",
      data.usage?.completion_tokens ?? "N/A",
    );

    return data; // Contains your JSON‑object personality analysis
  } catch (err: any) {
    if (err.name === "AbortError") {
      throw new Error("GPT‑4.1 request timed out (90 s).");
    }
    throw err; // Bubble up other errors
  }
}