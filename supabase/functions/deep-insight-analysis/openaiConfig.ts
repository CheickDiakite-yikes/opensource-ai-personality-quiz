
export const API_CONFIG = {
  BASE_URL: "https://api.openai.com/v1/chat/completions",
  DEFAULT_MODEL: "gpt-4o",
  FALLBACK_MODEL: "gpt-4o-mini",
  TEMPERATURE: 0.7, 
  TOP_P: 0.95,
  FREQUENCY_PENALTY: 0.1,
  PRESENCE_PENALTY: 0.2,
  RESPONSE_FORMAT: { type: "json_object" },
  MAX_TOKENS: 16000,  // Increased for more detailed responses
  FALLBACK_MAX_TOKENS: 8000, // Also increased fallback tokens
  FALLBACK_TIMEOUT: 180000, // 3 minutes timeout
  RETRY_ATTEMPTS: 3,
  // Force JSON mode for consistent schema adherence
  FORCE_JSON: true,
  // Define our JSON schema for structured output
  JSON_SCHEMA: {
    type: "object",
    properties: {
      overview: { type: "string", description: "Comprehensive personality overview" },
      core_traits: {
        type: "object",
        properties: {
          primary: { type: "string" },
          secondary: { type: "string" },
          manifestations: { type: "string" }
        },
        required: ["primary", "secondary", "manifestations"]
      },
      cognitive_patterning: {
        type: "object",
        properties: {
          decisionMaking: { type: "string" },
          learningStyle: { type: "string" },
          problemSolving: { type: "string" },
          informationProcessing: { type: "string" }
        },
        required: ["decisionMaking", "learningStyle", "problemSolving", "informationProcessing"]
      },
      emotional_architecture: {
        type: "object",
        properties: {
          emotionalAwareness: { type: "string" },
          regulationStyle: { type: "string" },
          emotionalResponsiveness: { type: "string" },
          emotionalPatterns: { type: "string" }
        },
        required: ["emotionalAwareness", "regulationStyle", "emotionalResponsiveness", "emotionalPatterns"]
      },
      interpersonal_dynamics: {
        type: "object",
        properties: {
          attachmentStyle: { type: "string" },
          communicationPattern: { type: "string" },
          conflictResolution: { type: "string" },
          relationshipNeeds: { type: "string" }
        },
        required: ["attachmentStyle", "communicationPattern", "conflictResolution", "relationshipNeeds"]
      },
      growth_potential: {
        type: "object",
        properties: {
          developmentalPath: { type: "string" },
          blindSpots: { type: "string" },
          untappedStrengths: { type: "string" },
          growthExercises: { type: "string" }
        },
        required: ["developmentalPath", "blindSpots", "untappedStrengths", "growthExercises"]
      },
      intelligence_score: { type: "number", minimum: 1, maximum: 100 },
      emotional_intelligence_score: { type: "number", minimum: 1, maximum: 100 },
      response_patterns: {
        type: "object",
        properties: {
          primaryChoice: { type: "string" },
          secondaryChoice: { type: "string" },
          consistency: { type: "string" },
          self_awareness: { type: "string" }
        },
        required: ["primaryChoice", "secondaryChoice"]
      }
    },
    required: [
      "overview", 
      "core_traits", 
      "cognitive_patterning", 
      "emotional_architecture", 
      "interpersonal_dynamics", 
      "growth_potential",
      "intelligence_score", 
      "emotional_intelligence_score",
      "response_patterns"
    ]
  }
};
