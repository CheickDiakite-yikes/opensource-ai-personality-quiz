
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRightIcon, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface HistoryItem {
  id: string;
  created_at: string;
  title: string;
  overview: string | null;
}

export const DeepInsightHistory: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) {
        setHistory([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('deep_insight_analyses')
          .select('id, created_at, title, overview')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) {
          console.error("Error fetching Deep Insight history:", error);
          setError(error.message);
          setHistory([]);
        } else {
          setHistory(data || []);
          setError(null);
        }
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
        console.error("Error in fetchHistory:", errorMessage);
        setError("Failed to load assessment history");
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  const viewAnalysis = (id: string) => {
    navigate(`/deep-insight/results/${id}`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          <CardTitle>Recent Assessments</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-muted h-16 rounded-md" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center p-4 text-muted-foreground">
            <p>Error: {error}</p>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center p-4 text-muted-foreground">
            <p>You haven't taken any Deep Insight assessments yet.</p>
            <Button 
              variant="outline" 
              className="mt-2" 
              onClick={() => navigate("/deep-insight/quiz")}
            >
              Take an Assessment
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <div key={item.id} className="p-3 bg-background border rounded-md shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="font-medium line-clamp-1">{item.title}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <Button size="sm" onClick={() => viewAnalysis(item.id)} variant="outline" className="ml-2 flex-shrink-0">
                    View <ArrowRightIcon className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
