
export const API_CONFIG = {
  BASE_URL: "https://api.openai.com/v1/chat/completions",
  MAIN_TIMEOUT: 90000, // Increased to 90 seconds
  FALLBACK_TIMEOUT: 60000, // Increased fallback timeout
  DEFAULT_MODEL: "gpt-4o",
  FALLBACK_MODEL: "gpt-4o-mini", 
  MAIN_MAX_TOKENS: 16000, // Maximum allowed for GPT-4o
  FALLBACK_MAX_TOKENS: 8000, // Reduced fallback tokens
  TEMPERATURE: 0.4,
  TOP_P: 0.9,
  FREQUENCY_PENALTY: 0.3,
  RETRY_COUNT: 2,  // Added retry count
  RETRY_INITIAL_DELAY: 2000,  // Added initial retry delay in ms
  RETRY_MAX_DELAY: 10000,  // Added maximum retry delay in ms
  RETRY_BACKOFF_FACTOR: 2  // Added exponential backoff factor
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
