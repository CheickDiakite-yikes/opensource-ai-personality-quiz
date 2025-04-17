
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Sparkles, Share2, History } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { AnalysisData, toJsonObject } from "../utils/analysis/types";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  // Helper function to validate or generate a valid UUID
  const ensureValidUUID = (id: string): string => {
    try {
      // Try to validate the UUID format first
      const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (regex.test(id)) {
        return id;
      }
      
      // If not a valid UUID, generate a new one
      return uuidv4();
    } catch (error) {
      // If any error occurs, generate a new UUID
      return uuidv4();
    }
  };

  const handleSaveToSupabase = async () => {
    if (!analysis) {
      toast.error("No analysis data to save");
      return;
    }

    setIsSaving(true);

    try {
      if (user) {
        // Store the analysis in Supabase using the new deep_insight_analyses table
        // Ensure we have a valid UUID
        const analysisId = ensureValidUUID(analysis.id);
        
        // Convert full analysis to JSON-compatible object
        const jsonAnalysis = toJsonObject(analysis);
        
        // Prepare analysis data in the format required by the database
        const analysisData = {
          id: analysisId,
          user_id: user.id,
          title: `Deep Insight Analysis - ${new Date().toLocaleDateString()}`,
          overview: analysis.overview,
          intelligence_score: Math.round(Number(analysis.intelligenceScore) || 0),
          emotional_intelligence_score: Math.round(Number(analysis.emotionalIntelligenceScore) || 0),
          // Specialized Deep Insight fields
          response_patterns: jsonAnalysis.responsePatterns,
          core_traits: jsonAnalysis.coreTraits,
          cognitive_patterning: jsonAnalysis.cognitivePatterning,
          emotional_architecture: jsonAnalysis.emotionalArchitecture,
          interpersonal_dynamics: jsonAnalysis.interpersonalDynamics,
          growth_potential: jsonAnalysis.growthPotential,
          // Store raw responses for future reference
          raw_responses: analysis.rawResponses || null,
          // Store complete analysis for easy retrieval
          complete_analysis: jsonAnalysis
        };

        // Check if the analysis already exists in our new table
        const { data: existingData } = await supabase
          .from('deep_insight_analyses')
          .select('id')
          .eq('id', analysisId)
          .maybeSingle();

        if (existingData) {
          // Update existing analysis
          const { error } = await supabase
            .from('deep_insight_analyses')
            .update(analysisData)
            .eq('id', analysisId);

          if (error) {
            throw new Error(`Failed to update analysis: ${error.message}`);
          }
          
          toast.success("Analysis updated successfully");
        } else {
          // Insert new analysis
          const { error } = await supabase
            .from('deep_insight_analyses')
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

  const viewHistory = () => {
    navigate("/deep-insight/history");
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

      <Button 
        variant="ghost" 
        className="flex items-center gap-2"
        onClick={viewHistory}
      >
        <History className="h-4 w-4" />
        View History
      </Button>
    </motion.div>
  );
};
