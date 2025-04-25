
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Sparkles, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { AnalysisData } from "../utils/analysis/types";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { Json } from "@/utils/types";
import { toJsonObject } from "@/hooks/aiAnalysis/utils";

interface ResultsActionsProps {
  onSave: () => void;
  itemVariants: any;
  analysis: AnalysisData;
}

// Prepare typed analysis data for database insertion
const prepareAnalysisData = (analysis: AnalysisData, userId: string) => {
  const analysisId = analysis.id || `deep-insight-${uuidv4()}`;
  
  // Convert all complex objects to Json type
  return {
    id: analysisId,
    user_id: userId,
    assessment_id: analysis.assessmentId || `assessment-${Date.now()}`,
    overview: analysis.overview || "",
    traits: toJsonObject(analysis.traits || []),
    intelligence: toJsonObject(analysis.intelligence || {}),
    intelligence_score: analysis.intelligenceScore || 0,
    emotional_intelligence_score: analysis.emotionalIntelligenceScore || 0,
    cognitive_style: toJsonObject(analysis.cognitiveStyle || {}),
    value_system: toJsonObject(analysis.valueSystem || []),
    motivators: toJsonObject(analysis.motivators || []),
    inhibitors: toJsonObject(analysis.inhibitors || []),
    weaknesses: toJsonObject(analysis.weaknesses || []),
    growth_areas: toJsonObject(analysis.growthAreas || []),
    relationship_patterns: toJsonObject(analysis.relationshipPatterns || {}),
    career_suggestions: toJsonObject(analysis.careerSuggestions || []),
    learning_pathways: toJsonObject(analysis.learningPathways || []),
    roadmap: analysis.roadmap || "",
    result: toJsonObject(analysis),
    // Deep Insight specific fields
    response_patterns: toJsonObject(analysis.responsePatterns || {}),
    core_traits: toJsonObject(analysis.coreTraits || {}),
    cognitive_patterning: toJsonObject(analysis.cognitivePatterning || {}),
    emotional_architecture: toJsonObject(analysis.emotionalArchitecture || {}),
    interpersonal_dynamics: toJsonObject(analysis.interpersonalDynamics || {}),
    growth_potential: toJsonObject(analysis.growthPotential || {})
  };
};

export const ResultsActions: React.FC<ResultsActionsProps> = ({ 
  onSave, 
  itemVariants,
  analysis 
}) => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveToSupabase = async () => {
    if (!analysis) {
      toast.error("No analysis data to save");
      return;
    }

    setIsSaving(true);

    try {
      if (user) {
        // Prepare analysis data in the format required by the database
        const analysisData = prepareAnalysisData(analysis, user.id);
        
        // Check if the analysis already exists
        const { data: existingData } = await supabase
          .from('analyses')
          .select('id')
          .eq('id', analysisData.id)
          .maybeSingle();

        if (existingData) {
          // Update existing analysis
          const { error } = await supabase
            .from('analyses')
            .update(analysisData)
            .eq('id', analysisData.id);

          if (error) {
            throw new Error(`Failed to update analysis: ${error.message}`);
          }
          
          toast.success("Analysis updated successfully");
        } else {
          // Insert new analysis
          const { error } = await supabase
            .from('analyses')
            .insert([analysisData]); // Changed to array to match expected type

          if (error) {
            throw new Error(`Failed to save analysis: ${error.message}`);
          }
          
          toast.success("Analysis saved successfully");
        }

        // Call the original onSave callback
        onSave();
        console.log("Analysis saved to Supabase for user:", user.id);
      } else {
        // For non-authenticated users, just use the local storage
        toast.info("Saving analysis to local storage. Sign in to save to your account.");
        onSave();
      }
    } catch (error) {
      console.error("Error saving analysis:", error);
      toast.error("Failed to save analysis", { 
        description: error instanceof Error ? error.message : "An unknown error occurred" 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = () => {
    // In a real implementation, this would open a sharing dialog
    // For now, we'll just show a toast
    toast.info("Sharing functionality will be available soon!");
  };

  const handleDownload = () => {
    // In a real implementation, this would generate and download a PDF
    // For now, we'll just show a toast
    toast.info("Download functionality will be available soon!");
  };

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      custom={6}
      className="flex flex-wrap justify-center gap-4"
    >
      <Button 
        className="flex items-center gap-2" 
        onClick={handleSaveToSupabase}
        disabled={isSaving}
      >
        <Sparkles className="h-4 w-4" />
        {isSaving ? "Saving..." : "Save This Analysis"}
      </Button>

      <Button 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={handleShare}
      >
        <Share2 className="h-4 w-4" />
        Share Results
      </Button>

      <Button 
        variant="secondary" 
        className="flex items-center gap-2"
        onClick={handleDownload}
      >
        <Download className="h-4 w-4" />
        Download PDF
      </Button>
    </motion.div>
  );
};
