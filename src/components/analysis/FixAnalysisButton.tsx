
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useAnalysisRefresh } from '@/hooks/useAnalysisRefresh';
import { useAIAnalysis } from '@/hooks/useAIAnalysis';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const FixAnalysisButton: React.FC = () => {
  const { forceAnalysisRefresh } = useAnalysisRefresh();
  const { refreshAnalysis, loadAllAnalysesFromSupabase, forceFetchAllAnalyses } = useAIAnalysis();
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const navigate = useNavigate();
  
  const handleFix = async () => {
    setIsRefreshing(true);
    try {
      toast.info("Attempting to fix analysis display issues...", { id: "fix-analysis" });
      
      // Try all available methods to fetch analyses with enhanced error handling
      console.log("Starting comprehensive analysis recovery process");
      
      // First try the most direct method - force fetching all analyses
      const analyses = await forceFetchAllAnalyses().catch(err => {
        console.error("Error in forceFetchAllAnalyses:", err);
        return null;
      });
      
      // If that didn't work, try the direct Supabase approach
      if (!analyses || analyses.length === 0) {
        console.log("First approach failed, trying forceAnalysisRefresh");
        const directAnalyses = await forceAnalysisRefresh().catch(err => {
          console.error("Error in forceAnalysisRefresh:", err);
          return null;
        });
        
        if (!directAnalyses || directAnalyses.length === 0) {
          console.log("Second approach failed, trying loadAllAnalysesFromSupabase");
          // Try the loadAllAnalysesFromSupabase approach as fallback
          const allAnalyses = await loadAllAnalysesFromSupabase().catch(err => {
            console.error("Error in loadAllAnalysesFromSupabase:", err);
            return null;
          });
          
          if (!allAnalyses || allAnalyses.length === 0) {
            toast.error("Could not find any analyses", {
              id: "fix-analysis",
              description: "Try taking a new assessment",
              duration: 5000
            });
            navigate("/assessment");
            return;
          }
          
          console.log(`Found ${allAnalyses.length} analyses using loadAllAnalysesFromSupabase`);
          // Use the found analyses
          await refreshAnalysis();
          
          // Navigate to the most recent analysis
          navigate(`/report/${allAnalyses[0].id}`);
          toast.success("Found your most recent analysis", {
            id: "fix-analysis",
            description: "You can now view your results"
          });
          return;
        }
        
        console.log(`Found ${directAnalyses.length} analyses using forceAnalysisRefresh`);
        
        // Find an analysis with sufficient traits
        const completeAnalysis = directAnalyses.find(a => a && a.traits && Array.isArray(a.traits) && a.traits.length >= 8);
        
        if (completeAnalysis) {
          console.log(`Found complete analysis with ${completeAnalysis.traits?.length} traits, navigating to it`);
          navigate(`/report/${completeAnalysis.id}`);
          toast.success("Found a complete analysis", {
            id: "fix-analysis",
            description: "Displaying your best analysis results"
          });
          return;
        } else if (directAnalyses.length > 0) {
          // Navigate to the most recent analysis
          navigate(`/report/${directAnalyses[0].id}`);
          toast.info("Found an analysis that may be incomplete", {
            id: "fix-analysis",
            description: "Showing the best available results"
          });
          return;
        }
      }
      
      console.log(`Found ${analyses?.length || 0} analyses using forceFetchAllAnalyses`);
      
      // Find the best analysis from all analyses
      if (analyses && analyses.length > 0) {
        // Find an analysis with sufficient traits
        const bestAnalysis = analyses.find(a => a && a.traits && Array.isArray(a.traits) && a.traits.length >= 8);
        
        if (bestAnalysis) {
          console.log(`Found best analysis with ${bestAnalysis.traits?.length} traits, navigating to it`);
          navigate(`/report/${bestAnalysis.id}`);
          toast.success("Found a complete analysis", {
            id: "fix-analysis",
            description: "Displaying your best analysis results"
          });
        } else {
          // Just use the first one
          navigate(`/report/${analyses[0].id}`);
          toast.info("Found an analysis that may be incomplete", {
            id: "fix-analysis",
            description: "Showing the best available results"
          });
        }
      } else {
        throw new Error("Could not find any valid analyses");
      }
    } catch (error) {
      console.error("Error fixing analyses:", error);
      toast.error("Failed to fix analysis", {
        id: "fix-analysis",
        description: "Please try refreshing the page or completing a new assessment"
      });
      // After 3 seconds, redirect to the assessment page
      setTimeout(() => {
        navigate("/assessment");
      }, 3000);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleFix} 
      disabled={isRefreshing} 
      className="flex items-center gap-2"
    >
      <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
      {isRefreshing ? 'Fixing...' : 'Fix Analysis Display'}
    </Button>
  );
};
