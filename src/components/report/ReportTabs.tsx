
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ReportTabs: React.FC = () => {
  return (
    <TabsList>
      <TabsTrigger value="overview">Overview</TabsTrigger>
      <TabsTrigger value="personality">Personality</TabsTrigger>
      <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
      <TabsTrigger value="motivation">Motivation</TabsTrigger>
      <TabsTrigger value="values">Values</TabsTrigger>
      <TabsTrigger value="growth">Growth Areas</TabsTrigger>
      <TabsTrigger value="relationships">Relationships</TabsTrigger>
      <TabsTrigger value="career">Career</TabsTrigger>
      <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
    </TabsList>
  );
};

export default ReportTabs;
