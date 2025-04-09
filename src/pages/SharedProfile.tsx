
import React, { useEffect, useState, useRef } from "react";
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

const SharedProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getAnalysisById } = useAnalysisById();
  const [analysis, setAnalysis] = useState<PersonalityAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const isMobile = useIsMobile();
  const fetchStarted = useRef(false);
  const toastShown = useRef(false);
  
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
    // Prevent multiple fetches
    if (fetchStarted.current) return;
    fetchStarted.current = true;
    
    setLoading(true);
    setError(null);
    
    if (!id) {
      console.error("No profile ID provided in URL parameters");
      setLoading(false);
      setError("No profile ID provided");
      if (!toastShown.current) {
        toast.error("No profile ID provided");
        toastShown.current = true;
      }
      return;
    }
    
    try {
      console.log("Attempting to fetch shared analysis with ID:", id);
      
      // Get the analysis by ID without requiring login
      const fetchedAnalysis = await getAnalysisById(id);
      
      if (fetchedAnalysis) {
        console.log("Successfully fetched shared analysis:", fetchedAnalysis.id);
        console.log("Analysis overview length:", fetchedAnalysis.overview?.length || 0);
        console.log("Analysis traits count:", fetchedAnalysis.traits?.length || 0);
        
        setAnalysis(fetchedAnalysis);
        // Show success toast only once
        if (!toastShown.current) {
          toast.success("Profile loaded successfully");
          toastShown.current = true;
        }
      } else {
        console.error("No analysis found with ID:", id);
        setError("Could not load the shared profile");
        if (!toastShown.current) {
          toast.error("Could not load the shared profile");
          toastShown.current = true;
        }
      }
    } catch (error) {
      console.error("Error fetching shared analysis:", error);
      console.error("Error stack:", error instanceof Error ? error.stack : "No stack available");
      setError("Error loading the shared profile");
      if (!toastShown.current) {
        toast.error(`Error loading the shared profile: ${error instanceof Error ? error.message : "Unknown error"}`);
        toastShown.current = true;
      }
    } finally {
      setLoading(false);
      fetchStarted.current = false;
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchAnalysis();
    
    // Cleanup function to prevent memory leaks
    return () => {
      toastShown.current = false;
    };
  }, [id]);
  
  // Implement retry mechanism with exponential backoff
  useEffect(() => {
    if (error && loadAttempts < 2 && !analysis) {
      const retryDelay = Math.pow(2, loadAttempts) * 1000; // 1s, then 2s
      console.log(`Retrying fetch (attempt ${loadAttempts + 1}) in ${retryDelay}ms`);
      
      const timer = setTimeout(() => {
        fetchStarted.current = false; // Reset the flag so we can try again
        setLoadAttempts(prev => prev + 1);
        fetchAnalysis();
      }, retryDelay);
      
      return () => clearTimeout(timer);
    }
  }, [error, loadAttempts, analysis]);
  
  const handleRetry = () => {
    fetchStarted.current = false;
    setLoadAttempts(0);
    fetchAnalysis();
  };
  
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
  
  if (error || !analysis) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
        <p className="text-muted-foreground mb-6">
          {error || "The shared profile you're looking for doesn't exist or may have been removed."}
        </p>
        <Button onClick={handleRetry} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
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
        {/* Add social media meta tags for sharing */}
        <div className="social-share-image">
          <img src="/lovable-uploads/9a629d86-fdd2-4f3f-90a2-10826eb575d7.png" alt="Personality analysis" />
        </div>
        
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8 shared-profile-header">
          <h1 className="text-3xl font-bold mb-2">Shared Personality Analysis</h1>
          <p className="text-muted-foreground">
            This is a shared view of someone's personality analysis from Who Am I?
          </p>
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
