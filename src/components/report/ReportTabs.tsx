
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

const ReportTabs: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <TabsList className={`${isMobile ? 'flex-wrap overflow-x-auto overflow-scroll-fix justify-start' : ''}`}>
      <TabsTrigger value="overview">Overview</TabsTrigger>
      <TabsTrigger value="personality">Personality</TabsTrigger>
      <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
      <TabsTrigger value="motivation">Motivation</TabsTrigger>
      <TabsTrigger value="values">Values</TabsTrigger>
      <TabsTrigger value="growth">Growth</TabsTrigger>
      <TabsTrigger value="relationships">Relationships</TabsTrigger>
      <TabsTrigger value="career">Career</TabsTrigger>
      <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
    </TabsList>
  );
};

export default ReportTabs;
