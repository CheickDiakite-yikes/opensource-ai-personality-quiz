
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export async function callOpenAI(openAIApiKey: string, formattedResponses: string) {
  if (!openAIApiKey || openAIApiKey.trim() === "") {
    throw new Error("OpenAI API key is missing or invalid");
  }

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

  if (!openAIRes.ok) {
    const errorText = await openAIRes.text();
    console.error("OpenAI error →", errorText);
    throw new Error(`OpenAI API Error: ${errorText}`);
  }

  return openAIRes.json();
}

