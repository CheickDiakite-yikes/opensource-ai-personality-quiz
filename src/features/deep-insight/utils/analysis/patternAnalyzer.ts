
import { DeepInsightResponses } from "../../types";
import { ResponsePatternAnalysis } from "./types";

/**
 * Analyzes response patterns to generate percentages and determine primary/secondary choices
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
    d: 0
  };
  
  responsesArray.forEach(([_, answer]) => {
    if (answer.includes('-a')) answerCounts.a++;
    if (answer.includes('-b')) answerCounts.b++;
    if (answer.includes('-c')) answerCounts.c++;
    if (answer.includes('-d')) answerCounts.d++;
  });
  
  console.log("Response distribution:", answerCounts);
  
  const totalResponses = responsesArray.length;
  const percentages = {
    a: Math.round((answerCounts.a / totalResponses) * 100),
    b: Math.round((answerCounts.b / totalResponses) * 100),
    c: Math.round((answerCounts.c / totalResponses) * 100),
    d: Math.round((answerCounts.d / totalResponses) * 100)
  };
  
  // Generate a unique response signature for this user
  const responseSignature = `${percentages.a}-${percentages.b}-${percentages.c}-${percentages.d}`;
  console.log("Response signature:", responseSignature);
  
  // Determine primary tendencies based on highest percentages
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
