
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
  const [selectedAnalysis, setSelectedAnalysis] = useState<PersonalityAnalysis | null>(null);
  
  // Refresh analyses when the component mounts
  useEffect(() => {
    console.log("ReportPage: Refreshing analysis data");
    refreshAnalysis();
  }, [refreshAnalysis]);
  
  // Set the current analysis based on the ID param if provided
  useEffect(() => {
    if (!isLoading) {
      console.log("ReportPage: ID param changed or loading finished", id);
      
      if (id) {
        console.log("ReportPage: Setting analysis from URL param:", id);
        const success = setCurrentAnalysis(id);
        
        if (!success && !analysis) {
          toast.error("Could not find the requested analysis", {
            description: "Please try taking the assessment again or log in to access your saved analyses",
            duration: 5000
          });
          
          navigate("/assessment");
        }
      }
    }
  }, [id, isLoading, setCurrentAnalysis, navigate, analysis]);
  
  // Update selected analysis when the analysis from the hook changes
  useEffect(() => {
    console.log("ReportPage: Analysis changed in hook", analysis?.id);
    if (analysis) {
      setSelectedAnalysis(analysis);
    }
  }, [analysis]);
  
  // Get all analyses for the dropdown
  const analyses = getAnalysisHistory();
  console.log("ReportPage: Available analyses:", analyses.map(a => a.id));
  
  // Handle analysis change from the header dropdown
  const handleAnalysisChange = (analysisId: string) => {
    console.log("ReportPage: User selected analysis:", analysisId);
    navigate(`/report/${analysisId}`);
  };
  
  if (isLoading) {
    return (
      <div className={`container ${isMobile ? 'py-4 px-3' : 'py-10'}`}>
        <ReportSkeleton />
      </div>
    );
  }
  
  // If no selected analysis, use the current one from the hook
  const displayAnalysis = selectedAnalysis || analysis;
  
  if (!displayAnalysis) {
    toast.error("Error loading analysis", {
      description: "We couldn't load the personality analysis. Please try taking the assessment again.",
      duration: 5000
    });
    
    navigate("/assessment");
    return null;
  }
  
  return (
    <div className={`container ${isMobile ? 'py-4 px-3 space-y-4' : 'py-6 space-y-8'}`}>
      <ReportHeader 
        analysis={displayAnalysis} 
        analysisHistory={analyses}
        onAnalysisChange={handleAnalysisChange}
      />
      
      <Tabs defaultValue="overview" className={`${isMobile ? 'space-y-4' : 'space-y-6'}`}>
        <ReportTabs />
        <ReportTabContent analysis={displayAnalysis} />
      </Tabs>
    </div>
  );
};

export default ReportPage;
