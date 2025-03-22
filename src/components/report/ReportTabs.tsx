
import React, { useRef, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

const ReportTabs: React.FC = () => {
  const isMobile = useIsMobile();
  const tabsRef = useRef<HTMLDivElement>(null);
  
  // Set smaller text and padding for mobile
  const tabTriggerClass = isMobile 
    ? "text-[0.65rem] py-0.5 px-1.5 whitespace-nowrap flex-shrink-0 font-medium" 
    : "whitespace-nowrap";
  
  // Function to ensure active tab is visible in the scrollable container
  useEffect(() => {
    const handleTabChange = (event: Event) => {
      if (!tabsRef.current) return;
      
      const target = event.target as HTMLElement;
      if (target && target.classList.contains('active')) {
        // Find the active tab trigger
        const activeTab = tabsRef.current.querySelector('[data-state="active"]');
        if (activeTab) {
          // Scroll the active tab into view
          activeTab.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          });
        }
      }
    };

    const tabsList = tabsRef.current;
    if (tabsList) {
      tabsList.addEventListener('click', handleTabChange);
      
      return () => {
        tabsList.removeEventListener('click', handleTabChange);
      };
    }
  }, []);
  
  return (
    <TabsList 
      ref={tabsRef}
      className="w-full max-w-[100vw] scrollbar-none flex overflow-x-auto pb-0.5 snap-x px-0.5 bg-background/60 backdrop-blur-sm no-scrollbar"
    >
      <TabsTrigger className={`${tabTriggerClass} first:ml-0.5 last:mr-0.5`} value="overview">Overview</TabsTrigger>
      <TabsTrigger className={tabTriggerClass} value="personality">Personality</TabsTrigger>
      <TabsTrigger className={tabTriggerClass} value="intelligence">Intelligence</TabsTrigger>
      <TabsTrigger className={tabTriggerClass} value="motivation">Motivation</TabsTrigger>
      <TabsTrigger className={tabTriggerClass} value="values">Values</TabsTrigger>
      <TabsTrigger className={tabTriggerClass} value="growth">Growth</TabsTrigger>
      <TabsTrigger className={tabTriggerClass} value="relationships">Relations</TabsTrigger>
      <TabsTrigger className={tabTriggerClass} value="career">Career</TabsTrigger>
      <TabsTrigger className={tabTriggerClass} value="roadmap">Roadmap</TabsTrigger>
    </TabsList>
  );
};

export default ReportTabs;
