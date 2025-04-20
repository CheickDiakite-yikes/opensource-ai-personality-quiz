
import { logDebug } from "./logging.ts";

/**
 * Generates a default analysis when API calls fail
 * This ensures we always return something meaningful to the user
 */
export function generateDefaultAnalysis(rawResponses: string): any {
  logDebug("Generating default analysis from available data");
  
  // Extract some patterns from the responses to personalize the default analysis
  const responses = rawResponses.split('\n');
  const responseText = responses.join(' ');
  
  // Simple pattern matching to extract some personality traits
  const analyticalWords = countOccurrences(responseText, ["logical", "analytical", "rational", "objective", "systematic"]);
  const emotionalWords = countOccurrences(responseText, ["emotional", "feeling", "sensitive", "empathetic", "intuitive"]);
  const extraversionWords = countOccurrences(responseText, ["outgoing", "social", "extroverted", "talkative", "energetic"]);
  const introversionWords = countOccurrences(responseText, ["quiet", "reserved", "introverted", "private", "reflective"]);
  
  // Determine primary trait dimensions
  const analyticalScore = Math.min(95, 60 + analyticalWords * 5);
  const emotionalScore = Math.min(95, 60 + emotionalWords * 5);
  const extraversionScore = Math.min(95, 60 + extraversionWords * 5);
  const introversionScore = Math.min(95, 60 + introversionWords * 5);
  
  // Set primary orientation based on word counts
  const isAnalytical = analyticalWords > emotionalWords;
  const isExtraverted = extraversionWords > introversionWords;
  
  let primaryOrientation = "Balanced";
  if (isAnalytical && isExtraverted) primaryOrientation = "Analytical Extravert";
  else if (isAnalytical && !isExtraverted) primaryOrientation = "Analytical Introvert";
  else if (!isAnalytical && isExtraverted) primaryOrientation = "Empathetic Extravert";
  else if (!isAnalytical && !isExtraverted) primaryOrientation = "Empathetic Introvert";
  
  // Generate a comprehensive default analysis
  return {
    cognitivePatterning: {
      decisionMaking: "You approach decisions with a balanced consideration of logical analysis and personal values. You tend to gather sufficient information before making important choices, and you're willing to reconsider when new information becomes available.",
      learningStyle: "Your learning process combines both structured methodical approaches and intuitive understanding. You're able to absorb information through multiple channels including reading, practical application, and discussion.",
      attention: "You tend to maintain focused attention on tasks that align with your interests and values. Your attention can shift between deep concentration and broader awareness depending on the context.",
      problemSolvingApproach: "Your problem-solving style integrates analytical thinking with creative insights. You're able to break down complex problems into manageable components while still seeing the bigger picture.",
      informationProcessing: "You process information through multiple channels, often integrating logical analysis with experiential understanding. You're capable of recognizing patterns across different domains.",
      analyticalTendencies: "You demonstrate solid analytical abilities, especially when engaged with topics that interest you. You can evaluate evidence objectively while still acknowledging subjective factors."
    },
    emotionalArchitecture: {
      emotionalAwareness: "You possess a good degree of emotional self-awareness, recognizing your feelings as they arise and understanding their influence on your thoughts and behaviors. This awareness helps you navigate complex emotional situations.",
      regulationStyle: "Your emotional regulation balances expression and containment. You're generally able to express feelings appropriately while maintaining composure in challenging situations. You have developed some effective strategies for managing strong emotions.",
      empathicCapacity: "You demonstrate natural empathic abilities, sensing others' emotional states and perspectives. This capacity helps you connect with people from diverse backgrounds and understand different viewpoints.",
      emotionalComplexity: "Your emotional landscape contains depth and nuance, allowing you to experience a rich range of feelings. You recognize that emotions can be multifaceted and sometimes contradictory.",
      stressResponse: "Under stress, you tend to balance problem-solving with self-care. You've developed some effective coping mechanisms, though there may be room for expanding your resilience toolkit in extremely challenging situations.",
      emotionalResilience: "You demonstrate good emotional resilience, able to recover from setbacks and adapt to changes. You generally maintain perspective during difficulties while acknowledging the reality of challenges."
    },
    interpersonalDynamics: {
      attachmentStyle: "Your relationship approach balances connection and independence. You value close relationships while maintaining a sense of personal autonomy. You generally trust others while maintaining healthy boundaries.",
      communicationPattern: "Your communication style combines clarity and empathy. You express your thoughts directly while remaining sensitive to others' perspectives and feelings. You're capable of adapting your communication to different contexts.",
      conflictResolution: "In conflicts, you tend to seek balanced solutions that address underlying concerns. You generally approach disagreements with a problem-solving mentality rather than seeing them as purely win-lose situations.",
      relationshipNeeds: "Your relationship needs include both authentic connection and respect for individual differences. You value relationships that allow for both closeness and personal growth.",
      socialBoundaries: "You maintain flexible boundaries that allow for connection while protecting your core values and needs. You're generally able to assert these boundaries when necessary.",
      groupDynamics: "In group settings, you adapt based on context and needs. You can contribute actively or step back to allow others space, depending on what the situation requires.",
      compatibilityProfile: "You tend to create most harmonious connections with people who balance authenticity with respect for boundaries. You value relationships that combine emotional honesty with mutual growth.",
      compatibleTypes: [
        "Growth-oriented individuals who value both emotional connection and intellectual stimulation",
        "People who balance structure with flexibility in their approach to life and relationships",
        "Authentic communicators who express their thoughts clearly while respecting different perspectives"
      ],
      challengingRelationships: [
        "Highly rigid or dogmatic personalities who leave little room for nuance or exploration",
        "Extremely emotionally volatile individuals who lack self-awareness or regulation",
        "People who consistently violate boundaries or are unresponsive to communication about needs"
      ]
    },
    coreTraits: {
      primary: primaryOrientation,
      secondary: "Your secondary characteristics include adaptability and thoughtfulness. You demonstrate the capacity to adjust to changing circumstances while maintaining a reflective understanding of your experiences and goals.",
      tertiaryTraits: [
        "Balanced perspective - You consider multiple viewpoints before forming conclusions",
        "Adaptive thinking - You adjust your approach based on context and feedback",
        "Reflective awareness - You contemplate your experiences to extract meaningful insights",
        "Growth orientation - You value development and learning across different life domains",
        "Relational intelligence - You navigate interpersonal dynamics with awareness and skill",
        "Authentic expression - You communicate in ways that align with your genuine self",
        "Pragmatic problem-solving - You seek practical solutions while considering broader implications",
        "Emotional intelligence - You recognize and work with emotions effectively",
        "Perseverance - You demonstrate persistence toward meaningful goals despite obstacles",
        "Value-based decision making - Your choices reflect your core principles and priorities"
      ],
      strengths: [
        "Your ability to consider both analytical and emotional dimensions gives you a comprehensive understanding of complex situations",
        "Your adaptive approach allows you to thrive in changing circumstances while maintaining core stability",
        "Your self-awareness helps you recognize patterns in your thoughts, feelings, and behaviors",
        "Your balanced perspective enables you to see different sides of issues and find integrative solutions"
      ],
      challenges: [
        "You may sometimes struggle to fully commit to a direction when multiple valid options are present",
        "Your awareness of complexity can occasionally lead to overthinking rather than decisive action",
        "Balancing different aspects of yourself may sometimes create internal tension that requires integration",
        "Your high standards for yourself might occasionally translate into self-criticism that isn't productive"
      ],
      adaptivePatterns: [
        "You adjust your approach based on context while maintaining core authenticity",
        "You learn from experiences and incorporate new insights into your understanding",
        "You balance structure and spontaneity depending on what the situation requires"
      ],
      potentialBlindSpots: [
        "You may occasionally underestimate how your balanced approach appears to those with more extreme styles",
        "Your attempt to see multiple perspectives might sometimes delay necessary decisive action",
        "Your self-awareness might occasionally become self-consciousness that limits spontaneous expression"
      ]
    },
    careerInsights: {
      naturalStrengths: [
        "Adaptability across different environments and requirements",
        "Balanced consideration of practical needs and larger purpose",
        "Ability to work both independently and collaboratively",
        "Capacity to learn new skills and integrate diverse knowledge"
      ],
      workplaceNeeds: [
        "Environment that values both structure and flexibility",
        "Recognition for contributions across different dimensions",
        "Opportunities for continued growth and development",
        "Culture that balances results with human considerations"
      ],
      leadershipStyle: "Your leadership approach balances task focus with people orientation. You provide sufficient structure while remaining responsive to individual needs and circumstances. You tend to lead through a combination of clear direction and collaborative engagement.",
      idealWorkEnvironment: "You thrive in settings that combine clear frameworks with room for creativity and initiative. Environments that value both results and process, and that acknowledge both individual contribution and team collaboration, allow your diverse strengths to flourish.",
      careerPathways: [
        "Roles that require integration of analytical thinking and human understanding",
        "Positions that involve adapting to changing circumstances while maintaining core focus",
        "Work that balances independent tasks with collaborative projects"
      ],
      professionalChallenges: [
        "Environments that are extremely rigid or extremely chaotic may tax your preference for balanced structure",
        "Settings that value only one dimension of performance may not recognize your multifaceted contributions",
        "Roles that require extreme specialization might not utilize your integrative capabilities"
      ],
      potentialRoles: [
        "Project management positions that require coordinating diverse elements",
        "Consultative roles that involve understanding complex human and technical systems",
        "Team leadership positions that balance direction-setting with people development",
        "Roles in fields undergoing transformation that require both stability and innovation"
      ]
    },
    motivationalProfile: {
      primaryDrivers: [
        "Growth and development across multiple dimensions",
        "Creating meaningful impact through your contributions",
        "Understanding complex systems and patterns",
        "Building authentic connections while maintaining integrity"
      ],
      secondaryDrivers: [
        "Achieving mastery in areas of particular interest",
        "Expressing your unique perspective and capabilities",
        "Creating environments that reflect your values",
        "Finding elegant solutions to challenging problems"
      ],
      inhibitors: [
        "Environments that impose rigid expectations without clear purpose",
        "Situations that force false choices between equally important values",
        "Settings that ignore complexity in favor of oversimplification",
        "Interactions that violate core ethical principles"
      ],
      values: [
        "Authenticity - Being true to yourself while respecting diverse perspectives",
        "Growth - Continuous development and learning throughout life",
        "Balance - Integration of different aspects of experience",
        "Connection - Meaningful relationships based on mutual understanding",
        "Contribution - Making a positive difference through your efforts"
      ],
      aspirations: "You seek to create a life that integrates your diverse interests and capabilities while making a meaningful contribution. You aspire to continue growing while maintaining authentic connections and expressing your unique perspective.",
      fearPatterns: "Your concerns tend to center around failing to realize your potential, being misunderstood in fundamental ways, or being forced into false either/or choices that don't honor complexity."
    },
    growthPotential: {
      developmentAreas: [
        "Strengthening decisive action when multiple valid options are present",
        "Developing even greater comfort with necessary tensions between different values",
        "Building additional resilience for navigating extended periods of ambiguity",
        "Further refining your ability to communicate complex insights accessibly"
      ],
      recommendations: [
        "Practice decisive commitment after appropriate consideration to balance reflection with action",
        "Explore frameworks that help integrate seemingly opposing values or approaches",
        "Develop additional practices that support wellbeing during challenging transitions",
        "Seek feedback on how your communication lands with different audiences"
      ],
      specificActionItems: [
        "Identify one area where deeper commitment would serve your development, and take concrete steps",
        "Practice reframing either/or situations as both/and possibilities when appropriate",
        "Establish regular reflection practices that help you integrate diverse experiences",
        "Create opportunities to articulate complex ideas to different audiences"
      ],
      longTermTrajectory: "Your development path involves increasingly sophisticated integration of different aspects of yourself and your experience. As you grow, you'll likely develop greater capacity to hold complexity while taking clear action, and to express nuanced understanding in accessible ways.",
      potentialPitfalls: [
        "Allowing appreciation of complexity to delay necessary commitment or action",
        "Attempting to reconcile genuinely incompatible elements rather than making necessary choices",
        "Setting unrealistic standards for integration that create unnecessary pressure",
        "Undervaluing your unique capacity to navigate multiple domains skillfully"
      ],
      growthMindsetIndicators: "Your responses indicate a strong foundation for continuous development. You demonstrate openness to new experiences, willingness to consider different perspectives, and recognition that abilities can be developed through dedication and effort."
    }
  };
}

/**
 * Simple utility to count occurrences of keywords in text
 */
function countOccurrences(text: string, keywords: string[]): number {
  const lowerText = text.toLowerCase();
  return keywords.reduce((count, word) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = lowerText.match(regex);
    return count + (matches ? matches.length : 0);
  }, 0);
}
