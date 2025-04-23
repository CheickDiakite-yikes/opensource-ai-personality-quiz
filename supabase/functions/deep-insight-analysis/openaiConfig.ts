
export const API_CONFIG = {
  BASE_URL: "https://api.openai.com/v1/chat/completions",
  MAIN_TIMEOUT: 120000, // 120 seconds timeout for primary model (increased to handle complex analysis)
  FALLBACK_TIMEOUT: 90000, // 90 seconds timeout for fallback model (increased for reliability)
  DEFAULT_MODEL: "gpt-4o", // Using the latest model for primary analysis
  FALLBACK_MODEL: "gpt-4o-mini", // More efficient model for fallbacks
  MAIN_MAX_TOKENS: 16000, // Maximum tokens for primary model
  FALLBACK_MAX_TOKENS: 8000, // Reduced tokens for fallback model
  TEMPERATURE: 0.2, // Further reduced temperature for more consistent, research-based outputs
  TOP_P: 0.9,
  FREQUENCY_PENALTY: 0.3, // Adjusted for more diverse responses
  PRESENCE_PENALTY: 0.2, // Increased to discourage repetition
  RETRY_COUNT: 5,  // Increased retry count for better reliability
  RETRY_INITIAL_DELAY: 1000,  // Optimized initial retry delay
  RETRY_MAX_DELAY: 15000,  // Increased maximum retry delay
  RETRY_BACKOFF_FACTOR: 2.0,  // Standard exponential backoff factor
  RESPONSE_FORMAT: { type: "json_object" }  // Ensure JSON response format
};

export interface OpenAIConfig {
  model: string;
  max_tokens: number;
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty?: number;
  totalPromptTokens: number;
  responsesCount: number;
  response_format?: { type: string };
  timeout?: number; // Added timeout parameter for more flexible timeout management
}
