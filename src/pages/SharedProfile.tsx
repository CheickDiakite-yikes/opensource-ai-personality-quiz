import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { PersonalityAnalysis } from "@/utils/types";
import { useAnalysisById } from "@/hooks/aiAnalysis/useAnalysisById";
import IntelligenceProfileCard from "@/components/profile/IntelligenceProfileCard";
import ProfileStats from "@/components/profile/ProfileStats";
import TraitsCard from "@/components/profile/TraitsCard";
import { useIsMobile, useViewport } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RefreshCw, Share2, ExternalLink } from "lucide-react";
import { AssessmentErrorHandler } from "@/components/assessment/AssessmentErrorHandler";
import TopTraitsTable from "@/components/profile/TopTraitsTable";

const SharedProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getAnalysisById, isLoadingAnalysisById } = useAnalysisById();
  const [analysis, setAnalysis] = useState<PersonalityAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const isMobile = useIsMobile();
  const { width } = useViewport();
  
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
      console.log(`Attempting to load shared analysis with ID: ${id}, attempt #${loadAttempts + 1}`);
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
    document.title = `Shared Personality Profile | Who Am I?`;
    fetchAnalysis();
    
    // Add meta tags for better sharing
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'View this shared personality analysis profile');
    }
    
    return () => {
      document.title = 'Who Am I?';
      if (metaDescription) {
        metaDescription.setAttribute('content', 'Discover your personality traits with AI-powered analysis');
      }
    };
  }, [id]);
  
  // Enhanced automatic retry mechanism with exponential backoff
  useEffect(() => {
    if (error && loadAttempts < 3 && !analysis) {
      const retryDelay = Math.pow(2, loadAttempts) * 1000; // 1s, 2s, 4s
      
      console.log(`Scheduling retry attempt ${loadAttempts + 1} for profile ID: ${id} in ${retryDelay}ms`);
      toast.loading(`Retrying profile load... (${loadAttempts + 1}/3)`);
      
      const timer = setTimeout(() => {
        setLoadAttempts(prev => prev + 1);
        console.log(`Executing retry attempt ${loadAttempts + 1} for profile ID: ${id}`);
        fetchAnalysis();
      }, retryDelay);
      
      return () => clearTimeout(timer);
    }
  }, [error, loadAttempts, analysis, id]);
  
  const handleRetry = () => {
    setLoadAttempts(0);
    fetchAnalysis();
    toast.loading("Retrying profile load...");
  };
  
  const handleShareProfile = () => {
    if (!analysis) return;
    
    const shareUrl = `${window.location.origin}/shared/${id}`;
    
    if (navigator.share) {
      navigator.share({
        title: "Personality Analysis - Who Am I?",
        text: `Check out this personality analysis from Who Am I? Top trait: ${analysis.traits?.[0]?.trait || "Personality Analysis"}`,
        url: shareUrl,
      }).catch(err => {
        console.error("Error sharing:", err);
        copyToClipboard(shareUrl);
      });
    } else {
      copyToClipboard(shareUrl);
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Link copied to clipboard!");
    }).catch(err => {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy link");
      
      // Fallback for iOS
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        toast.success("Link copied to clipboard!");
      } catch (err) {
        toast.error("Failed to copy link - try manually copying the URL");
      }
      document.body.removeChild(textArea);
    });
  };
  
  if (loading || isLoadingAnalysisById) {
    return (
      <div className="container py-6 md:py-16 text-center">
        <div className="animate-pulse space-y-4 md:space-y-6">
          <div className="h-8 md:h-12 bg-primary/10 rounded-md max-w-md mx-auto"></div>
          <div className="h-48 md:h-64 bg-primary/5 rounded-lg max-w-4xl mx-auto"></div>
          <div className="h-48 md:h-64 bg-primary/5 rounded-lg max-w-4xl mx-auto"></div>
        </div>
        <p className="mt-4 text-muted-foreground">Loading shared profile...</p>
      </div>
    );
  }
  
  if (error || !analysis) {
    const errorDetails = `Profile ID: ${id || "None"}\nAttempts: ${loadAttempts}\nError: ${error || "No data returned"}\nUser Agent: ${navigator.userAgent}`;
    
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
  
  // Use a more specific check for very small screens
  const isVerySmallScreen = width < 380;
  
  return (
    <div className={`container ${isMobile ? 'py-4 px-2' : 'py-16'}`}>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6 md:space-y-8 max-w-4xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-4 md:mb-8 shared-profile-header p-4 md:p-6">
          <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold mb-2`}>Shared Personality Analysis</h1>
          <p className="text-muted-foreground mb-4">
            This is a shared view of someone's personality analysis from Who Am I?
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
            <Button onClick={handleRetry} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button onClick={handleShareProfile} variant="outline" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Share This Profile
            </Button>
          </div>
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
        
        {/* Additional Traits Table (showing more traits) */}
        {analysis.traits && analysis.traits.length > 5 && (
          <motion.div variants={itemVariants} className="bg-card p-4 md:p-6 rounded-lg shadow-sm">
            <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold mb-4`}>All Personality Traits</h2>
            <TopTraitsTable traits={analysis.traits} />
          </motion.div>
        )}
        
        {/* Profile Stats */}
        <motion.div variants={itemVariants} className="bg-card p-4 md:p-6 rounded-lg shadow-sm">
          <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold mb-4`}>Profile Statistics</h2>
          <ProfileStats analysis={analysis} />
        </motion.div>
        
        <motion.div variants={itemVariants} className="text-center text-sm text-muted-foreground pt-2 pb-8">
          <p>Want to discover your own personality traits?</p>
          <a href="/" className="text-primary hover:underline flex items-center justify-center gap-1">
            Take the assessment at Who Am I? <ExternalLink className="h-3 w-3" />
          </a>
        </motion.div>
        
        {/* Debug info visible only in development mode */}
        {import.meta.env.DEV && (
          <div className="text-xs text-muted-foreground border-t pt-2 mt-4">
            <p>Debug: Profile ID: {id}</p>
            <p>Debug: Load Attempts: {loadAttempts}</p>
            <p>Debug: Is Mobile: {isMobile ? 'Yes' : 'No'}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SharedProfile;
