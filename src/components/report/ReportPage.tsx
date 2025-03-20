
import React from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Tabs } from "@/components/ui/tabs";
import ReportHeader from "./ReportHeader";
import ReportTabs from "./ReportTabs";
import ReportTabContent from "./ReportTabContent";
import { useAIAnalysis } from "@/hooks/useAIAnalysis";

const ReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { analysis, isLoading, getAnalysisHistory } = useAIAnalysis();
  
  // Get all analyses and find the one that matches the ID
  const analyses = getAnalysisHistory();
  const analysisResult = analyses.find(a => a.id === id) || analysis;
  
  if (isLoading) {
    return <div className="container py-10">Loading analysis...</div>;
  }
  
  if (!analysisResult) {
    toast({
      title: "Error loading analysis",
      description: "We couldn't load the personality analysis. Please try again.",
      variant: "destructive",
    });
    return <div className="container py-10">Error loading analysis. Please refresh the page.</div>;
  }
  
  return (
    <div className="container py-6 space-y-8">
      <ReportHeader analysis={analysisResult} />
      
      <Tabs defaultValue="overview" className="space-y-6">
        <ReportTabs />
        <ReportTabContent analysis={analysisResult} />
      </Tabs>
    </div>
  );
};

export default ReportPage;
