
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
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PersonalityAnalysis, Json } from "@/utils/types";
import { convertToPersonalityAnalysis } from "@/components/report/utils/dataConverters";

const ReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { analysis, isLoading, error, getAnalysisHistory, setCurrentAnalysis, refreshAnalysis } = useAIAnalysis();
  const isMobile = useIsMobile();
  const [loadAttempts, setLoadAttempts] = useState(0);
  const { user } = useAuth();
  const [directFetchInProgress, setDirectFetchInProgress] = useState(false);
  
  // Function to directly fetch analysis from Supabase if other methods fail
  const fetchAnalysisDirectly = async (analysisId: string) => {
    try {
      console.log("Attempting to fetch analysis directly from Supabase:", analysisId);
      setDirectFetchInProgress(true);
      
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('id', analysisId)
        .single();
        
      if (error) {
        console.error("Error fetching specific analysis from Supabase:", error);
        return null;
      }
      
      if (data) {
        console.log("Successfully fetched analysis directly from Supabase:", data.id);
        // Convert to PersonalityAnalysis type using the utility function
        return convertToPersonalityAnalysis(data);
      }
      
      return null;
    } catch (err) {
      console.error("Error in direct fetch:", err);
      return null;
    } finally {
      setDirectFetchInProgress(false);
    }
  };
  
  // Set the current analysis based on the ID param if provided
  useEffect(() => {
    const loadAnalysis = async () => {
      if (!id || directFetchInProgress) return;
      
      console.log(`Trying to load analysis with ID: ${id}, Loading state: ${isLoading}, Attempt: ${loadAttempts}`);
      
      // Try setting the current analysis from the hook's state or localStorage
      const success = setCurrentAnalysis(id);
      
      if (!success && !analysis) {
        console.log(`Could not find analysis with ID: ${id} in local storage, attempt: ${loadAttempts}`);
        
        // If user is logged in, try fetching directly from Supabase
        if (user && loadAttempts < 2) {
          console.log("User is logged in, attempting direct fetch from Supabase");
          const directAnalysis = await fetchAnalysisDirectly(id);
          
          if (directAnalysis) {
            console.log("Direct fetch successful, setting analysis");
            setCurrentAnalysis(directAnalysis.id);
            return;
          }
        }
        
        // Try refreshing data from Supabase if previous attempts failed
        if (loadAttempts < 3) {
          console.log(`Attempting to refresh analysis data from Supabase, attempt: ${loadAttempts + 1}`);
          refreshAnalysis();
          setLoadAttempts(prev => prev + 1);
          return;
        }
        
        toast.error("Could not find the requested analysis", {
          description: "Please try taking the assessment again or log in to access your saved analyses",
          duration: 5000
        });
        
        navigate("/assessment");
      } else if (success) {
        console.log("Successfully set analysis from ID param:", id);
      }
    };
    
    if (!isLoading) {
      loadAnalysis();
    }
  }, [id, isLoading, setCurrentAnalysis, navigate, analysis, refreshAnalysis, loadAttempts, user, directFetchInProgress]);
  
  if (isLoading || directFetchInProgress) {
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
            onClick={() => {
              console.log("Manually refreshing analysis data");
              refreshAnalysis();
              setLoadAttempts(0); // Reset attempts on manual refresh
            }}
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
    return (
      <div className={`container ${isMobile ? 'py-4 px-3' : 'py-10'}`}>
        <div className="p-6 bg-destructive/10 rounded-lg text-center">
          <h2 className="text-xl font-bold mb-2">No Analysis Found</h2>
          <p className="text-muted-foreground mb-4">
            We couldn't find the personality analysis you're looking for.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <button 
              className="px-4 py-2 bg-primary text-white rounded-md"
              onClick={() => navigate("/assessment")}
            >
              Take the Assessment
            </button>
            {user && (
              <button 
                className="px-4 py-2 bg-secondary text-white rounded-md"
                onClick={() => {
                  refreshAnalysis();
                  setLoadAttempts(0);
                }}
              >
                Refresh Data
              </button>
            )}
          </div>
        </div>
      </div>
    );
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
