
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bug, AlertTriangle, CheckCircle, ExternalLink, History } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * A debug dialog component that helps admins diagnose payment issues
 */
const PaymentDebugDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [stripeKeyInfo, setStripeKeyInfo] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [webhookStatus, setWebhookStatus] = useState<string | null>(null);
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
  const checkStripeKey = async () => {
    setIsChecking(true);
    try {
      console.log("Testing Stripe key configuration...");
      // Make a simple call to test the Stripe key setup
      const { data, error } = await supabase.functions.invoke("create-assessment-payment", {
        body: { debug: true }
      });
      
      console.log("Stripe key check response:", data, error);
      
      if (error) {
        setStripeKeyInfo(`Error: ${error.message}`);
        toast.error("Stripe key validation failed", {
          description: error.message
        });
      } else {
        setStripeKeyInfo(data?.message || "Key validation successful");
        
        // If key starts with sk_test, show a note about test mode
        if (data?.keyType === "test") {
          toast.info("Using Stripe in TEST mode", {
            description: "This will only process test payments. Use card 4242 4242 4242 4242 for testing."
          });
        } else if (data?.keyType === "live") {
          toast.success("Using Stripe in LIVE mode", {
            description: "Real payments will be processed"
          });
        }
      }
    } catch (error) {
      console.error("Exception during Stripe key check:", error);
      setStripeKeyInfo(`Exception: ${error instanceof Error ? error.message : String(error)}`);
      toast.error("Check failed", {
        description: "See console for details"
      });
    } finally {
      setIsChecking(false);
    }
  };
  
  const checkWebhook = async () => {
    setWebhookStatus("Checking webhook configuration...");
    try {
      const { data, error } = await supabase.functions.invoke("create-assessment-payment", {
        body: { checkWebhook: true }
      });
      
      if (error) {
        setWebhookStatus(`Webhook Error: ${error.message}`);
      } else {
        setWebhookStatus(data?.webhookStatus || "Webhook check not implemented");
      }
    } catch (error) {
      setWebhookStatus(`Webhook Exception: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  
  const loadRequestHistory = async () => {
    setIsLoadingHistory(true);
    try {
      // This would require a new edge function or database query to get logs
      // For now we'll simulate this with recent purchases
      const { data, error } = await supabase
        .from('assessment_purchases')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) {
        console.error("Error loading payment history:", error);
        toast.error("Could not load payment history");
      } else if (data) {
        setRecentRequests(data);
      }
    } catch (error) {
      console.error("Exception loading history:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };
  
  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="fixed bottom-4 right-4 bg-background/80 border-muted z-50 flex gap-1"
        onClick={() => {
          setIsOpen(true);
          // Clear previous check results when opening
          setStripeKeyInfo("");
          setWebhookStatus(null);
        }}
      >
        <Bug className="h-4 w-4" />
        <span className="sr-only md:not-sr-only">Debug Payment</span>
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
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
                <li>• CORS policy problems</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">1. Check Stripe Key Setup</h3>
              <Button 
                variant="secondary" 
                onClick={checkStripeKey} 
                disabled={isChecking}
                className="w-full"
              >
                {isChecking ? "Checking..." : "Check Stripe Key Configuration"}
              </Button>
              
              {stripeKeyInfo && (
                <div className="mt-2 p-2 bg-muted text-sm rounded font-mono overflow-auto max-h-28">
                  {stripeKeyInfo.includes("successful") ? (
                    <div className="flex items-center gap-1 text-green-500">
                      <CheckCircle className="h-4 w-4" />
                      {stripeKeyInfo}
                    </div>
                  ) : (
                    <div className="text-red-500">
                      {stripeKeyInfo}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-2">2. Check Payment History</h3>
              <Button 
                variant="outline"
                onClick={loadRequestHistory}
                disabled={isLoadingHistory}
                className="w-full mb-2"
              >
                <History className="h-4 w-4 mr-1" />
                {isLoadingHistory ? "Loading..." : "Load Recent Payments"}
              </Button>
              
              {recentRequests.length > 0 && (
                <div className="mt-2 bg-muted/50 p-2 rounded text-sm overflow-auto max-h-40">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-1">ID</th>
                        <th className="text-left py-1">Status</th>
                        <th className="text-left py-1">Amount</th>
                        <th className="text-left py-1">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentRequests.map((req) => (
                        <tr key={req.id} className="border-b border-muted/20">
                          <td className="py-1">{req.payment_session_id?.substring(0, 12)}...</td>
                          <td className="py-1">
                            <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                              req.status === "completed" ? "bg-green-100 text-green-800" : 
                              req.status === "pending" ? "bg-amber-100 text-amber-800" : 
                              "bg-red-100 text-red-800"
                            }`}>
                              {req.status}
                            </span>
                          </td>
                          <td className="py-1">${req.amount}</td>
                          <td className="py-1">{new Date(req.created_at).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {recentRequests.length === 0 && !isLoadingHistory && (
                <div className="text-sm text-muted-foreground">
                  No payment records found
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
              <div className="mt-3 flex justify-end">
                <a 
                  href="https://dashboard.stripe.com/apikeys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs flex items-center gap-1 text-primary hover:underline"
                >
                  View Stripe API keys <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex gap-2">
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>
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
