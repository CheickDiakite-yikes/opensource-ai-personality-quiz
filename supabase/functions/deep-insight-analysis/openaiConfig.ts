
export const API_CONFIG = {
  BASE_URL: "https://api.openai.com/v1/chat/completions",
  MAIN_TIMEOUT: 170000, // Increased to 170 seconds for gpt-4o
  FALLBACK_TIMEOUT: 120000, // Increased fallback timeout further
  DEFAULT_MODEL: "gpt-4o-mini", // Changed to use gpt-4o-mini as default for reliability
  FALLBACK_MODEL: "gpt-4o-mini", // Keep fallback as gpt-4o-mini
  MAIN_MAX_TOKENS: 12000, // Reduced from 16000 to improve completion speed
  FALLBACK_MAX_TOKENS: 8000, // Reduced for faster fallback responses
  TEMPERATURE: 0.2, // Lower temperature for more deterministic outputs
  TOP_P: 0.95,
  FREQUENCY_PENALTY: 0.2,
  RETRY_COUNT: 4,
  RETRY_INITIAL_DELAY: 1500,
  RETRY_MAX_DELAY: 8000,
  RETRY_BACKOFF_FACTOR: 1.8
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
