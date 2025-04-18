

export function logRequestConfig(config: any) {
  console.log("OpenAI request configuration:", {
    model: config.model,
    max_tokens: config.max_tokens,
    temperature: config.temperature,
    totalPromptTokens: config.totalPromptTokens,
    responsesCount: config.responsesCount
  });
}

export function logResponseStats(response: any) {
  if (!response) {
    console.log("No response data to log");
    return;
  }
  
  console.log("OpenAI response stats:", {
    totalTokens: response.usage?.total_tokens || "N/A",
    completionTokens: response.usage?.completion_tokens || "N/A",
    promptTokens: response.usage?.prompt_tokens || "N/A",
    model: response.model || "N/A",
    responseLength: response.choices?.[0]?.message?.content?.length || 0,
    finishReason: response.choices?.[0]?.finish_reason || "N/A"
  });
}

export function logError(error: any, context: string) {
  console.error(`${context} error details:`, {
    name: error?.name || "Unknown",
    message: error?.message || "No message",
    stack: error?.stack || "No stack trace",
    cause: error?.cause || "No cause"
  });
}
