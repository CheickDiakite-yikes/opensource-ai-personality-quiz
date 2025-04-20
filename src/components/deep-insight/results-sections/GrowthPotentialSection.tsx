
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GrowthPotential } from "../types/deepInsight";
import { Lightbulb, Target, AlertTriangle } from "lucide-react";

interface GrowthPotentialProps {
  data: GrowthPotential | null;
}

const GrowthPotentialSection: React.FC<GrowthPotentialProps> = ({ data }) => {
  // We'll only use defaults if absolutely necessary as a last resort
  const isUsingFallbackData = !data || 
    !data.developmentAreas || 
    !Array.isArray(data.developmentAreas) || 
    data.developmentAreas.length === 0;
  
  // Process the development areas to handle various formats from the API
  const processDevelopmentAreas = () => {
    if (!data || !data.developmentAreas) return [];
    
    if (!Array.isArray(data.developmentAreas)) {
      // If it's an object but not an array, try to extract values
      if (typeof data.developmentAreas === 'object' && data.developmentAreas !== null) {
        return Object.values(data.developmentAreas).filter(Boolean);
      }
      // If it's a string, split by periods or commas
      if (typeof data.developmentAreas === 'string') {
        const devAreasString = data.developmentAreas as string;
        return devAreasString
          .split(/[.,;]/)
          .map(item => item.trim())
          .filter(item => item.length > 0);
      }
      return [];
    }
    
    // Map each item to ensure we have strings
    return data.developmentAreas.map(item => {
      if (typeof item === 'string') return item;
      if (typeof item === 'object' && item !== null) {
        // Try to extract value from object (could be {area: "text"} format)
        const itemAsRecord = item as Record<string, unknown>;
        if ('area' in itemAsRecord) return String(itemAsRecord.area);
        if ('description' in itemAsRecord) return String(itemAsRecord.description);
        if ('text' in itemAsRecord) return String(itemAsRecord.text);
        // Get first property if possible
        const firstKey = Object.keys(itemAsRecord)[0];
        if (firstKey) return `${firstKey}: ${String(itemAsRecord[firstKey])}`;
      }
      return String(item || '');
    }).filter(item => item.trim().length > 0);
  };
  
  // Similarly process recommendations
  const processRecommendations = () => {
    if (!data || !data.recommendations) return [];
    
    if (!Array.isArray(data.recommendations)) {
      if (typeof data.recommendations === 'object' && data.recommendations !== null) {
        return Object.values(data.recommendations).filter(Boolean);
      }
      if (typeof data.recommendations === 'string') {
        const recommendationsString = data.recommendations as string;
        return recommendationsString
          .split(/[.,;]/)
          .map(item => item.trim())
          .filter(item => item.length > 0);
      }
      return [];
    }
    
    return data.recommendations.map(item => {
      if (typeof item === 'string') return item;
      if (typeof item === 'object' && item !== null) {
        const itemAsRecord = item as Record<string, unknown>;
        if ('recommendation' in itemAsRecord) return String(itemAsRecord.recommendation);
        if ('description' in itemAsRecord) return String(itemAsRecord.description);
        if ('text' in itemAsRecord) return String(itemAsRecord.text);
        if ('action' in itemAsRecord) return String(itemAsRecord.action);
        const firstKey = Object.keys(itemAsRecord)[0];
        if (firstKey) return `${firstKey}: ${String(itemAsRecord[firstKey])}`;
      }
      return String(item || '');
    }).filter(item => item.trim().length > 0);
  };

  // Get the actual data to display
  const developmentAreas = processDevelopmentAreas();
  const recommendations = processRecommendations();
  
  return (
    <div className="space-y-6">
      {isUsingFallbackData && (
        <div className="rounded-md bg-amber-50 dark:bg-amber-950/30 p-4 border border-amber-200 dark:border-amber-800 mb-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 mr-2" />
            <p className="text-sm text-amber-800 dark:text-amber-400">
              Waiting for AI to generate your personalized growth insights...
            </p>
          </div>
        </div>
      )}
      
      <Card className="border-violet-200 dark:border-violet-900">
        <CardHeader className="bg-violet-50 dark:bg-violet-900/20">
          <CardTitle className="text-violet-700 dark:text-violet-400 flex items-center">
            <Target className="h-5 w-5 mr-2" /> Development Areas
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {developmentAreas.length > 0 ? (
            <ul className="list-disc ml-6 space-y-3">
              {developmentAreas.map((area, index) => (
                <li key={index} className="text-muted-foreground">{area}</li>
              ))}
            </ul>
          ) : (
            <div className="py-6 text-center">
              <Target className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-muted-foreground italic">
                Development areas will appear once your analysis is complete
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="border-lime-200 dark:border-lime-900">
        <CardHeader className="bg-lime-50 dark:bg-lime-900/20">
          <CardTitle className="text-lime-700 dark:text-lime-400 flex items-center">
            <Lightbulb className="h-5 w-5 mr-2" /> Personalized Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {recommendations.length > 0 ? (
            <ul className="list-disc ml-6 space-y-3">
              {recommendations.map((recommendation, index) => (
                <li key={index} className="text-muted-foreground">{recommendation}</li>
              ))}
            </ul>
          ) : (
            <div className="py-6 text-center">
              <Lightbulb className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-muted-foreground italic">
                Personalized recommendations will appear once your analysis is complete
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GrowthPotentialSection;
