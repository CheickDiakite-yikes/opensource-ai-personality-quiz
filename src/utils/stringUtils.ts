
/**
 * Gets initials from a name string
 * @param name The name to get initials from
 * @returns The initials (up to 2 characters)
 */
export const getInitials = (name: string): string => {
  if (!name) return "?";
  
  // Split by spaces and get first letters of each word
  const parts = name.trim().split(/\s+/);
  
  if (parts.length === 1) {
    // If only one word, return first two letters
    return parts[0].substring(0, 2).toUpperCase();
  } else {
    // Return first letter of first and last words
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
};

/**
 * Truncates text to a specified length with ellipsis
 * @param text The text to truncate
 * @param maxLength Maximum length before truncating
 * @returns Truncated text with ellipsis if needed
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text || '';
  return text.substring(0, maxLength) + '...';
};
