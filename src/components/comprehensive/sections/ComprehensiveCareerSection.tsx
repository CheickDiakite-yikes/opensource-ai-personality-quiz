
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CareerPathway } from "@/utils/types";
import { Briefcase, TrendingUp, Lightbulb, GraduationCap, Target, BarChart3 } from "lucide-react";

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
  // Check if we're dealing with the enhanced career pathways format
  const hasDetailedCareers = careerSuggestions.length > 0 && typeof careerSuggestions[0] !== 'string';
  const careerPaths = hasDetailedCareers 
    ? careerSuggestions as CareerPathway[]
    : (careerSuggestions as string[]).map(career => ({ 
        field: career,
        title: career,
        description: undefined
      }));

  return (
    <>
      <Card className="w-full mb-6">
        <CardHeader className="relative">
          <div className="absolute top-0 right-0 h-24 w-24 bg-primary/10 rounded-bl-full -z-0" />
          <CardTitle className="flex items-center gap-2 z-10">
            <Target className="h-5 w-5 text-primary" />
            Purpose & Life Direction
          </CardTitle>
          <CardDescription>
            Key themes that may provide meaning and direction in your life
          </CardDescription>
        </CardHeader>
        <CardContent>
          {lifePurposeThemes && lifePurposeThemes.length > 0 ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {lifePurposeThemes.map((theme, index) => (
                  <Badge key={index} variant="outline" className="bg-primary/5 text-primary border-primary/30 px-3 py-1.5">
                    {theme}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                These themes represent potential areas of purpose and meaning that align with your personality structure, values, and motivational patterns. They aren't prescriptive but may guide your exploration of fulfilling life directions.
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Based on your profile, you may find meaning in pursuits that combine intellectual exploration with making tangible contributions. Consider areas where you can apply your analytical strengths while connecting with values that matter deeply to you.
            </p>
          )}
        </CardContent>
      </Card>
      
      <Card className="w-full mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Career Pathways
          </CardTitle>
          <CardDescription>
            Professional directions aligned with your personality profile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {careerPaths.map((career, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <div className="bg-muted/30 p-4 border-b">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center rounded-full bg-primary/10 h-8 w-8 text-sm text-primary font-medium mt-0.5 flex-shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">{career.title || career.field}</h3>
                      {career.field && career.title && career.field !== career.title && (
                        <p className="text-sm text-muted-foreground mt-0.5">Field: {career.field}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="p-4 space-y-4">
                  {career.description && (
                    <p className="text-sm">{career.description}</p>
                  )}
                  
                  {career.alignment && (
                    <div className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Alignment</p>
                        <p className="text-sm text-muted-foreground">{career.alignment}</p>
                      </div>
                    </div>
                  )}
                  
                  {(career.keyTraits && career.keyTraits.length > 0) && (
                    <div className="flex items-start gap-2">
                      <BarChart3 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Key Traits</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {career.keyTraits.map((trait, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">{trait}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {(career.traits && career.traits.length > 0 && !career.keyTraits) && (
                    <div className="flex items-start gap-2">
                      <BarChart3 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Key Traits</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {career.traits.map((trait, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">{trait}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {career.growth && (
                    <div className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Growth Potential</p>
                        <p className="text-sm text-muted-foreground">{career.growth}</p>
                      </div>
                    </div>
                  )}
                  
                  {(career.skills && career.skills.length > 0) && (
                    <div className="flex items-start gap-2">
                      <GraduationCap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Skills to Develop</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {career.skills.map((skill, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Development Roadmap
          </CardTitle>
          <CardDescription>
            Your path to personal and professional growth
          </CardDescription>
        </CardHeader>
        <CardContent>
          {roadmap ? (
            <div className="text-sm space-y-4">
              {roadmap.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Your development roadmap focuses on leveraging your analytical strengths while building confidence in your intuitive decision-making. Focus on setting clearer boundaries and embracing the concept of "good enough" to overcome perfectionist tendencies. Explore opportunities that combine your analytical abilities with creative problem-solving.
            </p>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default ComprehensiveCareerSection;
