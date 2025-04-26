
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AssessmentCard } from './AssessmentCard';
import { deleteAnalysisFromDatabase, fetchAllAnalysesByUserId } from '../utils/analysisHelpers';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';

export const AssessmentsList = ({ onSelect }: { onSelect: (id: string) => void }) => {
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [bulkDeleteProgress, setBulkDeleteProgress] = useState(0);
  const [bulkDeleteTotal, setBulkDeleteTotal] = useState(0);

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
      
      // Clear selected IDs when refreshing to avoid stale selections
      setSelectedIds(new Set());
      setIsInitialLoad(false);
    } catch (err) {
      console.error("[AssessmentsList] Error fetching analyses:", err);
      toast.error("Failed to load your analyses");
      setIsInitialLoad(false);
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
        
        console.log("[handleDeleteAnalysis] Successfully deleted analysis:", analysisId);
      } else {
        console.error("[handleDeleteAnalysis] Failed to delete analysis:", analysisId);
        // Force a refresh to get the current state from the database
        setRefreshCounter(prev => prev + 1);
      }
    } catch (err) {
      console.error("[AssessmentsList] Error deleting analysis:", err);
      toast.error("Failed to delete analysis");
      // Force a refresh to get the current state from the database
      setRefreshCounter(prev => prev + 1);
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

    setIsBulkDeleting(true);
    setBulkDeleteTotal(selectedIds.size);
    setBulkDeleteProgress(0);
    toast.loading(`Starting deletion of ${selectedIds.size} analyses...`, { id: "bulk-delete" });

    let successCount = 0;
    let failCount = 0;
    const selectedIdsArray = Array.from(selectedIds);
    const deletedIds = new Set<string>();
    
    try {
      // Process deletions in batches of 3 to avoid overwhelming the database
      const batchSize = 3;
      
      for (let i = 0; i < selectedIdsArray.length; i += batchSize) {
        const batch = selectedIdsArray.slice(i, i + batchSize);
        
        // Process batch in sequence to avoid race conditions
        for (const analysisId of batch) {
          try {
            setDeletingIds(prev => new Set([...prev, analysisId]));
            
            // Short delay to prevent database overload
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const success = await deleteAnalysisFromDatabase(analysisId);
            
            if (success) {
              deletedIds.add(analysisId);
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
            
            // Update progress
            setBulkDeleteProgress(prev => prev + 1);
            toast.loading(`Deleted ${successCount} of ${selectedIds.size} analyses...`, { id: "bulk-delete" });
          }
        }
      }
    } catch (error) {
      console.error("[AssessmentsList] Bulk deletion error:", error);
    } finally {
      // Update UI by removing successfully deleted items
      if (deletedIds.size > 0) {
        setAnalyses(prev => prev.filter(a => !deletedIds.has(a.id)));
      }
      
      // Clear selection
      setSelectedIds(new Set());
      setIsBulkDeleting(false);
      
      if (successCount > 0) {
        toast.success(`Successfully deleted ${successCount} analyses`, { id: "bulk-delete" });
      }
      
      if (failCount > 0) {
        toast.error(`Failed to delete ${failCount} analyses`, { id: "bulk-delete" });
        // Force a complete refresh to ensure UI is in sync with database
        setRefreshCounter(prev => prev + 1);
      }
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === analyses.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(analyses.map(a => a.id)));
    }
  };

  if (loading && isInitialLoad) {
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
              <div className="flex items-center justify-center">
                <Checkbox 
                  id="select-all"
                  checked={selectedIds.size === analyses.length && analyses.length > 0}
                  onCheckedChange={toggleSelectAll}
                  disabled={isBulkDeleting}
                />
              </div>
              <label htmlFor="select-all" className="text-sm text-muted-foreground cursor-pointer">
                {selectedIds.size} selected
              </label>
            </div>
            {selectedIds.size > 0 && (
              <Button 
                variant="destructive" 
                onClick={handleBulkDelete}
                disabled={selectedIds.size === 0 || isBulkDeleting}
                className="flex items-center gap-2"
              >
                {isBulkDeleting && (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>
                      {bulkDeleteProgress}/{bulkDeleteTotal}
                    </span>
                  </>
                )}
                {!isBulkDeleting && (
                  <span>Delete Selected ({selectedIds.size})</span>
                )}
              </Button>
            )}
          </div>
          <div className="grid gap-4">
            {analyses.map((analysis) => (
              <AssessmentCard 
                key={`analysis-${analysis.id}-${refreshCounter}`} 
                analysis={analysis}
                onSelect={onSelect}
                onDelete={handleDeleteAnalysis}
                isDeleting={deletingIds.has(analysis.id) || isBulkDeleting}
                isSelected={selectedIds.has(analysis.id)}
                onToggleSelect={() => {
                  if (isBulkDeleting) return;
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
