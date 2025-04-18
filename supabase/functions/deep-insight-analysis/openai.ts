
// src/utils/openai.ts  — GPT‑4.1 call *without* Web‑Search
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
    console.error("OpenAI API key is missing or invalid");
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
    console.log("Starting OpenAI API call to gpt-4.1 model");
    console.time("openai-api-call");
    
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
    console.timeEnd("openai-api-call");

    if (!res.ok) {
      const errText = await res.text();
      console.error(`GPT‑4.1 API Error (${res.status}):`, errText);
      
      // Log more detailed information about the error
      if (res.status === 401) {
        console.error("Authentication error: Check if API key is valid and not expired");
      } else if (res.status === 429) {
        console.error("Rate limit exceeded or insufficient quota");
      } else if (res.status === 500) {
        console.error("OpenAI server error");
      }
      
      throw new Error(`GPT‑4.1 API Error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    console.log("GPT‑4.1 total tokens:", data.usage?.total_tokens ?? "N/A");
    console.log("GPT‑4.1 completion tokens:", data.usage?.completion_tokens ?? "N/A");
    
    // Validate response data structure
    if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Invalid response structure from OpenAI:", JSON.stringify(data));
      throw new Error("Invalid response structure received from OpenAI API");
    }
    
    return data;
  } catch (err: any) {
    clearTimeout(timeoutId);
    
    // Improved error logging with detailed diagnostic information
    console.error("📌 OpenAI API call failed:", err.name, err.message);
    
    if (err.name === "AbortError") {
      console.error("Request timed out after 190 seconds");
      throw new Error("GPT‑4.1 request timed out after 190 s.");
    } else if (err.name === "TypeError" && err.message.includes("failed to fetch")) {
      console.error("Network error: Unable to reach OpenAI API. Check your internet connection or if API endpoint is correct.");
    } else if (err.name === "SyntaxError") {
      console.error("Invalid JSON response from OpenAI API");
    }
    
    // Log the stack trace for better debugging
    console.error("Error stack trace:", err.stack);
    
    throw err;
  }
}
