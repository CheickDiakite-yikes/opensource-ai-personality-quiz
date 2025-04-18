
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export const API_CONFIG = {
  BASE_URL: "https://api.openai.com/v1/chat/completions",
  MAIN_TIMEOUT: 55000, // 55 seconds - well below Edge Function limits (60s)
  FALLBACK_TIMEOUT: 40000, // 40 seconds - further reduced for safe completion
  DEFAULT_MODEL: "gpt-4o",
  FALLBACK_MODEL: "gpt-4o-mini", // Using smaller/faster model as fallback
  MAIN_MAX_TOKENS: 8000, // Reduced to ensure faster completion
  FALLBACK_MAX_TOKENS: 4000, // Further reduced for fallback
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
