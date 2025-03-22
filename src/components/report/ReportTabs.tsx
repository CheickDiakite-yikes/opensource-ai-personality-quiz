
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

const ReportTabs: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <TabsList className={`${isMobile ? 'w-[calc(100%+4px)] gap-1' : ''} flex overflow-x-auto scrollbar-none py-0.5`}>
      <TabsTrigger value="overview" className={isMobile ? "text-xs py-1 px-2 shrink-0" : "shrink-0"}>Overview</TabsTrigger>
      <TabsTrigger value="personality" className={isMobile ? "text-xs py-1 px-2 shrink-0" : "shrink-0"}>Personality</TabsTrigger>
      <TabsTrigger value="intelligence" className={isMobile ? "text-xs py-1 px-2 shrink-0" : "shrink-0"}>Intelligence</TabsTrigger>
      <TabsTrigger value="motivation" className={isMobile ? "text-xs py-1 px-2 shrink-0" : "shrink-0"}>Motivation</TabsTrigger>
      <TabsTrigger value="values" className={isMobile ? "text-xs py-1 px-2 shrink-0" : "shrink-0"}>Values</TabsTrigger>
      <TabsTrigger value="growth" className={isMobile ? "text-xs py-1 px-2 shrink-0" : "shrink-0"}>Growth</TabsTrigger>
      <TabsTrigger value="relationships" className={isMobile ? "text-xs py-1 px-2 shrink-0" : "shrink-0"}>Relationships</TabsTrigger>
      <TabsTrigger value="career" className={isMobile ? "text-xs py-1 px-2 shrink-0" : "shrink-0"}>Career</TabsTrigger>
      <TabsTrigger value="roadmap" className={isMobile ? "text-xs py-1 px-2 shrink-0" : "shrink-0"}>Roadmap</TabsTrigger>
    </TabsList>
  );
};

export default ReportTabs;
