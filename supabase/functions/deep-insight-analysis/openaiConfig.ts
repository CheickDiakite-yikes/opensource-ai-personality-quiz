
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export const API_CONFIG = {
  BASE_URL: "https://api.openai.com/v1/chat/completions",
  MAIN_TIMEOUT: 45000, // 45 seconds - further reduced from 55s
  FALLBACK_TIMEOUT: 30000, // 30 seconds - further reduced from 40s
  DEFAULT_MODEL: "gpt-4o",
  FALLBACK_MODEL: "gpt-4o-mini", // Using smaller/faster model as fallback
  MAIN_MAX_TOKENS: 12000, // Further reduced to ensure faster completion
  FALLBACK_MAX_TOKENS: 8000, // Further reduced for fallback
  TEMPERATURE: 0.4,
  TOP_P: 0.9,
  FREQUENCY_PENALTY: 0.3,
  RETRY_COUNT: 1 // Number of retries for failed requests
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
