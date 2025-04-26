
import React from 'react';
import { format } from 'date-fns';
import { FileText, Calendar, Trash2 } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface AssessmentCardProps {
  analysis: {
    id: string;
    created_at: string;
    analysis_data: Record<string, any>;
  };
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export const AssessmentCard = ({ analysis, onSelect, onDelete }: AssessmentCardProps) => {
  let title = "Concise Insight Analysis";
  let description = "";
  
  if (analysis.analysis_data) {
    const data = analysis.analysis_data as Record<string, any>;
    if (data.overview) {
      description = data.overview.substring(0, 60) + "...";
    }
    
    if (data.coreProfiling && data.coreProfiling.primaryArchetype) {
      title += `: ${data.coreProfiling.primaryArchetype} Type`;
    }
  }
  
  return (
    <Card 
      className="hover:border-primary/50 transition-colors cursor-pointer group relative"
      onClick={() => onSelect(analysis.id)}
    >
      <CardHeader className="py-4 pr-12">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <div className="flex flex-col">
              <span className="font-medium">{title}</span>
              {description && (
                <span className="text-xs text-muted-foreground hidden md:inline">{description}</span>
              )}
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
        onClick={(e) => {
          e.stopPropagation();
          onDelete(analysis.id);
        }}
      >
        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};
