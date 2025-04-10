
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAIAnalysis } from "@/hooks/useAIAnalysis";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import LoadingProfile from "./LoadingProfile";
import NoAnalysisFound from "./NoAnalysisFound";
import ProfileHeader from "./ProfileHeader";
import IntelligenceProfileCard from "./IntelligenceProfileCard";
import TraitsCard from "./TraitsCard";
import InsightsCard from "./InsightsCard";
import GrowthPathwayCard from "./GrowthPathwayCard";
import { useAuth } from "@/contexts/AuthContext";
import { PersonalityAnalysis } from "@/utils/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { AssessmentErrorHandler } from "../assessment/AssessmentErrorHandler";
import { FixAnalysisButton } from "../analysis/FixAnalysisButton";

// ShareProfile import has been removed

const ProfilePage: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { 
    analysis, 
    getAnalysisHistory, 
    isLoading: analysisLoading, 
    refreshAnalysis,
    loadAllAnalysesFromSupabase 
  } = useAIAnalysis();
  const navigate = useNavigate();
  const [stableAnalysis, setStableAnalysis] = useState<PersonalityAnalysis | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [refreshed, setRefreshed] = useState(false);
  const [isRefreshingData, setIsRefreshingData] = useState(false);
  const [showErrorHandler, setShowErrorHandler] = useState(false);
  const isMobile = useIsMobile();
  
  // Refresh analysis data when component mounts or auth state changes
  useEffect(() => {
    let isMounted = true;
    
    const loadAnalysisData = async () => {
      if (!isMounted || isRefreshingData) return;
      
      try {
        setIsRefreshingData(true);
        
        // Try to load all analyses first to ensure we have complete history
        if (user) {
          await loadAllAnalysesFromSupabase();
        }
        
        // Then refresh to update the state
        await refreshAnalysis();
        setRefreshed(true);
        
        // Get the analysis history (should be sorted with newest first)
        const history = getAnalysisHistory();
        
        if (history && history.length > 0) {
          console.log(`Loaded ${history.length} analyses for profile page`);
          setStableAnalysis(history[0]);
        } else {
          if (isMounted) setStableAnalysis(null);
        }
      } catch (error) {
        console.error('Error loading analysis data:', error);
        if (isMounted) setStableAnalysis(null);
        toast.error("Could not load your analysis data", {
          description: "Please try refreshing the page"
        });
      } finally {
        if (isMounted) {
          setProfileLoading(false);
          setIsRefreshingData(false);
        }
      }
    };
    
    // Only fetch data once auth is complete
    if (!authLoading && !refreshed) {
      loadAnalysisData();
    }
    
    return () => {
      isMounted = false;
    };
  }, [
    getAnalysisHistory, 
    refreshAnalysis, 
    authLoading, 
    user, 
    refreshed, 
    loadAllAnalysesFromSupabase,
    isRefreshingData
  ]);
  
  // Update stable analysis when analysis changes, without triggering a refresh
  useEffect(() => {
    if (analysis && (!stableAnalysis || analysis.id !== stableAnalysis.id)) {
      setStableAnalysis(analysis);
      setProfileLoading(false);
      setShowErrorHandler(false);
    }
  }, [analysis, stableAnalysis]);
  
  // Handler for manual refresh
  const handleRefresh = async () => {
    if (isRefreshingData) return;
    
    setIsRefreshingData(true);
    try {
      // Try to load all analyses
      if (user) {
        const allAnalyses = await loadAllAnalysesFromSupabase();
        if (allAnalyses && allAnalyses.length > 0) {
          toast.success(`Found ${allAnalyses.length} analyses`, {
            description: "Your profile has been updated with the latest data"
          });
        }
      }
      
      // Refresh to update state
      await refreshAnalysis();
    } catch (error) {
      console.error("Error during manual refresh:", error);
      toast.error("Could not refresh your analysis data", {
        description: "Please try again later"
      });
    } finally {
      setIsRefreshingData(false);
    }
  };
  
  // Render loading state during initial load
  if (authLoading || (analysisLoading && profileLoading)) {
    return <LoadingProfile />;
  }
  
  // If there's no analysis after loading, show the NoAnalysisFound component
  if (!stableAnalysis) {
    return <NoAnalysisFound />;
  }
  
  return (
    <div className="container max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto py-4 md:py-8 px-3 md:px-4 min-h-screen">
      <div className="flex justify-between items-center mb-3 md:mb-6">
        <Button 
          variant="ghost" 
          className="-ml-2" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshingData}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshingData ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {user && (
        <div className="mb-4 md:mb-6 p-3 md:p-4 bg-secondary/10 rounded-lg">
          <p className="text-sm text-muted-foreground">
            {user ? `Your analysis is saved to your account. You have completed ${getAnalysisHistory().length} assessments so far.` : 
            "Sign in to save your personality analysis results to your account."}
          </p>
        </div>
      )}
      
      <div className={`space-y-4 ${isMobile ? '' : 'space-y-6 md:space-y-8'}`}>
        <ProfileHeader analysis={stableAnalysis} itemVariants={{visible: {opacity: 1}}} />
        <IntelligenceProfileCard analysis={stableAnalysis} itemVariants={{visible: {opacity: 1}}} />
        <TraitsCard analysis={stableAnalysis} itemVariants={{visible: {opacity: 1}}} />
        <InsightsCard analysis={stableAnalysis} itemVariants={{visible: {opacity: 1}}} />
        <GrowthPathwayCard analysis={stableAnalysis} itemVariants={{visible: {opacity: 1}}} />
        
        {/* ShareProfile component has been removed */}
      </div>
    </div>
  );
};

export default ProfilePage;
