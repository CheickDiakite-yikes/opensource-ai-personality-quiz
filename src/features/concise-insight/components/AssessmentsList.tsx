
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AssessmentCard } from './AssessmentCard';
import { deleteAnalysisFromDatabase, fetchAllAnalysesByUserId } from '../utils/analysisHelpers';
import { Checkbox } from '@/components/ui/checkbox';

export const AssessmentsList = ({ onSelect }: { onSelect: (id: string) => void }) => {
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Use refreshCounter as a dependency to trigger re-fetches
  useEffect(() => {
    if (user) {
      fetchAnalyses();
    }
  }, [user, refreshCounter]);
  
  const fetchAnalyses = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await fetchAllAnalysesByUserId(user.id);
      console.log("[AssessmentsList] Fetched analyses:", data?.length || 0);
      setAnalyses(data || []);
    } catch (err) {
      console.error("[AssessmentsList] Error fetching analyses:", err);
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
      setDeletingIds(prev => new Set([...prev, analysisId]));
      
      // Perform deletion
      const success = await deleteAnalysisFromDatabase(analysisId);
      
      if (success) {
        // Remove the deleted item from local state
        setAnalyses(prev => prev.filter(a => a.id !== analysisId));
        
        // Remove from selected IDs if it was selected
        setSelectedIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(analysisId);
          return newSet;
        });
        
        // Force a refresh of the data after deletion
        setRefreshCounter(prev => prev + 1);
      } else {
        throw new Error("Delete operation failed");
      }
    } catch (err) {
      console.error("[AssessmentsList] Error deleting analysis:", err);
      toast.error("Failed to delete analysis");
    } finally {
      // Remove from deleting state
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(analysisId);
        return newSet;
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) {
      toast.error("Please select items to delete");
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedIds.size} selected analyses? This cannot be undone.`)) {
      return;
    }

    let successCount = 0;
    let failCount = 0;

    for (const analysisId of selectedIds) {
      try {
        setDeletingIds(prev => new Set([...prev, analysisId]));
        const success = await deleteAnalysisFromDatabase(analysisId);
        
        if (success) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (err) {
        console.error(`[AssessmentsList] Error deleting analysis ${analysisId}:`, err);
        failCount++;
      } finally {
        setDeletingIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(analysisId);
          return newSet;
        });
      }
    }

    // Update UI after all deletions
    if (successCount > 0) {
      setAnalyses(prev => prev.filter(a => !selectedIds.has(a.id)));
      setSelectedIds(new Set());
      setRefreshCounter(prev => prev + 1);
      toast.success(`Successfully deleted ${successCount} analyses`);
    }
    
    if (failCount > 0) {
      toast.error(`Failed to delete ${failCount} analyses`);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === analyses.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(analyses.map(a => a.id)));
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
        <>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Checkbox 
                checked={selectedIds.size === analyses.length}
                onClick={toggleSelectAll}
              />
              <span className="text-sm text-muted-foreground">
                {selectedIds.size} selected
              </span>
            </div>
            {selectedIds.size > 0 && (
              <Button 
                variant="destructive" 
                onClick={handleBulkDelete}
                disabled={selectedIds.size === 0}
              >
                Delete Selected ({selectedIds.size})
              </Button>
            )}
          </div>
          <div className="grid gap-4">
            {analyses.map((analysis) => (
              <AssessmentCard 
                key={`${analysis.id}-${refreshCounter}`} 
                analysis={analysis}
                onSelect={onSelect}
                onDelete={handleDeleteAnalysis}
                isDeleting={deletingIds.has(analysis.id)}
                isSelected={selectedIds.has(analysis.id)}
                onToggleSelect={() => {
                  setSelectedIds(prev => {
                    const newSet = new Set(prev);
                    if (newSet.has(analysis.id)) {
                      newSet.delete(analysis.id);
                    } else {
                      newSet.add(analysis.id);
                    }
                    return newSet;
                  });
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
