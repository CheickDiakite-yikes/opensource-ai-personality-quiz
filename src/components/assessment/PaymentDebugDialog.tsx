
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

interface PaymentDebugDialogProps {
  open: boolean;
  onClose: () => void;
}

export const PaymentDebugDialog: React.FC<PaymentDebugDialogProps> = ({ open, onClose }) => {
  const [stripeKeyInfo, setStripeKeyInfo] = useState<{ status: string; message: string; details?: string }>({
    status: 'pending',
    message: 'Click to check Stripe key configuration',
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const checkStripeKey = async () => {
    setIsLoading(true);
    setStripeKeyInfo({
      status: 'loading',
      message: 'Checking Stripe key configuration...',
    });

    try {
      // Call the edge function to verify the Stripe key
      const { data, error } = await supabase.functions.invoke('verify-assessment-payment', {
        body: { debug: true },
      });

      if (error) {
        console.error('Error checking Stripe key:', error);
        setStripeKeyInfo({
          status: 'error',
          message: 'Error checking Stripe key',
          details: error.message,
        });
        return;
      }

      console.log('Stripe key check response:', data);
      
      if (data.success) {
        setStripeKeyInfo({
          status: 'success',
          message: 'Stripe key is valid and configured correctly',
          details: data.details || 'Key type: ' + data.keyType,
        });
      } else {
        setStripeKeyInfo({
          status: 'error',
          message: data.error || 'Invalid Stripe configuration',
          details: data.details || 'Check the logs for more information',
        });
      }
    } catch (error) {
      console.error('Exception checking Stripe key:', error);
      setStripeKeyInfo({
        status: 'error',
        message: 'Exception checking Stripe key',
        details: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Payment Debug Information</DialogTitle>
          <DialogDescription>
            Administrator tools to diagnose payment integration issues
          </DialogDescription>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Stripe API Key Configuration</h3>
            
            <div className={`p-3 rounded-md ${
              stripeKeyInfo.status === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
              stripeKeyInfo.status === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
              'bg-slate-50 border border-slate-200'
            }`}>
              <p className="text-sm font-medium">{stripeKeyInfo.message}</p>
              {stripeKeyInfo.details && (
                <p className="text-xs mt-1 font-mono">{stripeKeyInfo.details}</p>
              )}
            </div>
            
            <Button 
              onClick={checkStripeKey}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              {isLoading ? 'Checking...' : 'Check Stripe Key Configuration'}
            </Button>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Troubleshooting Steps</h3>
            <ul className="text-xs space-y-1 list-disc pl-4">
              <li>Ensure the STRIPE_SECRET_KEY is correctly set in Supabase secrets</li>
              <li>Key should start with 'sk_' not 'pk_' or 'rk_'</li>
              <li>For testing, use a key starting with 'sk_test_'</li>
              <li>For production, use a key starting with 'sk_live_'</li>
              <li>Check Supabase logs for detailed error information</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDebugDialog;
