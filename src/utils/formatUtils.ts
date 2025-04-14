
// Add the missing formatTraitScore function
export const formatTraitScore = (score: number | undefined): string => {
  if (score === undefined || score === null) {
    return "N/A";
  }
  
  // Format the score out of 10
  return `${score.toFixed(1)}/10`;
};
