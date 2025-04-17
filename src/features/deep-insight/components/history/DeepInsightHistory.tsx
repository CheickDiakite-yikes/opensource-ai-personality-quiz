import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ChevronRight, FileClock, RefreshCw } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAIAnalysis } from "@/hooks/useAIAnalysis";
import { PersonalityAnalysis } from "@/utils/types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface HistoryItem {
  id: string;
  title: string;
  date: Date;
  label?: string;
}

const DeepInsightHistory: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<"list" | "grid">("list");
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const { analysisHistory, getAnalysisHistory, forceFetchAllAnalyses } = useAIAnalysis();
  
  // Load history data
  useEffect(() => {
    loadHistory();
  }, []);
  
  // Function to load history that can be called on demand
  const loadHistory = async () => {
    setIsLoading(true);
    
    try {
      // Force refresh all analyses to ensure we have the complete history
      await forceFetchAllAnalyses();
      
      // Get the updated history
      const allAnalyses = getAnalysisHistory();
      console.log("All analyses found:", allAnalyses?.length || 0);
      
      if (allAnalyses && allAnalyses.length > 0) {
        console.log("Sample analysis:", allAnalyses[0]);
      }
      
      // Find Deep Insight analyses - now we're looking for analyses with traits
      // since responsePatterns might not always be present
      const deepInsightAnalyses = allAnalyses
        .filter((analysis: PersonalityAnalysis) => 
          analysis && 
          analysis.traits && 
          Array.isArray(analysis.traits) &&
          analysis.traits.length > 0
        )
        .map((analysis: PersonalityAnalysis): HistoryItem => {
          // Generate a title from the analysis data
          const primaryTrait = analysis.traits && analysis.traits.length > 0 
            ? analysis.traits[0].trait 
            : "Personality";
            
          // Try to get response pattern if available
          const primaryStyle = analysis.responsePatterns?.primaryChoice || "analysis";
          const date = new Date(analysis.createdAt);
          
          return {
            id: analysis.id,
            title: `Deep Insight - ${primaryTrait}`,
            date,
            label: getPrimaryTraitLabel(analysis)
          };
        });
          
      console.log(`Found ${deepInsightAnalyses.length} Deep Insight analyses`);
      setHistory(deepInsightAnalyses);
      
      if (deepInsightAnalyses.length === 0 && allAnalyses.length > 0) {
        toast.info("Found analyses but none match Deep Insight format", {
          description: "Try taking a Deep Insight assessment"
        });
      }
    } catch (error) {
      console.error("Error loading Deep Insight history:", error);
      toast.error("Could not load analysis history", {
        description: "Please try again later"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const navigateToResult = (analysisId: string) => {
    navigate(`/deep-insight/results/${analysisId}`);
  };
  
  // Helper function to get a label for the analysis
  const getPrimaryTraitLabel = (analysis: PersonalityAnalysis): string => {
    // First try to use responsePatterns if available
    if (analysis.responsePatterns?.primaryChoice) {
      const key = analysis.responsePatterns.primaryChoice;
      switch (key) {
        case 'a': return 'Analytical';
        case 'b': return 'Emotional';
        case 'c': return 'Practical';
        case 'd': return 'Creative';
        case 'e': return 'Cautious';
        case 'f': return 'Reflective';
        default: return key.charAt(0).toUpperCase() + key.slice(1);
      }
    }
    
    // Otherwise use the first trait
    if (analysis.traits && analysis.traits.length > 0) {
      return analysis.traits[0].trait;
    }
    
    return 'Analysis';
  };
  
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Past Deep Insight Analyses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-md animate-pulse">
                <div className="w-3/5 h-5 bg-muted rounded"></div>
                <div className="w-1/5 h-4 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (history.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Past Deep Insight Analyses</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => loadHistory()}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileClock className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-lg font-medium">No history found</p>
            <p className="text-muted-foreground">Complete a Deep Insight assessment to see your results history</p>
            <Button onClick={() => navigate('/deep-insight/quiz')} className="mt-4">
              Take Deep Insight Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Past Deep Insight Analyses</CardTitle>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => loadHistory()}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
          <Tabs value={view} onValueChange={(v) => setView(v as "list" | "grid")}>
            <TabsList className="grid w-[160px] grid-cols-2">
              <TabsTrigger value="list">List</TabsTrigger>
              <TabsTrigger value="grid">Grid</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {view === "list" ? (
          <div className="space-y-2">
            {history.map(item => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => navigateToResult(item.id)}
              >
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary/60" />
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(item.date, { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  {item.label && (
                    <span className="text-sm px-2 py-1 bg-primary/10 rounded mr-2">
                      {item.label}
                    </span>
                  )}
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {history.map(item => (
              <Card 
                key={item.id}
                className="hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => navigateToResult(item.id)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{item.title}</h3>
                    {item.label && (
                      <span className="text-xs px-2 py-1 bg-primary/10 rounded">
                        {item.label}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(item.date, { addSuffix: true })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeepInsightHistory;
