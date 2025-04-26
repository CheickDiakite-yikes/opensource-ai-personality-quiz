
import React from 'react';
import { FileText, Calendar, Trash2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

interface AssessmentCardProps {
  analysis: any;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}

export const AssessmentCard: React.FC<AssessmentCardProps> = ({ 
  analysis, 
  onSelect, 
  onDelete,
  isDeleting = false,
  isSelected = false,
  onToggleSelect
}) => {
  // Extract title from analysis data if available
  let title = "Concise Insight Analysis";
  let description = "";
  
  if (analysis.analysis_data) {
    const data = analysis.analysis_data as Record<string, any>;
    // Extract a small portion of the overview if available for description
    if (data.overview) {
      description = data.overview.substring(0, 60) + "...";
    }
    
    // If there's a primary archetype, include it in the title
    if (data.coreProfiling && data.coreProfiling.primaryArchetype) {
      title += `: ${data.coreProfiling.primaryArchetype} Type`;
    }
  }
  
  // Handle card click, but only if not in deleting state
  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDeleting) {
      onSelect(analysis.id);
    }
  };

  // Handle delete button click, stop propagation to prevent card click
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDeleting) {
      onDelete(analysis.id);
    }
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleSelect) {
      onToggleSelect();
    }
  };
  
  return (
    <Card 
      className={`hover:border-primary/50 transition-colors cursor-pointer group relative ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}
      onClick={handleCardClick}
      data-analysis-id={analysis.id}
    >
      <CardHeader className="py-4 pr-12">
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            {onToggleSelect && (
              <div onClick={handleCheckboxClick} className="flex items-center justify-center">
                <Checkbox 
                  checked={isSelected}
                  onCheckedChange={onToggleSelect}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <div className="flex flex-col">
                <span className="font-medium">{title}</span>
                {description && (
                  <span className="text-xs text-muted-foreground hidden md:inline">{description}</span>
                )}
              </div>
            </div>
          </div>
          <Badge variant="outline">
            <Calendar className="h-3 w-3 mr-1" />
            {format(new Date(analysis.created_at), 'MMM d, yyyy')}
          </Badge>
        </div>
      </CardHeader>
      
      <div 
        className="absolute top-4 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleDeleteClick}
      >
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7 text-destructive hover:bg-destructive/10"
          disabled={isDeleting}
          aria-label="Delete assessment"
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </div>
    </Card>
  );
};
