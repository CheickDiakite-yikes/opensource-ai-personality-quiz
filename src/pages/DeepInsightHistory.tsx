
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { AnalysisData } from "@/features/deep-insight/utils/analysis/types";
import { AnalysisHistoryCard } from "@/features/deep-insight/components/AnalysisHistoryCard";
import { convertToPersonalityAnalysis } from "@/hooks/aiAnalysis/utils";

const DeepInsightHistory: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState<AnalysisData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAnalyses = async () => {
    if (!user) {
      toast.error("You must be logged in to view your history");
      navigate("/auth");
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("analyses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        // Convert to AnalysisData format
        const formattedAnalyses = data.map(item => {
          const analysis = convertToPersonalityAnalysis(item);
          return analysis as unknown as AnalysisData;
        }).filter(Boolean);
        
        setAnalyses(formattedAnalyses);
      }
    } catch (error) {
      console.error("Error fetching analyses:", error);
      toast.error("Failed to load your analysis history");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAnalyses();
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchAnalyses();
  }, [user]);

  return (
    <div className="container max-w-4xl mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={() => navigate("/deep-insight")} className="-ml-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Your Analysis History</h1>
      
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 bg-muted/50 animate-pulse rounded-md"></div>
          ))}
        </div>
      ) : analyses.length > 0 ? (
        <div className="space-y-4">
          {analyses.map((analysis) => (
            <AnalysisHistoryCard key={analysis.id} analysis={analysis} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/20 rounded-lg">
          <p className="text-muted-foreground mb-4">You don't have any saved analyses yet.</p>
          <Button onClick={() => navigate("/deep-insight/quiz")}>
            Take the Assessment
          </Button>
        </div>
      )}
    </div>
  );
};

export default DeepInsightHistory;
