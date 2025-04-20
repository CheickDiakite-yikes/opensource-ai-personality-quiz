
export const API_CONFIG = {
  BASE_URL: "https://api.openai.com/v1/chat/completions",
  DEFAULT_MODEL: "gpt-4o",  // Using more capable model for richer analysis
  FALLBACK_MODEL: "gpt-4o-mini",
  MAIN_MAX_TOKENS: 4000,  // Increased token limit for more detailed responses
  FALLBACK_MAX_TOKENS: 2000,
  TEMPERATURE: 0.7,
  TOP_P: 0.9,
  FREQUENCY_PENALTY: 0.2,
  RETRY_COUNT: 3,
  MAIN_TIMEOUT: 60000,
  FALLBACK_TIMEOUT: 30000,
};
