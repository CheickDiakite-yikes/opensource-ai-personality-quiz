
import React from "react";
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

const ProfilePage: React.FC = () => {
  const { analysis, isLoading } = useAIAnalysis();
  const navigate = useNavigate();
  
  if (isLoading) {
    return <LoadingProfile />;
  }
  
  // If no analysis is available, redirect to assessment
  React.useEffect(() => {
    if (!analysis && !isLoading) {
      navigate("/assessment");
    }
  }, [analysis, navigate, isLoading]);
  
  if (!analysis) {
    return <NoAnalysisFound />;
  }
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
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
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        <ProfileHeader analysis={analysis} itemVariants={itemVariants} />
        <IntelligenceProfileCard analysis={analysis} itemVariants={itemVariants} />
        <TraitsCard analysis={analysis} itemVariants={itemVariants} />
        <InsightsCard analysis={analysis} itemVariants={itemVariants} />
        <GrowthPathwayCard analysis={analysis} itemVariants={itemVariants} />
      </motion.div>
    </div>
  );
};

export default ProfilePage;
