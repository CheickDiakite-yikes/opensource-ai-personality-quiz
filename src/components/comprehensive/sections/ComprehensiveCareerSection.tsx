
import React from 'react';
import { CareerPathway } from "@/utils/types";
import { processCareerSuggestions } from './career/utils/careerUtils';
import PurposeSection from './career/PurposeSection';
import CareerPathwaysSection from './career/CareerPathwaysSection';
import DevelopmentRoadmapSection from './career/DevelopmentRoadmapSection';

interface ComprehensiveCareerSectionProps {
  careerSuggestions: string[] | CareerPathway[];
  roadmap: string;
  lifePurposeThemes?: string[];
}

const ComprehensiveCareerSection: React.FC<ComprehensiveCareerSectionProps> = ({ 
  careerSuggestions, 
  roadmap,
  lifePurposeThemes = []
}) => {
  // Process career suggestions into a consistent format
  const careerPaths = processCareerSuggestions(careerSuggestions);

  return (
    <>
      <PurposeSection lifePurposeThemes={lifePurposeThemes} />
      <CareerPathwaysSection careerPaths={careerPaths} />
      <DevelopmentRoadmapSection roadmap={roadmap} />
    </>
  );
};

export default ComprehensiveCareerSection;
