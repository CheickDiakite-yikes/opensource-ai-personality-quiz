import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, CreditCard, Package, Sparkles, FileCheck, AlertTriangle, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, SUPABASE_URL } from "@/integrations/supabase/client";
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
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
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
      navigate("/assessment-quiz");
    } else {
      toast.error("You need to purchase credits to take the assessment.");
    }
  };
  
  const resetPaymentState = () => {
    setIsProcessing(false);
    setProcessMessage("");
    setPaymentError(null);
  };
  
  useEffect(() => {
    const timeouts: number[] = [];
    
    if (isProcessing) {
      // Auto-reset after 30 seconds if still processing
      timeouts.push(window.setTimeout(() => {
        console.log("Payment processing timeout (30s) - resetting state");
        setIsProcessing(false);
        setProcessMessage("");
        setPaymentError("Payment processing timed out. Please try again.");
        toast.error("Payment processing is taking too long", {
          description: "Please try again or use a different payment method"
        });
      }, 30000));
      
      // Show message after 10 seconds
      timeouts.push(window.setTimeout(() => {
        if (isProcessing) {
          console.log("Payment processing still in progress (10s) - showing info message");
          toast.info("Still processing your payment", {
            description: "This is taking longer than expected, but please wait..."
          });
        }
      }, 10000));
    }
    
    return () => {
      timeouts.forEach(id => window.clearTimeout(id));
    };
  }, [isProcessing]);
  
  const initiatePayment = async (paymentType: 'single' | 'bundle') => {
    resetPaymentState();
    setIsProcessing(true);
    setProcessMessage(`Preparing ${paymentType} payment...`);
    
    let paymentSessionId: string | null = null;
    
    try {
      console.log(`Initiating ${paymentType} payment...`);
      
      // Set a timeout for the function call
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      // Enhanced error handling with fallback logic
      try {
        // First attempt - Use Supabase edge function invoke
        console.log("Attempt 1: Using Supabase functions.invoke");
        setProcessMessage(`Connecting to payment service (attempt 1)...`);
        
        // Log Supabase URL for debugging
        console.log("Using Supabase URL:", SUPABASE_URL);
        
        const { data, error } = await supabase.functions.invoke("create-assessment-payment", {
          body: { paymentType },
          headers: { 
            "Payment-Type": paymentType,
            "Client-Timestamp": new Date().toISOString()
          }
        });
        
        clearTimeout(timeoutId);
        
        if (error) {
          console.error("Supabase function error:", error);
          throw new Error(`Supabase function error: ${error.message}`);
        }
        
        if (!data) {
          throw new Error("No response data received from payment service");
        }
        
        console.log("Payment initiation response:", data);
        
        if (data.error) {
          throw new Error(`Payment function error: ${data.error}`);
        }
        
        if (data?.url) {
          handlePaymentRedirect(data);
        } else {
          throw new Error("No payment URL returned");
        }
      } catch (primaryError) {
        console.error("Primary payment method failed:", primaryError);
        
        // Log detailed error information for debugging
        console.error("Primary payment failure details:", {
          message: primaryError.message,
          stack: primaryError.stack,
          name: primaryError.name,
          timestamp: new Date().toISOString()
        });
        
        toast.error("Payment service connection failed", {
          description: "Trying alternate payment method..."
        });
        
        try {
          // Second attempt - Use manual fetching with direct URL
          console.log("Attempt 2: Using direct fetch approach");
          setProcessMessage(`Connecting to payment service (attempt 2)...`);
          
          // Use the imported SUPABASE_URL constant directly
          const functionUrl = `${SUPABASE_URL}/functions/v1/create-assessment-payment`;
          console.log("Direct function URL:", functionUrl);
          
          // Get auth token for authorization
          const { data: { session } } = await supabase.auth.getSession();
          const authToken = session?.access_token || '';
          
          // Enhanced error logging for fetch operations
          console.log("Starting direct fetch with auth token length:", authToken ? authToken.length : 0);
          
          const response = await fetch(functionUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`,
              'Payment-Type': paymentType,
              'Client-Timestamp': new Date().toISOString()
            },
            body: JSON.stringify({ paymentType }),
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error("HTTP error response:", {
              status: response.status,
              statusText: response.statusText,
              body: errorText
            });
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
          }
          
          const data = await response.json();
          console.log("Direct fetch response:", data);
          
          if (data.error) {
            throw new Error(`Payment function error: ${data.error}`);
          }
          
          if (data?.url) {
            handlePaymentRedirect(data);
          } else {
            throw new Error("No payment URL returned");
          }
        } catch (secondaryError) {
          console.error("Secondary payment method failed:", secondaryError);
          throw new Error(`Payment service unavailable. ${primaryError.message}. Backup also failed: ${secondaryError.message}`);
        }
      }
    } catch (err: any) {
      console.error("Exception in payment:", err);
      let errorMessage = err.message || "Unknown error";
      
      // Provide more specific error messages for common issues
      if (errorMessage.includes("NetworkError") || errorMessage.includes("Failed to fetch")) {
        errorMessage = "Network connection error. Please check your internet connection and try again.";
      } else if (errorMessage.includes("timeout") || errorMessage.includes("abort")) {
        errorMessage = "Request timed out. The payment service is taking too long to respond.";
      } else if (errorMessage.includes("token") || errorMessage.includes("auth")) {
        errorMessage = "Authentication error. Please try signing out and back in.";
      }
      
      setPaymentError(`Payment error: ${errorMessage}`);
      toast.error("An unexpected error occurred", {
        description: errorMessage || "Please try again or contact support."
      });
      
      // Reset processing state immediately on error
      setIsProcessing(false);
    }
  };
  
  const handlePaymentRedirect = (data: any) => {
    console.log("Redirecting to payment:", data);
    setProcessMessage("Redirecting to payment page...");
    
    // Save the session ID in local storage for verification later
    if (data.paymentSessionId) {
      localStorage.setItem("pendingPaymentSessionId", data.paymentSessionId);
    }
    
    // Multiple redirect attempts for better reliability
    const stripeUrl = data.url;
    
    // Create and click a link to avoid popup blockers
    const link = document.createElement('a');
    link.href = stripeUrl;
    link.target = '_self';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Fallback direct redirect after a short delay
    setTimeout(() => {
      if (document.visibilityState === 'visible') {
        console.log("Fallback redirect triggered");
        window.location.href = stripeUrl;
      }
    }, 1000);
    
    // Last resort - reset state if we haven't navigated away after 5 seconds
    setTimeout(() => {
      if (document.visibilityState === 'visible') {
        console.log("Still on same page after redirect attempts - resetting state");
        setIsProcessing(false);
        setPaymentError("Failed to redirect to payment page. Please try again.");
        toast.error("Failed to open payment page", {
          description: "Please try again or use a different browser"
        });
      }
    }, 5000);
  };
  
  // Handle manual retry
  const handleRetryPayment = () => {
    resetPaymentState();
    setRetryCount(retryCount + 1);
    toast.info("Retrying payment initialization...");
  };
  
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
          console.log("Verifying payment for session:", sessionId);
          const { data, error } = await supabase.functions.invoke("verify-assessment-payment", {
            body: { paymentSessionId: sessionId }
          });
          
          if (error) {
            console.error("Payment verification error:", error);
            toast.error("Failed to verify payment", {
              description: "Please contact support if your credits don't appear."
            });
            return;
          }
          
          if (data?.error) {
            console.error("Payment verification function error:", data.error);
            toast.error("Payment verification failed", {
              description: data.error || "Please contact support if your credits don't appear."
            });
            return;
          }
          
          if (data?.success) {
            toast.success("Payment successful! Your credits have been added.");
            console.log("Payment verification result:", data);
            fetchCredits(); // Refresh credits data
          } else {
            toast.error(data?.message || "Payment verification failed. Please try again.");
          }
        } catch (err: any) {
          console.error("Exception in payment verification:", err);
          toast.error("An unexpected error occurred verifying your payment", {
            description: err.message || "Please contact support if your credits don't appear."
          });
        } finally {
          setIsProcessing(false);
          setProcessMessage("");
          localStorage.removeItem("pendingPaymentSessionId");
        }
      }
      
      // Check for any pending payments that might have been interrupted
      const pendingSessionId = localStorage.getItem("pendingPaymentSessionId");
      if (pendingSessionId) {
        console.log("Found pending payment session:", pendingSessionId);
        // Remove the pending payment session ID
        localStorage.removeItem("pendingPaymentSessionId");
        
        // If we were redirected back without a session_id in the URL, 
        // the payment was likely cancelled or failed
        toast.info("Previous payment session detected", {
          description: "The payment may have been cancelled or interrupted."
        });
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
        <div className="mt-2 text-sm text-center text-muted-foreground">
          <p>If this takes longer than expected, you can try again</p>
        </div>
        
        {/* Retry button that appears immediately */}
        <div className="mt-6">
          <Button 
            variant="outline"
            onClick={handleRetryPayment}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry Payment
          </Button>
        </div>
      </div>
    );
  }
  
  // Conditional rendering for error state
  if (paymentError) {
    return (
      <div className="container max-w-4xl py-12 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-destructive/10 p-6 rounded-lg text-center max-w-lg mx-auto">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Payment Error</h3>
          <p className="text-muted-foreground mb-6">{paymentError}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" onClick={() => resetPaymentState()}>
              Try Again
            </Button>
            <Button onClick={() => navigate("/")}>
              Return Home
            </Button>
          </div>
          
          {/* Enhanced debug information in collapsible section */}
          <details className="mt-8 text-left text-xs">
            <summary className="cursor-pointer text-muted-foreground">Debug Info</summary>
            <div className="p-2 mt-2 bg-muted/50 rounded text-muted-foreground">
              <p>User ID: {user?.id || 'Not logged in'}</p>
              <p>Browser: {navigator.userAgent}</p>
              <p>Retry Count: {retryCount}</p>
              <p>Page URL: {window.location.href}</p>
              <p>Time: {new Date().toISOString()}</p>
              <p>Supabase URL: {SUPABASE_URL ? 'Set' : 'Not set'}</p>
              <p>Edge Function: create-assessment-payment</p>
            </div>
          </details>
        </div>
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
