
export function generateDefaultScore(domain: string): number {
  const baseScore = Math.random() * 30 + 50; // Generate score between 50-80
  return Math.round(baseScore);
}

export function calculateSafeDomainScore(domain: string): number {
  try {
    const score = generateDefaultScore(domain);
    return Math.min(100, Math.max(0, score)); // Ensure score is between 0-100
  } catch (error) {
    console.error(`Error calculating ${domain} score:`, error);
    return 50; // Default fallback score
  }
}
