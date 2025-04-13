
import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flame, Shield, Coffee, Lightbulb } from "lucide-react";

interface ComprehensiveMotivationSectionProps {
  motivators: string[];
  inhibitors: string[];
}

const ComprehensiveMotivationSection: React.FC<ComprehensiveMotivationSectionProps> = ({
  motivators,
  inhibitors
}) => {
  // Helper function to parse out any embedded explanations in motivators/inhibitors
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
  
  // Process motivators and inhibitors to extract any embedded explanations
  const processedMotivators = motivators.map(parseItemWithExplanation);
  const processedInhibitors = inhibitors.map(parseItemWithExplanation);
  
  return (
    <Card className="p-6 md:p-8 shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <Flame className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-semibold">Motivation Profile</h2>
      </div>
      
      <p className="mb-6 text-muted-foreground">
        Understanding what drives you and what holds you back can help you create environments and habits that enhance your natural motivation.
      </p>
      
      <Tabs defaultValue="motivators" className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="motivators">Key Motivators</TabsTrigger>
          <TabsTrigger value="inhibitors">Inhibitors</TabsTrigger>
        </TabsList>
        
        <TabsContent value="motivators" className="p-1">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">What Drives You Forward</h3>
          </div>
          
          <ul className="space-y-3">
            {processedMotivators.map((item, index) => (
              <li key={index} className="bg-muted/30 p-4 rounded-md hover:bg-muted/40 transition-colors">
                <div className="flex items-start">
                  <span className="inline-flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 h-6 w-6 text-sm text-green-600 dark:text-green-400 mr-3 mt-0.5 flex-shrink-0">
                    {index + 1}
                  </span>
                  <div>
                    <span className="font-medium">{item.key}</span>
                    {item.explanation && (
                      <p className="text-muted-foreground mt-2">{item.explanation}</p>
                    )}
                    
                    {index === 0 && (
                      <div className="mt-3 p-2 bg-primary/5 rounded-md">
                        <p className="text-sm text-primary/80 italic">
                          This is your primary driver. Environments and activities that engage this motivator will naturally energize you.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          
          <div className="mt-4 p-4 border-t pt-4">
            <div className="flex items-start">
              <Coffee className="h-5 w-5 text-primary mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium">Leveraging Your Motivators</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Structuring your environment and goals to align with these motivators will help you maintain momentum and overcome obstacles. Look for opportunities that naturally engage these drivers.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="inhibitors" className="p-1">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">What May Hold You Back</h3>
          </div>
          
          <ul className="space-y-3">
            {processedInhibitors.map((item, index) => (
              <li key={index} className="bg-muted/30 p-4 rounded-md">
                <div className="flex items-start">
                  <span className="inline-flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 h-6 w-6 text-sm text-red-600 dark:text-red-400 mr-3 mt-0.5 flex-shrink-0">
                    {index + 1}
                  </span>
                  <div>
                    <span className="font-medium">{item.key}</span>
                    {item.explanation && (
                      <p className="text-muted-foreground mt-2">{item.explanation}</p>
                    )}
                    
                    {/* Add mitigation strategy for the first inhibitor */}
                    {index === 0 && (
                      <div className="mt-3 p-2 bg-muted rounded-md">
                        <p className="text-sm italic">
                          <strong>Mitigation strategy:</strong> Awareness is the first step. When you notice this inhibitor at work, pause and reconnect with your core motivators.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          
          <div className="mt-4 p-4 border-t pt-4">
            <div className="flex items-start">
              <Coffee className="h-5 w-5 text-primary mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium">Overcoming Inhibitors</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Being mindful of these inhibitors allows you to develop strategies to minimize their impact. Creating systems that reduce friction and building supportive habits can help you maintain momentum.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ComprehensiveMotivationSection;
