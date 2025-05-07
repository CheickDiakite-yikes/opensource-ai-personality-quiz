
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Bug, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Admin emails for testing - update with real admin emails later
const ADMIN_EMAILS = ["admin@example.com"];

interface PaymentDebugDialogProps {
  userId?: string;
  onCreditUpdate?: () => void;
}

export const PaymentDebugDialog: React.FC<PaymentDebugDialogProps> = ({ 
  userId, 
  onCreditUpdate 
}) => {
  const { user } = useAuth();
  const [creditsToAdd, setCreditsToAdd] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  
  // Check if current user is in admin list
  const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email);
  
  if (!isAdmin) {
    // Only show to admins
    return null;
  }
  
  const addBonusCredits = async () => {
    if (!userId) {
      toast.error("No user ID provided");
      return;
    }
    
    if (creditsToAdd <= 0) {
      toast.error("Credits must be a positive number");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("grant-bonus-credits", {
        body: {
          targetUserId: userId,
          creditsToAdd: creditsToAdd
        }
      });
      
      if (error) {
        console.error("Bonus credits error:", error);
        toast.error("Failed to add bonus credits");
        return;
      }
      
      console.log("Bonus credits result:", data);
      
      if (data?.success) {
        toast.success(`Added ${creditsToAdd} bonus credits successfully`);
        setOpen(false);
        if (onCreditUpdate) {
          onCreditUpdate();
        }
      } else {
        toast.error(data?.error || "Failed to add bonus credits");
      }
    } catch (err) {
      console.error("Exception adding bonus credits:", err);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Bug className="mr-2 h-4 w-4" />
          Admin Debug Tools
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            Admin Debug Tools
          </DialogTitle>
          <DialogDescription>
            Add bonus credits to users for testing or special circumstances.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 rounded-md mb-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-800 dark:text-amber-300">
                These tools are for admin use only. All actions are logged and audited.
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userId">User ID</Label>
              <Input id="userId" value={userId} readOnly disabled className="bg-muted" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="credits">Bonus Credits to Add</Label>
              <Input
                id="credits"
                type="number"
                min="1"
                value={creditsToAdd}
                onChange={(e) => setCreditsToAdd(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button 
            onClick={addBonusCredits}
            disabled={isSubmitting || !userId}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Bonus Credits
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
