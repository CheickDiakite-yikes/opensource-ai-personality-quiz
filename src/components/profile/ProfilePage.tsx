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
  const { getAnalysisHistory, isLoading: analysisLoading, refreshAnalysis } = useAIAnalysis();
  const navigate = useNavigate();
  const [stableAnalysis, setStableAnalysis] = useState<PersonalityAnalysis | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const isMobile = useIsMobile();
  
  // Refresh analysis data when component mounts or auth state changes
  useEffect(() => {
    let isMounted = true;
    
    const loadAnalysisData = async () => {
      if (!isMounted) return;
      
      try {
        // Force a refresh of analysis data to ensure we have the latest
        await refreshAnalysis();
        
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
    
    // Only fetch data once auth is complete
    if (!authLoading) {
      loadAnalysisData();
    }
    
    return () => {
      isMounted = false;
    };
  }, [getAnalysisHistory, refreshAnalysis, authLoading, user]);
  
  // Render loading state during initial load
  if (authLoading || analysisLoading || profileLoading) {
    return <LoadingProfile />;
  }
  
  // If there's no analysis after loading, show the NoAnalysisFound component
  if (!stableAnalysis) {
    return <NoAnalysisFound />;
  }
  
  // Very simplified animation variants to prevent blinking
  const containerVariants = {
    visible: { opacity: 1 }
  };
  
  const itemVariants = {
    visible: { opacity: 1 }
  };
  
  return (
    <div className="container max-w-4xl mx-auto py-6 md:py-10 px-4 min-h-screen">
      <Button 
        variant="ghost" 
        className="mb-4 md:mb-6" 
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
      
      <div className={`space-y-4 ${isMobile ? '' : 'space-y-8'}`}>
        <ProfileHeader analysis={stableAnalysis} itemVariants={itemVariants} />
        <IntelligenceProfileCard analysis={stableAnalysis} itemVariants={itemVariants} />
        <TraitsCard analysis={stableAnalysis} itemVariants={itemVariants} />
        <InsightsCard analysis={stableAnalysis} itemVariants={itemVariants} />
        <GrowthPathwayCard analysis={stableAnalysis} itemVariants={itemVariants} />
      </div>
    </div>
  );
};

export default ProfilePage;
