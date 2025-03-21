
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
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

const ProfilePage: React.FC = () => {
  const { getAnalysisHistory, isLoading } = useAIAnalysis();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stableAnalysis, setStableAnalysis] = useState<PersonalityAnalysis | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  
  // Fetch the latest analysis when the component mounts
  useEffect(() => {
    const fetchLatestAnalysis = async () => {
      // Get the analysis history (should be sorted with newest first)
      const history = getAnalysisHistory();
      
      if (history && history.length > 0) {
        // Set the most recent analysis (first item in the array)
        setStableAnalysis(history[0]);
      } else {
        setStableAnalysis(null);
      }
      
      setProfileLoading(false);
    };
    
    // Only fetch data when loading is complete
    if (!isLoading) {
      fetchLatestAnalysis();
    }
  }, [getAnalysisHistory, isLoading]);
  
  // Render loading state during initial load
  if (isLoading || profileLoading) {
    return <LoadingProfile />;
  }
  
  // If there's no analysis after loading, show the NoAnalysisFound component
  if (!stableAnalysis) {
    return <NoAnalysisFound />;
  }
  
  const containerVariants = {
    hidden: { opacity: 0.95 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.15,
        ease: "linear"
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0.95 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.15,
        ease: "linear"
      }
    }
  };
  
  return (
    <div className="container max-w-5xl py-6 md:py-10 px-4 min-h-screen">
      <Button 
        variant="ghost" 
        className="mb-6" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      
      {user && (
        <div className="mb-6 p-4 bg-secondary/10 rounded-lg">
          <p className="text-sm text-muted-foreground">
            {user ? "Your analysis is saved to your account and will be available whenever you log in." : 
            "Sign in to save your personality analysis results to your account."}
          </p>
        </div>
      )}
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        <ProfileHeader analysis={stableAnalysis} itemVariants={itemVariants} />
        <IntelligenceProfileCard analysis={stableAnalysis} itemVariants={itemVariants} />
        <TraitsCard analysis={stableAnalysis} itemVariants={itemVariants} />
        <InsightsCard analysis={stableAnalysis} itemVariants={itemVariants} />
        <GrowthPathwayCard analysis={stableAnalysis} itemVariants={itemVariants} />
      </motion.div>
    </div>
  );
};

export default ProfilePage;
