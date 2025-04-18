
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export async function callOpenAI(openAIApiKey: string, formattedResponses: string) {
  if (!openAIApiKey || openAIApiKey.trim() === "") {
    throw new Error("OpenAI API key is missing or invalid");
  }

  console.log("Starting OpenAI API call with model: gpt-4o");
  console.time("openai-api-call");

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
  });

  console.timeEnd("openai-api-call");
  
  if (!openAIRes.ok) {
    const errorText = await openAIRes.text();
    console.error("OpenAI error →", errorText);
    console.error("OpenAI HTTP status:", openAIRes.status);
    console.error("OpenAI response headers:", Object.fromEntries(openAIRes.headers.entries()));
    throw new Error(`OpenAI API Error: ${errorText}`);
  }

  const response = await openAIRes.json();
  console.log("OpenAI response tokens:", response.usage?.total_tokens || "N/A");
  console.log("OpenAI completion tokens:", response.usage?.completion_tokens || "N/A");
  return response;
}

