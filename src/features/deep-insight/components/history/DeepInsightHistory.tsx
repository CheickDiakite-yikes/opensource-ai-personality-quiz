
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Clock, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export const DeepInsightHistory: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analyses, setAnalyses] = useState<any[]>([]);

  useEffect(() => {
    const fetchAnalyses = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // First try to get analyses from the deep_insight_analyses table
        const { data: deepInsightData, error: deepError } = await supabase
          .from('deep_insight_analyses')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (!deepError && deepInsightData && deepInsightData.length > 0) {
          console.log(`Found ${deepInsightData.length} analyses in deep_insight_analyses`);
          setAnalyses(deepInsightData);
          setLoading(false);
          return;
        }
        
        // If nothing in the new table or if there was an error, try the old analyses table
        const { data: oldAnalyses, error: oldError } = await supabase
          .from('analyses')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (!oldError && oldAnalyses && oldAnalyses.length > 0) {
          console.log(`Found ${oldAnalyses.length} analyses in analyses`);
          setAnalyses(oldAnalyses);
        } else {
          // No analyses found in either table
          console.log("No analyses found for user");
          setAnalyses([]);
        }
      } catch (err) {
        console.error("Error fetching analyses:", err);
        toast.error("Failed to load your analyses history");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, [user]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Your Analysis History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center text-muted-foreground">
          <p>Loading your previous analyses...</p>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Your Analysis History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <p className="mb-4 text-muted-foreground">Please sign in to view your analysis history.</p>
          <Button onClick={() => navigate('/auth')}>Sign In</Button>
        </CardContent>
      </Card>
    );
  }

  if (analyses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Your Analysis History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <p className="mb-4 text-muted-foreground">You haven't saved any analyses yet.</p>
          <Button onClick={() => navigate('/deep-insight/quiz')}>Take Deep Insight Assessment</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Your Analysis History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {analyses.map((analysis) => (
            <div 
              key={analysis.id} 
              className="flex items-center justify-between p-4 bg-background/80 rounded-lg border border-border/30 hover:border-border/60 transition-all hover:shadow-md"
            >
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h3 className="font-medium">
                    {analysis.title || "Deep Insight Analysis"}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {new Date(analysis.created_at).toLocaleDateString()} • {new Date(analysis.created_at).toLocaleTimeString()}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                className="flex items-center gap-1"
                onClick={() => navigate(`/deep-insight/results/${analysis.id}`)}
              >
                View
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
