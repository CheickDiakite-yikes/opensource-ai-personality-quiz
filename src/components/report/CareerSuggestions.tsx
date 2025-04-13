
import React from 'react';
import { Briefcase, ArrowRight } from 'lucide-react';
import { CareerPathway } from '@/utils/types';

interface CareerSuggestionsProps {
  careers: string[] | CareerPathway[];
}

const CareerSuggestions: React.FC<CareerSuggestionsProps> = ({ careers }) => {
  // Check if we're dealing with enhanced career pathways or simple strings
  const isEnhancedCareers = careers.length > 0 && 
    typeof careers[0] !== 'string' && 
    careers[0] !== null &&
    ('title' in careers[0] || 'field' in careers[0]);

  if (isEnhancedCareers) {
    // Handle enhanced career pathways with detailed information
    return (
      <div className="space-y-4">
        <h3 className="text-md font-medium">Career Pathways</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(careers as CareerPathway[]).map((career, index) => {
            // Make sure to extract text values safely, handling potential undefined values
            const title = career.title || career.field || "Career Path";
            const description = career.description || "";
            const alignment = career.alignment || "";
            
            return (
              <div 
                key={index} 
                className="border border-border/40 p-4 rounded-md hover:shadow-md transition-shadow bg-card/30"
              >
                <div className="flex items-start gap-2">
                  <Briefcase className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-primary">{title}</h4>
                    {description && <p className="text-sm mt-1 mb-2">{description}</p>}
                    {alignment && (
                      <p className="text-xs text-muted-foreground italic">
                        Alignment: {alignment}
                      </p>
                    )}
                    
                    {career.traits && career.traits.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium">Key Traits:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {career.traits.slice(0, 3).map((trait, i) => (
                            <span 
                              key={i} 
                              className="text-xs px-2 py-0.5 bg-primary/10 rounded-full"
                            >
                              {trait}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  
  // Handle simple string career suggestions
  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium">Suggested Career Paths</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {(careers as string[]).map((career, index) => (
          <div 
            key={index} 
            className="flex items-center p-3 border border-border/40 rounded-md hover:bg-secondary/10 transition-colors"
          >
            <ArrowRight className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
            <span>{career}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareerSuggestions;
