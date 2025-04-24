
export const API_CONFIG = {
  BASE_URL: "https://api.openai.com/v1/chat/completions",
  DEFAULT_MODEL: "gpt-4o",
  FALLBACK_MODEL: "gpt-4o-mini",
  TEMPERATURE: 0.7, // Increased from 0.4 for more creative, detailed responses
  TOP_P: 0.95,
  FREQUENCY_PENALTY: 0.1,
  PRESENCE_PENALTY: 0.2, // Increased to encourage more diverse content
  RESPONSE_FORMAT: { type: "json_object" },
  MAX_TOKENS: 6000, // Increased significantly for much more detailed responses
  FALLBACK_MAX_TOKENS: 4500, // Increased fallback tokens as well
  FALLBACK_TIMEOUT: 120000, // Doubled timeout for more reliable responses
  RETRY_ATTEMPTS: 3 // Increased retry attempts
};
