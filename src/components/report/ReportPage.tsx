
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Tabs } from "@/components/ui/tabs";
import ReportHeader from "./ReportHeader";
import ReportTabs from "./ReportTabs";
import ReportTabContent from "./ReportTabContent";
import { useAIAnalysis } from "@/hooks/useAIAnalysis";
import ReportSkeleton from "./skeletons/ReportSkeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { PersonalityAnalysis } from "@/utils/types";

const ReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    analysis, 
    isLoading, 
    getAnalysisHistory, 
    setCurrentAnalysis, 
    refreshAnalysis 
  } = useAIAnalysis();
  const isMobile = useIsMobile();
  const [currentAnalysis, setCurrentAnalysisState] = useState<PersonalityAnalysis | null>(null);
  
  // Refresh analyses when the component mounts
  useEffect(() => {
    refreshAnalysis();
  }, [refreshAnalysis]);
  
  // Set the current analysis based on the ID param if provided
  useEffect(() => {
    if (id && !isLoading) {
      console.log("Setting analysis from URL param:", id);
      const success = setCurrentAnalysis(id);
      
      if (!success && !analysis) {
        toast.error("Could not find the requested analysis", {
          description: "Please try taking the assessment again or log in to access your saved analyses",
          duration: 5000
        });
        
        navigate("/assessment");
      }
    }
  }, [id, isLoading, setCurrentAnalysis, navigate, analysis]);
  
  // Update local state when the analysis from the hook changes
  useEffect(() => {
    if (analysis) {
      setCurrentAnalysisState(analysis);
    }
  }, [analysis]);
  
  if (isLoading) {
    return (
      <div className={`container ${isMobile ? 'py-4 px-3' : 'py-10'}`}>
        <ReportSkeleton />
      </div>
    );
  }
  
  // Get all analyses and find the one that matches the ID
  const analyses = getAnalysisHistory();
  let selectedAnalysis = currentAnalysis || analysis;
  
  if (id) {
    const matchingAnalysis = analyses.find(a => a.id === id);
    if (matchingAnalysis) {
      selectedAnalysis = matchingAnalysis;
    }
  }
  
  if (!selectedAnalysis) {
    toast.error("Error loading analysis", {
      description: "We couldn't load the personality analysis. Please try taking the assessment again.",
      duration: 5000
    });
    
    navigate("/assessment");
    return null;
  }
  
  return (
    <div className={`container ${isMobile ? 'py-4 px-3 space-y-4' : 'py-6 space-y-8'}`}>
      <ReportHeader analysis={selectedAnalysis} />
      
      <Tabs defaultValue="overview" className={`${isMobile ? 'space-y-4' : 'space-y-6'}`}>
        <ReportTabs />
        <ReportTabContent analysis={selectedAnalysis} />
      </Tabs>
    </div>
  );
};

export default ReportPage;
