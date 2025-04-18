
export function logRequestConfig(config: any) {
  console.log("OpenAI request configuration:", config);
  console.log("System prompt length:", config.totalPromptTokens);
  console.log("Total responses to analyze:", config.responsesCount);
  console.log("First 100 chars of responses:", config.responses?.substring(0, 100) + "...");
}

export function logResponseStats(response: any) {
  console.log("OpenAI response stats:", {
    totalTokens: response.usage?.total_tokens || "N/A",
    completionTokens: response.usage?.completion_tokens || "N/A",
    promptTokens: response.usage?.prompt_tokens || "N/A",
    model: response.model,
    responseLength: response.choices?.[0]?.message?.content?.length || 0
  });
}

export function logError(error: any, context: string) {
  console.error(`${context} error details:`, {
    name: error.name,
    message: error.message,
    stack: error.stack,
    cause: error.cause
  });
}

