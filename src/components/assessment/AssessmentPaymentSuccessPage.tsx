
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useAssessmentCredits } from "@/hooks/useAssessmentCredits";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AssessmentPaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { fetchCredits } = useAssessmentCredits();
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [credits, setCredits] = useState(0);
  
  useEffect(() => {
    let mounted = true;
    
    const verifyPayment = async () => {
      if (!sessionId) {
        setVerifying(false);
        return;
      }
      
      try {
        const { data, error } = await supabase.functions.invoke("verify-assessment-payment", {
          body: { sessionId }
        });
        
        if (error || !data.success) {
          throw new Error(error?.message || "Payment verification failed");
        }
        
        if (mounted) {
          setSuccess(true);
          setCredits(data.credits || 0);
          fetchCredits(); // Update the credits in the global state
          toast.success("Payment successful!", { 
            description: "Your assessment credits have been added to your account"
          });
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        toast.error("Payment verification failed", {
          description: "Please contact support if you were charged"
        });
      } finally {
        if (mounted) {
          setVerifying(false);
        }
      }
    };
    
    verifyPayment();
    
    return () => {
      mounted = false;
    };
  }, [sessionId, fetchCredits]);
  
  const handleStartAssessment = () => {
    navigate("/assessment");
  };
  
  const handleReturnToIntro = () => {
    navigate("/assessment-intro");
  };
  
  return (
    <div className="container max-w-2xl py-12 px-4 flex items-center justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <Card className="w-full">
          <CardHeader className="text-center pb-4">
            {verifying ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                <CardTitle>Verifying your payment...</CardTitle>
                <CardDescription>Please wait while we confirm your payment</CardDescription>
              </div>
            ) : success ? (
              <div className="flex flex-col items-center">
                <CheckCircle className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Payment Successful!</CardTitle>
                <CardDescription>Your assessment credits have been added to your account</CardDescription>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <XCircle className="h-12 w-12 text-destructive mb-4" />
                <CardTitle>Payment Verification Failed</CardTitle>
                <CardDescription>We couldn't verify your payment. If you were charged, please contact support.</CardDescription>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {!verifying && success && (
              <div className="space-y-6">
                <div className="bg-primary/10 p-4 rounded-lg text-center">
                  <p className="text-lg mb-1">Current Credits Balance</p>
                  <p className="text-3xl font-bold text-primary">{credits}</p>
                </div>
                
                <div className="flex flex-col space-y-3">
                  <Button onClick={handleStartAssessment} size="lg">
                    Start Assessment Now
                  </Button>
                  <Button variant="outline" onClick={handleReturnToIntro}>
                    Return to Assessment Intro
                  </Button>
                </div>
              </div>
            )}
            
            {!verifying && !success && (
              <div className="space-y-4">
                <p>If you believe this is an error, please try the following:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Check your email for a payment receipt from Stripe</li>
                  <li>Refresh this page to attempt verification again</li>
                  <li>Contact customer support with any payment confirmation details</li>
                </ul>
                <div className="flex flex-col space-y-3 mt-6">
                  <Button variant="outline" onClick={handleReturnToIntro}>
                    Return to Assessment Intro
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AssessmentPaymentSuccessPage;
