
import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Briefcase, ArrowRight, GraduationCap, TrendingUp, Zap } from "lucide-react";
import { CareerPathway } from "@/utils/types";

interface CareerSuggestionsProps {
  careers: string[] | CareerPathway[];
}

const CareerSuggestions: React.FC<CareerSuggestionsProps> = ({ careers }) => {
  // Check if we're dealing with the enhanced career pathways format
  const hasDetailedCareers = careers.length > 0 && typeof careers[0] !== 'string';
  const careerPaths = hasDetailedCareers 
    ? careers as CareerPathway[]
    : (careers as string[]).map(career => ({ 
        field: career,
        title: career,
        description: undefined,
        alignment: undefined,
        keyTraits: undefined,
        traits: undefined,
        growth: undefined,
        skills: undefined
      }));

  return (
    <Card className="glass-panel overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500/10 to-violet-500/10 pb-4">
        <CardTitle className="flex items-center">
          <Briefcase className="h-5 w-5 mr-2 text-primary" /> Career Pathways
        </CardTitle>
        <CardDescription>
          Potential career directions aligned with your personality and cognitive style
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 gap-4">
          {careerPaths.map((career, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-md border border-border/40 bg-card/30 overflow-hidden"
            >
              <div className="flex flex-col">
                <div className="px-4 py-3 bg-muted/20 border-b border-border/40">
                  <div className="flex items-center">
                    <div className="inline-flex items-center justify-center rounded-full bg-primary/10 h-8 w-8 text-sm text-primary mr-3 flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="font-medium text-lg">{career.title || career.field}</span>
                  </div>
                </div>
                
                {(career.description || career.alignment || career.keyTraits || career.traits || career.growth || career.skills) && (
                  <div className="p-4 space-y-3">
                    {career.description && (
                      <p className="text-muted-foreground text-sm">{career.description}</p>
                    )}
                    
                    {career.alignment && (
                      <div className="flex items-start text-sm">
                        <ArrowRight className="h-4 w-4 text-primary mt-0.5 mr-2 flex-shrink-0" />
                        <span><span className="font-medium">Alignment:</span> {career.alignment}</span>
                      </div>
                    )}
                    
                    {(career.keyTraits && career.keyTraits.length > 0) && (
                      <div className="flex items-start text-sm">
                        <Zap className="h-4 w-4 text-primary mt-0.5 mr-2 flex-shrink-0" />
                        <div>
                          <span className="font-medium">Key traits:</span>{' '}
                          {career.keyTraits.join(', ')}
                        </div>
                      </div>
                    )}
                    
                    {(career.traits && career.traits.length > 0) && (
                      <div className="flex items-start text-sm">
                        <Zap className="h-4 w-4 text-primary mt-0.5 mr-2 flex-shrink-0" />
                        <div>
                          <span className="font-medium">Key traits:</span>{' '}
                          {career.traits.join(', ')}
                        </div>
                      </div>
                    )}
                    
                    {career.growth && (
                      <div className="flex items-start text-sm">
                        <TrendingUp className="h-4 w-4 text-primary mt-0.5 mr-2 flex-shrink-0" />
                        <span><span className="font-medium">Growth:</span> {career.growth}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-6 p-4 border border-dashed rounded-md">
          <div className="flex items-start">
            <GraduationCap className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
            <div className="space-y-2">
              <h4 className="font-medium">Educational Pathways</h4>
              <p className="text-sm text-muted-foreground">
                Consider exploring courses, certifications, or degree programs that align with your 
                cognitive strengths and personal values. Focus on acquiring both technical skills and 
                developing the soft skills your personality naturally excels in.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CareerSuggestions;
