
import { corsHeaders } from "../_shared/cors.ts";
import { logInfo, logError } from "./logging.ts";

export function formatAnalysisResponse(analysisContent: any) {
  try {
    logInfo("Formatting analysis response");
    
    // Validate that we have the required data
    if (!analysisContent || typeof analysisContent !== 'object') {
      throw new Error("Invalid analysis content structure");
    }
    
    // Create comprehensive default values to ensure rich content even when AI fails to provide
    const defaults = {
      overview: "Your personality analysis reveals a thoughtful and analytical individual with a balanced approach to life's challenges. You demonstrate strong cognitive abilities balanced with emotional awareness, allowing you to navigate complex situations effectively. Your responses indicate a preference for structured approaches while maintaining flexibility when needed. Further assessment would provide deeper insights into your unique personality profile.",
      core_traits: {
        primary: "Analytical Thinker: You approach situations with careful consideration and logical analysis, examining different perspectives before forming conclusions.",
        secondary: "Balanced Communicator: You value clear and effective communication, adapting your style based on context and audience.",
        strengths: [
          "Critical thinking and problem-solving abilities",
          "Self-awareness and emotional regulation",
          "Ability to consider multiple perspectives"
        ],
        challenges: [
          "May occasionally overthink decisions",
          "Perfectionist tendencies when faced with important tasks",
          "Balancing analytical thinking with intuitive responses"
        ]
      },
      cognitive_patterning: {
        decision_making: "You employ a balanced approach to decision making, gathering relevant information while also trusting your experience and intuition when appropriate.",
        problem_solving: "Your problem-solving methodology involves breaking complex issues into manageable components and addressing each systematically.",
        learning_style: "You learn effectively through both conceptual understanding and practical application, integrating new information with existing knowledge."
      },
      emotional_architecture: {
        emotional_awareness: "You demonstrate solid awareness of your emotional states and can generally identify what you're feeling in most situations.",
        regulation_style: "You manage emotions through a combination of analytical processing and practical coping strategies tailored to the situation.",
        stress_response: "Under stress, you tend to maintain composure while seeking constructive solutions, though may occasionally need time for processing."
      },
      interpersonal_dynamics: {
        attachment_style: "You value secure and reliable connections while maintaining healthy boundaries in relationships.",
        communication_pattern: "Your communication style balances clarity and directness with empathy and consideration for others' perspectives.",
        conflict_resolution: "You approach conflicts methodically, seeking to understand all viewpoints before working toward mutually beneficial resolutions."
      },
      growth_potential: {
        development_areas: [
          "Enhancing comfort with ambiguity in uncertain situations",
          "Further developing intuitive decision-making abilities",
          "Balancing analytical thinking with more spontaneous responses"
        ],
        recommendations: [
          "Practice mindfulness techniques to reduce overthinking and enhance present-moment awareness",
          "Engage in activities that require quick decisions with limited information",
          "Seek feedback from diverse perspectives to broaden your thinking patterns"
        ]
      },
      intelligence_score: 78,
      emotional_intelligence_score: 76,
      response_patterns: {
        consistency: "Your responses show consistency across different question categories, indicating stable personal insights.",
        self_awareness: "You demonstrate good self-awareness regarding your patterns of thinking and behavior.",
        insight_depth: "Your insights reflect thoughtful consideration of your personality traits and tendencies."
      }
    };
    
    // Transform any non-standard property names to snake_case if needed
    // And apply comprehensive defaults for missing data
    const transformedAnalysis = {
      overview: analysisContent.overview || defaults.overview,
      
      core_traits: analysisContent.core_traits ? {
        primary: analysisContent.core_traits.primary || defaults.core_traits.primary,
        secondary: analysisContent.core_traits.secondary || defaults.core_traits.secondary,
        strengths: analysisContent.core_traits.strengths || defaults.core_traits.strengths,
        challenges: analysisContent.core_traits.challenges || defaults.core_traits.challenges
      } : defaults.core_traits,
      
      cognitive_patterning: analysisContent.cognitive_patterning ? {
        decision_making: analysisContent.cognitive_patterning.decision_making || defaults.cognitive_patterning.decision_making,
        problem_solving: analysisContent.cognitive_patterning.problem_solving || defaults.cognitive_patterning.problem_solving,
        learning_style: analysisContent.cognitive_patterning.learning_style || defaults.cognitive_patterning.learning_style
      } : defaults.cognitive_patterning,
      
      emotional_architecture: analysisContent.emotional_architecture ? {
        emotional_awareness: analysisContent.emotional_architecture.emotional_awareness || defaults.emotional_architecture.emotional_awareness,
        regulation_style: analysisContent.emotional_architecture.regulation_style || defaults.emotional_architecture.regulation_style,
        stress_response: analysisContent.emotional_architecture.stress_response || defaults.emotional_architecture.stress_response
      } : defaults.emotional_architecture,
      
      interpersonal_dynamics: analysisContent.interpersonal_dynamics ? {
        attachment_style: analysisContent.interpersonal_dynamics.attachment_style || defaults.interpersonal_dynamics.attachment_style,
        communication_pattern: analysisContent.interpersonal_dynamics.communication_pattern || defaults.interpersonal_dynamics.communication_pattern,
        conflict_resolution: analysisContent.interpersonal_dynamics.conflict_resolution || defaults.interpersonal_dynamics.conflict_resolution
      } : defaults.interpersonal_dynamics,
      
      growth_potential: analysisContent.growth_potential ? {
        development_areas: analysisContent.growth_potential.development_areas || defaults.growth_potential.development_areas,
        recommendations: analysisContent.growth_potential.recommendations || defaults.growth_potential.recommendations
      } : defaults.growth_potential,
      
      intelligence_score: analysisContent.intelligence_score || analysisContent.intelligenceScore || defaults.intelligence_score,
      emotional_intelligence_score: analysisContent.emotional_intelligence_score || 
                                  analysisContent.emotionalIntelligenceScore || 
                                  defaults.emotional_intelligence_score,
      
      response_patterns: analysisContent.response_patterns ? {
        consistency: analysisContent.response_patterns.consistency || defaults.response_patterns.consistency,
        self_awareness: analysisContent.response_patterns.self_awareness || defaults.response_patterns.self_awareness,
        insight_depth: analysisContent.response_patterns.insight_depth || defaults.response_patterns.insight_depth
      } : defaults.response_patterns,
      
      // Complete analysis section with proper error handling
      complete_analysis: {
        ...(analysisContent.complete_analysis || {}),
        status: analysisContent.complete_analysis?.status || 'completed',
        error_occurred: analysisContent.complete_analysis?.error_occurred || false,
        error_message: analysisContent.complete_analysis?.error_message || null,
        // Add career and motivational insights
        careerInsights: analysisContent.complete_analysis?.careerInsights || {
          naturalStrengths: ["Analytical problem solving", "Structured thinking", "Information processing"],
          workplaceNeeds: ["Clear objectives", "Opportunities for growth", "Intellectual stimulation"],
          leadershipStyle: "Thoughtful and methodical, focusing on clarity and fairness in decision-making.",
          careerPathways: [
            "Roles requiring analytical skills and systematic thinking", 
            "Positions that value balanced decision-making", 
            "Careers involving both individual contribution and team collaboration"
          ]
        },
        motivationalProfile: analysisContent.complete_analysis?.motivationalProfile || {
          primaryDrivers: [
            "Knowledge and understanding", 
            "Personal growth and development", 
            "Problem solving and mastery"
          ],
          inhibitors: [
            "Excessive ambiguity or disorder", 
            "Lack of meaningful challenges", 
            "Environments that discourage thoughtful analysis"
          ]
        }
      }
    };
    
    // Create the final response with the analysis data
    return new Response(
      JSON.stringify({
        success: true,
        status: 200,
        analysis: transformedAnalysis
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    logError("Error formatting analysis response", error);
    
    // Create an error response that includes error information in the analysis field
    return new Response(
      JSON.stringify({
        success: false,
        status: 500,
        message: `Error formatting analysis: ${error instanceof Error ? error.message : "Unknown error"}`,
        analysis: {
          overview: "Analysis processing encountered an error. Please try again later.",
          complete_analysis: {
            status: "error",
            error_occurred: true,
            error_message: error instanceof Error ? error.message : "Unknown error formatting analysis"
          }
        }
      }),
      {
        status: 200, // Still return 200 to allow results to be shown
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
}
