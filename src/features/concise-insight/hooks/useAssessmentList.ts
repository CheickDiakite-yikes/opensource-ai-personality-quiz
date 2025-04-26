
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { deleteAnalysisFromDatabase, fetchAllAnalysesByUserId } from '../utils/analysisHelpers';

export const useAssessmentList = () => {
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [bulkDeleteProgress, setBulkDeleteProgress] = useState(0);
  const [bulkDeleteTotal, setBulkDeleteTotal] = useState(0);
  const { user } = useAuth();

  const fetchAnalyses = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await fetchAllAnalysesByUserId(user.id);
      console.log("[useAssessmentList] Fetched analyses:", data?.length || 0);
      setAnalyses(data || []);
      setSelectedIds(new Set());
      setIsInitialLoad(false);
    } catch (err) {
      console.error("[useAssessmentList] Error fetching analyses:", err);
      toast.error("Failed to load your analyses");
      setIsInitialLoad(false);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const handleDeleteAnalysis = async (analysisId: string) => {
    if (!confirm("Are you sure you want to delete this analysis? This cannot be undone.")) {
      return;
    }
    
    try {
      setDeletingIds(prev => new Set([...prev, analysisId]));
      
      const success = await deleteAnalysisFromDatabase(analysisId);
      
      if (success) {
        setAnalyses(prev => prev.filter(a => a.id !== analysisId));
        setSelectedIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(analysisId);
          return newSet;
        });
      } else {
        setRefreshCounter(prev => prev + 1);
      }
    } catch (err) {
      console.error("[useAssessmentList] Error deleting analysis:", err);
      toast.error("Failed to delete analysis");
      setRefreshCounter(prev => prev + 1);
    } finally {
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
    
    try {
      for (let i = 0; i < selectedIdsArray.length; i++) {
        const analysisId = selectedIdsArray[i];
        try {
          setDeletingIds(prev => new Set([...prev, analysisId]));
          
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const success = await deleteAnalysisFromDatabase(analysisId);
          
          if (success) {
            successCount++;
            setAnalyses(prev => prev.filter(a => a.id !== analysisId));
          } else {
            failCount++;
          }
        } catch (err) {
          console.error(`[useAssessmentList] Error deleting analysis ${analysisId}:`, err);
          failCount++;
        } finally {
          setDeletingIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(analysisId);
            return newSet;
          });
          
          setBulkDeleteProgress(prev => prev + 1);
          toast.loading(`Deleted ${successCount} of ${selectedIds.size} analyses...`, { id: "bulk-delete" });
        }
      }
    } finally {
      setSelectedIds(new Set());
      setIsBulkDeleting(false);
      
      if (successCount > 0) {
        toast.success(`Successfully deleted ${successCount} analyses`, { id: "bulk-delete" });
      }
      
      if (failCount > 0) {
        toast.error(`Failed to delete ${failCount} analyses`, { id: "bulk-delete" });
        setRefreshCounter(prev => prev + 1);
      }
      
      if (successCount > 0) {
        fetchAnalyses();
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

  const toggleSelectItem = (analysisId: string) => {
    if (isBulkDeleting) return;
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(analysisId)) {
        newSet.delete(analysisId);
      } else {
        newSet.add(analysisId);
      }
      return newSet;
    });
  };

  return {
    analyses,
    loading,
    isInitialLoad,
    deletingIds,
    selectedIds,
    isBulkDeleting,
    bulkDeleteProgress,
    bulkDeleteTotal,
    fetchAnalyses,
    handleDeleteAnalysis,
    handleBulkDelete,
    toggleSelectAll,
    toggleSelectItem,
    refreshCounter
  };
};
