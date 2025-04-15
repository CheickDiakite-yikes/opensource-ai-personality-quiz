
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useAIAnalysis } from "@/hooks/useAIAnalysis";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, RefreshCw } from "lucide-react";
import TraitsDetail from "./TraitsDetail";
import { useIsMobile } from "@/hooks/use-mobile";
import { PersonalityAnalysis } from "@/utils/types";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const TraitsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { 
    analysis, 
    isLoading, 
    fetchAnalysisById,
    forceFetchAllAnalyses 
  } = useAIAnalysis();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [directAnalysis, setDirectAnalysis] = useState<PersonalityAnalysis | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Log current route and analysis ID for debugging
  useEffect(() => {
    console.log(`[TraitsPage] Route analysis ID: ${id}`);
    console.log(`[TraitsPage] Current analysis: ${analysis?.id || 'none'}`);
  }, [id, analysis]);
  
  // Try to load the analysis directly if we have an ID but no analysis
  useEffect(() => {
    if (id && !analysis && !directAnalysis && !isLoading) {
      const loadAnalysisDirectly = async () => {
        console.log(`[TraitsPage] Attempting to load analysis directly with ID: ${id}`);
        
        try {
          // First try the edge function
          console.log("[TraitsPage] Attempting to use edge function");
          const { data: edgeData, error: edgeError } = await supabase.functions.invoke(
            "get-comprehensive-analysis",
            {
              method: 'POST',
              body: { id }
            }
          );
          
          if (edgeError) {
            console.error("[TraitsPage] Edge function error:", edgeError);
          } else if (edgeData) {
            console.log("[TraitsPage] Successfully loaded analysis with edge function");
            setDirectAnalysis(edgeData);
            return;
          }
          
          // Then try the direct fetch if edge function fails
          const fetchedAnalysis = await fetchAnalysisById(id);
          
          if (fetchedAnalysis) {
            console.log(`[TraitsPage] Successfully loaded analysis with ID: ${id}`);
            setDirectAnalysis(fetchedAnalysis);
            return;
          }
          
          console.log(`[TraitsPage] Direct fetch failed, trying force fetch`);
          
          // If direct fetch fails, try force fetching all analyses
          const allAnalyses = await forceFetchAllAnalyses();
          
          if (allAnalyses && allAnalyses.length > 0) {
            console.log(`[TraitsPage] Force fetch found ${allAnalyses.length} analyses`);
            
            // Try to find the matching analysis
            const matchingAnalysis = allAnalyses.find(a => a.id === id);
            
            if (matchingAnalysis) {
              console.log(`[TraitsPage] Found matching analysis in force fetch results`);
              setDirectAnalysis(matchingAnalysis);
              return;
            }
            
            // If we found analyses but none match the ID, redirect to the first one
            console.log(`[TraitsPage] No matching analysis found, redirecting to first analysis`);
            toast.info("Redirecting to available analysis");
            navigate(`/traits/${allAnalyses[0].id}`);
            return;
          }
          
          // If we couldn't load the analysis, redirect to assessment
          console.log(`[TraitsPage] Failed to load any analyses, redirecting to assessment`);
          toast.error("Could not find the requested analysis", {
            description: "Please try taking the assessment again"
          });
          navigate("/assessment");
        } catch (error) {
          console.error(`[TraitsPage] Error loading analysis:`, error);
          toast.error("Error loading analysis", {
            description: "Please try again later or take a new assessment"
          });
          navigate("/assessment");
        }
      };
      
      loadAnalysisDirectly();
    }
  }, [id, analysis, directAnalysis, isLoading, fetchAnalysisById, navigate, forceFetchAllAnalyses]);
  
  // Handle manual refresh
  const handleRefresh = async () => {
    if (isRefreshing || !id) return;
    
    setIsRefreshing(true);
    toast.loading("Refreshing analysis data...", { id: "traits-refresh" });
    
    try {
      // First try edge function
      const { data: edgeData, error: edgeError } = await supabase.functions.invoke(
        "get-comprehensive-analysis",
        {
          method: 'POST',
          body: { id }
        }
      );
      
      if (edgeError) {
        console.error("[TraitsPage] Edge function error during refresh:", edgeError);
      } else if (edgeData) {
        console.log("[TraitsPage] Successfully refreshed analysis with edge function");
        setDirectAnalysis(edgeData);
        toast.success("Analysis data refreshed", { id: "traits-refresh" });
        setIsRefreshing(false);
        return;
      }
      
      // If edge function fails, try normal refresh
      const refreshedAnalysis = await fetchAnalysisById(id);
      
      if (refreshedAnalysis) {
        setDirectAnalysis(refreshedAnalysis);
        toast.success("Analysis data refreshed", { id: "traits-refresh" });
        setIsRefreshing(false);
        return;
      }
      
      // If that fails, try force refresh of all analyses
      console.log("[TraitsPage] Normal refresh failed, trying force refresh");
      const allAnalyses = await forceFetchAllAnalyses();
      
      if (allAnalyses && allAnalyses.length > 0) {
        const matchingAnalysis = allAnalyses.find(a => a.id === id);
        
        if (matchingAnalysis) {
          setDirectAnalysis(matchingAnalysis);
          toast.success("Analysis data refreshed", { id: "traits-refresh" });
        } else {
          toast.error("Could not find this specific analysis", { 
            id: "traits-refresh",
            description: "We found other analyses you can view"
          });
          
          // Redirect to first available analysis
          navigate(`/traits/${allAnalyses[0].id}`);
        }
      } else {
        toast.error("Could not refresh analysis data", { 
          id: "traits-refresh",
          description: "Please try again later"
        });
      }
    } catch (error) {
      console.error("Error refreshing analysis:", error);
      toast.error("Error refreshing data", { id: "traits-refresh" });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Use direct analysis if available, otherwise use the one from the hook
  const displayAnalysis = directAnalysis || analysis;
  
  // Redirect if no analysis is available
  if (!displayAnalysis && !isLoading) {
    return (
      <div className="container max-w-5xl py-4 md:py-8 px-3 md:px-4">
        <h2 className="text-2xl font-bold">No analysis found</h2>
        <p className="mt-2">Complete the assessment to view your personality traits.</p>
        <Button onClick={() => navigate("/assessment")} className="mt-4">
          Take Assessment
        </Button>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="container max-w-5xl py-4 md:py-8 px-3 md:px-4">
        <div className="space-y-4 md:space-y-6">
          <div className="h-8 w-40 bg-muted rounded animate-pulse"></div>
          <div className="h-64 bg-muted rounded animate-pulse"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-4xl mx-auto py-4 md:py-8 px-3 md:px-4 min-h-screen overflow-x-hidden">
      <div className="flex items-center justify-between mb-3 md:mb-6">
        <Button 
          variant="ghost" 
          className="-ml-2" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`space-y-4 ${isMobile ? '' : 'space-y-8'}`}
      >
        <Card className="overflow-hidden">
          <CardHeader className={`bg-gradient-to-r from-primary/20 to-secondary/20 ${isMobile ? 'p-4 pb-3' : 'pb-4'}`}>
            <CardTitle className="text-foreground">All Personality Traits</CardTitle>
            <CardDescription className="text-foreground/80">Detailed view of all your personality traits from the assessment</CardDescription>
          </CardHeader>
          <CardContent className={isMobile ? "p-3 pt-2" : "pt-6"}>
            {displayAnalysis?.traits && displayAnalysis.traits.length > 0 ? (
              <TraitsDetail traits={displayAnalysis.traits} />
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No trait data available for this analysis.</p>
                <Button variant="outline" className="mt-4" onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4 mr-2" /> Try Refreshing
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default TraitsPage;
