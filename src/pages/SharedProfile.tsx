
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { PersonalityAnalysis } from "@/utils/types";
import { useAIAnalysis } from "@/hooks/useAIAnalysis";
import IntelligenceProfileCard from "@/components/profile/IntelligenceProfileCard";
import ProfileStats from "@/components/profile/ProfileStats";
import TraitsCard from "@/components/profile/TraitsCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { Cat, CloudSun, Leaf, Bird } from "lucide-react";

const SharedProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getAnalysisById } = useAIAnalysis();
  const [analysis, setAnalysis] = useState<PersonalityAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  
  // Floating items for Ghibli effect
  const floatingItems = [
    { element: <CloudSun className="text-sky-400" size={24} />, className: "top-[10%] right-[5%] animate-float" },
    { element: <Leaf className="text-green-500" size={20} />, className: "top-[25%] left-[8%] animate-float-x" },
    { element: <Bird className="text-amber-500" size={18} />, className: "bottom-[25%] right-[10%] animate-sway" },
    { element: <Cat className="text-orange-500" size={22} />, className: "top-[15%] left-[15%] animate-soft-bounce" },
  ];
  
  useEffect(() => {
    const fetchAnalysis = async () => {
      // Prevent multiple fetches
      if (fetchStarted.current) return;
      fetchStarted.current = true;
      
      setLoading(true);
      setError(null);
      
      if (!id) {
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
          console.log("Successfully fetched shared analysis:", fetchedAnalysis);
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
        setError("Error loading the shared profile");
        if (!toastShown.current) {
          toast.error("Error loading the shared profile");
          toastShown.current = true;
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalysis();
    
    // Cleanup function to prevent memory leaks
    return () => {
      fetchStarted.current = false;
      toastShown.current = false;
    };
  }, [id, getAnalysisById]);
  
  if (loading) {
    return (
      <div className="container py-16 text-center forest-background min-h-screen">
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-amber-600/40 rounded-full max-w-md mx-auto"></div>
          <div className="h-64 bg-amber-100/50 rounded-2xl max-w-4xl mx-auto"></div>
          <div className="h-64 bg-amber-100/50 rounded-2xl max-w-4xl mx-auto"></div>
        </div>
      </div>
    );
  }
  
  if (error || !analysis) {
    return (
      <div className="container py-16 text-center forest-background min-h-screen">
        <div className="ghibli-card p-8 max-w-lg mx-auto">
          <h1 className="text-2xl font-bold mb-4 font-indie text-amber-800">Profile Not Found</h1>
          <p className="text-amber-700 mb-6">
            {error || "The shared profile you're looking for doesn't exist or may have been removed."}
          </p>
          <a href="/" className="ghibli-button inline-block">Return Home</a>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`container ${isMobile ? 'py-6' : 'py-16'} forest-background min-h-screen relative`}>
      {/* Clouds */}
      <div className="clouds">
        <div className="cloud cloud-1"></div>
        <div className="cloud cloud-2"></div>
        <div className="cloud cloud-3"></div>
      </div>
      
      {/* Floating elements */}
      {floatingItems.map((item, index) => (
        <div
          key={index}
          className={`absolute z-10 ${item.className}`}
          style={{ animationDelay: `${index * 0.7}s` }}
        >
          {item.element}
        </div>
      ))}
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8 max-w-4xl mx-auto relative z-10"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="ghibli-banner mx-auto inline-block mb-4">
            <h1 className="text-xl md:text-2xl font-indie">Shared Personality Analysis</h1>
          </div>
          <p className="text-amber-800 font-medium">
            This is a shared view of someone's personality analysis from Who Am I?
          </p>
        </motion.div>
        
        {/* Intelligence Profile Card */}
        {analysis.intelligence && (
          <motion.div variants={itemVariants} className="ghibli-card p-6">
            <h2 className="text-xl font-bold mb-4 font-indie text-amber-800">Intelligence Profile</h2>
            <IntelligenceProfileCard analysis={analysis} itemVariants={itemVariants} />
          </motion.div>
        )}
        
        {/* Top Traits */}
        {analysis.traits && analysis.traits.length > 0 && (
          <motion.div variants={itemVariants} className="ghibli-card p-6">
            <h2 className="text-xl font-bold mb-4 font-indie text-amber-800">Top Traits</h2>
            <TraitsCard analysis={analysis} itemVariants={itemVariants} />
          </motion.div>
        )}
        
        {/* Profile Stats */}
        <motion.div variants={itemVariants} className="ghibli-card p-6">
          <h2 className="text-xl font-bold mb-4 font-indie text-amber-800">Profile Statistics</h2>
          <ProfileStats analysis={analysis} />
        </motion.div>
        
        <motion.div variants={itemVariants} className="text-center text-amber-800">
          <p>Want to discover your own personality traits?</p>
          <a href="/" className="text-amber-600 hover:underline hover:text-amber-700 font-medium">Take the assessment at Who Am I?</a>
        </motion.div>
        
        {/* Grass at bottom */}
        <div className="grass absolute bottom-0 left-0 right-0"></div>
        <div className="flowers absolute bottom-0 left-0 right-0">
          <div className="flower"></div>
          <div className="flower"></div>
          <div className="flower"></div>
          <div className="flower"></div>
          <div className="flower"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default SharedProfile;
