
export const API_CONFIG = {
  BASE_URL: "https://api.openai.com/v1/chat/completions",
  DEFAULT_MODEL: "gpt-4o",
  FALLBACK_MODEL: "gpt-4o-mini",
  TEMPERATURE: 0.7, 
  TOP_P: 0.95,
  FREQUENCY_PENALTY: 0.1,
  PRESENCE_PENALTY: 0.2,
  RESPONSE_FORMAT: { type: "json_object" },
  MAX_TOKENS: 8000,  // Increased to ensure we get very detailed responses
  FALLBACK_MAX_TOKENS: 6000, // Also increased fallback tokens
  FALLBACK_TIMEOUT: 180000, // Increased timeout to 3 minutes for more reliable responses
  RETRY_ATTEMPTS: 3
};
