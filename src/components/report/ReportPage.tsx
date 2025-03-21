
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Tabs } from "@/components/ui/tabs";
import ReportHeader from "./ReportHeader";
import ReportTabs from "./ReportTabs";
import ReportTabContent from "./ReportTabContent";
import { useAIAnalysis } from "@/hooks/useAIAnalysis";
import ReportSkeleton from "./skeletons/ReportSkeleton";
import { useIsMobile } from "@/hooks/use-mobile";

const ReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { analysis, isLoading, getAnalysisHistory, setCurrentAnalysis } = useAIAnalysis();
  const isMobile = useIsMobile();
  
  // Set the current analysis based on the ID param if provided
  useEffect(() => {
    if (id && !isLoading) {
      console.log("Trying to set current analysis to ID from URL param:", id);
      const success = setCurrentAnalysis(id);
      
      if (!success && !analysis) {
        console.log("Could not find analysis with ID:", id);
        toast.error("Could not find the requested analysis", {
          description: "Please try taking the assessment again or log in to access your saved analyses",
          duration: 5000
        });
        
        navigate("/assessment");
      } else {
        console.log("Successfully set analysis from ID param:", id);
      }
    }
  }, [id, isLoading, setCurrentAnalysis, navigate, analysis]);
  
  if (isLoading) {
    console.log("Report page is in loading state");
    return (
      <div className={`container ${isMobile ? 'py-4 px-3' : 'py-10'}`}>
        <ReportSkeleton />
      </div>
    );
  }
  
  // Get all analyses and find the one that matches the ID
  const analyses = getAnalysisHistory();
  console.log("Loaded analysis history:", analyses.length, "items");
  let analysisResult = analysis;
  
  if (id) {
    console.log("Looking for analysis with ID:", id);
    const matchingAnalysis = analyses.find(a => a.id === id);
    if (matchingAnalysis) {
      console.log("Found matching analysis:", matchingAnalysis.id);
      analysisResult = matchingAnalysis;
    } else {
      console.log("No matching analysis found for ID:", id);
    }
  }
  
  if (!analysisResult) {
    console.error("No analysis available to display");
    toast.error("Error loading analysis", {
      description: "We couldn't load the personality analysis. Please try taking the assessment again.",
      duration: 5000
    });
    
    navigate("/assessment");
    return null;
  }
  
  console.log("Rendering report for analysis:", analysisResult.id);
  
  return (
    <div className={`container ${isMobile ? 'py-4 px-3 space-y-4' : 'py-6 space-y-8'}`}>
      <ReportHeader analysis={analysisResult} />
      
      <Tabs defaultValue="overview" className={`${isMobile ? 'space-y-4' : 'space-y-6'}`}>
        <ReportTabs />
        <ReportTabContent analysis={analysisResult} />
      </Tabs>
    </div>
  );
};

export default ReportPage;
