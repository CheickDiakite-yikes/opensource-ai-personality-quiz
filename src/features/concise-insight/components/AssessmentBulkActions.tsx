
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface AssessmentBulkActionsProps {
  selectedCount: number;
  totalCount: number;
  isBulkDeleting: boolean;
  bulkDeleteProgress?: number;
  bulkDeleteTotal?: number;
  onToggleSelectAll: () => void;
  onBulkDelete: () => void;
}

export const AssessmentBulkActions = ({
  selectedCount,
  totalCount,
  isBulkDeleting,
  bulkDeleteProgress,
  bulkDeleteTotal,
  onToggleSelectAll,
  onBulkDelete
}: AssessmentBulkActionsProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center">
          <Checkbox 
            id="select-all"
            checked={selectedCount === totalCount && totalCount > 0}
            onCheckedChange={onToggleSelectAll}
            disabled={isBulkDeleting}
          />
        </div>
        <label htmlFor="select-all" className="text-sm text-muted-foreground cursor-pointer">
          {selectedCount} selected
        </label>
      </div>
      {selectedCount > 0 && (
        <Button 
          variant="destructive" 
          onClick={onBulkDelete}
          disabled={selectedCount === 0 || isBulkDeleting}
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
            <span>Delete Selected ({selectedCount})</span>
          )}
        </Button>
      )}
    </div>
  );
};
