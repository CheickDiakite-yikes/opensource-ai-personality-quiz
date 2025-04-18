
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export const API_CONFIG = {
  BASE_URL: "https://api.openai.com/v1/chat/completions",
  MAIN_TIMEOUT: 240000, // 4 minutes
  FALLBACK_TIMEOUT: 120000, // 2 minutes
  DEFAULT_MODEL: "gpt-4o",
  FALLBACK_MODEL: "gpt-4o",
  MAIN_MAX_TOKENS: 16000,
  FALLBACK_MAX_TOKENS: 8000,
  TEMPERATURE: 0.4,
  TOP_P: 0.9,
  FREQUENCY_PENALTY: 0.3
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

