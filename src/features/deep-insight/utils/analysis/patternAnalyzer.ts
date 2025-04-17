
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
    e: 0,
    f: 0
  };
  
  // Count each response type by the letter at the end of the response string
  responsesArray.forEach(([_, answer]) => {
    // Extract the last character of the answer string which indicates the choice
    const lastChar = answer.charAt(answer.length - 1).toLowerCase();
    
    // Increment the appropriate counter if the character is a valid choice
    if (lastChar === 'a') answerCounts.a++;
    if (lastChar === 'b') answerCounts.b++;
    if (lastChar === 'c') answerCounts.c++;
    if (lastChar === 'd') answerCounts.d++;
    if (lastChar === 'e') answerCounts.e++;
    if (lastChar === 'f') answerCounts.f++;
  });
  
  console.log("Response distribution:", answerCounts);
  
  const totalResponses = responsesArray.length;
  const percentages = {
    a: Math.round((answerCounts.a / totalResponses) * 100) || 0,
    b: Math.round((answerCounts.b / totalResponses) * 100) || 0,
    c: Math.round((answerCounts.c / totalResponses) * 100) || 0,
    d: Math.round((answerCounts.d / totalResponses) * 100) || 0,
    e: Math.round((answerCounts.e / totalResponses) * 100) || 0,
    f: Math.round((answerCounts.f / totalResponses) * 100) || 0
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
