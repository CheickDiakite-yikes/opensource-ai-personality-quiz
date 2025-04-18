
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export const API_CONFIG = {
  BASE_URL: "https://api.openai.com/v1/chat/completions",
  MAIN_TIMEOUT: 60000, // Increased from 45 seconds to 60 seconds
  FALLBACK_TIMEOUT: 45000, // Increased from 30 seconds to 45 seconds
  DEFAULT_MODEL: "gpt-4o",
  FALLBACK_MODEL: "gpt-4o-mini", // Using smaller/faster model as fallback
  MAIN_MAX_TOKENS: 8000, // Reduced from 12000 to ensure faster completion
  FALLBACK_MAX_TOKENS: 6000, // Reduced from 8000 for fallback
  TEMPERATURE: 0.4,
  TOP_P: 0.9,
  FREQUENCY_PENALTY: 0.3,
  RETRY_COUNT: 2 // Increased from 1 to 2 retries for failed requests
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
