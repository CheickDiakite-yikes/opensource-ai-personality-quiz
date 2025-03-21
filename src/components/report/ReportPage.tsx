
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

const ReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { analysis, isLoading, error, getAnalysisHistory, setCurrentAnalysis, refreshAnalysis } = useAIAnalysis();
  const isMobile = useIsMobile();
  const [loadAttempts, setLoadAttempts] = useState(0);
  
  // Set the current analysis based on the ID param if provided
  useEffect(() => {
    if (id && !isLoading) {
      console.log("Trying to set current analysis to ID from URL param:", id);
      const success = setCurrentAnalysis(id);
      
      if (!success && !analysis) {
        console.log("Could not find analysis with ID:", id);
        
        // Try refreshing data from Supabase if this is the first attempt
        if (loadAttempts < 1) {
          console.log("Attempting to refresh analysis data from Supabase");
          refreshAnalysis();
          setLoadAttempts(prev => prev + 1);
          return;
        }
        
        toast.error("Could not find the requested analysis", {
          description: "Please try taking the assessment again or log in to access your saved analyses",
          duration: 5000
        });
        
        navigate("/assessment");
      } else {
        console.log("Successfully set analysis from ID param:", id);
      }
    }
  }, [id, isLoading, setCurrentAnalysis, navigate, analysis, refreshAnalysis, loadAttempts]);
  
  if (isLoading) {
    console.log("Report page is in loading state");
    return (
      <div className={`container ${isMobile ? 'py-4 px-3' : 'py-10'}`}>
        <ReportSkeleton />
      </div>
    );
  }
  
  if (error) {
    console.error("Error in report page:", error);
    return (
      <div className={`container ${isMobile ? 'py-4 px-3' : 'py-10'}`}>
        <div className="p-6 bg-destructive/10 rounded-lg text-center">
          <h2 className="text-xl font-bold mb-2">Error Loading Report</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button 
            className="px-4 py-2 bg-primary text-white rounded-md"
            onClick={() => refreshAnalysis()}
          >
            Try Again
          </button>
        </div>
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
