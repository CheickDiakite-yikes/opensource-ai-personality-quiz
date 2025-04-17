
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, FileText, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AnalysisData } from "../utils/analysis/types";
import { format } from "date-fns";
import { toast } from "sonner";

interface AnalysisHistoryCardProps {
  analysis: AnalysisData;
}

export const AnalysisHistoryCard: React.FC<AnalysisHistoryCardProps> = ({ analysis }) => {
  const navigate = useNavigate();
  
  // Format date if it exists
  const formattedDate = analysis.createdAt 
    ? format(new Date(analysis.createdAt), 'MMM d, yyyy')
    : 'Unknown date';
  
  const viewAnalysis = () => {
    // Legacy ID support - check if this is a legacy ID or new UUID format
    const isLegacyId = analysis.id.startsWith('analysis-') || !analysis.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    
    if (isLegacyId) {
      toast.info("Loading legacy analysis format...");
      // For older analyses with legacy IDs, use a different approach
      navigate(`/deep-insight/results?id=${encodeURIComponent(analysis.id)}&legacy=true`);
    } else {
      // For newer analyses with proper UUIDs, use normal navigation
      navigate(`/deep-insight/results?id=${analysis.id}`);
    }
  };

  const shareAnalysis = () => {
    const url = `${window.location.origin}/deep-insight/shared?id=${encodeURIComponent(analysis.id)}`;
    
    // Try the clipboard API
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url)
        .then(() => toast.success("Link copied to clipboard"))
        .catch(() => {
          // Fallback to older method if clipboard API fails
          const textField = document.createElement('textarea');
          textField.value = url;
          document.body.appendChild(textField);
          textField.select();
          document.execCommand('copy');
          textField.remove();
          toast.success("Link copied to clipboard");
        });
    } else {
      // Fallback for browsers without clipboard API
      const textField = document.createElement('textarea');
      textField.value = url;
      document.body.appendChild(textField);
      textField.select();
      document.execCommand('copy');
      textField.remove();
      toast.success("Link copied to clipboard");
    }
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-semibold">
            {analysis.coreTraits?.primary || "Deep Insight Analysis"}
          </CardTitle>
          <Badge 
            variant={analysis.intelligenceScore > 85 ? "default" : "secondary"}
            className="text-xs"
          >
            IQ: {analysis.intelligenceScore || '—'}
          </Badge>
        </div>
        <CardDescription className="text-xs">
          {formattedDate}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        <p className="text-sm line-clamp-2 text-muted-foreground">
          {analysis.overview?.substring(0, 120)}... 
        </p>
        
        <div className="mt-2 flex gap-2 flex-wrap">
          {analysis.coreTraits?.strengths?.slice(0, 2).map((strength, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              {strength}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/30 pt-2 pb-2 px-4 flex gap-2">
        <Button size="sm" onClick={viewAnalysis} className="w-full">
          <Eye className="h-4 w-4 mr-1" /> View
        </Button>
        <Button size="sm" variant="secondary" onClick={shareAnalysis} className="px-2">
          <Share2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
