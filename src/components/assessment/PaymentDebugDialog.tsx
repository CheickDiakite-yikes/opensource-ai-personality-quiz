
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bug, AlertTriangle } from "lucide-react";

/**
 * A debug dialog component that helps admins diagnose payment issues
 */
const PaymentDebugDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [stripeKeyInfo, setStripeKeyInfo] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  
  const checkStripeKey = async () => {
    setIsChecking(true);
    try {
      // Make a simple call to test the Stripe key setup
      const { data, error } = await supabase.functions.invoke("create-assessment-payment", {
        body: { debug: true }
      });
      
      if (error) {
        setStripeKeyInfo(`Error: ${error.message}`);
      } else {
        setStripeKeyInfo(data?.message || "Key validation successful");
      }
    } catch (error) {
      setStripeKeyInfo(`Exception: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsChecking(false);
    }
  };
  
  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="fixed bottom-4 right-4 bg-background/80 border-muted z-50 flex gap-1"
        onClick={() => setIsOpen(true)}
      >
        <Bug className="h-4 w-4" />
        <span className="sr-only md:not-sr-only">Debug Payment</span>
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Configuration Debug</DialogTitle>
            <DialogDescription>
              For administrators: Diagnose Stripe integration issues
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-md">
              <h3 className="font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Common Issues
              </h3>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Stripe key format wrong (should start with 'sk_')</li>
                <li>• Invalid or expired Stripe key</li>
                <li>• Incorrect Stripe account permissions</li>
                <li>• Edge function configuration issues</li>
              </ul>
            </div>
            
            <div>
              <Button 
                variant="secondary" 
                onClick={checkStripeKey} 
                disabled={isChecking}
                className="w-full"
              >
                {isChecking ? "Checking..." : "Check Stripe Key Setup"}
              </Button>
              
              {stripeKeyInfo && (
                <div className="mt-2 p-2 bg-muted text-sm rounded font-mono">
                  {stripeKeyInfo}
                </div>
              )}
            </div>
            
            <div className="bg-muted/50 p-4 rounded-md text-sm">
              <p>Make sure your Stripe secret key:</p>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>Starts with "sk_" (not "pk_" or "rk_")</li>
                <li>Is properly set in Supabase Edge Function secrets</li>
                <li>Has the correct permissions (test or live mode)</li>
              </ul>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PaymentDebugDialog;
