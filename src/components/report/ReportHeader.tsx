
import React from "react";
import { PersonalityAnalysis } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { Share, Copy, Calendar, History, Check, Twitter, Facebook, Linkedin } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { useState } from "react";

interface ReportHeaderProps {
  analysis: PersonalityAnalysis;
  analysisHistory?: PersonalityAnalysis[];
  onAnalysisChange?: (analysisId: string) => void;
}

const ReportHeader: React.FC<ReportHeaderProps> = ({ 
  analysis,
  analysisHistory = [],
  onAnalysisChange
}) => {
  const isMobile = useIsMobile();
  const [copied, setCopied] = useState(false);
  
  // Generate a share URL for the current analysis
  const shareUrl = `${window.location.origin}/report/${analysis.id}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied to clipboard", {
      description: "Share this link to let others view your personality analysis"
    });
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Handle social sharing
  const handleShare = (platform: string) => {
    let shareLink = '';
    const text = `Check out my personality analysis on Who Am I? My top trait is ${analysis.traits[0]?.trait || 'Personality'}`;
    const imageUrl = `https://www.sowei.io/lovable-uploads/94f8c274-1a06-4bde-8383-3a46aea85f20.png`;
    
    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(text)}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
    }
    
    if (shareLink) {
      window.open(shareLink, '_blank', 'width=600,height=400');
      toast.success(`Sharing on ${platform}`);
    }
  };

  const renderDate = () => {
    try {
      const date = new Date(analysis.createdAt);
      return format(date, "MMMM d, yyyy");
    } catch (error) {
      return "Recent assessment";
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-1">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Your Personality Analysis</h1>
          <div className="flex items-center text-muted-foreground mt-1">
            <Calendar className="h-4 w-4 mr-1" />
            {renderDate()}
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            onClick={handleCopyLink}
            size={isMobile ? "sm" : "default"}
            variant="outline"
          >
            {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />} 
            {copied ? "Copied" : "Copy Link"}
          </Button>
          
          {/* Past Reports Button - ALWAYS visible right next to Share button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size={isMobile ? "sm" : "default"}
                disabled={analysisHistory.length <= 1}
              >
                <History className="h-4 w-4 mr-2" /> Past Reports
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Your Past Analyses</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {analysisHistory.length <= 1 ? (
                <DropdownMenuItem disabled>No past reports available</DropdownMenuItem>
              ) : (
                // Always show up to 5 past analyses (not including current)
                analysisHistory
                  .filter(item => item.id !== analysis.id)
                  .slice(0, 5)
                  .map((item) => {
                    let dateLabel = "Unknown date";
                    try {
                      dateLabel = format(new Date(item.createdAt), "MMM d, yyyy");
                    } catch (e) {
                      console.error("Invalid date format", e);
                    }
                    
                    return (
                      <DropdownMenuItem 
                        key={item.id}
                        onClick={() => onAnalysisChange && onAnalysisChange(item.id)}
                      >
                        {dateLabel}
                      </DropdownMenuItem>
                    );
                  })
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Share Button - Opens dialog with share options */}
          <Dialog>
            <DialogTrigger asChild>
              <Button size={isMobile ? "sm" : "default"}>
                <Share className="h-4 w-4 mr-2" /> Share
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Share your analysis</DialogTitle>
                <DialogDescription>
                  Let others see your personality analysis results
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex items-center space-x-2 mt-4">
                <div className="grid flex-1 gap-2">
                  <div className="bg-muted text-muted-foreground p-2 rounded-md text-sm overflow-hidden text-ellipsis">
                    {shareUrl}
                  </div>
                </div>
                <Button size="sm" onClick={handleCopyLink}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-3">Share on social media</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleShare('twitter')}>
                    <Twitter className="h-4 w-4 mr-2" /> Twitter
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleShare('facebook')}>
                    <Facebook className="h-4 w-4 mr-2" /> Facebook
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleShare('linkedin')}>
                    <Linkedin className="h-4 w-4 mr-2" /> LinkedIn
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default ReportHeader;
