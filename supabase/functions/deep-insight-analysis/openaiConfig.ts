
export const API_CONFIG = {
  BASE_URL: "https://api.openai.com/v1/chat/completions",
  DEFAULT_MODEL: "gpt-4o",
  FALLBACK_MODEL: "gpt-4o-mini",
  TEMPERATURE: 0.5, // Lowered from 0.7 for more consistent outputs
  TOP_P: 1,
  FREQUENCY_PENALTY: 0,
  PRESENCE_PENALTY: 0,
  RESPONSE_FORMAT: { type: "json_object" },
  MAX_TOKENS: 4000, // Set explicit max tokens
  FALLBACK_MAX_TOKENS: 3000,
  FALLBACK_TIMEOUT: 45000, // Extended timeout for more reliable responses
  RETRY_ATTEMPTS: 2 // Add retry attempts
};
