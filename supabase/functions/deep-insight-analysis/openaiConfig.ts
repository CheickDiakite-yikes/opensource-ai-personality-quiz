
export const API_CONFIG = {
  BASE_URL: "https://api.openai.com/v1/chat/completions",
  DEFAULT_MODEL: "gpt-4o",
  FALLBACK_MODEL: "gpt-4o-mini",
  TEMPERATURE: 0.7,
  TOP_P: 1,
  FREQUENCY_PENALTY: 0,
  PRESENCE_PENALTY: 0,
  RESPONSE_FORMAT: { type: "json_object" },
  FALLBACK_MAX_TOKENS: 3000,
  FALLBACK_TIMEOUT: 30000
};
