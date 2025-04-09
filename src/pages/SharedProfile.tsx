
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { PersonalityAnalysis } from "@/utils/types";
import { useAnalysisById } from "@/hooks/aiAnalysis/useAnalysisById";
import IntelligenceProfileCard from "@/components/profile/IntelligenceProfileCard";
import ProfileStats from "@/components/profile/ProfileStats";
import TraitsCard from "@/components/profile/TraitsCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { AssessmentErrorHandler } from "@/components/assessment/AssessmentErrorHandler";

const SharedProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getAnalysisById, isLoadingAnalysisById } = useAnalysisById();
  const [analysis, setAnalysis] = useState<PersonalityAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadAttempts, setLoadAttempts] = useState(0);
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

  const fetchAnalysis = async () => {
    if (!id) {
      setError("No profile ID provided");
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      // Get the analysis by ID 
      const fetchedAnalysis = await getAnalysisById(id);
      
      if (fetchedAnalysis && fetchedAnalysis.id) {
        console.log("Successfully loaded shared analysis:", fetchedAnalysis.id);
        setAnalysis(fetchedAnalysis);
        toast.success("Profile loaded successfully");
      } else {
        console.error("Failed to load shared analysis with ID:", id);
        setError("Could not load the shared profile");
        toast.error("Could not load the shared profile");
      }
    } catch (err) {
      console.error("Error loading shared profile:", err);
      setError("Error loading the shared profile");
      toast.error("Error loading the shared profile");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchAnalysis();
  }, [id]);
  
  // Implement retry mechanism
  useEffect(() => {
    if (error && loadAttempts < 2 && !analysis) {
      const retryDelay = Math.pow(2, loadAttempts) * 1000; // 1s, 2s
      
      const timer = setTimeout(() => {
        setLoadAttempts(prev => prev + 1);
        fetchAnalysis();
      }, retryDelay);
      
      return () => clearTimeout(timer);
    }
  }, [error, loadAttempts, analysis]);
  
  const handleRetry = () => {
    setLoadAttempts(0);
    fetchAnalysis();
    toast.loading("Retrying profile load...");
  };
  
  if (loading || isLoadingAnalysisById) {
    return (
      <div className="container py-16 text-center">
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-primary/10 rounded-md max-w-md mx-auto"></div>
          <div className="h-64 bg-primary/5 rounded-lg max-w-4xl mx-auto"></div>
          <div className="h-64 bg-primary/5 rounded-lg max-w-4xl mx-auto"></div>
        </div>
        <p className="mt-4 text-muted-foreground">Loading shared profile...</p>
      </div>
    );
  }
  
  if (error || !analysis) {
    const errorDetails = `Profile ID: ${id || "None"}\nAttempts: ${loadAttempts}\nError: ${error || "No data returned"}`;
    
    return (
      <AssessmentErrorHandler
        title="Could Not Load Shared Profile"
        description="We couldn't retrieve the personality analysis. This profile may not exist or has been removed."
        showRetry={true}
        errorDetails={errorDetails}
        onRetry={handleRetry}
      />
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
        <motion.div variants={itemVariants} className="text-center mb-8 shared-profile-header">
          <h1 className="text-3xl font-bold mb-2">Shared Personality Analysis</h1>
          <p className="text-muted-foreground">
            This is a shared view of someone's personality analysis from Who Am I?
          </p>
          <Button onClick={handleRetry} className="mt-4 flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Profile
          </Button>
        </motion.div>
        
        {/* Intelligence Profile Card */}
        {analysis.intelligence && (
          <IntelligenceProfileCard analysis={analysis} itemVariants={itemVariants} />
        )}
        
        {/* Top Traits */}
        {analysis.traits && analysis.traits.length > 0 && (
          <motion.div variants={itemVariants}>
            <TraitsCard analysis={analysis} itemVariants={itemVariants} />
          </motion.div>
        )}
        
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
