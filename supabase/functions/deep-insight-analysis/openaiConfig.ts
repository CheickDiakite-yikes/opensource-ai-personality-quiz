
export const API_CONFIG = {
  BASE_URL: "https://api.openai.com/v1/chat/completions",
  MAIN_TIMEOUT: 180000, // Maximum 3 minutes (180 seconds)
  FALLBACK_TIMEOUT: 170000, // Also nearly 3 minutes for fallback
  DEFAULT_MODEL: "gpt-4o", // Use the full gpt-4o model for best results
  FALLBACK_MODEL: "gpt-4o", // Also use gpt-4o as fallback for consistency
  MAIN_MAX_TOKENS: 24000, // Maximum tokens for completeness
  FALLBACK_MAX_TOKENS: 16000, // Generous fallback tokens
  TEMPERATURE: 0.05, // Lower temperature for more deterministic outputs
  TOP_P: 0.98,
  FREQUENCY_PENALTY: 0.1,
  RETRY_COUNT: 5, // Increase retry attempts
  RETRY_INITIAL_DELAY: 1000,
  RETRY_MAX_DELAY: 10000,
  RETRY_BACKOFF_FACTOR: 1.5
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
