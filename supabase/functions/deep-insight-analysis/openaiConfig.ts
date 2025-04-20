
export const API_CONFIG = {
  BASE_URL: "https://api.openai.com/v1/chat/completions",
  MAIN_TIMEOUT: 160000, // Increased to 160 seconds for gpt-4o
  FALLBACK_TIMEOUT: 100000, // Increased fallback timeout further
  DEFAULT_MODEL: "gpt-4o", // Using gpt-4o as default
  FALLBACK_MODEL: "gpt-4o-mini", // Fallback to gpt-4o-mini
  MAIN_MAX_TOKENS: 16000, // Maximum allowed for gpt-4o
  FALLBACK_MAX_TOKENS: 12000, // Increased fallback tokens
  TEMPERATURE: 0.2, // Lower temperature for more deterministic outputs
  TOP_P: 0.95,
  FREQUENCY_PENALTY: 0.2,
  RETRY_COUNT: 3,
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
