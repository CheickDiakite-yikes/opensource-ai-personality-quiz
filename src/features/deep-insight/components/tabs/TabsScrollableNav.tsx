
import React, { useRef, useEffect } from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { Brain, Heart, Users, Briefcase, Compass } from "lucide-react";

interface TabsScrollableNavProps {
  defaultValue?: string;
}

export const TabsScrollableNav: React.FC<TabsScrollableNavProps> = ({ defaultValue = "cognitive" }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Auto-scroll active tab into view
  useEffect(() => {
    const handleTabChange = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target?.getAttribute('data-state') === 'active') {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    };

    const tabsList = scrollRef.current;
    if (tabsList) {
      tabsList.addEventListener('click', handleTabChange);
      return () => tabsList.removeEventListener('click', handleTabChange);
    }
  }, []);

  const tabTriggerClass = isMobile 
    ? "text-sm py-1.5 px-3 min-w-[80px] flex-shrink-0 whitespace-nowrap"
    : "px-4 py-2";

  return (
    <TabsList 
      ref={scrollRef}
      className="w-full max-w-[100vw] scrollbar-none flex overflow-x-auto pb-0.5 snap-x px-0.5 bg-background/60 backdrop-blur-sm"
    >
      <TabsTrigger className={tabTriggerClass} value="cognitive">
        <Brain className="h-4 w-4 mr-2" />
        <span>Cognitive</span>
      </TabsTrigger>
      <TabsTrigger className={tabTriggerClass} value="emotional">
        <Heart className="h-4 w-4 mr-2" />
        <span>Emotional</span>
      </TabsTrigger>
      <TabsTrigger className={tabTriggerClass} value="interpersonal">
        <Users className="h-4 w-4 mr-2" />
        <span>Social</span>
      </TabsTrigger>
      <TabsTrigger className={tabTriggerClass} value="career">
        <Briefcase className="h-4 w-4 mr-2" />
        <span>Career</span>
      </TabsTrigger>
      <TabsTrigger className={tabTriggerClass} value="growth">
        <Compass className="h-4 w-4 mr-2" />
        <span>Growth</span>
      </TabsTrigger>
    </TabsList>
  );
};
