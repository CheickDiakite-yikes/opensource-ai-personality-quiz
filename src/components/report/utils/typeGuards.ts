
import { ValueSystemType, CognitiveStyleType, RelationshipPatterns } from "@/utils/types";

// Type guard to check if valueSystem is an object or array
export const isValueSystemObject = (valueSystem: ValueSystemType): valueSystem is {
  strengths: string[];
  challenges: string[];
  compatibleTypes: string[];
} => {
  return typeof valueSystem === 'object' && !Array.isArray(valueSystem) && 'strengths' in valueSystem;
};

// Type guard to check if relationshipPatterns is an object or array
export const isRelationshipObject = (patterns: RelationshipPatterns | string[]): patterns is RelationshipPatterns => {
  return typeof patterns === 'object' && !Array.isArray(patterns) && 'strengths' in patterns;
};

// Type guard for cognitive style
export const isCognitiveStyleObject = (style: CognitiveStyleType): style is {
  primary: string;
  secondary: string;
  description: string;
} => {
  return typeof style === 'object' && 'primary' in style;
};
