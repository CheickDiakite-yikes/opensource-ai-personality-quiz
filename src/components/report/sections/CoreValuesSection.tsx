
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Check } from "lucide-react";
import { ValueSystemType, ValueSystem } from "@/utils/types";
import { isValueSystemObject } from "../utils/typeGuards";
import { ensureStringItems } from "@/utils/formatUtils";

interface CoreValuesSectionProps {
  valueSystem: ValueSystemType;
}

const CoreValuesSection: React.FC<CoreValuesSectionProps> = ({ valueSystem }) => {
  // Handle both object and array formats for valueSystem
  const values = React.useMemo(() => {
    if (isValueSystemObject(valueSystem)) {
      return valueSystem.strengths || [];
    } else if (Array.isArray(valueSystem)) {
      return valueSystem;
    }
    return [];
  }, [valueSystem]);
  
  // Extract weaknesses if available
  const weaknesses = React.useMemo(() => {
    if (isValueSystemObject(valueSystem)) {
      return valueSystem.weaknesses || [];
    }
    return [];
  }, [valueSystem]);
  
  // Get description if available
  const description = React.useMemo(() => {
    if (isValueSystemObject(valueSystem)) {
      return valueSystem.description || "";
    }
    return "";
  }, [valueSystem]);
  
  // Ensure we have string arrays
  const safeValues = ensureStringItems(values);
  const safeWeaknesses = ensureStringItems(weaknesses);
  
  return (
    <Card className="glass-panel overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 pb-4">
        <CardTitle className="flex items-center">
          <Heart className="h-5 w-5 mr-2 text-primary" /> Core Values
        </CardTitle>
        <CardDescription>
          Your fundamental beliefs and priorities
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {description && (
          <p className="mb-6 text-muted-foreground">{description}</p>
        )}
        
        <h3 className="font-medium text-lg mb-3">Your Top Values</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {safeValues.length > 0 ? (
            safeValues.map((value, index) => (
              <div key={index} className="flex items-start">
                <div className="rounded-full bg-primary/10 p-1 mr-3 mt-0.5">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p><strong>{value}</strong></p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground italic">No core values identified</p>
          )}
        </div>
        
        {safeWeaknesses.length > 0 && (
          <>
            <h3 className="font-medium text-lg mt-6 mb-3">Potential Value Conflicts</h3>
            <ul className="space-y-2">
              {safeWeaknesses.map((weakness, index) => (
                <li key={index} className="text-muted-foreground">
                  • {weakness}
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CoreValuesSection;
