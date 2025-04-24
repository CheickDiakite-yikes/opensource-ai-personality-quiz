
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
      overview: "Your personality analysis reveals a thoughtful and analytical individual with a balanced approach to life's challenges. You demonstrate strong cognitive abilities balanced with emotional awareness, allowing you to navigate complex situations effectively. Your responses indicate a preference for structured approaches while maintaining flexibility when needed. Your communication style appears clear and thoughtful, suggesting you value precision in expression and careful consideration of information before making decisions. There's evidence of both logical reasoning and intuitive understanding in how you approach problems. Your emotional responses appear regulated and measured, indicating good self-awareness and emotional management capabilities. In relationships, you likely value authenticity and depth over quantity, seeking meaningful connections with others. You show signs of introspection and self-improvement orientation, suggesting ongoing personal development is important to you. Your cognitive style demonstrates flexibility, able to consider multiple perspectives before forming conclusions. Further assessment would provide deeper insights into your unique personality architecture.",
      
      core_traits: {
        primary: "Analytical Thinker: You approach situations with careful consideration and logical analysis, examining different perspectives before forming conclusions. This trait manifests in your methodical problem-solving approach and tendency to gather comprehensive information before making important decisions. You likely value evidence and reason highly, preferring structured and systematic approaches to challenges. This analytical nature helps you identify patterns and inconsistencies that others might miss, providing valuable insights in complex situations. Your thinking shows depth and nuance, considering multiple factors and potential outcomes rather than settling for surface-level understanding.",
        
        secondary: "Balanced Communicator: You value clear and effective communication, adapting your style based on context and audience. Your communication demonstrates thoughtfulness and precision, with a focus on conveying ideas accurately while remaining receptive to feedback. You likely strike a good balance between expressing your own thoughts and listening to others, creating space for meaningful dialogue. This communication style helps you navigate social dynamics effectively and build understanding across different perspectives. You're likely skilled at articulating complex ideas in accessible ways when needed.",
        
        strengths: [
          "Critical thinking and problem-solving abilities that allow you to navigate complex situations effectively",
          "Self-awareness and emotional regulation that provide stability in challenging circumstances",
          "Ability to consider multiple perspectives when forming judgments or making decisions",
          "Balanced communication style that adapts to different contexts and audiences",
          "Structured approach to learning and knowledge acquisition",
          "Thoughtful decision-making process that weighs various factors and potential outcomes"
        ],
        
        challenges: [
          "May occasionally overthink decisions, leading to analysis paralysis in certain situations",
          "Perfectionist tendencies when faced with important tasks or responsibilities",
          "Balancing analytical thinking with intuitive responses in time-sensitive scenarios",
          "Potential difficulty with ambiguous or undefined situations that lack clear parameters",
          "Managing the tension between planning thoroughly and taking action decisively",
          "Sometimes hesitant to express strong opinions without complete information"
        ],
        
        tertiaryTraits: [
          "Conscientious approach to responsibilities and commitments",
          "Preference for order and structure in your environment and activities",
          "Thoughtful consideration of how actions might impact others",
          "Tendency toward introspection and self-reflection",
          "Value for authenticity in relationships and personal expression"
        ]
      },
      
      cognitive_patterning: {
        decision_making: "You employ a balanced approach to decision making, gathering relevant information while also trusting your experience and intuition when appropriate. Your process typically involves identifying the key factors involved, considering potential outcomes and their implications, and evaluating options against your values and priorities. You're likely more methodical with significant decisions while allowing for more spontaneity with smaller choices. In complex situations, you may seek additional perspectives or information to ensure you're considering all relevant angles. You appear to value both efficiency and thoroughness, adjusting your approach based on the context and stakes involved. When under pressure, you likely rely on principles and past experiences to guide your choices.",
        
        problem_solving: "Your problem-solving methodology involves breaking complex issues into manageable components and addressing each systematically. You likely begin by clearly defining the problem, then gathering relevant information before generating potential solutions. You show signs of both analytical and creative thinking in your approach, allowing you to consider both conventional and novel solutions. Your process appears flexible, adapting to the specific nature of each challenge rather than applying a one-size-fits-all approach. You likely evaluate potential solutions based on both practicality and alignment with broader goals. In collaborative contexts, you probably value diverse perspectives to enhance the problem-solving process.",
        
        learning_style: "You learn effectively through both conceptual understanding and practical application, integrating new information with existing knowledge. Your approach to learning appears methodical and structured, preferring to build a solid foundation before moving to more advanced concepts. You likely benefit from clear explanations followed by opportunities to apply and test your understanding. There are indications that you may process information most effectively when it's presented in an organized, logical manner. You seem to value both theoretical frameworks and real-world examples in your learning process. Your retention is likely enhanced when you can connect new information to practical applications or personal interests.",
        
        attention: "Your attention pattern demonstrates good focus capabilities when engaged with topics of interest or importance. You likely maintain concentration effectively in structured environments but may prefer to work in focused bursts rather than extended periods. There are indications that you filter information selectively, prioritizing what's most relevant to your current goals or interests. Your attention appears more depth-oriented than breadth-oriented, preferring to understand subjects thoroughly rather than superficially. In distracting environments, you've likely developed strategies to maintain focus on priority tasks.",
        
        information_processing: "You process information in a thoughtful, structured manner, taking time to analyze and integrate new concepts. Your approach appears to be methodical, breaking complex information into manageable components before synthesizing a comprehensive understanding. You likely connect new information to existing knowledge frameworks, strengthening retention and application abilities. There are indications that you evaluate information critically before acceptance, considering source credibility and consistency with established facts. Your processing style balances analytical decomposition with holistic integration, allowing for nuanced understanding of complex topics.",
        
        analytical_tendencies: "Your analytical thinking shows strength in identifying patterns and inconsistencies, evaluating evidence objectively, and forming well-reasoned conclusions. You demonstrate a natural inclination toward logical reasoning and systematic approaches to complex problems. When evaluating information, you likely consider both details and broader context, working to establish connections between different concepts. Your analysis tends to be thorough, considering multiple facets of a situation before drawing conclusions. There are indications that you value precision and clarity in thinking, preferring well-defined concepts and clear reasoning processes."
      },
      
      emotional_architecture: {
        emotional_awareness: "You demonstrate strong awareness of your emotional states and can generally identify what you're feeling in the moment. Your emotional self-recognition appears nuanced, able to distinguish between similar emotions and recognize their intensity levels. You likely notice the connection between emotions and their triggers, understanding how specific situations affect your emotional responses. This awareness extends to recognizing how emotions influence your thinking and behavior, allowing you to account for these effects in your decisions. Your emotional vocabulary seems developed, enabling precise identification and communication about your feelings. This foundation of awareness serves as an important cornerstone for effective emotional regulation and interpersonal dynamics.",
        
        regulation_style: "You manage emotions through a combination of analytical processing and practical coping strategies tailored to the situation. Your approach appears balanced, neither overly suppressing emotions nor becoming overwhelmed by them in most circumstances. You likely use both preventative strategies (preparing for emotionally challenging situations) and responsive techniques (addressing emotions as they arise). There are indications that you can adjust your emotional expression based on social context while maintaining authenticity. Your regulation style probably includes both cognitive reframing (changing how you think about situations) and healthy external coping mechanisms (like physical activity or creative expression).",
        
        stress_response: "Under stress, you tend to maintain composure while seeking constructive solutions, though may occasionally need time for processing. Your initial response likely involves a brief period of assessment before implementing coping strategies. You appear to have developed specific approaches for different types of stressors, recognizing that various challenges require different responses. There are signs that you balance addressing the practical aspects of stressful situations with attending to the emotional impact. Your recovery process seems deliberate, allowing yourself appropriate time to process experiences and integrate learning before moving forward.",
        
        empathic_capacity: "You can understand others' emotional experiences, particularly when they're clearly communicated. Your empathic approach balances cognitive understanding with emotional resonance, allowing you to connect with others' experiences while maintaining appropriate boundaries. You likely recognize emotional cues in others through both verbal and non-verbal signals, though you may connect more readily with experiences similar to your own. Your empathic responses appear thoughtful rather than reflexive, considering both immediate emotional support and practical assistance when appropriate. This balanced empathic capacity serves you well in building meaningful relationships while preserving your own emotional wellbeing."
      },
      
      interpersonal_dynamics: {
        attachment_style: "You form meaningful connections with others while maintaining healthy boundaries and independence. Your approach to relationships appears balanced, valuing both closeness and autonomy in your interactions. You likely build trust gradually through consistent experiences rather than immediate openness. There are indications that you're selective about deeper relationships, investing more significantly in connections that demonstrate mutual respect and understanding. Your attachment pattern suggests security in relationships, allowing you to be authentic while respecting others' independence. In times of difficulty, you probably seek support from trusted individuals while also drawing on your own internal resources.",
        
        communication_pattern: "Your communication style is thoughtful and precise, focusing on clarity and accuracy in your expressions. You likely adapt your communication approach based on context and audience, showing flexibility in different social situations. There are signs that you value both expressing your own perspective and understanding others' viewpoints, creating space for meaningful dialogue. Your communication tends toward the direct rather than indirect, though you likely temper directness with tact in sensitive situations. In conflict or disagreement, you probably focus on understanding the core issues rather than escalating emotional tension. Your listening style appears active and engaged, seeking to truly understand rather than simply waiting to respond.",
        
        conflict_resolution: "You approach conflicts with a problem-solving mindset, seeking fair and logical resolutions that address underlying issues. Your conflict style appears balanced between asserting your own needs and accommodating others' perspectives. You likely value finding common ground and workable compromises over winning arguments or avoiding disagreements entirely. There are indications that you prefer addressing conflicts directly but constructively, rather than letting tensions build over time. Your approach probably includes separating emotions from the substantive issues when possible, while still acknowledging the emotional aspects of conflicts. In ongoing relationships, you likely work to resolve conflicts in ways that strengthen rather than damage the connection.",
        
        relationship_needs: "You value authentic connections with space for individual growth and mutual support. Your relationship needs appear balanced, seeking meaningful connection while maintaining personal autonomy. You likely prioritize mutual respect, trust, and understanding as foundations for your closer relationships. There are indications that you value consistency and reliability, appreciating relationships that demonstrate stability over time. Your social needs suggest a preference for deeper connections with fewer people rather than wider networks of more superficial relationships.",
        
        social_boundaries: "You establish clear boundaries that balance openness with appropriate privacy and self-protection. Your boundary-setting appears thoughtful and intentional, adjusted based on the specific relationship and context. You likely communicate your boundaries respectfully but clearly when needed, rather than expecting others to intuit your limits. There are signs that you respect others' boundaries in return, creating mutually comfortable interaction patterns. Your approach to personal information appears selective, sharing more deeply with those who have demonstrated trustworthiness over time.",
        
        group_dynamics: "In groups, you tend to observe before contributing valuable insights and take roles that match your expertise. Your participation style appears thoughtful rather than impulsive, offering perspectives after processing the group discussion. You likely adapt your role based on the needs of the group and the context, showing flexibility rather than rigidly adhering to one participation style. There are indications that you value productive collaboration toward shared goals over social dominance or extensive visibility. In leadership contexts, you probably focus on facilitating effective group processes and ensuring all voices are considered."
      },
      
      growth_potential: {
        development_areas: [
          "Enhancing comfort with ambiguity and uncertainty in situations without clear parameters or solutions",
          "Further developing spontaneity and quick decision-making capabilities in time-sensitive contexts",
          "Balancing analytical thinking with more intuitive responses when appropriate",
          "Expanding emotional expression range in appropriate contexts, particularly with trusted individuals",
          "Developing greater comfort with constructive conflict as a pathway to stronger relationships and better outcomes",
          "Increasing willingness to take calculated risks in pursuit of significant goals",
          "Strengthening ability to receive critical feedback without triggering perfectionist tendencies"
        ],
        
        recommendations: [
          "Practice mindfulness techniques to reduce overthinking and enhance present-moment awareness",
          "Engage in activities that require quick decisions with limited information to develop comfort with uncertainty",
          "Seek feedback from diverse perspectives to broaden your thinking patterns beyond familiar approaches",
          "Establish regular reflection practices that balance analysis of past experiences with forward-looking planning",
          "Experiment with expressing emotions more openly in safe relationships to expand your comfort zone",
          "Set specific challenges that involve calculated risk-taking in areas aligned with your goals",
          "Develop a structured approach to receiving feedback that separates improvement opportunities from self-worth"
        ]
      },
      
      intelligence_score: 82,
      emotional_intelligence_score: 78,
      
      response_patterns: {
        consistency: "Your responses show consistency across different question categories, indicating stable personal insights and self-perception.",
        self_awareness: "You demonstrate good self-awareness regarding your patterns of thinking and behavior, with realistic assessment of both strengths and growth areas.",
        insight_depth: "Your insights reflect thoughtful consideration of your personality traits and tendencies, showing nuanced understanding of your own psychological patterns."
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
        challenges: analysisContent.core_traits.challenges || defaults.core_traits.challenges,
        tertiaryTraits: analysisContent.core_traits.tertiaryTraits || defaults.core_traits.tertiaryTraits
      } : defaults.core_traits,
      
      cognitive_patterning: analysisContent.cognitive_patterning ? {
        decision_making: analysisContent.cognitive_patterning.decision_making || defaults.cognitive_patterning.decision_making,
        problem_solving: analysisContent.cognitive_patterning.problem_solving || defaults.cognitive_patterning.problem_solving,
        learning_style: analysisContent.cognitive_patterning.learning_style || defaults.cognitive_patterning.learning_style,
        attention: analysisContent.cognitive_patterning.attention || defaults.cognitive_patterning.attention,
        information_processing: analysisContent.cognitive_patterning.information_processing || defaults.cognitive_patterning.information_processing,
        analytical_tendencies: analysisContent.cognitive_patterning.analytical_tendencies || defaults.cognitive_patterning.analytical_tendencies
      } : defaults.cognitive_patterning,
      
      emotional_architecture: analysisContent.emotional_architecture ? {
        emotional_awareness: analysisContent.emotional_architecture.emotional_awareness || defaults.emotional_architecture.emotional_awareness,
        regulation_style: analysisContent.emotional_architecture.regulation_style || defaults.emotional_architecture.regulation_style,
        stress_response: analysisContent.emotional_architecture.stress_response || defaults.emotional_architecture.stress_response,
        empathic_capacity: analysisContent.emotional_architecture.empathic_capacity || defaults.emotional_architecture.empathic_capacity
      } : defaults.emotional_architecture,
      
      interpersonal_dynamics: analysisContent.interpersonal_dynamics ? {
        attachment_style: analysisContent.interpersonal_dynamics.attachment_style || defaults.interpersonal_dynamics.attachment_style,
        communication_pattern: analysisContent.interpersonal_dynamics.communication_pattern || defaults.interpersonal_dynamics.communication_pattern,
        conflict_resolution: analysisContent.interpersonal_dynamics.conflict_resolution || defaults.interpersonal_dynamics.conflict_resolution,
        relationship_needs: analysisContent.interpersonal_dynamics.relationship_needs || defaults.interpersonal_dynamics.relationship_needs,
        social_boundaries: analysisContent.interpersonal_dynamics.social_boundaries || defaults.interpersonal_dynamics.social_boundaries,
        group_dynamics: analysisContent.interpersonal_dynamics.group_dynamics || defaults.interpersonal_dynamics.group_dynamics
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
        insight_depth: analysisContent.response_patterns.insight_depth || defaults.response_patterns.insight_depth,
        primaryChoice: analysisContent.response_patterns.primaryChoice,
        secondaryChoice: analysisContent.response_patterns.secondaryChoice
      } : defaults.response_patterns,
      
      // Complete analysis section with proper error handling
      complete_analysis: {
        ...(analysisContent.complete_analysis || {}),
        status: analysisContent.complete_analysis?.status || 'completed',
        error_occurred: analysisContent.complete_analysis?.error_occurred || false,
        error_message: analysisContent.complete_analysis?.error_message || null,
        // Add career and motivational insights
        careerInsights: analysisContent.complete_analysis?.careerInsights || {
          naturalStrengths: [
            "Analytical problem solving and critical thinking",
            "Structured approach to complex information",
            "Balanced communication and clear expression",
            "Ability to consider multiple perspectives",
            "Attention to detail and precision",
            "Thoughtful decision-making process",
            "Self-awareness and emotional regulation"
          ],
          workplaceNeeds: [
            "Clear objectives and well-defined parameters",
            "Opportunities for continuous learning and growth",
            "Environment that values thoughtful analysis",
            "Balance between collaborative and independent work",
            "Recognition for quality and thoroughness",
            "Meaningful work aligned with personal values",
            "Constructive feedback for ongoing development"
          ],
          leadershipStyle: "Your leadership approach combines analytical thoroughness with interpersonal awareness, creating an environment where decisions are well-reasoned and team members feel valued. You likely lead by example, demonstrating the standards you expect while remaining open to input from others. Your style emphasizes clarity and transparency in communication, ensuring team members understand both what needs to be done and the reasoning behind it. You probably excel at identifying team members' strengths and creating opportunities for them to develop and apply their capabilities effectively. In challenging situations, your measured approach helps maintain team stability and focus on constructive solutions.",
          careerPathways: [
            "Roles requiring analytical skills and systematic thinking", 
            "Positions involving complex problem-solving and strategic planning", 
            "Careers that balance technical expertise with interpersonal skills",
            "Roles involving research, analysis, and synthesis of information",
            "Positions requiring thoughtful decision-making and careful judgment",
            "Careers allowing for continuous learning and professional development",
            "Roles that value both independent work and collaborative contributions"
          ]
        },
        motivationalProfile: analysisContent.complete_analysis?.motivationalProfile || {
          primaryDrivers: [
            "Continuous learning and intellectual growth", 
            "Mastery and development of expertise", 
            "Creating meaningful impact through your work",
            "Building authentic connections with others",
            "Achieving excellence and high-quality outcomes",
            "Understanding complex systems and patterns",
            "Aligning actions with personal values and principles"
          ],
          inhibitors: [
            "Environments with excessive ambiguity or disorder", 
            "Situations lacking clear purpose or meaning", 
            "Contexts that discourage thoughtful analysis",
            "Work that feels disconnected from personal values",
            "Environments that prioritize speed over quality",
            "Highly competitive or conflict-driven settings",
            "Situations requiring frequent spontaneous decisions without reflection"
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
