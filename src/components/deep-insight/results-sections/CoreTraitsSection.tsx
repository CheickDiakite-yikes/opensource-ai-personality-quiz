
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CoreTraits } from "../types/deepInsight";

interface CoreTraitsProps {
  data: CoreTraits | null;
}

const CoreTraitsSection: React.FC<CoreTraitsProps> = ({ data }) => {
  const defaultData = {
    primary: "Analytical Thinker",
    secondary: "Balanced Communicator",
    strengths: [
      "Logical reasoning", 
      "Detail orientation", 
      "Structured approach", 
      "Problem solving", 
      "Critical thinking"
    ],
    challenges: [
      "Perfectionism", 
      "Overthinking", 
      "Difficulty with ambiguity", 
      "Balancing details with big picture", 
      "Stress management"
    ]
  };
  
  // Use default data if data is null
  const traitData = data || defaultData;

  // Process strengths and challenges to handle various formats and ensure minimum items
  const processArrayItems = (items: any[] | undefined, defaultItems: string[]): string[] => {
    if (!items || !Array.isArray(items) || items.length === 0) return defaultItems;
    
    // If we have fewer than 5 items, add some defaults
    if (items.length < 5) {
      return [...items.map(item => processItem(item)), ...defaultItems.slice(0, 5 - items.length)];
    }
    
    return items.map(item => processItem(item));
  };
  
  // Process individual item which may be string or object
  const processItem = (item: any): string => {
    if (typeof item === 'string') {
      return item;
    } else if (typeof item === 'object' && item !== null) {
      // If it's an object, try to extract meaningful information
      if ('description' in item) return item.description;
      if ('trait' in item) return item.trait;
      if ('name' in item) return item.name;
      if ('text' in item) return item.text;
      if ('value' in item) return item.value;
      
      // Get the first key-value pair
      const key = Object.keys(item)[0];
      if (key) return `${key}: ${item[key]}`;
    }
    return String(item || '').replace(/[{}]/g, '');
  };
  
  // Ensure strengths and challenges are always arrays of strings with minimum content
  const defaultStrengths = defaultData.strengths;
  const defaultChallenges = defaultData.challenges;
  const safeStrengths = processArrayItems(traitData.strengths, defaultStrengths);
  const safeChallenges = processArrayItems(traitData.challenges, defaultChallenges);
  
  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Primary Personality Traits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium mb-2">Primary Trait</h3>
              <p className="text-muted-foreground">{String(traitData.primary || defaultData.primary)}</p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-2">Secondary Trait</h3>
              <p className="text-muted-foreground">{String(traitData.secondary || defaultData.secondary)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-green-200 dark:border-green-900">
          <CardHeader className="bg-green-50 dark:bg-green-900/20">
            <CardTitle className="text-green-700 dark:text-green-400">Strengths</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="list-disc ml-6 space-y-2">
              {safeStrengths.map((strength, index) => (
                <li key={index} className="text-muted-foreground">{strength}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        <Card className="border-red-200 dark:border-red-900">
          <CardHeader className="bg-red-50 dark:bg-red-900/20">
            <CardTitle className="text-red-700 dark:text-red-400">Challenges</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="list-disc ml-6 space-y-2">
              {safeChallenges.map((challenge, index) => (
                <li key={index} className="text-muted-foreground">{challenge}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoreTraitsSection;
