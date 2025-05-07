
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { getInitials } from "@/utils/stringUtils";
import { AIAnalysis } from "@/utils/types";
import { CreditCard, Loader2, Share } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProfileHeaderProps {
  profile?: {
    name: string | null;
    avatar_url: string | null;
  };
  analysis?: AIAnalysis;
  isShared?: boolean;
}

interface UserCredits {
  credits_remaining: number;
  bundle_purchases: number;
  bonus_credits: number;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  analysis,
  isShared = false,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isShareLoading, setIsShareLoading] = useState(false);
  const [userCredits, setUserCredits] = useState<UserCredits | null>(null);
  const [isLoadingCredits, setIsLoadingCredits] = useState(false);

  // Fetch user credits if user is logged in
  useEffect(() => {
    const fetchUserCredits = async () => {
      if (!user) return;
      
      setIsLoadingCredits(true);
      try {
        const { data, error } = await supabase
          .from("assessment_credits")
          .select("credits_remaining, bundle_purchases, bonus_credits")
          .eq("user_id", user.id)
          .single();
          
        if (error) {
          console.error("Error fetching user credits:", error);
        } else {
          setUserCredits(data);
        }
      } catch (err) {
        console.error("Exception fetching user credits:", err);
      } finally {
        setIsLoadingCredits(false);
      }
    };
    
    fetchUserCredits();
  }, [user]);

  const handleShareProfile = async () => {
    if (!user || !analysis) return;

    setIsShareLoading(true);
    try {
      // TODO: Create proper sharing functionality
      toast.success("Profile sharing isn't implemented yet", {
        description: "This feature will be available soon!",
      });
    } catch (error) {
      console.error("Error sharing profile:", error);
      toast.error("Failed to share profile. Please try again later.");
    } finally {
      setIsShareLoading(false);
    }
  };

  const getCreditsDisplay = () => {
    if (isLoadingCredits) {
      return (
        <div className="flex items-center gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Loading credits...</span>
        </div>
      );
    }
    
    if (!userCredits) {
      return null;
    }
    
    return (
      <div className="flex flex-col">
        <div className="flex items-center gap-1 text-sm">
          <CreditCard className="h-3 w-3" />
          <span>
            <strong>{userCredits.credits_remaining}</strong> assessment {userCredits.credits_remaining === 1 ? 'credit' : 'credits'} remaining
          </span>
        </div>
        
        {userCredits.bundle_purchases > 0 && (
          <div className="text-xs text-muted-foreground">
            Purchased {userCredits.bundle_purchases} bundle{userCredits.bundle_purchases !== 1 ? 's' : ''}
          </div>
        )}
        
        {userCredits.bonus_credits > 0 && (
          <div className="text-xs text-muted-foreground">
            Includes {userCredits.bonus_credits} bonus credit{userCredits.bonus_credits !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    );
  };

  const displayName = profile?.name || user?.email?.split("@")[0] || "User";

  const navigateToAssessment = () => {
    navigate("/assessment");
  };

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-0 flex flex-col sm:flex-row items-center gap-4">
        <Avatar className="h-20 w-20 border-2 border-primary/10">
          <AvatarImage src={profile?.avatar_url || undefined} alt={displayName} />
          <AvatarFallback className="text-xl">{getInitials(displayName)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-bold">{displayName}</h1>
          {analysis ? (
            <CardDescription className="mt-1 max-w-md">
              {analysis.overview ? analysis.overview.split(".")[0] + "." : "No analysis available."}
            </CardDescription>
          ) : (
            <CardDescription>No personality analysis yet. Take the assessment to unlock your insights.</CardDescription>
          )}
          
          {!isShared && user && userCredits !== null && (
            <div className="mt-2">
              {getCreditsDisplay()}
            </div>
          )}
        </div>

        {!isShared ? (
          <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
            {!analysis && (
              <Button onClick={navigateToAssessment}>Take Assessment</Button>
            )}
            {analysis && (
              <Button variant="outline" size="sm" onClick={handleShareProfile} disabled={isShareLoading}>
                {isShareLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Share className="mr-2 h-4 w-4" />}
                Share Profile
              </Button>
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;
