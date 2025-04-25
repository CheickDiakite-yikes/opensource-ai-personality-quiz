
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs } from "@/components/ui/tabs";
import ReportHeader from "./ReportHeader";
import ReportTabs from "./ReportTabs";
import ReportTabContent from "./ReportTabContent";
import ReportSkeleton from "./skeletons/ReportSkeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import ReportError from "./ReportError";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PersonalityAnalysis } from "@/utils/types";
import { convertToPersonalityAnalysis } from "@/hooks/aiAnalysis/utils";

const EnhancedReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [analysis, setAnalysis] = useState<PersonalityAnalysis | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<PersonalityAnalysis[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Load analysis on component mount or when ID changes
  useEffect(() => {
    async function loadAnalysis() {
      setIsLoading(true);
      setErrorMessage(null);
      
      try {
        // If no ID provided, fetch all analyses to find the most recent one
        if (!id) {
          console.log("No ID provided, fetching all analyses");
          await loadAllAnalyses();
          return;
        }
        
        // First try: Direct lookup from Supabase
        const { data: directData, error: directError } = await supabase
          .from('analyses')
          .select('*')
          .eq('id', id)
          .maybeSingle();
          
        if (!directError && directData) {
          console.log("Found analysis directly:", directData.id);
          const processedAnalysis = convertToPersonalityAnalysis(directData);
          setAnalysis(processedAnalysis);
          await loadAnalysisHistory(); // Load history after setting current analysis
          setIsLoading(false);
          return;
        }

        // Second try: Using edge function (which has more fallbacks)
        console.log("Direct lookup failed, trying edge function");
        const { data: functionData, error: functionError } = await supabase.functions.invoke('get-public-analysis', {
          method: 'GET',
          body: { id }
        });
        
        if (functionError) {
          console.error("Edge function error:", functionError);
          throw new Error(`Failed to retrieve analysis: ${functionError.message}`);
        }
        
        if (functionData) {
          console.log("Found analysis via edge function:", functionData.id);
          const processedAnalysis = convertToPersonalityAnalysis(functionData);
          setAnalysis(processedAnalysis);
          await loadAnalysisHistory(); // Load history after setting current analysis
          setIsLoading(false);
          return;
        }
        
        // Try loading all analyses if no specific analysis was found
        await loadAllAnalyses();
        
      } catch (error) {
        console.error("Error loading analysis:", error);
        setErrorMessage(error instanceof Error ? error.message : "Failed to load analysis");
        setIsLoading(false);
      }
    }
    
    loadAnalysis();
  }, [id]);

  // Function to load all analyses (for history or when no ID provided)
  const loadAllAnalyses = async () => {
    try {
      console.log("Loading all analyses");
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        console.log(`Found ${data.length} analyses in history`);
        const processedAnalyses = data.map(convertToPersonalityAnalysis);
        setAnalysisHistory(processedAnalyses);
        
        // If no specific analysis is selected, use the most recent one
        if (!id) {
          console.log("No ID provided, redirecting to most recent analysis:", processedAnalyses[0].id);
          navigate(`/report/${processedAnalyses[0].id}`, { replace: true });
          return;
        }
        
        // If we have an ID but couldn't find it directly, check if it's in our history
        const matchingAnalysis = processedAnalyses.find(a => a.id === id);
        if (matchingAnalysis) {
          console.log("Found matching analysis in history:", matchingAnalysis.id);
          setAnalysis(matchingAnalysis);
        }
      } else {
        console.log("No analyses found in database");
        // If no analyses found at all, redirect to assessment
        toast.error("No analyses found", {
          description: "Please complete an assessment to view your report"
        });
        navigate("/assessment", { replace: true });
      }
    } catch (error) {
      console.error("Error loading analyses:", error);
      setErrorMessage("Failed to load analysis history");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load analysis history separately
  const loadAnalysisHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const processedAnalyses = data.map(convertToPersonalityAnalysis);
        setAnalysisHistory(processedAnalyses);
      }
    } catch (error) {
      console.error("Error loading analysis history:", error);
      // Don't set error message here as it's not critical
    }
  };

  // Function to change the current analysis
  const handleAnalysisChange = async (analysisId: string) => {
    if (analysisId === id) return;
    
    console.log(`Changing analysis to: ${analysisId}`);
    navigate(`/report/${analysisId}`);
  };

  // Function to manually refresh analyses
  const handleManualRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    toast.loading("Refreshing analyses...", { id: "refresh-toast" });
    
    try {
      // Reload the current analysis and history
      const currentId = id;
      
      // Reset state
      setAnalysis(null);
      setAnalysisHistory([]);
      
      // Reload all analyses first
      await loadAllAnalyses();
      
      // If we have a currentId, try to find it again
      if (currentId) {
        const { data } = await supabase.functions.invoke('get-public-analysis', {
          method: 'GET',
          body: { id: currentId }
        });
        
        if (data) {
          console.log("Refreshed current analysis:", data.id);
          const processedAnalysis = convertToPersonalityAnalysis(data);
          setAnalysis(processedAnalysis);
        }
      }
      
      toast.success("Analyses refreshed successfully", { id: "refresh-toast" });
    } catch (error) {
      console.error("Error refreshing analyses:", error);
      toast.error("Failed to refresh analyses", { id: "refresh-toast" });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className={`container ${isMobile ? 'pt-2 pb-16 px-0.5 mx-0 w-full max-w-full overflow-hidden' : 'py-10'}`}>
        <ReportSkeleton />
      </div>
    );
  }
  
  // Show error state if we have an error
  if (errorMessage) {
    return (
      <ReportError
        description={errorMessage}
        onRetry={handleManualRefresh}
        errorDetails={`Report ID: ${id}, History Size: ${analysisHistory.length}`}
      />
    );
  }
  
  // Render the report content
  return (
    <div className={`mx-auto ${isMobile ? 'p-0 pt-1 pb-16 px-0 max-w-full w-full overflow-hidden' : 'py-6 space-y-8 max-w-4xl container'}`}>
      {analysis ? (
        <>
          <ReportHeader 
            analysis={analysis} 
            analysisHistory={analysisHistory}
            onAnalysisChange={handleAnalysisChange}
            onManualRefresh={handleManualRefresh}
          />
          
          <Tabs defaultValue="overview" className="w-full overflow-hidden max-w-full">
            <div className="w-full overflow-x-auto sticky top-0 z-10 bg-background/80 backdrop-blur-sm pt-1 shadow-sm">
              <ReportTabs />
            </div>
            <ReportTabContent analysis={analysis} />
          </Tabs>
        </>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold">No Analysis Selected</h2>
          <p className="text-muted-foreground mt-2">
            {analysisHistory.length > 0 
              ? "Please select an analysis from your history" 
              : "Complete an assessment to view your analysis"}
          </p>
          <div className="mt-4">
            <button 
              onClick={() => navigate("/assessment")} 
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
            >
              Take Assessment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedReportPage;
