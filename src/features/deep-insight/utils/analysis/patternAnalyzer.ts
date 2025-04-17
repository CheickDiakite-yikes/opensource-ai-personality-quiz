
import { DeepInsightResponses } from "../../types";
import { ResponsePatternAnalysis } from "./types";

/**
 * Analyzes response patterns to generate detailed percentages and determine primary/secondary choices
 * Now with enhanced accuracy to identify both strengths and weaknesses honestly
 */
export const analyzeResponsePatterns = (responses: DeepInsightResponses): ResponsePatternAnalysis => {
  console.log("Processing responses for pattern analysis:", Object.keys(responses).length);
  
  // Extract key insights to personalize the analysis
  const responsesArray = Object.entries(responses);
  
  // Initialize counters with all possible response types
  const answerCounts = {
    a: 0, // Analytical
    b: 0, // Emotional
    c: 0, // Practical
    d: 0, // Creative
    e: 0, // Social
    f: 0  // Organized
  };
  
  // Count response types more thoroughly
  responsesArray.forEach(([questionId, answer]) => {
    // First try the expected format where the answer ends with a letter
    const lastChar = answer.charAt(answer.length - 1);
    if (['a', 'b', 'c', 'd', 'e', 'f'].includes(lastChar)) {
      answerCounts[lastChar]++;
      return;
    }
    
    // Try alternative format where the answer contains "-X"
    for (const key of Object.keys(answerCounts)) {
      if (answer.includes(`-${key}`)) {
        answerCounts[key]++;
        return;
      }
    }
    
    // If we can't determine the type, log it
    console.log(`Could not determine pattern for answer: ${answer}`);
  });
  
  console.log("Response distribution:", answerCounts);
  
  const totalResponses = Math.max(
    responsesArray.length, 
    Object.values(answerCounts).reduce((sum, count) => sum + count, 0)
  );
  
  // Calculate percentages with rounding to ensure they sum to 100%
  let percentageSum = 0;
  const rawPercentages = {};
  
  // First pass - calculate raw percentages
  for (const key in answerCounts) {
    rawPercentages[key] = (answerCounts[key] / totalResponses) * 100;
    percentageSum += Math.round(rawPercentages[key]);
  }
  
  // Adjust to ensure percentages sum to 100%
  const percentages: Record<string, number> = {};
  let adjustedSum = 0;
  
  // Sort keys by raw percentage (descending) to prioritize larger values
  const sortedKeys = Object.keys(rawPercentages).sort(
    (a, b) => rawPercentages[b] - rawPercentages[a]
  );
  
  // Round most values, save adjustment for the last one
  for (let i = 0; i < sortedKeys.length; i++) {
    const key = sortedKeys[i];
    if (i < sortedKeys.length - 1) {
      percentages[key] = Math.round(rawPercentages[key]);
      adjustedSum += percentages[key];
    } else {
      // Make the last (smallest) value absorb the rounding difference
      percentages[key] = Math.max(0, 100 - adjustedSum);
    }
  }
  
  console.log("Final percentages:", percentages);
  
  // Generate a unique response signature for this user
  const responseSignature = `${percentages.a}-${percentages.b}-${percentages.c}-${percentages.d}-${percentages.e}-${percentages.f}`;
  console.log("Response signature:", responseSignature);
  
  // Determine primary tendencies based on highest percentages, now with all options
  const sortedChoices = Object.entries(percentages)
    .sort(([, a], [, b]) => b - a)
    .map(([choice]) => choice);
  
  const primaryChoice = sortedChoices[0];
  const secondaryChoice = sortedChoices[1];
  
  // Generate interpretation based on patterns
  const interpretation = generatePatternInterpretation(primaryChoice, secondaryChoice, percentages);
  
  console.log(`Primary choice: ${primaryChoice} (${percentages[primaryChoice]}%), Secondary: ${secondaryChoice} (${percentages[secondaryChoice]}%)`);
  
  return {
    percentages,
    primaryChoice,
    secondaryChoice,
    responseSignature,
    interpretation
  };
};

/**
 * Generates a detailed interpretation of the response pattern
 */
