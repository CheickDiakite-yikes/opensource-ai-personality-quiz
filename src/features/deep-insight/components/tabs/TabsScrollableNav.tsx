
import React, { useRef, useEffect } from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Heart, Users, Briefcase, TrendingUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export const TabsScrollableNav: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Function to scroll tabs into view when selected
  const scrollToTab = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (scrollRef.current) {
      const target = event.currentTarget;
      const scrollContainer = scrollRef.current;
      const targetLeft = target.offsetLeft;
      const targetWidth = target.offsetWidth;
      const containerWidth = scrollContainer.offsetWidth;
      
      // Center the selected tab in the container
      scrollContainer.scrollLeft = targetLeft - (containerWidth / 2) + (targetWidth / 2);
    }
  };

  // Create an observer to watch for tab changes
  useEffect(() => {
    if (!scrollRef.current) return;
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-state') {
          const target = mutation.target as HTMLElement;
          if (target.getAttribute('data-state') === 'active') {
            // Scroll the selected tab into view
            const scrollContainer = scrollRef.current;
            if (scrollContainer) {
              const targetLeft = target.offsetLeft;
              const targetWidth = target.offsetWidth;
              const containerWidth = scrollContainer.offsetWidth;
              
              scrollContainer.scrollTo({
                left: targetLeft - (containerWidth / 2) + (targetWidth / 2),
                behavior: 'smooth'
              });
            }
          }
        }
      });
    });
    
    // Watch all the tab trigger elements
    const tabTriggers = scrollRef.current.querySelectorAll('[role="tab"]');
    tabTriggers.forEach(tab => {
      observer.observe(tab, { attributes: true });
    });
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  return (
    <div 
      ref={scrollRef} 
      className="overflow-x-auto sticky top-0 z-10 pb-2 -mx-1 px-1"
      style={{ 
        scrollbarWidth: 'none', 
        msOverflowStyle: 'none'
      }}
    >
      <TabsList className={`w-full inline-flex ${isMobile ? 'justify-start' : 'justify-center'}`}>
        <TabsTrigger 
          value="cognitive" 
          className="flex items-center gap-1.5"
          onClick={scrollToTab}
        >
          <Brain className="h-4 w-4" />
          <span>Cognitive</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="emotional" 
          className="flex items-center gap-1.5"
          onClick={scrollToTab}
        >
          <Heart className="h-4 w-4" />
          <span>Emotional</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="interpersonal" 
          className="flex items-center gap-1.5"
          onClick={scrollToTab}
        >
          <Users className="h-4 w-4" />
          <span>Interpersonal</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="career" 
          className="flex items-center gap-1.5"
          onClick={scrollToTab}
        >
          <Briefcase className="h-4 w-4" />
          <span>Career</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="growth" 
          className="flex items-center gap-1.5"
          onClick={scrollToTab}
        >
          <TrendingUp className="h-4 w-4" />
          <span>Growth</span>
        </TabsTrigger>
      </TabsList>
    </div>
  );
};
