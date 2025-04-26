
import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AssessmentCard } from './AssessmentCard';
import { AssessmentHeader } from './AssessmentHeader';
import { AssessmentBulkActions } from './AssessmentBulkActions';
import { useAssessmentList } from '../hooks/useAssessmentList';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface AssessmentsListProps {
  onSelect: (id: string) => void;
}

export const AssessmentsList = ({ onSelect }: AssessmentsListProps) => {
  const {
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
  } = useAssessmentList();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnalyses();
  }, [fetchAnalyses, refreshCounter]);

  if (loading && isInitialLoad) {
    return (
      <div className="py-10 flex justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const takeNewAssessment = () => {
    navigate('/concise-insight');
  };

  return (
    <div className="space-y-6">
      <AssessmentHeader />
      
      {analyses.length === 0 ? (
        <Card className="text-center py-10">
          <CardContent>
            <p className="mb-4 text-muted-foreground">You haven't completed any Concise Insight assessments yet.</p>
            <Button onClick={takeNewAssessment}>Take Your First Assessment</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <AssessmentBulkActions 
            selectedCount={selectedIds.size}
            totalCount={analyses.length}
            isBulkDeleting={isBulkDeleting}
            bulkDeleteProgress={bulkDeleteProgress}
            bulkDeleteTotal={bulkDeleteTotal}
            onToggleSelectAll={toggleSelectAll}
            onBulkDelete={handleBulkDelete}
          />
          <div className="grid gap-4">
            {analyses.map((analysis) => (
              <AssessmentCard 
                key={`analysis-${analysis.id}-${refreshCounter}`} 
                analysis={analysis}
                onSelect={onSelect}
                onDelete={handleDeleteAnalysis}
                isDeleting={deletingIds.has(analysis.id) || isBulkDeleting}
                isSelected={selectedIds.has(analysis.id)}
                onToggleSelect={() => toggleSelectItem(analysis.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
