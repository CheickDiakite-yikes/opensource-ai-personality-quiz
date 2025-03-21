
import React, { useEffect } from "react";
import { motion } from "framer-motion";
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
import { toast } from "sonner";

const ProfilePage: React.FC = () => {
  const { analysis, isLoading, error, refreshAnalysis } = useAIAnalysis();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Fetch data once when component mounts if user is logged in
  useEffect(() => {
    if (user) {
      console.log("ProfilePage: User is logged in, fetching data");
      refreshAnalysis();
    }
  }, [user, refreshAnalysis]);
  
  const handleRefresh = async () => {
    toast.info("Refreshing your profile data...");
    await refreshAnalysis();
    
    if (!analysis) {
      toast.warning("No analysis found. Please take an assessment first.");
    } else {
      toast.success("Profile data refreshed");
    }
  };
  
  console.log("ProfilePage rendering with analysis:", analysis ? "found" : "not found");
  console.log("ProfilePage isLoading:", isLoading);
  console.log("ProfilePage error:", error);
  
  if (isLoading) {
    return <LoadingProfile />;
  }
  
  if (error) {
    return (
      <div className="container max-w-4xl py-8 px-4 flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center space-y-6">
          <h1 className="text-2xl font-bold text-red-500">Error Loading Profile</h1>
          <p className="text-muted-foreground max-w-md mx-auto">{error}</p>
          <Button onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" /> Retry
          </Button>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="container max-w-4xl py-8 px-4 flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center space-y-6">
          <h1 className="text-2xl font-bold">Profile Requires Login</h1>
          <p className="text-muted-foreground max-w-md mx-auto">Please sign in to view your profile.</p>
          <Button onClick={() => navigate("/auth")}>
            Sign In / Register
          </Button>
        </div>
      </div>
    );
  }
  
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
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleRefresh}
          className="flex items-center"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh Data
        </Button>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-4 bg-secondary/10 rounded-lg"
      >
        <p className="text-sm text-muted-foreground">
          Your analysis is saved to your account and will be available whenever you log in.
        </p>
      </motion.div>
      
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
