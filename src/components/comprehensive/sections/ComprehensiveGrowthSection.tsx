
import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, AlertTriangle, BookOpen, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ComprehensiveGrowthSectionProps {
  growthAreas: string[];
  weaknesses: string[];
  learningPathways: string[];
}

const ComprehensiveGrowthSection: React.FC<ComprehensiveGrowthSectionProps> = ({
  growthAreas,
  weaknesses,
  learningPathways
}) => {
  // Helper function to parse out any embedded explanations
  const parseItemWithExplanation = (item: string) => {
    const colonIndex = item.indexOf(':');
    if (colonIndex > 0 && colonIndex < item.length - 1) {
      return {
        key: item.substring(0, colonIndex).trim(),
        explanation: item.substring(colonIndex + 1).trim()
      };
    }
    return { key: item, explanation: '' };
  };
  
  // Process growth areas and weaknesses to extract any embedded explanations
  const processedGrowthAreas = growthAreas.map(parseItemWithExplanation);
  const processedWeaknesses = weaknesses.map(parseItemWithExplanation);
  
  return (
    <Card className="p-6 md:p-8 shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-semibold">Growth & Development</h2>
      </div>
      
      <Tabs defaultValue="areas" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="areas">Growth Areas</TabsTrigger>
          <TabsTrigger value="weaknesses">Challenges</TabsTrigger>
          <TabsTrigger value="learning">Learning Paths</TabsTrigger>
        </TabsList>
        
        <TabsContent value="areas" className="p-1">
          <p className="text-muted-foreground mb-4">
            These are your key areas for personal and professional development that can lead to significant growth.
          </p>
          
          <ul className="space-y-4">
            {processedGrowthAreas.map((area, index) => (
              <li key={index} className="bg-muted/30 p-4 rounded-md">
                <div className="flex items-start">
                  <span className="inline-flex items-center justify-center rounded-full bg-primary/10 h-6 w-6 text-sm text-primary mr-3 mt-0.5 flex-shrink-0">
                    {index + 1}
                  </span>
                  <div>
                    <span className="font-medium">{area.key}</span>
                    {area.explanation && (
                      <p className="text-sm text-muted-foreground mt-2">{area.explanation}</p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          
          <div className="mt-4 p-3 border border-dashed rounded-md">
            <p className="text-sm text-muted-foreground">
              Focus on these growth areas can help you reach your potential and achieve greater success in your personal and professional life.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="weaknesses" className="p-1">
          <p className="mb-4 flex items-center gap-2 text-muted-foreground">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            Current challenges that may require attention and conscious effort to overcome.
          </p>
          
          <ul className="space-y-4">
            {processedWeaknesses.map((weakness, index) => (
              <li key={index} className="bg-muted/30 p-4 rounded-md">
                <div className="flex items-start">
                  <span className="inline-flex items-center justify-center rounded-full bg-primary/10 h-6 w-6 text-sm text-primary mr-3 mt-0.5 flex-shrink-0">
                    {index + 1}
                  </span>
                  <div>
                    <span className="font-medium">{weakness.key}</span>
                    {weakness.explanation && (
                      <p className="text-sm text-muted-foreground mt-2">{weakness.explanation}</p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          
          <div className="mt-4 p-3 border border-dashed rounded-md">
            <p className="text-sm text-muted-foreground">
              Remember that awareness is the first step toward change. Acknowledging these challenges opens the path to personal growth.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="learning" className="p-1">
          <p className="mb-4 flex items-center gap-2 text-muted-foreground">
            <BookOpen className="h-4 w-4 text-primary" />
            Recommended learning approaches that align with your cognitive style.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {learningPathways.map((pathway, index) => (
              <div key={index} className="bg-muted/30 p-3 rounded-md hover:bg-muted/50 transition-colors">
                <div className="flex items-start">
                  <ArrowUpRight className="h-4 w-4 text-primary mt-1 mr-2 flex-shrink-0" />
                  <p>{pathway}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <Button variant="outline" className="inline-flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Explore Personalized Learning Resources
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ComprehensiveGrowthSection;
