
import React from "react";
import { Check, Copy, Twitter, Facebook, Linkedin, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface ShareDialogProps {
  shareUrl: string;
  isMobile?: boolean;
}

export const ShareDialog: React.FC<ShareDialogProps> = ({ shareUrl, isMobile }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied to clipboard", {
      description: "Share this link to let others view your personality analysis"
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    let shareLink = '';
    const text = `Check out my personality analysis on Who Am I?`;
    
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={isMobile ? "sm" : "default"} className="flex-1 px-2">
          <Share2 className="h-4 w-4 mr-2" /> Share
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
  );
};
