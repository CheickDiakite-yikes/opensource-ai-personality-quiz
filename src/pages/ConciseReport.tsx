
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useConciseInsightResults } from "@/features/concise-insight/hooks/useConciseInsightResults";
import { 
  fetchAllAnalysesByUserId,
  deleteAnalysisFromDatabase
} from "@/features/concise-insight/utils/analysisHelpers";
import { ReportDetails } from "@/features/concise-insight/components/ReportDetails";
import { AssessmentsList } from "@/features/concise-insight/components/AssessmentsList";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2, AlertTriangle } from "lucide-react";

// Loading component
const ResultsLoading = () => (
  <div className="container max-w-4xl py-12 px-4 flex flex-col items-center justify-center min-h-[400px]">
    <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
    <h2 className="text-2xl font-bold">Loading Analysis</h2>
    <p className="text-muted-foreground max-w-md text-center mt-2">
      Please wait while we retrieve your personality insights...
    </p>
  </div>
);

// Error component
const ResultsError = ({ error, onRetry }: { error: string, onRetry?: () => void }) => (
  <div className="container max-w-4xl py-12 px-4 flex flex-col items-center justify-center min-h-[400px]">
    <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
      <AlertTriangle className="text-destructive h-6 w-6" />
    </div>
    <h2 className="text-2xl font-bold">Analysis Error</h2>
    <p className="text-muted-foreground max-w-md text-center mt-2">
      {error || "There was an error retrieving your analysis. Please try again."}
    </p>
    {onRetry && (
      <button 
        className="mt-6 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        onClick={onRetry}
      >
        Try Again
      </button>
    )}
  </div>
);

// Main component
const ConciseReport: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { analysis, loading, error, saveAnalysis, refreshAnalysis } = useConciseInsightResults(id);
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [navigatingAfterDelete, setNavigatingAfterDelete] = useState(false);

  // Function to refresh data
  const refreshData = useCallback(() => {
    console.log("Triggering data refresh");
    setRefreshTrigger(prev => prev + 1);
    if (refreshAnalysis) {
      refreshAnalysis();
    }
  }, [refreshAnalysis]);

  // Handle navigation to a specific analysis 
  const handleSelectAnalysis = useCallback((analysisId: string) => {
    navigate(`/concise-report/${analysisId}`);
  }, [navigate]);

  // Handle manual refresh
  const handleManualRefresh = useCallback(() => {
    refreshData();
  }, [refreshData]);

  // Handle deletion of current analysis with improved error handling
  const handleDeleteCurrent = useCallback(async () => {
    if (!id || !user) return;
    
    if (!confirm("Are you sure you want to delete this analysis? This action cannot be undone.")) {
      return;
    }
    
    try {
      setIsDeleting(true);
      toast.loading("Deleting analysis...", { id: "delete-toast" });
      
      const success = await deleteAnalysisFromDatabase(id);
      
      if (success) {
        toast.success("Analysis deleted successfully", { id: "delete-toast" });
        setNavigatingAfterDelete(true);
        
        // Check if we have other analyses to navigate to
        const remainingAnalyses = await fetchAllAnalysesByUserId(user.id);
        
        if (remainingAnalyses && remainingAnalyses.length > 0) {
          // Navigate to the first available analysis
          const newId = remainingAnalyses[0].id;
          // Use replace to prevent going back to deleted analysis
          navigate(`/concise-report/${newId}`, { replace: true });
        } else {
          // No analyses left, go to the report list view
          navigate('/concise-report', { replace: true });
        }
      } else {
        toast.error("Failed to delete analysis", { id: "delete-toast" });
        throw new Error("Failed to delete analysis");
      }
    } catch (err) {
      console.error("Error deleting analysis:", err);
      toast.error("Failed to delete analysis", { id: "delete-toast" });
    } finally {
      setIsDeleting(false);
      setNavigatingAfterDelete(false);
    }
  }, [id, navigate, user]);

  // Clear error state if navigating after delete
  useEffect(() => {
    if (navigatingAfterDelete && error && error.includes("not found")) {
      // This is expected behavior after deletion, don't show an error
      console.log("Ignoring expected error after deletion");
    }
  }, [navigatingAfterDelete, error]);

  // If no assessment ID is provided, show the list of assessments
  if (!id) {
    return (
      <motion.div 
        className="container max-w-4xl py-8 px-4 md:px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        key={`list-view-${refreshTrigger}`}
      >
        <div className="flex flex-col gap-8">
          <header className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Concise Insight Reports</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Review your personality analyses and track your personal development over time
            </p>
          </header>
          
          <AssessmentsList onSelect={handleSelectAnalysis} />
        </div>
      </motion.div>
    );
  }
  
  if (loading) {
    return <ResultsLoading />;
  }
  
  if (isDeleting || navigatingAfterDelete) {
    return (
      <div className="container max-w-4xl py-12 px-4 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <h2 className="text-2xl font-bold">Deleting Analysis</h2>
        <p className="text-muted-foreground max-w-md text-center mt-2">
          Please wait while we delete this analysis...
        </p>
      </div>
    );
  }
  
  // Only show error if not in the process of navigating after delete
  if ((error && !navigatingAfterDelete) || !analysis) {
    return <ResultsError error={error || "No analysis data found"} onRetry={handleManualRefresh} />;
  }
  
  return (
    <motion.div 
      className="container max-w-4xl py-8 px-4 md:px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      key={`detail-view-${id}`}
    >
      <div className="mb-6 flex justify-between items-center">
        <button 
          onClick={() => navigate('/concise-report')}
          className="text-primary hover:underline flex items-center gap-1"
        >
          ← Back to Reports
        </button>
        <div className="flex gap-2">
          <button 
            onClick={handleDeleteCurrent}
            className="px-3 py-1 text-sm text-destructive hover:bg-destructive/10 rounded"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Report'}
          </button>
        </div>
      </div>
      
      <ReportDetails analysis={analysis} saveAnalysis={saveAnalysis} />
    </motion.div>
  );
};

export default ConciseReport;
