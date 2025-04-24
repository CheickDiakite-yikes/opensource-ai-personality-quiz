
export const API_CONFIG = {
  BASE_URL: "https://api.openai.com/v1/chat/completions",
  DEFAULT_MODEL: "gpt-4o",
  FALLBACK_MODEL: "gpt-4o-mini",
  TEMPERATURE: 0.4, // Lowered from 0.5 for more consistent outputs
  TOP_P: 0.95,
  FREQUENCY_PENALTY: 0.1,
  PRESENCE_PENALTY: 0.1,
  RESPONSE_FORMAT: { type: "json_object" },
  MAX_TOKENS: 4500, // Increased tokens for more detailed responses
  FALLBACK_MAX_TOKENS: 3500,
  FALLBACK_TIMEOUT: 60000, // Extended timeout for more reliable responses
  RETRY_ATTEMPTS: 2 // Add retry attempts
};
