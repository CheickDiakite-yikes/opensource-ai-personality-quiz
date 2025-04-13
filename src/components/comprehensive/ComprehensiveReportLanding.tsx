
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AlertTriangle, FileChart, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const ComprehensiveReportLanding: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [latestAnalysisId, setLatestAnalysisId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestAnalysis = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Get the user's latest comprehensive analysis
        const { data, error } = await supabase
          .from('comprehensive_analyses')
          .select('id')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (error) throw new Error(error.message);
        
        if (data && data.length > 0) {
          setLatestAnalysisId(data[0].id);
        }
      } catch (err) {
        console.error("Error fetching latest comprehensive analysis:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        toast.error("Failed to find your comprehensive reports");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestAnalysis();
  }, [user]);

  const handleViewReport = () => {
    if (latestAnalysisId) {
      navigate(`/comprehensive-report/${latestAnalysisId}`);
    }
  };

  const handleTakeAssessment = () => {
    navigate("/comprehensive-assessment");
  };

  if (isLoading) {
    return (
      <div className="container py-8 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Comprehensive Report</h1>
        <Card className="p-6 max-w-3xl mx-auto">
          <div className="space-y-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-12 w-40 mx-auto mt-4" />
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Comprehensive Report</h1>
        <Card className="p-6 max-w-3xl mx-auto text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Reports</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Comprehensive Report</h1>
      
      {latestAnalysisId ? (
        <Card className="p-6 md:p-8 max-w-3xl mx-auto text-center">
          <FileChart className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Your Comprehensive Analysis is Ready</h2>
          <p className="text-muted-foreground mb-6">
            View your detailed personality analysis based on the 100-question comprehensive assessment.
          </p>
          <Button size="lg" onClick={handleViewReport} className="gap-2">
            View Full Report <ArrowRight className="h-4 w-4" />
          </Button>
        </Card>
      ) : (
        <Card className="p-6 md:p-8 max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-2">No Comprehensive Report Yet</h2>
          <p className="text-muted-foreground mb-6">
            Complete the 100-question comprehensive assessment to receive your detailed personality analysis.
          </p>
          <Button size="lg" onClick={handleTakeAssessment} className="gap-2">
            Take the Assessment <ArrowRight className="h-4 w-4" />
          </Button>
        </Card>
      )}
    </div>
  );
};

export default ComprehensiveReportLanding;
