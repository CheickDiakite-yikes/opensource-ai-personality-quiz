
import { CareerPathway } from "@/utils/types";

// Helper function to safely convert any value to string
const safeString = (value: any): string => {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') {
    // Handle objects with name/description
    if (value.name) return String(value.name);
    if (value.description) return String(value.description);
    return JSON.stringify(value);
  }
  return String(value);
};

/**
 * Processes career suggestions into a consistent format
 */
export const processCareerSuggestions = (
  careerSuggestions: string[] | CareerPathway[]
): CareerPathway[] => {
  // Check if we're dealing with the enhanced career pathways format
  const hasDetailedCareers = careerSuggestions.length > 0 && 
    typeof careerSuggestions[0] !== 'string' && 
    careerSuggestions[0] !== null &&
    ('title' in careerSuggestions[0] || 'field' in careerSuggestions[0]);
  
  // Safely transform career suggestions into a consistent format
  return hasDetailedCareers 
    ? careerSuggestions as CareerPathway[]
    : (careerSuggestions as any[]).map(career => {
        // Handle if career is a string or an object with name/description
        if (typeof career === 'string') {
          return { 
            field: career,
            title: career,
          };
        } else if (career && typeof career === 'object') {
          // Safely handle objects with potential name/description properties
          const title = safeString(career.name || career.title || career.field || "Career Path");
          return { 
            field: title,
            title: title,
            description: career.description ? safeString(career.description) : undefined
          };
        } else {
          return {
            field: "Career Path",
            title: "Career Path"
          };
        }
      });
};
