
import { corsHeaders } from "../_shared/cors.ts";
import { generateDefaultScore, calculateSafeDomainScore } from "./scoring.ts";
import { getStringSafely, getArraySafely, generateOverview } from "./utils.ts";

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
    const analysis = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      overview: generateOverview(analysisContent),
      ...analysisContent,
      intelligenceScore: calculateSafeDomainScore("cognitive"),
      emotionalIntelligenceScore: calculateSafeDomainScore("emotional")
    };

    return new Response(
      JSON.stringify({ analysis, success: true }), 
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error formatting analysis response:", error);
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
