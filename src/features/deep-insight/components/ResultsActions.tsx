
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Sparkles, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { AnalysisData } from "../utils/analysis/types";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

interface ResultsActionsProps {
  onSave: () => void;
  itemVariants: any;
  analysis: AnalysisData;
}

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
        // Store the analysis in Supabase
        const analysisId = analysis.id || `deep-insight-${uuidv4()}`;
        
        // Prepare analysis data in the format required by the database
        const analysisData = {
          id: analysisId,
          user_id: user.id,
          assessment_id: analysis.assessmentId || `assessment-${Date.now()}`,
          overview: analysis.overview,
          traits: analysis.traits || [],
          intelligence: analysis.intelligence || {},
          intelligence_score: analysis.intelligenceScore || 0,
          emotional_intelligence_score: analysis.emotionalIntelligenceScore || 0,
          cognitive_style: analysis.cognitiveStyle || {},
          value_system: analysis.valueSystem || [],
          motivators: analysis.motivators || [],
          inhibitors: analysis.inhibitors || [],
          weaknesses: analysis.weaknesses || [],
          growth_areas: analysis.growthAreas || [],
          relationship_patterns: analysis.relationshipPatterns || {},
          career_suggestions: analysis.careerSuggestions || [],
          learning_pathways: analysis.learningPathways || [],
          roadmap: analysis.roadmap || "",
          result: analysis,
          // New Deep Insight specific fields
          response_patterns: analysis.responsePatterns || {},
          core_traits: analysis.coreTraits || {},
          cognitive_patterning: analysis.cognitivePatterning || {},
          emotional_architecture: analysis.emotionalArchitecture || {},
          interpersonal_dynamics: analysis.interpersonalDynamics || {},
          growth_potential: analysis.growthPotential || {}
        };

        // Check if the analysis already exists
        const { data: existingData } = await supabase
          .from('analyses')
          .select('id')
          .eq('id', analysisId)
          .maybeSingle();

        if (existingData) {
          // Update existing analysis
          const { error } = await supabase
            .from('analyses')
            .update(analysisData)
            .eq('id', analysisId);

          if (error) {
            throw new Error(`Failed to update analysis: ${error.message}`);
          }
          
          toast.success("Analysis updated successfully");
        } else {
          // Insert new analysis
          const { error } = await supabase
            .from('analyses')
            .insert(analysisData);

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
