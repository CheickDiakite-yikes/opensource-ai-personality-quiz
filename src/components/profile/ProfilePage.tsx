
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
  const { analysis, isLoading } = useAIAnalysis();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stableAnalysis, setStableAnalysis] = useState<PersonalityAnalysis | null>(null);
  
  // Only update the analysis once when it's available to prevent blinking
  useEffect(() => {
    if (analysis && !stableAnalysis) {
      setStableAnalysis(analysis);
    }
  }, [analysis, stableAnalysis]);
  
  // Render loading state only on initial load
  if (isLoading && !stableAnalysis) {
    return <LoadingProfile />;
  }
  
  // Use stableAnalysis if available, otherwise use analysis from the hook
  const displayAnalysis = stableAnalysis || analysis;
  
  if (!displayAnalysis) {
    return <NoAnalysisFound />;
  }
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05 // Reduce stagger time for more stable appearance
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 }, // Reduced y offset for subtle animation
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3, // Shorter duration
        ease: "easeOut" // Simpler easing
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
        <motion.div
          initial={{ opacity: 0.9 }} // Start almost fully visible
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="mb-6 p-4 bg-secondary/10 rounded-lg"
        >
          <p className="text-sm text-muted-foreground">
            {user ? "Your analysis is saved to your account and will be available whenever you log in." : 
            "Sign in to save your personality analysis results to your account."}
          </p>
        </motion.div>
      )}
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        <ProfileHeader analysis={displayAnalysis} itemVariants={itemVariants} />
        <IntelligenceProfileCard analysis={displayAnalysis} itemVariants={itemVariants} />
        <TraitsCard analysis={displayAnalysis} itemVariants={itemVariants} />
        <InsightsCard analysis={displayAnalysis} itemVariants={itemVariants} />
        <GrowthPathwayCard analysis={displayAnalysis} itemVariants={itemVariants} />
      </motion.div>
    </div>
  );
};

export default ProfilePage;
