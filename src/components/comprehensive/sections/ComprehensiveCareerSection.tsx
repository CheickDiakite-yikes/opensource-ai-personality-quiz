
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  LightbulbIcon, 
  TrendingUp, 
  School, 
  Sparkles, 
  Target, 
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface CareerPathway {
  title: string;
  description?: string;
  alignment?: string;
  traits?: string[];
  growth?: string;
  skills?: string[];
}

interface ComprehensiveCareerSectionProps {
  careerSuggestions: string[] | CareerPathway[];
  roadmap: string;
}

const ComprehensiveCareerSection: React.FC<ComprehensiveCareerSectionProps> = ({
  careerSuggestions,
  roadmap
}) => {
  // Check if we're dealing with enhanced career data
  const hasDetailedCareers = careerSuggestions.length > 0 && typeof careerSuggestions[0] !== 'string';
  
  // Convert simple career strings to career pathway objects if needed
  const careerPathways = hasDetailedCareers 
    ? careerSuggestions as CareerPathway[]
    : (careerSuggestions as string[]).map(career => ({ 
        title: career,
        description: `A career path that aligns well with your personality profile and cognitive strengths.`
      }));
  
  // Parse roadmap into sections if it contains markdown-style headers
  const roadmapSections = roadmap?.split(/(?=^##\s+)/m).filter(Boolean) || [];
  const hasStructuredRoadmap = roadmapSections.length > 1;
  
  // Function to render roadmap content
  const renderRoadmapContent = () => {
    if (hasStructuredRoadmap) {
      return roadmapSections.map((section, index) => {
        const lines = section.split('\n');
        const title = lines[0].replace(/^##\s+/, '');
        const content = lines.slice(1).join('\n').trim();
        
        return (
          <div key={index} className={index > 0 ? "mt-8" : ""}>
            <h4 className="text-lg font-medium mb-3 flex items-center gap-2">
              {index === 0 ? <Target className="h-5 w-5 text-primary/80" /> : 
               index === 1 ? <Clock className="h-5 w-5 text-primary/80" /> : 
               <CheckCircle2 className="h-5 w-5 text-primary/80" />}
              {title}
            </h4>
            <div className="whitespace-pre-line text-muted-foreground pl-7">
              {content.split('\n').map((line, i) => (
                <p key={i} className={i > 0 ? "mt-2" : ""}>{line}</p>
              ))}
            </div>
          </div>
        );
      });
    } else {
      // Simple roadmap formatting
      return (
        <div className="whitespace-pre-line text-muted-foreground">
          {roadmap?.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className={idx > 0 ? "mt-4" : ""}>{paragraph}</p>
          ))}
        </div>
      );
    }
  };

  return (
    <Card className="p-6 md:p-8 shadow-md">
      <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
        <Briefcase className="h-6 w-6 text-primary/80" />
        Career Insights
      </h2>
      <p className="text-muted-foreground mb-8">
        Career recommendations based on your personality traits, cognitive strengths, and values alignment
      </p>
      
      <div className="space-y-12">
        {/* Career Pathways Section */}
        <section>
          <h3 className="text-xl font-medium mb-5 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary/80" />
            Recommended Career Pathways
          </h3>
          
          <div className="space-y-5">
            {careerPathways.map((career, index) => (
              <div key={index} className="border rounded-lg overflow-hidden bg-card/50">
                <div className="bg-muted/30 p-4 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                      {index + 1}
                    </div>
                    <h4 className="text-lg font-medium">{career.title}</h4>
                  </div>
                  <Badge variant="secondary">{index === 0 ? "Highest Match" : index === 1 ? "Strong Match" : "Good Match"}</Badge>
                </div>
                
                <div className="p-4 space-y-4">
                  {career.description && (
                    <p className="text-muted-foreground">{career.description}</p>
                  )}
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {(career.traits && career.traits.length > 0) && (
                      <div className="flex items-start gap-2">
                        <LightbulbIcon className="h-5 w-5 text-primary/80 flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-medium text-sm mb-1">Personality Alignment</p>
                          <div className="flex flex-wrap gap-2">
                            {career.traits.map((trait, traitIdx) => (
                              <Badge key={traitIdx} variant="outline">{trait}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {(career.skills && career.skills.length > 0) && (
                      <div className="flex items-start gap-2">
                        <BookOpen className="h-5 w-5 text-primary/80 flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-medium text-sm mb-1">Key Skills to Develop</p>
                          <div className="flex flex-wrap gap-2">
                            {career.skills.map((skill, skillIdx) => (
                              <Badge key={skillIdx} variant="outline" className="bg-secondary/20">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {career.growth && (
                    <div className="flex items-start gap-2 mt-4 pt-4 border-t border-border/50">
                      <TrendingUp className="h-5 w-5 text-primary/80 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm mb-1">Growth Trajectory</p>
                        <p className="text-muted-foreground text-sm">{career.growth}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <Separator />
        
        {/* Educational Pathways Section */}
        <section>
          <h3 className="text-xl font-medium mb-5 flex items-center gap-2">
            <School className="h-5 w-5 text-primary/80" />
            Learning & Development Roadmap
          </h3>
          
          <Card className="p-6 bg-secondary/10">
            {renderRoadmapContent()}
          </Card>
        </section>
        
        {/* Additional Career Resources */}
        <section>
          <h3 className="text-xl font-medium mb-4">Additional Development Resources</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-md p-4 bg-card/50">
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <ArrowRight className="h-4 w-4 text-primary" />
                Skill Development Focus Areas
              </h4>
              <p className="text-sm text-muted-foreground">
                Based on your personality profile, consider developing both technical skills in your field of interest 
                and soft skills like communication, emotional intelligence, and adaptability that complement your natural strengths.
              </p>
            </div>
            
            <div className="border rounded-md p-4 bg-card/50">
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <ArrowRight className="h-4 w-4 text-primary" />
                Networking Recommendations
              </h4>
              <p className="text-sm text-muted-foreground">
                Your personality profile suggests you would benefit from building a network that includes both mentors
                in your field of interest and peers who share your values and work ethic. Consider professional groups
                that align with your career aspirations.
              </p>
            </div>
          </div>
        </section>
      </div>
    </Card>
  );
};

export default ComprehensiveCareerSection;
