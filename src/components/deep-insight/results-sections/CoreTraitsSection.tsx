
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CoreTraitsProps {
  data: {
    primary: string;
    secondary: string;
    strengths: string[];
    challenges: string[];
  } | null;
}

const CoreTraitsSection: React.FC<CoreTraitsProps> = ({ data }) => {
  const defaultData = {
    primary: "Analytical Thinker",
    secondary: "Balanced Communicator",
    strengths: ["Logical reasoning", "Detail orientation", "Structured approach"],
    challenges: ["Perfectionism", "Overthinking", "Difficulty with ambiguity"]
  };
  
  // Use default data if data is null
  const traitData = data || defaultData;
  
  // Ensure strengths and challenges are always arrays of strings
  const safeStrengths = Array.isArray(traitData.strengths) 
    ? traitData.strengths.filter(item => typeof item === 'string')
    : [];
    
  const safeChallenges = Array.isArray(traitData.challenges)
    ? traitData.challenges.filter(item => typeof item === 'string')
    : [];
  
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
              <p className="text-muted-foreground">{String(traitData.primary)}</p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-2">Secondary Trait</h3>
              <p className="text-muted-foreground">{String(traitData.secondary)}</p>
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
