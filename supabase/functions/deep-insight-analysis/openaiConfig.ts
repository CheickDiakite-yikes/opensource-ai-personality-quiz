
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export const API_CONFIG = {
  BASE_URL: "https://api.openai.com/v1/chat/completions",
  MAIN_TIMEOUT: 80000, // 80 seconds - reduced from 240s to be below Edge Function limits
  FALLBACK_TIMEOUT: 60000, // 60 seconds - reduced from 120s to be below Edge Function limits
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
