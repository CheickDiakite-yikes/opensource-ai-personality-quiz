
export const API_CONFIG = {
  BASE_URL: "https://api.openai.com/v1/chat/completions",
  MAIN_TIMEOUT: 180000, // Maximum 3 minutes (180 seconds)
  FALLBACK_TIMEOUT: 170000, // Also nearly 3 minutes for fallback
  DEFAULT_MODEL: "gpt-4o", // Use the full gpt-4o model for best results
  FALLBACK_MODEL: "gpt-4o-mini", // Keep fallback as gpt-4o-mini
  MAIN_MAX_TOKENS: 32768, // Increased max tokens for comprehensive analysis
  FALLBACK_MAX_TOKENS: 16000, // Increased fallback tokens
  TEMPERATURE: 0.7, // Slightly higher temperature for more creative outputs
  TOP_P: 1.0,
  FREQUENCY_PENALTY: 0,
  PRESENCE_PENALTY: 0,
  RETRY_COUNT: 3,
  RETRY_INITIAL_DELAY: 2000,
  RETRY_MAX_DELAY: 10000,
  RETRY_BACKOFF_FACTOR: 2.0
};

export interface OpenAIConfig {
  model: string;
  max_tokens: number;
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  totalPromptTokens: number;
  responsesCount: number;
}
