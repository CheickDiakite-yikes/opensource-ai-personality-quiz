
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useAnalysisRefresh } from '@/hooks/useAnalysisRefresh';
import { useAIAnalysis } from '@/hooks/useAIAnalysis';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const FixAnalysisButton: React.FC = () => {
  const { forceAnalysisRefresh } = useAnalysisRefresh();
  const { refreshAnalysis, loadAllAnalysesFromSupabase } = useAIAnalysis();
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const navigate = useNavigate();
  
  const handleFix = async () => {
    setIsRefreshing(true);
    try {
      toast.info("Attempting to fix analysis display issues...");
      
      // First, try the direct Supabase approach
      const analyses = await forceAnalysisRefresh().catch(err => {
        console.error("Error in forceAnalysisRefresh:", err);
        return null;
      });
      
      if (!analyses || analyses.length === 0) {
        // Try the loadAllAnalysesFromSupabase approach as fallback
        const allAnalyses = await loadAllAnalysesFromSupabase().catch(err => {
          console.error("Error in loadAllAnalysesFromSupabase:", err);
          return null;
        });
        
        if (!allAnalyses || allAnalyses.length === 0) {
          toast.error("Could not find any analyses", {
            description: "Try taking a new assessment",
            duration: 5000
          });
          navigate("/assessment");
          return;
        }
        
        // Use the found analyses
        await refreshAnalysis();
        
        // Navigate to the most recent analysis
        navigate(`/report/${allAnalyses[0].id}`);
        toast.success("Found your most recent analysis", {
          description: "You can now view your results"
        });
        return;
      }
      
      // Then refresh through the normal mechanism
      await loadAllAnalysesFromSupabase().catch(err => {
        console.error("Error loading all analyses:", err);
      });
      
      await refreshAnalysis().catch(err => {
        console.error("Error refreshing analysis:", err);
      });
      
      // Log details about the fetched analyses for debugging
      console.log(`Fetched ${analyses.length} analyses`);
      analyses.forEach((analysis, index) => {
        if (analysis && analysis.traits) {
          console.log(`Analysis ${index + 1}: ID: ${analysis.id}, Traits: ${analysis.traits?.length || 0}`);
        } else {
          console.log(`Analysis ${index + 1}: ID: ${analysis.id}, Traits: Missing or invalid`);
        }
      });
      
      // Wait a moment to ensure data is fully loaded
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Find an analysis with sufficient traits (at least 2)
      const completeAnalysis = analyses.find(a => a && a.traits && Array.isArray(a.traits) && a.traits.length >= 8);
      const partialAnalysis = analyses.find(a => a && a.traits && Array.isArray(a.traits) && a.traits.length >= 2);
      
      if (completeAnalysis) {
        console.log(`Found complete analysis with ${completeAnalysis.traits?.length} traits, navigating to it`);
        navigate(`/report/${completeAnalysis.id}`);
        toast.success("Found a complete analysis", {
          description: "Displaying your best analysis results"
        });
      } else if (partialAnalysis) {
        console.log(`Found partial analysis with ${partialAnalysis.traits?.length} traits, navigating to it`);
        navigate(`/report/${partialAnalysis.id}`);
        toast.info("Found a partial analysis", {
          description: "Some data may be incomplete but viewable"
        });
      } else if (analyses.length > 0) {
        // Navigate to the most recent analysis
        navigate(`/report/${analyses[0].id}`);
        toast.warning("Your analyses all appear to be incomplete", {
          description: "Consider retaking the assessment with more detailed answers"
        });
      } else {
        toast.error("No valid analyses found", {
          description: "Try taking a new assessment",
          duration: 5000
        });
        navigate("/assessment");
      }
    } catch (error) {
      console.error("Error fixing analyses:", error);
      toast.error("Failed to fix analysis", {
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
