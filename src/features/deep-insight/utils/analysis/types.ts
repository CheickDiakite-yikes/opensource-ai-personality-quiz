
import { PersonalityAnalysis } from "@/utils/types";
import { DeepInsightResponses, CoreTraits, GrowthPotential, ResponsePatternAnalysis, CognitivePatterning, EmotionalArchitecture, InterpersonalDynamics } from "../../types";
import { Json } from "@/integrations/supabase/types";
// Re-export the PersonalityTrait type for use in Deep Insight components
import { PersonalityTrait } from "@/utils/types";
export type { PersonalityTrait, ResponsePatternAnalysis };

// Define AnalysisData type to extend PersonalityAnalysis
export interface AnalysisData extends PersonalityAnalysis {
  coreTraits: CoreTraits;
  cognitivePatterning: CognitivePatterning;
  emotionalArchitecture: EmotionalArchitecture;
  interpersonalDynamics: InterpersonalDynamics;
  growthPotential: GrowthPotential;
  responsePatterns: ResponsePatternAnalysis;
}

// Helper function to convert AnalysisData to Json-compatible format
export const toJsonObject = (analysis: AnalysisData): Record<string, Json> => {
  return JSON.parse(JSON.stringify(analysis));
};
