
import React from "react";
import { Heart, ChevronDown, ChevronUp } from "lucide-react";
import { PersonalityTrait } from "@/utils/types";

interface PersonalityTraitsListProps {
  traits: PersonalityTrait[];
}

export const PersonalityTraitsList: React.FC<PersonalityTraitsListProps> = ({ traits }) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div>
      <button 
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full py-2 text-left font-medium border-b"
      >
        <div className="flex items-center">
          <Heart className="h-4 w-4 mr-2 text-primary" />
          <span>Top Personality Traits</span>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      
      {expanded && (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 animate-in fade-in">
          {traits.slice(0, 9).map((trait, index) => (
            <div key={index} className="bg-secondary/10 p-2 rounded-md">
              <div className="font-medium flex items-center">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mr-2 text-xs text-primary">
                  {index + 1}
                </div>
                {trait.trait}
              </div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{trait.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
