
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, CreditCard, Package, Sparkles, FileCheck, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PaymentDebugDialog } from "./PaymentDebugDialog";

interface CreditsData {
  id: string;
  user_id: string;
  credits_remaining: number;
  bonus_credits: number;
  bundle_purchases: number;
  created_at: string;
  updated_at: string;
}

const AssessmentIntroPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [credits, setCredits] = useState<CreditsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processMessage, setProcessMessage] = useState("");
  
  const fetchCredits = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from("assessment_credits")
        .select("*")
        .eq("user_id", user?.id)
        .single();
        
      if (error) {
        console.error("Error fetching credits:", error);
        toast.error("Failed to load your credits. Please try again.");
      } else {
        setCredits(data);
        console.log("User credits loaded:", data);
      }
    } catch (err) {
      console.error("Exception fetching credits:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (user) {
      fetchCredits();
    }
  }, [user]);
  
  const startAssessment = () => {
    // If user has credits, navigate to assessment
    if (credits && credits.credits_remaining > 0) {
      navigate("/assessment");
    } else {
      toast.error("You need to purchase credits to take the assessment.");
    }
  };
  
  const initiatePayment = async (paymentType: 'single' | 'bundle') => {
    setIsProcessing(true);
    setProcessMessage(`Preparing ${paymentType} payment...`);
    
    try {
      const { data, error } = await supabase.functions.invoke("create-assessment-payment", {
        body: { paymentType }
      });
      
      if (error) {
        console.error("Payment initiation error:", error);
        toast.error("Failed to initiate payment. Please try again.");
        return;
      }
      
      if (data?.url) {
        console.log("Redirecting to payment:", data);
        setProcessMessage("Redirecting to payment page...");
        // Save the session ID in local storage for verification later
        if (data.paymentSessionId) {
          localStorage.setItem("pendingPaymentSessionId", data.paymentSessionId);
        }
        window.location.href = data.url;
      } else {
        throw new Error("No payment URL returned");
      }
    } catch (err) {
      console.error("Exception in payment:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
      setProcessMessage("");
    }
  };
  
  // Check for a returning payment session
  useEffect(() => {
    const checkPaymentStatus = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session_id');
      
      if (sessionId) {
        // Clear the URL parameter without refresh
        window.history.replaceState({}, document.title, window.location.pathname);
        
        setIsProcessing(true);
        setProcessMessage("Verifying your payment...");
        
        try {
          const { data, error } = await supabase.functions.invoke("verify-assessment-payment", {
            body: { paymentSessionId: sessionId }
          });
          
          if (error) {
            console.error("Payment verification error:", error);
            toast.error("Failed to verify payment. Please contact support.");
            return;
          }
          
          if (data?.success) {
            toast.success("Payment successful! Your credits have been added.");
            console.log("Payment verification result:", data);
            fetchCredits(); // Refresh credits data
          } else {
            toast.error(data?.message || "Payment verification failed. Please try again.");
          }
        } catch (err) {
          console.error("Exception in payment verification:", err);
          toast.error("An unexpected error occurred verifying your payment.");
        } finally {
          setIsProcessing(false);
          setProcessMessage("");
          localStorage.removeItem("pendingPaymentSessionId");
        }
      }
      
      // Check for any pending payments that might have been interrupted
      const pendingSessionId = localStorage.getItem("pendingPaymentSessionId");
      if (pendingSessionId) {
        // TODO: In a more robust implementation, we could check the status of this pending payment
        localStorage.removeItem("pendingPaymentSessionId");
      }
    };
    
    if (user) {
      checkPaymentStatus();
    }
  }, [user]);
  
  // Conditional rendering for loading state
  if (isLoading) {
    return (
      <div className="container max-w-4xl py-12 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-center text-muted-foreground">Loading your assessment credits...</p>
      </div>
    );
  }
  
  // Conditional rendering for processing state
  if (isProcessing) {
    return (
      <div className="container max-w-4xl py-12 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-center text-muted-foreground">{processMessage || "Processing..."}</p>
      </div>
    );
  }
  
  return (
    <div className="container max-w-4xl py-12">
      <motion.div 
        className="flex flex-col gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full text-primary mb-4">
            <Brain className="h-6 w-6" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Who Am I? Assessment</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover your unique personality traits, cognitive patterns, and emotional intelligence with our in-depth assessment.
          </p>
          
          {credits && (
            <div className="mt-6 p-3 bg-muted/50 inline-flex items-center gap-2 rounded-md">
              <FileCheck className="h-5 w-5 text-primary" />
              <span>
                You have <span className="font-bold">{credits.credits_remaining}</span> assessment {credits.credits_remaining === 1 ? "credit" : "credits"} remaining
              </span>
            </div>
          )}
        </div>
        
        {/* Start Assessment Button */}
        {credits && credits.credits_remaining > 0 ? (
          <div className="flex justify-center">
            <Button 
              size="lg" 
              onClick={startAssessment}
              className="text-lg px-8 py-6"
            >
              Start Your Assessment
            </Button>
          </div>
        ) : (
          <div className="bg-muted/30 p-4 rounded-lg text-center">
            <div className="flex items-center justify-center gap-2 text-amber-500 mb-2">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">You need credits to take the assessment</span>
            </div>
            <p className="text-muted-foreground">
              Purchase assessment credits below to begin your journey of self-discovery.
            </p>
          </div>
        )}
        
        {/* Payment Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Single Assessment Option */}
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3">
              <div className="bg-primary/10 text-primary font-medium px-3 py-1 rounded-full text-sm">
                Best Value
              </div>
            </div>
            <CardHeader>
              <CardTitle>Single Assessment</CardTitle>
              <CardDescription>Take the assessment once</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="text-3xl font-bold">$2.99</span>
                <span className="text-muted-foreground">per assessment</span>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>Complete personality profile</span>
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>Personalized insights report</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={() => initiatePayment('single')}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Purchase ($2.99)
              </Button>
            </CardFooter>
          </Card>
          
          {/* Bundle Option */}
          <Card className="relative overflow-hidden border-primary">
            <div className="absolute top-0 right-0 p-3">
              <div className="bg-primary text-primary-foreground font-medium px-3 py-1 rounded-full text-sm">
                Save 11%
              </div>
            </div>
            <CardHeader>
              <CardTitle>Assessment Bundle</CardTitle>
              <CardDescription>Take the assessment three times</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="text-3xl font-bold">$7.99</span>
                <span className="text-muted-foreground">for 3 credits</span>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-primary" />
                  <span>Use now or save for later</span>
                </li>
                <li className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-primary" />
                  <span>Track your growth over time</span>
                </li>
                <li className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-primary" />
                  <span>Share with friends or family</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant="default"
                onClick={() => initiatePayment('bundle')}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Purchase Bundle ($7.99)
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Admin-only debug dialog */}
        <div className="mt-8">
          <PaymentDebugDialog userId={user?.id} onCreditUpdate={fetchCredits} />
        </div>
      </motion.div>
    </div>
  );
};

export default AssessmentIntroPage;
