
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAIAnalysis } from "@/hooks/useAIAnalysis";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
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

const ProfilePage: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { analysis, getAnalysisHistory, isLoading: analysisLoading, refreshAnalysis } = useAIAnalysis();
  const navigate = useNavigate();
  const [stableAnalysis, setStableAnalysis] = useState<PersonalityAnalysis | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [refreshed, setRefreshed] = useState(false);
  const isMobile = useIsMobile();
  
  // Refresh analysis data when component mounts or auth state changes, but only once
  useEffect(() => {
    let isMounted = true;
    
    const loadAnalysisData = async () => {
      if (!isMounted || refreshed) return;
      
      try {
        // Only refresh once when the component mounts
        await refreshAnalysis();
        setRefreshed(true);
        
        // Get the analysis history (should be sorted with newest first)
        const history = getAnalysisHistory();
        
        if (history && history.length > 0) {
          setStableAnalysis(history[0]);
        } else {
          if (isMounted) setStableAnalysis(null);
        }
      } catch (error) {
        console.error('Error loading analysis data:', error);
        if (isMounted) setStableAnalysis(null);
      } finally {
        if (isMounted) setProfileLoading(false);
      }
    };
    
    // Only fetch data once auth is complete and we haven't refreshed yet
    if (!authLoading && !refreshed) {
      loadAnalysisData();
    }
    
    return () => {
      isMounted = false;
    };
  }, [getAnalysisHistory, refreshAnalysis, authLoading, user, refreshed]);
  
  // Update stable analysis when analysis changes, without triggering a refresh
  useEffect(() => {
    if (analysis && (!stableAnalysis || analysis.id !== stableAnalysis.id)) {
      setStableAnalysis(analysis);
      setProfileLoading(false);
    }
  }, [analysis, stableAnalysis]);
  
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
      <Button 
        variant="ghost" 
        className="mb-3 md:mb-6 -ml-2" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      
      {user && (
        <div className="mb-4 md:mb-6 p-3 md:p-4 bg-secondary/10 rounded-lg">
          <p className="text-sm text-muted-foreground">
            {user ? "Your analysis is saved to your account and will be available whenever you log in." : 
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
      </div>
    </div>
  );
};

export default ProfilePage;
