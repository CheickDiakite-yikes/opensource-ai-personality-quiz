
export const API_CONFIG = {
  BASE_URL: "https://api.openai.com/v1/chat/completions",
  MAIN_TIMEOUT: 140000, // Increased to 140 seconds for gpt-4o
  FALLBACK_TIMEOUT: 90000, // Increased fallback timeout
  DEFAULT_MODEL: "gpt-4o", // Changed to use gpt-4o
  FALLBACK_MODEL: "gpt-4o-mini", // Fallback to gpt-4o-mini
  MAIN_MAX_TOKENS: 16000, // Maximum allowed for gpt-4o
  FALLBACK_MAX_TOKENS: 12000, // Increased fallback tokens
  TEMPERATURE: 0.3, // Lower temperature for more deterministic outputs
  TOP_P: 0.9,
  FREQUENCY_PENALTY: 0.2,
  RETRY_COUNT: 3,  // Kept retry count
  RETRY_INITIAL_DELAY: 2000,
  RETRY_MAX_DELAY: 10000,
  RETRY_BACKOFF_FACTOR: 2
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
