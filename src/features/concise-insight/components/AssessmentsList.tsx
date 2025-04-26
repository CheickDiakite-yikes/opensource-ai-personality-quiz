
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AssessmentCard } from './AssessmentCard';
import { deleteAnalysisFromDatabase, fetchAllAnalysesByUserId } from '../utils/analysisHelpers';

export const AssessmentsList = ({ onSelect }: { onSelect: (id: string) => void }) => {
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchAnalyses();
  }, [user]);
  
  const fetchAnalyses = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await fetchAllAnalysesByUserId(user.id);
      setAnalyses(data);
    } catch (err) {
      console.error("Error fetching analyses:", err);
      toast.error("Failed to load your analyses");
    } finally {
      setLoading(false);
    }
  };

  const takeNewAssessment = () => {
    navigate('/concise-insight');
  };
  
  const handleDeleteAnalysis = async (analysisId: string) => {
    if (!confirm("Are you sure you want to delete this analysis? This cannot be undone.")) {
      return;
    }
    
    try {
      // Mark as deleting
      setDeletingIds(prev => new Set(prev).add(analysisId));
      
      // Perform deletion
      const success = await deleteAnalysisFromDatabase(analysisId);
      
      if (success) {
        // Update local state to remove the deleted item
        setAnalyses(analyses.filter(a => a.id !== analysisId));
        toast.success("Analysis deleted successfully");
      }
    } catch (err) {
      console.error("Error deleting analysis:", err);
    } finally {
      // Remove from deleting state
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(analysisId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="py-10 flex justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Assessments</h2>
        <Button onClick={takeNewAssessment}>Take New Assessment</Button>
      </div>
      
      {analyses.length === 0 ? (
        <Card className="text-center py-10">
          <CardContent>
            <p className="mb-4 text-muted-foreground">You haven't completed any Concise Insight assessments yet.</p>
            <Button onClick={takeNewAssessment}>Take Your First Assessment</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {analyses.map((analysis) => (
            <AssessmentCard 
              key={analysis.id} 
              analysis={analysis}
              onSelect={onSelect}
              onDelete={handleDeleteAnalysis}
              isDeleting={deletingIds.has(analysis.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
