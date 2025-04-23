
export const API_CONFIG = {
  BASE_URL: "https://api.openai.com/v1/chat/completions",
  MAIN_TIMEOUT: 90000, // 90 seconds timeout for primary model
  FALLBACK_TIMEOUT: 60000, // 60 seconds timeout for fallback model
  DEFAULT_MODEL: "gpt-4o", // Using our best model for primary analysis
  FALLBACK_MODEL: "gpt-4o-mini", // More efficient model for fallbacks
  MAIN_MAX_TOKENS: 16000, // Maximum tokens for primary model
  FALLBACK_MAX_TOKENS: 8000, // Reduced tokens for fallback model
  TEMPERATURE: 0.3, // Reduced temperature for more consistent outputs
  TOP_P: 0.9,
  FREQUENCY_PENALTY: 0.2, // Slightly reduced for more focused responses
  PRESENCE_PENALTY: 0.1, // Added to discourage repetition
  RETRY_COUNT: 3,  // Increased retry count for better reliability
  RETRY_INITIAL_DELAY: 1500,  // Reduced initial retry delay
  RETRY_MAX_DELAY: 10000,  // Maximum retry delay
  RETRY_BACKOFF_FACTOR: 1.8,  // Slightly adjusted exponential backoff factor
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
}
