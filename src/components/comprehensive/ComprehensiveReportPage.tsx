
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { ComprehensiveAnalysis } from "@/utils/types";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { formatTraitScore } from "@/utils/formatUtils";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const ComprehensiveReportPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState<ComprehensiveAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch comprehensive analysis
  useEffect(() => {
    async function fetchComprehensiveAnalysis() {
      if (!id) {
        setIsLoading(false);
        setError("No analysis ID provided");
        return;
      }

      try {
        setIsLoading(true);
        
        // Call the edge function to get the comprehensive analysis
        const { data, error: functionError } = await supabase.functions.invoke(
          "get-comprehensive-analysis",
          {
            body: { id },
          }
        );

        if (functionError) {
          throw new Error(`Edge function error: ${functionError.message}`);
        }

        if (!data) {
          throw new Error("No analysis data returned");
        }

        console.log("Comprehensive analysis data:", data);
        setAnalysis(data as ComprehensiveAnalysis);
      } catch (err) {
        console.error("Error fetching comprehensive analysis:", err);
        setError(err instanceof Error ? err.message : "Failed to load analysis");
        toast.error("Failed to load analysis", {
          description: "There was a problem retrieving your comprehensive analysis"
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchComprehensiveAnalysis();
  }, [id]);

  // Loading state
  if (isLoading) {
    return (
      <div className="container py-6 md:py-10 px-4 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Comprehensive Report</h1>
          <Skeleton className="h-6 w-40 mx-auto" />
        </div>
        
        <Card className="p-8">
          <div className="space-y-4 max-w-3xl mx-auto">
            <Skeleton className="h-8 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            
            <div className="py-4">
              <Skeleton className="h-36 w-full rounded-md" />
            </div>
            
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/6" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container py-6 md:py-10 px-4 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Comprehensive Report</h1>
          <p className="text-muted-foreground">
            ID: {id || "No report ID provided"}
          </p>
        </div>
        
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-destructive" />
            <h2 className="text-xl font-semibold">Unable to Load Report</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              {error}
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // No analysis state - show coming soon placeholder
  if (!analysis) {
    return (
      <div className="container py-6 md:py-10 px-4 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Comprehensive Report</h1>
          <p className="text-muted-foreground">
            ID: {id || "No report ID provided"}
          </p>
        </div>
        
        <Card className="p-8 text-center">
          <h2 className="text-xl mb-4">Coming Soon</h2>
          <p className="text-muted-foreground mb-6">
            The comprehensive report feature is currently under development.
            This will provide a more detailed analysis based on our 100-question assessment.
          </p>
          
          <div className="space-y-4 max-w-md mx-auto">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            
            <div className="py-4">
              <Skeleton className="h-24 w-full rounded-md" />
            </div>
            
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/6" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </Card>
      </div>
    );
  }

  // Render analysis data
  return (
    <div className="container py-6 md:py-10 px-4 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Comprehensive Report</h1>
        <p className="text-muted-foreground">
          Analysis ID: {analysis.id}
        </p>
      </div>
      
      {/* Overview section */}
      <Card className="p-6 md:p-8 shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Personality Overview</h2>
        <p className="mb-6">{analysis.overview}</p>
        
        {/* Key traits section */}
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-3">Key Personality Traits</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.traits?.slice(0, 5).map((trait, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                {trait.trait}: {formatTraitScore(trait.score)}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Intelligence scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 bg-muted/30 rounded-lg">
            <h4 className="font-medium">Intelligence Score</h4>
            <p className="text-2xl font-bold">{formatTraitScore(analysis.intelligenceScore || 0)}</p>
          </div>
          
          <div className="p-4 bg-muted/30 rounded-lg">
            <h4 className="font-medium">Emotional Intelligence</h4>
            <p className="text-2xl font-bold">{formatTraitScore(analysis.emotionalIntelligenceScore || 0)}</p>
          </div>
        </div>
      </Card>
      
      {/* More details - can be expanded in future */}
      <div className="text-center text-muted-foreground">
        <p>This is a preview of your comprehensive report.</p>
        <p>More detailed insights and functionality will be added soon.</p>
      </div>
    </div>
  );
};

export default ComprehensiveReportPage;
