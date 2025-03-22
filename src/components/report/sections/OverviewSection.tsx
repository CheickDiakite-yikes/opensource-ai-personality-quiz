
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CognitiveStyleType } from "@/utils/types";
import { isCognitiveStyleObject } from "../utils/typeGuards";
import { useIsMobile } from "@/hooks/use-mobile";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OverviewSectionProps {
  overview: string;
  cognitiveStyle: CognitiveStyleType;
}

const OverviewSection: React.FC<OverviewSectionProps> = ({
  overview,
  cognitiveStyle
}) => {
  const isMobile = useIsMobile();
  const [expanded, setExpanded] = React.useState(!isMobile);
  
  // Format cognitive style for display based on type
  const formatCognitiveStyle = () => {
    if (isCognitiveStyleObject(cognitiveStyle)) {
      return (
        <>
          <span className="font-semibold text-primary">{cognitiveStyle.primary}</span>
          {" with "}
          <span className="font-semibold text-primary">{cognitiveStyle.secondary}</span>
          {" elements"}
        </>
      );
    } else {
      return <span className="font-semibold text-primary">{cognitiveStyle}</span>;
    }
  };
  
  // Split the overview into paragraphs
  const paragraphs = overview.split('\n\n');
  
  return (
    <section className="max-w-full overflow-hidden">
      <h2 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold mb-2`}>Personality Overview</h2>
      
      <Card className="mb-3 md:mb-6 overflow-hidden w-full force-wrap text-wrap">
        {isMobile ? (
          <>
            <Collapsible open={expanded} onOpenChange={setExpanded} className="w-full">
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full flex items-center justify-between py-1 px-3 border-b"
                  size="sm"
                >
                  <span className="text-xs">{expanded ? "Collapse" : "Expand"} overview</span>
                  {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="w-full">
                <CardContent className="px-3 py-2 w-full">
                  <div className="prose prose-sm max-w-none w-full">
                    {paragraphs.map((paragraph, index) => (
                      <p key={index} className="mb-2 leading-relaxed text-xs break-words whitespace-normal">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </>
        ) : (
          <CardContent className="pt-6">
            <div className="prose prose-sm max-w-none">
              {paragraphs.map((paragraph, index) => (
                <p key={index} className="mb-3 md:mb-4 leading-relaxed text-sm md:text-base">
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
      
      <div className={`grid grid-cols-1 ${isMobile ? 'gap-2' : 'md:grid-cols-2 gap-4'} mb-4 max-w-full`}>
        <Card className="w-full">
          <CardContent className={`${isMobile ? 'px-3 py-2' : 'pt-6'} w-full`}>
            <h3 className={`${isMobile ? 'text-sm' : 'text-lg'} font-semibold mb-1`}>Cognitive Style</h3>
            <p className="text-muted-foreground text-xs md:text-base break-words whitespace-normal force-wrap">
              You tend to process information as a {formatCognitiveStyle()}
            </p>
            
            {isCognitiveStyleObject(cognitiveStyle) && cognitiveStyle.description && (
              <p className="mt-2 text-xs text-muted-foreground break-words whitespace-normal force-wrap">
                {cognitiveStyle.description}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default OverviewSection;
