
import { DeepInsightResponses } from "../../types";
import { ResponsePatternAnalysis } from "./types";

/**
 * Analyzes response patterns to generate percentages and determine primary/secondary choices
 * Now with enhanced accuracy to identify both strengths and weaknesses honestly
 */
export const analyzeResponsePatterns = (responses: DeepInsightResponses): ResponsePatternAnalysis => {
  console.log("Processing responses:", responses);
  
  // Extract key insights to personalize the analysis
  const responsesArray = Object.entries(responses);
  
  // Count different answer choices to detect patterns
  const answerCounts = {
    a: 0,
    b: 0, 
    c: 0,
    d: 0,
    e: 0,  // Added new option
    f: 0   // Added new option
  };
  
  responsesArray.forEach(([_, answer]) => {
    const lastChar = answer.charAt(answer.length - 1);
    if (lastChar === 'a') answerCounts.a++;
    if (lastChar === 'b') answerCounts.b++;
    if (lastChar === 'c') answerCounts.c++;
    if (lastChar === 'd') answerCounts.d++;
    if (lastChar === 'e') answerCounts.e++;  // Support for new option e
    if (lastChar === 'f') answerCounts.f++;  // Support for new option f
  });
  
  console.log("Response distribution:", answerCounts);
  
  const totalResponses = responsesArray.length;
  const percentages = {
    a: Math.round((answerCounts.a / totalResponses) * 100),
    b: Math.round((answerCounts.b / totalResponses) * 100),
    c: Math.round((answerCounts.c / totalResponses) * 100),
    d: Math.round((answerCounts.d / totalResponses) * 100),
    e: Math.round((answerCounts.e / totalResponses) * 100),  // Percentage for new option
    f: Math.round((answerCounts.f / totalResponses) * 100)   // Percentage for new option
  };
  
  // Generate a unique response signature for this user
  const responseSignature = `${percentages.a}-${percentages.b}-${percentages.c}-${percentages.d}-${percentages.e}-${percentages.f}`;
  console.log("Response signature:", responseSignature);
  
  // Determine primary tendencies based on highest percentages, now with all options
  const sortedChoices = Object.entries(percentages)
    .sort(([, a], [, b]) => b - a)
    .map(([choice]) => choice);
  
  const primaryChoice = sortedChoices[0];
  const secondaryChoice = sortedChoices[1];
  
  console.log(`Primary choice: ${primaryChoice} (${percentages[primaryChoice]}%), Secondary: ${secondaryChoice} (${percentages[secondaryChoice]}%)`);
  
  return {
    percentages,
    primaryChoice,
    secondaryChoice,
    responseSignature
  };
};
