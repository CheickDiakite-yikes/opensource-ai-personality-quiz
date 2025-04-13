
import { CareerPathway } from "@/utils/types";

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
          const title = career.name || career.title || career.field || "Career Path";
          return { 
            field: title,
            title: title,
            description: career.description || undefined
          };
        } else {
          return {
            field: "Career Path",
            title: "Career Path"
          };
        }
      });
};
