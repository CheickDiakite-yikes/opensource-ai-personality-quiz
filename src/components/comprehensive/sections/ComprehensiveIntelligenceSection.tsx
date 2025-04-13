
import React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { IntelligenceType } from "@/utils/types";
import { 
  Brain, 
  BookOpen, 
  BarChart, 
  PieChart, 
  Network, 
  Cpu, 
  Lightbulb,
  HelpCircle
} from "lucide-react";
import IntelligenceDomainChart from "../../report/IntelligenceDomainChart";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ComprehensiveIntelligenceSectionProps {
  intelligence: IntelligenceType;
  intelligenceScore: number;
  emotionalIntelligenceScore: number;
}

const ComprehensiveIntelligenceSection: React.FC<ComprehensiveIntelligenceSectionProps> = ({
  intelligence,
  intelligenceScore,
  emotionalIntelligenceScore
}) => {
  // Ensure we have valid data
  const hasIntelligenceData = intelligence && intelligence.type && intelligence.domains?.length > 0;
  
  // Organize cognitive domains into categories
  const analyticalDomains = intelligence?.domains?.filter(d => 
    d.name.toLowerCase().includes('analytical') || 
    d.name.toLowerCase().includes('logical') ||
    d.name.toLowerCase().includes('reasoning')
  ) || [];
  
  const creativeDomains = intelligence?.domains?.filter(d => 
    d.name.toLowerCase().includes('creative') || 
    d.name.toLowerCase().includes('innovation') ||
    d.name.toLowerCase().includes('divergent')
  ) || [];
  
  const practicalDomains = intelligence?.domains?.filter(d => 
    d.name.toLowerCase().includes('practical') || 
    d.name.toLowerCase().includes('applied') ||
    d.name.toLowerCase().includes('execution')
  ) || [];
  
  const socialDomains = intelligence?.domains?.filter(d => 
    d.name.toLowerCase().includes('social') || 
    d.name.toLowerCase().includes('interpersonal') ||
    d.name.toLowerCase().includes('emotional')
  ) || [];
  
  // Get remaining domains not in other categories
  const otherDomains = intelligence?.domains?.filter(domain => 
    ![...analyticalDomains, ...creativeDomains, ...practicalDomains, ...socialDomains]
    .includes(domain)
  ) || [];

  return (
    <Card className="p-6 md:p-8 shadow-md">
      <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
        <Brain className="h-6 w-6 text-primary/80" />
        Cognitive Processing Profile
      </h2>
      <p className="text-muted-foreground mb-8">
        Analysis of your information processing styles, problem-solving approaches, and mental adaptability
      </p>
      
      <div className="space-y-12">
        {/* Cognitive Profile Overview */}
        <section>
          {hasIntelligenceData && (
            <>
              <h3 className="text-xl font-medium mb-3 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary/80" />
                Primary Cognitive Style: {intelligence.type}
              </h3>
              <p className="text-muted-foreground mb-6">
                {intelligence.description}
              </p>
            </>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-muted/30 rounded-lg border border-border/50">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-lg flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary/80" />
                  Cognitive Flexibility Score
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[300px]">
                        <p className="text-sm">Measures your ability to adapt thinking strategies, shift between concepts, and process complex information patterns based on your assessment responses.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </h4>
                <span className="text-2xl font-bold">{intelligenceScore}/100</span>
              </div>
              <Progress value={intelligenceScore} className="h-2.5 mb-3" indicatorClassName="bg-primary" />
              <p className="text-sm text-muted-foreground">
                {intelligenceScore >= 85 ? "Exceptional cognitive flexibility with rapid adaptation to new contexts and challenges" : 
                 intelligenceScore >= 75 ? "Excellent mental adaptability with strong pattern recognition across diverse contexts" : 
                 intelligenceScore >= 65 ? "Very good cognitive flexibility with effective problem-solving approach changes" : 
                 intelligenceScore >= 55 ? "Good mental adaptability with potential for further development in complex scenarios" : 
                 intelligenceScore >= 45 ? "Moderate cognitive flexibility that works well in familiar contexts" : 
                 "Developing cognitive flexibility with opportunities for growth through new learning approaches"}
              </p>
            </div>
            
            <div className="p-5 bg-muted/30 rounded-lg border border-border/50">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary/80" />
                  Emotional Intelligence
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[300px]">
                        <p className="text-sm">Evaluates your ability to recognize, understand and manage emotions in yourself and others, as well as navigate social dynamics effectively.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </h4>
                <span className="text-2xl font-bold">{emotionalIntelligenceScore}/100</span>
              </div>
              <Progress value={emotionalIntelligenceScore} className="h-2.5 mb-3" indicatorClassName="bg-primary" />
              <p className="text-sm text-muted-foreground">
                {emotionalIntelligenceScore >= 85 ? "Exceptional emotional awareness with nuanced understanding of complex social dynamics" : 
                 emotionalIntelligenceScore >= 75 ? "Excellent emotional regulation and empathetic connection with others" : 
                 emotionalIntelligenceScore >= 65 ? "Very good emotional intelligence supporting effective relationships and communication" : 
                 emotionalIntelligenceScore >= 55 ? "Good emotional awareness with room for deepening interpersonal dynamics" : 
                 emotionalIntelligenceScore >= 45 ? "Moderate emotional intelligence functioning well in familiar relationships" : 
                 "Developing emotional awareness with opportunities for growth through mindful practices"}
              </p>
            </div>
          </div>
          
          <div className="bg-secondary/10 p-5 rounded-lg mt-6">
            <p className="text-sm text-muted-foreground">
              <strong>About these scores:</strong> The cognitive assessment measures how you approach problems, process information, and adapt to new challenges - not academic knowledge or IQ. It evaluates pattern recognition, mental flexibility, and information processing based on your assessment responses. Different cognitive styles excel in different contexts and environments.
            </p>
          </div>
        </section>
        
        <Separator />
        
        {/* Cognitive Domains Visualization */}
        {hasIntelligenceData && (
          <section>
            <h3 className="text-xl font-medium mb-5 flex items-center gap-2">
              <BarChart className="h-5 w-5 text-primary/80" />
              Cognitive Domain Analysis
            </h3>
            
            <div>
              <IntelligenceDomainChart domains={intelligence.domains} />
            </div>
            
            {/* Domain Groups Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {analyticalDomains.length > 0 && (
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <PieChart className="h-4 w-4 text-primary/80" />
                    Analytical Processing
                  </h4>
                  <ul className="space-y-2 text-sm">
                    {analyticalDomains.map((domain, idx) => (
                      <li key={idx} className="flex justify-between">
                        <span>{domain.name}</span>
                        <span className="font-medium">{domain.score.toFixed(1)}/10</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground mt-3">
                    How you analyze information, solve logical problems, and evaluate evidence
                  </p>
                </div>
              )}
              
              {creativeDomains.length > 0 && (
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-primary/80" />
                    Creative Thinking
                  </h4>
                  <ul className="space-y-2 text-sm">
                    {creativeDomains.map((domain, idx) => (
                      <li key={idx} className="flex justify-between">
                        <span>{domain.name}</span>
                        <span className="font-medium">{domain.score.toFixed(1)}/10</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground mt-3">
                    Your ability to generate novel ideas, see unconventional connections, and think divergently
                  </p>
                </div>
              )}
              
              {practicalDomains.length > 0 && (
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-primary/80" />
                    Practical Application
                  </h4>
                  <ul className="space-y-2 text-sm">
                    {practicalDomains.map((domain, idx) => (
                      <li key={idx} className="flex justify-between">
                        <span>{domain.name}</span>
                        <span className="font-medium">{domain.score.toFixed(1)}/10</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground mt-3">
                    How you implement ideas, solve real-world problems, and apply knowledge practically
                  </p>
                </div>
              )}
              
              {socialDomains.length > 0 && (
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Network className="h-4 w-4 text-primary/80" />
                    Social Cognition
                  </h4>
                  <ul className="space-y-2 text-sm">
                    {socialDomains.map((domain, idx) => (
                      <li key={idx} className="flex justify-between">
                        <span>{domain.name}</span>
                        <span className="font-medium">{domain.score.toFixed(1)}/10</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground mt-3">
                    Your understanding of social dynamics, interpersonal intelligence, and communication
                  </p>
                </div>
              )}
              
              {otherDomains.length > 0 && (
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Additional Cognitive Domains</h4>
                  <ul className="space-y-2 text-sm">
                    {otherDomains.map((domain, idx) => (
                      <li key={idx} className="flex justify-between">
                        <span>{domain.name}</span>
                        <span className="font-medium">{domain.score.toFixed(1)}/10</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}
        
        <Separator />
        
        {/* Learning and Processing Styles */}
        <section>
          <h3 className="text-xl font-medium mb-5">Learning & Information Processing</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg overflow-hidden">
              <div className="p-4 bg-muted/30 border-b">
                <h4 className="font-medium">Optimal Learning Approaches</h4>
              </div>
              <div className="p-4 text-sm space-y-3">
                <p>
                  Based on your cognitive profile, you likely learn most effectively through 
                  {intelligenceScore > 70 ? " multiple modalities, with particular strength in abstract conceptualization and practical application." : 
                   intelligenceScore > 60 ? " structured exploration that balances conceptual understanding with hands-on experience." : 
                   " concrete examples and clear step-by-step instructions with regular feedback."}
                </p>
                <p>
                  Your processing style suggests that 
                  {(intelligence?.type || "").toLowerCase().includes("analytical") ? " you benefit from organized, logical presentation of material with clear connections between concepts." :
                   (intelligence?.type || "").toLowerCase().includes("creative") ? " you excel when allowed to explore connections between seemingly unrelated ideas and concepts." :
                   (intelligence?.type || "").toLowerCase().includes("practical") ? " you learn best when information is presented with clear real-world applications and examples." :
                   " your balanced approach allows you to adapt to various learning contexts, though you may have preferences for certain approaches."}
                </p>
              </div>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <div className="p-4 bg-muted/30 border-b">
                <h4 className="font-medium">Cognitive Strengths Application</h4>
              </div>
              <div className="p-4 text-sm space-y-3">
                <p>
                  Your particular cognitive profile indicates strengths in
                  {analyticalDomains.some(d => d.score > 7) ? " analyzing complex information and identifying patterns," : ""}
                  {creativeDomains.some(d => d.score > 7) ? " generating innovative solutions and making unique connections," : ""}
                  {practicalDomains.some(d => d.score > 7) ? " applying knowledge to practical situations and implementing ideas," : ""}
                  {socialDomains.some(d => d.score > 7) ? " understanding social dynamics and navigating interpersonal situations," : ""}
                  {!analyticalDomains.some(d => d.score > 7) && !creativeDomains.some(d => d.score > 7) && 
                   !practicalDomains.some(d => d.score > 7) && !socialDomains.some(d => d.score > 7) ? 
                   " a balanced approach across multiple cognitive domains," : ""}
                  {" which can be particularly valuable in professional contexts that require "}
                  {intelligenceScore > 70 ? "adaptive thinking and complex problem solving." : 
                   intelligenceScore > 60 ? "systematic approaches with room for creative solutions." : 
                   "practical implementation and steady progress."}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Card>
  );
};

export default ComprehensiveIntelligenceSection;
