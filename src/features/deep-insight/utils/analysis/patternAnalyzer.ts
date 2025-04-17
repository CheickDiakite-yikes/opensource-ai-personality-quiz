
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
    // Handle null, undefined or invalid answers
    if (!answer || typeof answer !== 'string') {
      console.warn("Invalid answer detected:", answer);
      return;
    }
    
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
  
  // Handle edge case where there are no responses
  if (totalResponses === 0) {
    console.warn("No valid responses found, using default distribution");
    return {
      percentages: {
        a: 20,
        b: 20,
        c: 20,
        d: 20,
        e: 10,
        f: 10
      },
      primaryChoice: "a",
      secondaryChoice: "b",
      responseSignature: "20-20-20-20-10-10"
    };
  }
  
  // Calculate valid response count (sum of all answer counts)
  const validResponseCount = answerCounts.a + answerCounts.b + answerCounts.c + 
                            answerCounts.d + answerCounts.e + answerCounts.f;
                            
  // If no valid responses were found (e.g., malformed data), use default
  if (validResponseCount === 0) {
    console.warn("No valid answer choices found, using default distribution");
    return {
      percentages: {
        a: 20,
        b: 20,
        c: 20,
        d: 20,
        e: 10,
        f: 10
      },
      primaryChoice: "a",
      secondaryChoice: "b",
      responseSignature: "20-20-20-20-10-10"
    };
  }
  
  const percentages = {
    a: Math.round((answerCounts.a / validResponseCount) * 100) || 0,
    b: Math.round((answerCounts.b / validResponseCount) * 100) || 0,
    c: Math.round((answerCounts.c / validResponseCount) * 100) || 0,
    d: Math.round((answerCounts.d / validResponseCount) * 100) || 0,
    e: Math.round((answerCounts.e / validResponseCount) * 100) || 0,
    f: Math.round((answerCounts.f / validResponseCount) * 100) || 0
  };
  
  // Ensure percentages sum to 100%
  const totalPercentage = percentages.a + percentages.b + percentages.c + 
                          percentages.d + percentages.e + percentages.f;
                          
  if (totalPercentage !== 100 && validResponseCount > 0) {
    // Find the largest percentage and adjust it to make total 100%
    const diff = 100 - totalPercentage;
    const entries = Object.entries(percentages) as [keyof typeof percentages, number][];
    const maxEntry = entries.reduce((max, entry) => 
      entry[1] > max[1] ? entry : max, entries[0]
    );
    
    percentages[maxEntry[0]] += diff;
    console.log(`Adjusted percentages to sum to 100% (added ${diff} to ${maxEntry[0]})`);
  }
  
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
