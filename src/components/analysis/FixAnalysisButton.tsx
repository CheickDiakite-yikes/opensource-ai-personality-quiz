
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
      const analyses = await forceAnalysisRefresh();
      
      if (analyses && analyses.length > 0) {
        // Then refresh through the normal mechanism
        await loadAllAnalysesFromSupabase();
        await refreshAnalysis();
        
        // Navigate to the most recent analysis
        navigate(`/report/${analyses[0].id}`);
      } else {
        toast.error("No analyses found to fix");
      }
    } catch (error) {
      console.error("Error fixing analyses:", error);
      toast.error("Failed to fix analysis", {
        description: "Please try refreshing the page or completing a new assessment"
      });
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
