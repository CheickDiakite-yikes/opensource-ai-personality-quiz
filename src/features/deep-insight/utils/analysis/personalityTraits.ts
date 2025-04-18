
import { PersonalityTraitsDetermination } from "./types";

/**
 * Determines personality traits based on response patterns
 */
export const determinePersonalityTraits = (primaryChoice: string): PersonalityTraitsDetermination => {
  let primaryTrait, analyticalScore, emotionalScore, adaptabilityScore;
  let decisionMakingStyle, learningStyle, emotionalAwareness;
  
  // Primary trait based on most common response
  switch(primaryChoice) {
    case 'a':
      primaryTrait = "Analytical Strategist";
      analyticalScore = 72 + Math.random() * 15; // More varied distribution
      emotionalScore = 55 + Math.random() * 20;  // Lower baseline, wider range
      adaptabilityScore = 62 + Math.random() * 18;
      decisionMakingStyle = "You tend to gather all available information before making decisions, weighing pros and cons meticulously. This methodical approach serves you well for complex choices but may slow you down for simpler ones. You excel at identifying logical inconsistencies and potential pitfalls, though you might sometimes overanalyze situations where intuition would be more efficient. Your decision-making process typically involves creating mental models and frameworks to organize information systematically.";
      learningStyle = "You learn best through structured, logical frameworks and detailed analysis. You prefer to master fundamental concepts before moving forward. Information presented in an organized, sequential manner is easiest for you to absorb and retain. You tend to ask probing questions to deepen your understanding and often create your own systems for categorizing knowledge. Abstract concepts become clearer to you when they're accompanied by concrete examples or empirical evidence.";
      emotionalAwareness = "You have strong cognitive awareness of emotions, though you may sometimes intellectualize feelings rather than experiencing them directly. You're skilled at analyzing emotional patterns in yourself and others, but might occasionally maintain emotional distance as a protective mechanism. You prefer processing feelings privately before discussing them and are adept at identifying the logical reasons behind emotional reactions. Your emotional self-regulation tends to be deliberate and controlled, with an emphasis on maintaining objectivity even in challenging situations.";
      break;
    case 'b':
      primaryTrait = "Empathic Connector";
      analyticalScore = 60 + Math.random() * 15;  // Lower analytical for empathic type
      emotionalScore = 74 + Math.random() * 18;   // Higher emotional but more variance
      adaptabilityScore = 65 + Math.random() * 20;
      decisionMakingStyle = "You balance rational analysis with intuition, often considering how choices will affect others. You're skilled at understanding multiple perspectives when making decisions. Your process typically involves checking in with your emotional compass while also weighing practical considerations. You're particularly attuned to the relational implications of your choices and naturally consider the human impact alongside logical factors. This integrated approach allows you to make decisions that are both sound and emotionally intelligent, though you may sometimes spend extra time processing the emotional dimensions of important choices.";
      learningStyle = "You learn best through collaborative discussion and connecting new information to personal experiences. Social learning environments tend to enhance your understanding. You naturally draw connections between concepts and their real-world applications, especially as they relate to people and relationships. You tend to remember information better when it has emotional resonance or when you can see how it might positively impact others. Storytelling and narrative frameworks significantly enhance your retention and engagement with new material.";
      emotionalAwareness = "You possess exceptional awareness of your emotional landscape and can often sense others' feelings with remarkable accuracy. This emotional intelligence is a cornerstone of your personality. You naturally pick up on subtle emotional cues that others might miss and can usually identify the underlying causes of emotional reactions. Your emotional vocabulary is rich and nuanced, allowing you to distinguish between similar feelings with precision. While you're generally comfortable with emotional expression, you're also skilled at adapting this expression to different contexts appropriately.";
      break;
    case 'c':
      primaryTrait = "Adaptive Innovator";
      analyticalScore = 65 + Math.random() * 18;
      emotionalScore = 62 + Math.random() * 16;
      adaptabilityScore = 75 + Math.random() * 15;  // Still strong but more realistic
      decisionMakingStyle = "You're comfortable making decisions with incomplete information, trusting your ability to adjust as new data emerges. This adaptive approach serves you well in rapidly changing situations. You excel at iterative decision-making, where you can make initial choices and then refine your approach based on real-time feedback. Your decisions are typically pragmatic and context-sensitive rather than based on rigid principles or frameworks. You naturally consider multiple possible futures and prepare contingency plans, making you particularly effective in uncertain or ambiguous environments.";
      learningStyle = "You learn through experimentation and practical application, preferring to dive in and learn by doing rather than extensive preparation. You're comfortable with trial and error and see mistakes as valuable learning opportunities rather than failures. Your learning accelerates when you can immediately apply new knowledge to solve real problems. You tend to absorb information across diverse domains and are skilled at making unusual connections between seemingly unrelated concepts. Your learning is enhanced when you have the freedom to explore tangents and alternative approaches.";
      emotionalAwareness = "You have a balanced awareness of emotions and can generally identify what you're feeling, though you may sometimes prioritize action over processing emotions fully. You adapt your emotional expression based on what's practical in the moment and can shift emotional gears quickly when circumstances change. Your emotional resilience is particularly strong, allowing you to recover from setbacks and disappointments with relative ease. While you value emotional authenticity, you're also pragmatic about emotional management in different contexts. You're especially adept at maintaining emotional equilibrium during times of change or crisis.";
      break;
    case 'd':
      primaryTrait = "Visionary Explorer";
      analyticalScore = 66 + Math.random() * 16;
      emotionalScore = 64 + Math.random() * 18;
      adaptabilityScore = 70 + Math.random() * 17;
      decisionMakingStyle = "You often rely on intuition and big-picture thinking when making decisions. You have a knack for seeing possibilities others miss and are comfortable taking calculated risks. Your decisions are frequently guided by a strong internal vision of what could be, rather than just what currently exists. You naturally consider long-term implications and are willing to make unconventional choices if they align with your vision. While you can analyze details when necessary, you prefer to maintain focus on the broader purpose and meaning behind your decisions, occasionally overlooking practical implementation challenges in favor of innovative possibilities.";
      learningStyle = "You learn best when exploring connections between diverse concepts and ideas. You're drawn to the novel and unconventional in your approach to knowledge. Abstract thinking comes naturally to you, and you often grasp high-level concepts before understanding all the details. You tend to learn in non-linear ways, making intuitive leaps and connections that might not follow traditional learning paths. Visual and spatial representations of information particularly resonate with you. Your curiosity is broad and deep, and you're especially engaged when learning about topics that challenge conventional wisdom or offer new conceptual frameworks.";
      emotionalAwareness = "You have good emotional awareness, particularly when emotions connect to your values and aspirations. You're especially attuned to feelings of wonder, curiosity, and inspiration. Your emotional landscape is rich and textured, with particular sensitivity to aesthetic experiences and moments of insight or discovery. You may experience emotions more intensely than others in response to ideas, possibilities, or creative works. While you're generally comfortable with emotional complexity, you sometimes find routine emotional maintenance less engaging than the emotional highs that come with new discoveries or creative breakthroughs. Your emotional self-understanding is often expressed through creative or intellectual pursuits.";
      break;
    default:
      primaryTrait = "Balanced Thinker";
      analyticalScore = 65 + Math.random() * 15;  // More moderate baseline scores
      emotionalScore = 65 + Math.random() * 15;
      adaptabilityScore = 65 + Math.random() * 15;
      decisionMakingStyle = "You approach decisions with a balanced perspective, weighing both logical and intuitive factors. You're flexible in your decision-making style, adapting your approach based on the specific situation. You can be methodical when necessary but also trust your gut instincts when appropriate. This versatility allows you to handle a wide range of decisions effectively, though you may sometimes experience initial uncertainty about which approach to use for a particular situation. You generally consider both short-term practical concerns and longer-term implications in your decision process.";
      learningStyle = "You have a flexible learning style that adapts to different contexts and subject matters. You can engage with both theoretical concepts and practical applications, depending on the situation. Your learning benefits from a mixture of independent study and collaborative discussion. You tend to integrate information from multiple sources and perspectives before forming your own understanding. While you don't strongly favor one learning modality over others, having access to diverse formats (visual, auditory, kinesthetic) enhances your comprehension and retention.";
      emotionalAwareness = "You have a solid awareness of your emotions and can generally navigate emotional situations effectively. You strike a reasonable balance between acknowledging feelings and maintaining practical focus. While you may not always immediately recognize subtle emotional nuances, you're able to process and understand your emotions given some reflection time. You're typically comfortable both sharing emotions and keeping them private, depending on the context. Your emotional regulation tends to be flexible, neither overly controlled nor excessively expressive in most situations.";
  }
  
  return {
    primaryTrait,
    analyticalScore,
    emotionalScore,
    adaptabilityScore,
    decisionMakingStyle,
    learningStyle,
    emotionalAwareness
  };
};

/**
 * Determines secondary trait based on response pattern
 */
export const determineSecondaryTrait = (secondaryChoice: string): string => {
  switch(secondaryChoice) {
    case 'a': return "Systematic Thinker";
    case 'b': return "Relationship Focused";
    case 'c': return "Pragmatic Adapter";
    case 'd': return "Creative Explorer";
    default: return "Balanced Thinker";
  }
};
