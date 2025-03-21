
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Share, Copy, Check, Twitter, Facebook, Linkedin } from "lucide-react";
import { PersonalityAnalysis } from "@/utils/types";
import { toast } from "sonner";

interface ShareProfileProps {
  analysis: PersonalityAnalysis;
}

const ShareProfile: React.FC<ShareProfileProps> = ({ analysis }) => {
  const [copied, setCopied] = useState(false);
  
  // Generate a unique share URL using the new domain
  const shareUrl = `https://www.sowei.io/shared-profile/${analysis.id || 'demo'}`;
  
  // Handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  // Handle social sharing
  const handleShare = (platform: string) => {
    let shareLink = '';
    const text = `Check out my personality analysis on Who Am I? My top trait is ${analysis.traits[0].trait}`;
    const imageUrl = `https://www.sowei.io/lovable-uploads/03c0c12c-5bc0-4613-811a-662add832c4f.png`;
    
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
        <Button className="hover-glow">
          <Share className="mr-2 h-4 w-4" /> Share Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share your profile</DialogTitle>
          <DialogDescription>
            Let others see your personality analysis and compare traits
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center space-x-2 mt-4">
          <div className="grid flex-1 gap-2">
            <div className="bg-muted text-muted-foreground p-2 rounded-md text-sm overflow-hidden text-ellipsis">{shareUrl}</div>
          </div>
          <Button size="sm" onClick={handleCopy}>
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

export default ShareProfile;
