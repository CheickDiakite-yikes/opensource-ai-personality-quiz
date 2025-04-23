
import { SYSTEM_PROMPT } from "./prompts.ts";
import { API_CONFIG } from "./openaiConfig.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createOpenAIRequest, handleOpenAIResponse } from "./openaiClient.ts";
import { logRequestConfig, logError, logDebug, logInfo, createPerformanceTracker } from "./logging.ts";
import { handleFallback } from "./fallbackHandler.ts";
import { analyzeResponses } from "./utils.ts";

export async function callOpenAI(openAIApiKey: string, formattedResponses: string) {
  if (!openAIApiKey || openAIApiKey.trim() === "") {
    logDebug("OpenAI API key missing or empty");
    throw new Error("OpenAI API key is missing or invalid");
  }

  logInfo(`Starting OpenAI API call with model: ${API_CONFIG.DEFAULT_MODEL}`);
  const totalTimer = createPerformanceTracker("Total OpenAI processing time");

  try {
    // Analyze responses to determine complexity
    const responseMetrics = analyzeResponses(
      formattedResponses.split('\n').reduce((acc, line) => {
        const match = line.match(/^Q(\d+): (.+)$/);
        if (match) {
          acc[match[1]] = match[2];
        }
        return acc;
      }, {} as Record<string, string>)
    );
    
    logInfo("Response metrics analysis", responseMetrics);
    
    const config = {
      model: API_CONFIG.DEFAULT_MODEL,
      max_tokens: API_CONFIG.MAIN_MAX_TOKENS,
      temperature: API_CONFIG.TEMPERATURE,
      top_p: API_CONFIG.TOP_P,
      frequency_penalty: API_CONFIG.FREQUENCY_PENALTY,
      totalPromptTokens: SYSTEM_PROMPT.length + formattedResponses.length,
      responsesCount: formattedResponses.split('\n').length
    };
    
    logRequestConfig(config);
    
    // More conservative prompt size limit with smart reduction
    const MAX_PROMPT_SIZE = 12000;
    let optimizedPrompt = formattedResponses;
  
    if (formattedResponses.length > MAX_PROMPT_SIZE) {
      logDebug(`Large input detected (${formattedResponses.length} chars), optimizing prompt size`);
    
      // Split by newline to get individual responses
      const responses = formattedResponses.split('\n');
      
      // Intelligent sampling based on response quality
      optimizedPrompt = intelligentlySampleResponses(responses, MAX_PROMPT_SIZE, responseMetrics);
      
      logDebug(`Reduced prompt from ${formattedResponses.length} to ${optimizedPrompt.length} characters`);
      logDebug(`Kept ${optimizedPrompt.split('\n').length} out of ${responses.length} responses`);
    }
    
    // Enhanced retry system with exponential backoff
    for (let attemptCount = 0; attemptCount <= API_CONFIG.RETRY_COUNT; attemptCount++) {
      try {
        if (attemptCount > 0) {
          const backoffDelay = Math.min(
            API_CONFIG.RETRY_MAX_DELAY,
            API_CONFIG.RETRY_INITIAL_DELAY * Math.pow(API_CONFIG.RETRY_BACKOFF_FACTOR, attemptCount - 1)
          );
          logDebug(`Retry attempt ${attemptCount}/${API_CONFIG.RETRY_COUNT} after ${backoffDelay}ms delay`);
          await new Promise(resolve => setTimeout(resolve, backoffDelay));
        }
        
        // Create an AbortController for timeout management
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          controller.abort("Request timeout exceeded");
          logDebug("Manually aborting request after timeout", { timeout: API_CONFIG.MAIN_TIMEOUT });
        }, API_CONFIG.MAIN_TIMEOUT);
        
        try {
          logDebug(`Sending request to OpenAI (attempt ${attemptCount + 1}/${API_CONFIG.RETRY_COUNT + 1})`, { 
            timeout: API_CONFIG.MAIN_TIMEOUT,
            promptLength: optimizedPrompt.length 
          });
          
          const apiCallTimer = createPerformanceTracker("OpenAI API call");
          
          const openAIRes = await createOpenAIRequest(
            openAIApiKey, 
            [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: `Please analyze these assessment responses:\n${optimizedPrompt}` }
            ],
            API_CONFIG.MAIN_MAX_TOKENS,
            controller.signal
          );
          
          apiCallTimer.end();
          clearTimeout(timeoutId); // Clear the timeout if request completes
          
          logDebug(`Successfully received OpenAI response on attempt ${attemptCount + 1}`);
          
          const parsingTimer = createPerformanceTracker("OpenAI response parsing");
          const openAIData = await handleOpenAIResponse(openAIRes);
          parsingTimer.end();
          
          totalTimer.end();
          
          return openAIData;
        } catch (error) {
          clearTimeout(timeoutId);
          
          logError(error, `API call attempt ${attemptCount + 1} failed`);
          
          if (attemptCount >= API_CONFIG.RETRY_COUNT) {
            throw error;
          }
        }
      } catch (retryError) {
        logError(retryError, `Retry wrapper error attempt ${attemptCount + 1}`);
        
        if (attemptCount >= API_CONFIG.RETRY_COUNT) {
          throw retryError;
        }
      }
    }
    
    throw new Error("All OpenAI API attempts failed");
  } catch (error) {
    logError(error, "OpenAI API call failed");
    
    // Now try the fallback
    logInfo("Main API call failed. Attempting fallback...");
    try {
      const fallbackTimer = createPerformanceTracker("Fallback processing");
      const fallbackResult = await handleFallback(openAIApiKey, formattedResponses);
      fallbackTimer.end();
      
      return {
        choices: [{
          message: {
            content: JSON.stringify(fallbackResult)
          },
          finish_reason: "fallback"
        }],
        model: API_CONFIG.FALLBACK_MODEL,
        usage: { total_tokens: 0 }, // We don't have accurate usage data from fallback
        _meta: {
          fallback: true,
          reason: error.message
        }
      };
    } catch (fallbackError) {
      logError(fallbackError, "Both main and fallback approaches failed");
      throw new Error("Analysis processing failed after multiple attempts: " + 
        (fallbackError instanceof Error ? fallbackError.message : "Unknown error"));
    } finally {
      totalTimer.end();
    }
  }
}

