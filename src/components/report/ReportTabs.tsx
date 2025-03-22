
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

const ReportTabs: React.FC = () => {
  const isMobile = useIsMobile();
  
  // Set smaller text and padding for mobile
  const tabTriggerClass = isMobile 
    ? "text-xs py-1.5 whitespace-nowrap flex-shrink-0" 
    : "whitespace-nowrap";
  
  return (
    <TabsList className="w-full scrollbar-none flex overflow-x-auto pb-1 snap-x">
      <TabsTrigger className={tabTriggerClass} value="overview">Overview</TabsTrigger>
      <TabsTrigger className={tabTriggerClass} value="personality">Personality</TabsTrigger>
      <TabsTrigger className={tabTriggerClass} value="intelligence">Intelligence</TabsTrigger>
      <TabsTrigger className={tabTriggerClass} value="motivation">Motivation</TabsTrigger>
      <TabsTrigger className={tabTriggerClass} value="values">Values</TabsTrigger>
      <TabsTrigger className={tabTriggerClass} value="growth">Growth Areas</TabsTrigger>
      <TabsTrigger className={tabTriggerClass} value="relationships">Relationships</TabsTrigger>
      <TabsTrigger className={tabTriggerClass} value="career">Career</TabsTrigger>
      <TabsTrigger className={tabTriggerClass} value="roadmap">Roadmap</TabsTrigger>
    </TabsList>
  );
};

export default ReportTabs;
