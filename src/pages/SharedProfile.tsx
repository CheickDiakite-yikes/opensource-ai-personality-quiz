
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { PersonalityAnalysis } from "@/utils/types";
import { useAIAnalysis } from "@/hooks/useAIAnalysis";
import IntelligenceProfileCard from "@/components/profile/IntelligenceProfileCard";
import ProfileStats from "@/components/profile/ProfileStats";
import TraitsCard from "@/components/profile/TraitsCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

const SharedProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getAnalysisById } = useAIAnalysis();
  const [analysis, setAnalysis] = useState<PersonalityAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();
  
  // Animation variants
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };
  
  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true);
      
      if (!id) {
        setLoading(false);
        toast.error("No profile ID provided");
        return;
      }
      
      try {
        console.log("Attempting to fetch shared analysis with ID:", id);
        
        // Get the analysis by ID without requiring login
        const fetchedAnalysis = await getAnalysisById(id);
        
        if (fetchedAnalysis) {
          console.log("Successfully fetched shared analysis:", fetchedAnalysis);
          setAnalysis(fetchedAnalysis);
          // Show success toast
          toast.success("Profile loaded successfully");
        } else {
          console.error("No analysis found with ID:", id);
          toast.error("Could not load the shared profile");
        }
      } catch (error) {
        console.error("Error fetching shared analysis:", error);
        toast.error("Error loading the shared profile");
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalysis();
  }, [id, getAnalysisById]);
  
  if (loading) {
    return (
      <div className="container py-16 text-center">
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-primary/10 rounded-md max-w-md mx-auto"></div>
          <div className="h-64 bg-primary/5 rounded-lg max-w-4xl mx-auto"></div>
          <div className="h-64 bg-primary/5 rounded-lg max-w-4xl mx-auto"></div>
        </div>
      </div>
    );
  }
  
  if (!analysis) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
        <p className="text-muted-foreground mb-6">
          Sorry, the shared profile you're looking for doesn't exist or may have been removed.
        </p>
      </div>
    );
  }
  
  return (
    <div className={`container ${isMobile ? 'py-6' : 'py-16'}`}>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8 max-w-4xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Shared Personality Analysis</h1>
          <p className="text-muted-foreground">
            This is a shared view of someone's personality analysis from Who Am I?
          </p>
        </motion.div>
        
        {/* Intelligence Profile Card */}
        <IntelligenceProfileCard analysis={analysis} itemVariants={itemVariants} />
        
        {/* Top Traits */}
        <motion.div variants={itemVariants}>
          <TraitsCard analysis={analysis} itemVariants={itemVariants} />
        </motion.div>
        
        {/* Profile Stats */}
        <motion.div variants={itemVariants} className="bg-card p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">Profile Statistics</h2>
          <ProfileStats analysis={analysis} />
        </motion.div>
        
        <motion.div variants={itemVariants} className="text-center text-sm text-muted-foreground">
          <p>Want to discover your own personality traits?</p>
          <a href="/" className="text-primary hover:underline">Take the assessment at Who Am I?</a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SharedProfile;
