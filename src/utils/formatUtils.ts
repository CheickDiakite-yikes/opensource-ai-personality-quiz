
/**
 * Formats a trait score consistently as X/10 regardless of the input scale
 * @param score The raw score value (can be 0-1, 0-10, or 0-100)
 * @param format Output format ('fraction' for X/10 or 'number' for just X)
 * @returns Formatted score string
 */
export const formatTraitScore = (score: number, format: 'fraction' | 'number' = 'fraction'): string => {
  // If score is already between 0 and 10, use it directly
  if (score > 0 && score <= 10) {
    return format === 'fraction' ? `${Math.round(score)}/10` : String(Math.round(score));
  }
  // If score is between 0 and 1, scale to 0-10
  else if (score >= 0 && score <= 1) {
    return format === 'fraction' ? `${Math.round(score * 10)}/10` : String(Math.round(score * 10));
  }
  // If score is greater than 10 (e.g., 0-100 scale), convert to 0-10
  else if (score > 10) {
    return format === 'fraction' ? `${Math.round((score / 100) * 10)}/10` : String(Math.round((score / 100) * 10));
  }
  return format === 'fraction' ? `${Math.round(score)}/10` : String(Math.round(score));
};
