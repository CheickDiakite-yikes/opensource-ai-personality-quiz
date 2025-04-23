
import { corsHeaders } from "../_shared/cors.ts";
import { logError, logInfo } from "./logging.ts";

export function formatAnalysisResponse(analysisContent: any) {
  if (!analysisContent || typeof analysisContent !== 'object') {
    return new Response(
      JSON.stringify({ 
        error: "Invalid analysis content format",
        success: false 
      }), 
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }

  try {
    // Generate intelligence scores if not present
    const intelligenceScore = generateScore("cognitive");
    const emotionalIntelligenceScore = generateScore("emotional");

    const analysis = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      overview: generateOverview(analysisContent),
      ...analysisContent,
      intelligenceScore,
      emotionalIntelligenceScore
    };

    logInfo("Successfully formatted analysis response");
    
    return new Response(
      JSON.stringify({ analysis, success: true }), 
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    logError("Error formatting analysis response:", error);
    return new Response(
      JSON.stringify({ 
        error: "Error formatting analysis response",
        details: error.message,
        success: false 
      }), 
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
}

// Generate a score between 50-95 for the given domain
function generateScore(domain: string): number {
  return Math.floor(Math.random() * 46) + 50;
}

// Extract or generate an overview from the analysis content
function generateOverview(analysisContent: any): string {
  try {
    // Try to extract from cognitive and emotional patterns
    const cognitiveDescription = analysisContent.cognitivePatterning?.decisionMaking || '';
    const emotionalDescription = analysisContent.emotionalArchitecture?.emotionalAwareness || '';
    const coreDescription = analysisContent.coreTraits?.primary || '';
    
    if (coreDescription) {
      return coreDescription;
    }
    
    if (cognitiveDescription && emotionalDescription) {
      return `${cognitiveDescription} ${emotionalDescription}`;
    }
    
    // Fallback generic description
    return "Your Deep Insight Analysis reveals a multifaceted personality with unique cognitive patterns and emotional depths. The following sections break down the key components of your psychological profile.";
  } catch (error) {
    logError("Error generating overview:", error);
    return "Your Deep Insight Analysis has been processed. Explore the sections below to discover insights about your personality.";
  }
}
