
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Calendar, History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAIAnalysis } from "@/hooks/useAIAnalysis";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { toast } from "sonner";

const ReportHeader: React.FC = () => {
  const { analysis, getAnalysisHistory, setCurrentAnalysis } = useAIAnalysis();
  const navigate = useNavigate();
  const [historyOpen, setHistoryOpen] = useState(false);
  
  const handleDownload = () => {
    if (!analysis) return;
    
    try {
      // Create a formatted version of the analysis for download
      const formattedAnalysis = {
        overview: analysis.overview,
        traits: analysis.traits.map(trait => ({
          trait: trait.trait,
          score: trait.score,
          description: trait.description,
          strengths: trait.strengths,
          challenges: trait.challenges,
          growthSuggestions: trait.growthSuggestions
        })),
        intelligence: analysis.intelligence,
        cognitiveStyle: analysis.cognitiveStyle,
        valueSystem: analysis.valueSystem,
        motivators: analysis.motivators,
        inhibitors: analysis.inhibitors,
        weaknesses: analysis.weaknesses,
        growthAreas: analysis.growthAreas,
        relationshipPatterns: analysis.relationshipPatterns,
        careerSuggestions: analysis.careerSuggestions,
        roadmap: analysis.roadmap,
        learningPathways: analysis.learningPathways,
        scores: {
          intelligence: analysis.intelligenceScore,
          emotionalIntelligence: analysis.emotionalIntelligenceScore
        },
        generatedAt: format(analysis.createdAt, 'PPP')
      };
      
      // Convert to JSON string
      const jsonStr = JSON.stringify(formattedAnalysis, null, 2);
      
      // Create a Blob with the JSON data
      const blob = new Blob([jsonStr], { type: 'application/json' });
      
      // Create a temporary download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `personality-analysis-${format(new Date(), 'yyyy-MM-dd')}.json`;
      
      // Trigger the download
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Report downloaded successfully!");
    } catch (error) {
      console.error("Error downloading report:", error);
      toast.error("Failed to download report. Please try again.");
    }
  };
  
  const handleSelectHistory = (analysisId: string) => {
    if (setCurrentAnalysis(analysisId)) {
      toast.success("Loaded report from history");
      setHistoryOpen(false);
    } else {
      toast.error("Failed to load report");
    }
  };
  
  const historyItems = getAnalysisHistory();
  
  return (
    <div className="flex justify-between items-start mb-8 flex-col md:flex-row">
      <div>
        <h1 className="text-3xl font-bold">Your Analysis Report</h1>
        <p className="text-muted-foreground mt-2">
          Based on your assessment responses
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
        <Popover open={historyOpen} onOpenChange={setHistoryOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center">
              <History className="h-4 w-4 mr-2" /> History
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <h3 className="font-medium">Previous Analyses</h3>
              {historyItems.length > 0 ? (
                <div className="max-h-60 overflow-y-auto">
                  {historyItems.map((item, index) => (
                    <button
                      key={item.id || index}
                      onClick={() => handleSelectHistory(item.id || '')}
                      className="w-full text-left p-2 hover:bg-muted rounded flex items-center justify-between group"
                    >
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          {item.createdAt && format(new Date(item.createdAt), 'PPP')}
                        </span>
                      </div>
                      <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                        View
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No previous analyses found
                </p>
              )}
            </div>
          </PopoverContent>
        </Popover>
        <Button 
          variant="outline" 
          className="flex items-center" 
          onClick={handleDownload}
        >
          <Download className="h-4 w-4 mr-2" /> Download Report
        </Button>
      </div>
    </div>
  );
};

export default ReportHeader;
