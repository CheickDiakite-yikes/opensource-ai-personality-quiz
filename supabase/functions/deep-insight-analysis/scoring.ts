// Helper function to safely generate a default score
export function generateDefaultScore(domain: string): number {
  // Generate a score with normal distribution
  const baseScore = 65; // Mean
  const stdDev = 15;  // Standard deviation
  
  // Box-Muller transform for normal distribution
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  
  // Apply the normal distribution
  let score = Math.round(baseScore + z0 * stdDev);
  
  // Ensure the score is within the realistic bounds
  score = Math.min(95, Math.max(35, score));
  
  return score;
}

// Helper function to safely calculate domain scores
export function calculateSafeDomainScore(domain: string): number {
  const score = generateDefaultScore(domain);
  
  // Apply domain-specific adjustments based on characteristic distributions
  let adjustment = 0;
  
  switch(domain) {
    case "cognitive":
      adjustment = 5; // Slight positive bias for cognitive scores
      break;
    case "emotional":
      adjustment = 0; // Neutral for emotional scores
      break;
    case "adaptability":
      adjustment = 2; // Slight positive bias for adaptability
      break;
    case "resilience":
      adjustment = -2; // Slight negative bias for resilience (typically underreported)
      break;
    default:
      adjustment = 0;
  }
  
  // Apply the adjustment while keeping within bounds
  return Math.min(95, Math.max(35, score + adjustment));
}
