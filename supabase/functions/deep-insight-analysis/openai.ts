// src/utils/openai.ts
//--------------------------------------------------------------
//  OpenAI → GPT‑4.1 personality analysis (Responses API)
//--------------------------------------------------------------

import { SYSTEM_PROMPT } from "./prompts.ts";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

/**
 * Call GPT‑4.1 (Responses API) with quiz answers.
 * @param openAIApiKey   – your secret key
 * @param formattedResponses – the user’s answers (plain text)
 */
export async function callOpenAI(
  openAIApiKey: string,
  formattedResponses: string,
) {
  if (!openAIApiKey?.trim()) {
    throw new Error("OpenAI API key is missing or invalid");
  }

  /* ------------------ Build the Responses‑API payload ------------------ */
  const requestBody = {
    model: "gpt-4.1",

    // 👇 NEW: conversation turns live under `input`, NOT `messages`
    input: [
      {
        role: "system",
        content: [
          { type: "input_text", text: SYSTEM_PROMPT },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text:
              `Please analyze these assessment responses with rigorous scoring standards:\n${formattedResponses}`,
          },
        ],
      },
    ],

    /* Structured‑output + advanced knobs */
    text: { format: { type: "json_object" } },
    reasoning: {},

    tools: [
      {
        type: "web_search_preview",
        user_location: { type: "approximate", country: "US" },
        search_context_size: "medium",
      },
    ],

    temperature: 1,
    top_p: 1,
    max_output_tokens: 30_009,
    store: true,
  };

  /* ------------------ Fire the request with 90 s timeout ------------------ */
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 90_000);

  try {
    const res = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text();
      console.error("GPT‑4.1 error →", errText);
      throw new Error(`GPT‑4.1 API Error (${res.status}): ${errText}`);
    }

    const data = await res.json();

    // Optional logging
    console.log("GPT‑4.1 total tokens:", data.usage?.total_tokens ?? "N/A");
    console.log("GPT‑4.1 completion tokens:", data.usage?.completion_tokens ?? "N/A");

    return data; // Includes your JSON‑object analysis
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new Error("GPT‑4.1 request timed out after 90 s.");
    }
    throw err;
  }
}