function generatePatternInterpretation(
  primary: string, 
  secondary: string,
  percentages: Record<string, number>
): string {
  // Get style names for primary and secondary
  const primaryStyle = getResponseStyleName(primary);
  const secondaryStyle = getResponseStyleName(secondary);
  
  // Calculate diversity ratio - how evenly distributed are the responses
  const values = Object.values(percentages);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const diversity = 1 - ((max - min) / max);
  
  let interpretation = `Your response pattern shows a predominant ${primaryStyle} style (${percentages[primary]}%) `;
  interpretation += `combined with a strong ${secondaryStyle} approach (${percentages[secondary]}%). `;
  
  // Add context based on diversity ratio
  if (diversity > 0.7) {
    interpretation += `You have a remarkably balanced response pattern, indicating versatility in your approach to situations. `;
  } else if (diversity > 0.4) {
    interpretation += `Your thinking style shows moderate flexibility, with clear preferences but the ability to adapt. `;
  } else {
    interpretation += `Your response pattern shows a very distinct preference for your primary style, indicating clarity in your approach. `;
  }
  
  // Add insights based on specific combinations
  interpretation += getCombinationInsight(primary, secondary);
  
  return interpretation;
}

/**
 * Returns the full name of a response style based on its code
 */
function getResponseStyleName(code: string): string {
  switch(code) {
    case 'a': return 'Analytical';
    case 'b': return 'Emotional';
    case 'c': return 'Practical';
    case 'd': return 'Creative';
    case 'e': return 'Social';
    case 'f': return 'Organized';
    default: return 'Balanced';
  }
}

/**
 * Provides specific insights based on combinations of thinking styles
 */
function getCombinationInsight(primary: string, secondary: string): string {
  const combinations = {
    "a+b": "You balance logical analysis with emotional awareness, giving you both rigorous thinking and strong interpersonal insights.",
    "a+c": "Your combination of analytical thinking and practical focus creates a pragmatic problem-solving approach grounded in solid reasoning.",
    "a+d": "You unite systematic analysis with creative exploration, allowing you to find innovative solutions while maintaining logical structure.",
    "a+e": "Your analytical mind combined with social awareness allows you to understand both systems and people with equal clarity.",
    "a+f": "You combine analytical depth with organizational precision, creating highly structured and well-reasoned approaches to problems.",
    
    "b+a": "Your emotional intelligence is complemented by analytical ability, helping you process feelings while maintaining objective perspective.",
    "b+c": "You blend emotional awareness with practical action, helping you navigate feelings while finding workable solutions.",
    "b+d": "Your emotional depth enhances your creative expression, allowing for authentic and resonant creative output.",
    "b+e": "With both emotional and social intelligence, you excel at understanding individuals deeply while navigating group dynamics.",
    "b+f": "Your emotional awareness combined with organizational skills helps you create structured approaches that honor human needs.",
    
    "c+a": "Your practical orientation is enhanced by analytical thinking, allowing you to implement solutions based on sound reasoning.",
    "c+b": "You complement your practical approach with emotional understanding, making you effective at implementing solutions that work for people.",
    "c+d": "Your practical foundation supports creative exploration, helping you turn innovative ideas into workable realities.",
    "c+e": "Your practical nature combined with social awareness helps you implement solutions that work within community contexts.",
    "c+f": "Your combination of practical action and organizational structure creates highly efficient and functional systems.",
    
    "d+a": "Your creative thinking is complemented by analytical ability, allowing you to innovate while maintaining logical coherence.",
    "d+b": "Your creative expression is enhanced by emotional depth, making your innovations resonate on a human level.",
    "d+c": "Your creative vision is grounded by practical considerations, helping you bring innovative ideas into realistic implementation.",
    "d+e": "Your creative thinking combined with social awareness helps you innovate in ways that resonate with and engage others.",
    "d+f": "You organize your creative energy with structured approaches, helping you channel innovation effectively.",
    
    "e+a": "Your social intelligence is enhanced by analytical thinking, giving you insight into both group dynamics and systematic patterns.",
    "e+b": "Your social awareness is deepened by emotional intelligence, allowing you to understand group dynamics and individual feelings.",
    "e+c": "Your social orientation combined with practical approach helps you build functional connections and communities.",
    "e+d": "Your social awareness is enhanced by creative thinking, helping you find innovative ways to connect with and engage others.",
    "e+f": "You bring organization to social contexts, excelling at structured collaboration and group coordination.",
    
    "f+a": "Your organizational precision combined with analytical depth creates highly structured and thoroughly reasoned systems.",
    "f+b": "Your organizational ability is balanced by emotional awareness, helping you create systems that respect human needs.",
    "f+c": "Your organizational structure supports practical implementation, making you highly effective at executing plans.",
    "f+d": "You organize creative energy with structured approaches, helping to channel innovation into productive outcomes.",
    "f+e": "Your organizational skills applied to social contexts make you excellent at coordinating groups and building structured communities.",
  };
  
  const key = `${primary}+${secondary}`;
  return combinations[key] || "This combination provides a unique perspective on situations and challenges.";
}