/**
 * Intelligently samples responses based on quality metrics
 */
function intelligentlySampleResponses(
  responses: string[], 
  maxSize: number,
  metrics: Record<string, any>
): string {
  const keptResponses: string[] = [];
  let totalLength = 0;
  
  // Always include first 5 responses for context
  for (let i = 0; i < Math.min(5, responses.length); i++) {
    keptResponses.push(responses[i]);
    totalLength += responses[i].length + 1;
  }
  
  // Different sampling strategy based on estimated quality
  const samplingRate = metrics.estimatedQuality === "high" ? 0.7 : 
                      metrics.estimatedQuality === "moderate" ? 0.5 : 0.3;
  
  // Sort remaining responses by length (proxy for detail)
  const remainingResponses = responses.slice(5)
    .sort((a, b) => b.length - a.length); // Sort by length, longest first
  
  // Take the top X% of responses by length
  const topResponses = remainingResponses.slice(
    0, 
    Math.ceil(remainingResponses.length * samplingRate)
  );
  
  // Add as many as will fit in our budget
  for (const response of topResponses) {
    if (totalLength + response.length <= maxSize - 1000) {
      keptResponses.push(response);
      totalLength += response.length + 1;
    }
  }
  
  // Add final note about sampling
  const samplingNote = "\n\n[Note: Responses have been intelligently sampled for optimal analysis. Focus on deep patterns and insights.]";
  
  // Sort responses back to original order (by question number) for better context
  keptResponses.sort((a, b) => {
    const aMatch = a.match(/^Q(\d+):/);
    const bMatch = b.match(/^Q(\d+):/);
    if (aMatch && bMatch) {
      return parseInt(aMatch[1]) - parseInt(bMatch[1]);
    }
    return 0;
  });
  
  return keptResponses.join('\n') + samplingNote;
}
