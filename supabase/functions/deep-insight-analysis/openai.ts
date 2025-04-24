
import { API_CONFIG } from "./openaiConfig.ts";
import { logError, logInfo } from "./logging.ts";
import { retryable } from "./retryUtils.ts";

// Enhanced OpenAI API call with better error handling and retry logic
export const callOpenAI = async (apiKey: string, userContent: string) => {
  logInfo("Making OpenAI API call for deep insight analysis");
  
  // Import system and user prompts
  const { SYSTEM_PROMPT, USER_PROMPT } = await import("./prompts.ts");
  
  const makeRequest = async (model: string, maxTokens: number) => {
    try {
      logInfo(`Calling OpenAI with model: ${model}, max tokens: ${maxTokens}`);
      
      const response = await fetch(API_CONFIG.BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: "system",
              content: SYSTEM_PROMPT
            },
            {
              role: "user", 
              content: USER_PROMPT(userContent)
            }
          ],
          temperature: API_CONFIG.TEMPERATURE,
          top_p: API_CONFIG.TOP_P,
          frequency_penalty: API_CONFIG.FREQUENCY_PENALTY,
          presence_penalty: API_CONFIG.PRESENCE_PENALTY,
          max_tokens: maxTokens,
          response_format: API_CONFIG.RESPONSE_FORMAT
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      
      // Basic validation of the response
      if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
        throw new Error("Invalid response structure from OpenAI API");
      }
      
      // Try to parse the JSON to validate it before returning
      try {
        const parsedContent = JSON.parse(data.choices[0].message.content);
        
        // Basic validation of required top-level fields
        const requiredFields = ["overview", "core_traits", "cognitive_patterning", "emotional_architecture", 
                              "interpersonal_dynamics", "growth_potential"];
        
        for (const field of requiredFields) {
          if (!parsedContent[field]) {
            throw new Error(`Missing required field in response: ${field}`);
          }
        }
        
        // Content length check - ensure overview is substantial
        if (parsedContent.overview && parsedContent.overview.length < 200) {
          throw new Error("Overview content is too short, needs to be more comprehensive");
        }
      } catch (parseError) {
        throw new Error(`Failed to parse OpenAI JSON response: ${parseError.message}`);
      }
      
      logInfo("OpenAI API call successful");
      return data;
    } catch (error) {
      logError(`OpenAI API call failed: ${error.message}`);
      throw error;
    }
  };
  
  // Implement retry logic with exponential backoff
  const retryableMakeRequest = retryable(
    makeRequest,
    API_CONFIG.RETRY_ATTEMPTS,
    (attempt) => Math.min(1000 * Math.pow(2, attempt), 10000)
  );
  
  try {
    // First try with the default model and settings
    return await retryableMakeRequest(API_CONFIG.DEFAULT_MODEL, API_CONFIG.MAX_TOKENS);
  } catch (primaryError) {
    logError(`Primary model failed: ${primaryError.message}. Trying fallback model.`);
    
    try {
      // If the default model fails, try with the fallback model
      return await retryableMakeRequest(API_CONFIG.FALLBACK_MODEL, API_CONFIG.FALLBACK_MAX_TOKENS);
    } catch (fallbackError) {
      logError(`Fallback model also failed: ${fallbackError.message}`);
      throw new Error(`Failed to generate analysis with both models: ${fallbackError.message}`);
    }
  }
};
