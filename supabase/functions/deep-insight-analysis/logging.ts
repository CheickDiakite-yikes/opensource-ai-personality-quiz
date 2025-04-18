
export function logRequestConfig(config: any) {
  console.log("OpenAI request configuration:", {
    model: config.model || "unknown",
    max_tokens: config.max_tokens || "unknown",
    temperature: config.temperature || "unknown",
    totalPromptTokens: config.totalPromptTokens || "unknown",
    responsesCount: config.responsesCount || "unknown"
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
  // Safely extract error details, handling undefined values
  const errorObj = {
    name: error?.name || "Unknown",
    message: error?.message || "No message",
    stack: error?.stack || "No stack trace",
    cause: error?.cause || "No cause"
  };
  
  console.error(`${context} error details:`, errorObj);
  
  // Additional logging for debugging
  if (typeof error === 'undefined') {
    console.error(`${context}: Error object is undefined`);
  } else if (error === null) {
    console.error(`${context}: Error object is null`);
  } else if (typeof error === 'string') {
    console.error(`${context}: Error is a string:`, error);
  }
}

export function logDebug(message: string, data?: any) {
  if (data) {
    console.log(`DEBUG - ${message}:`, data);
  } else {
    console.log(`DEBUG - ${message}`);
  }
}
