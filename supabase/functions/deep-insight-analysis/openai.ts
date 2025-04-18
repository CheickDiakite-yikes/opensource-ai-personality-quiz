// src/utils/openai.ts  — GPT‑4.1 call *without* Web‑Search
//--------------------------------------------------------------

import { SYSTEM_PROMPT } from "./prompts.ts";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

export async function callOpenAI(
  openAIApiKey: string,
  formattedResponses: string,
) {
  if (!openAIApiKey?.trim()) {
    throw new Error("OpenAI API key is missing or invalid");
  }

  /* ------------ Build GPT‑4.1 request (NO tools) ------------ */
  const requestBody = {
    model: "gpt-4.1",
    input: [
      {
        role: "system",
        content: [{ type: "input_text", text: SYSTEM_PROMPT }],
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

    // structured JSON output
    text: { format: { type: "json_object" } },

    // optional chain‑of‑thought (kept; safe for JSON mode)
    reasoning: {},

    temperature: 1,
    top_p: 1,
    max_output_tokens: 30_009,
    store: true,
  };

  /* ------------ 190‑s timeout guard ------------ */
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 190_000);

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
    console.log("GPT‑4.1 total tokens:", data.usage?.total_tokens ?? "N/A");
    console.log("GPT‑4.1 completion tokens:", data.usage?.completion_tokens ?? "N/A");

    return data;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new Error("GPT‑4.1 request timed out after 190 s.");
    }
    throw err;
  }
}