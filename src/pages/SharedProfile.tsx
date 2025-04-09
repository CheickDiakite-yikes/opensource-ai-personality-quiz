
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
import { RefreshCw, Share } from "lucide-react";
import { AssessmentErrorHandler } from "@/components/assessment/AssessmentErrorHandler";

const SharedProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getAnalysisById, isLoadingAnalysisById, analysisError } = useAnalysisById();
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
  
  const validateAnalysis = (data: PersonalityAnalysis | null): boolean => {
    if (!data) return false;
    
    // Check for essential properties
    if (!data.id || !data.traits || data.traits.length === 0) {
      console.log("SHARED PROFILE: Invalid analysis data - missing essential properties");
      return false;
    }
    
    return true;
  };
  
  const fetchAnalysis = async () => {
    // Prevent multiple fetches
    if (fetchStarted.current) return;
    fetchStarted.current = true;
    
    setLoading(true);
    setError(null);
    
    if (!id) {
      console.error("SHARED PROFILE: No profile ID provided in URL parameters");
      setLoading(false);
      setError("No profile ID provided");
      if (!toastShown.current) {
        toast.error("No profile ID provided");
        toastShown.current = true;
      }
      return;
    }
    
    try {
      console.log("SHARED PROFILE: Attempting to fetch shared analysis with ID:", id);
      
      // Get the analysis by ID without requiring login
      const fetchedAnalysis = await getAnalysisById(id);
      
      if (fetchedAnalysis && validateAnalysis(fetchedAnalysis)) {
        console.log("SHARED PROFILE: Successfully fetched valid analysis:", fetchedAnalysis.id);
        console.log("SHARED PROFILE: Analysis has", fetchedAnalysis.traits?.length || 0, "traits");
        
        setAnalysis(fetchedAnalysis);
        // Show success toast only once
        if (!toastShown.current) {
          toast.success("Profile loaded successfully");
          toastShown.current = true;
        }
      } else {
        console.error("SHARED PROFILE: Retrieved invalid or null analysis for ID:", id);
        setError(analysisError || "Could not load the shared profile data");
        if (!toastShown.current) {
          toast.error("Could not load the shared profile");
          toastShown.current = true;
        }
      }
    } catch (error) {
      console.error("SHARED PROFILE: Error fetching shared analysis:", error);
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
    console.log("SHARED PROFILE: Component mounted with ID:", id);
    fetchAnalysis();
    
    // Cleanup function to prevent memory leaks
    return () => {
      toastShown.current = false;
    };
  }, [id]);
  
  // Implement retry mechanism with exponential backoff
  useEffect(() => {
    if (error && loadAttempts < 3 && !analysis) {
      const retryDelay = Math.pow(2, loadAttempts) * 1000; // 1s, 2s, 4s
      console.log(`SHARED PROFILE: Retrying fetch (attempt ${loadAttempts + 1}) in ${retryDelay}ms`);
      
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
    toastShown.current = false;
    setLoadAttempts(0);
    fetchAnalysis();
    toast.loading("Retrying profile load...");
  };
  
  if (loading) {
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
    const errorDetails = `Profile ID: ${id || "None"}\nAttempts: ${loadAttempts}\nError: ${error || "No data returned"}\nAccess: Public`;
    
    return (
      <AssessmentErrorHandler
        title="Could Not Load Shared Profile"
        description="We couldn't retrieve the personality analysis. This profile may not exist or has been removed."
        showRetry={true}
        errorDetails={errorDetails}
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
        {/* Social media meta tags for sharing */}
        <div className="social-share-image">
          <img src="/lovable-uploads/9a629d86-fdd2-4f3f-90a2-10826eb575d7.png" alt="Personality analysis" />
        </div>
        
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
