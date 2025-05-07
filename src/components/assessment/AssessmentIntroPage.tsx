
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useAssessmentCredits } from "@/hooks/useAssessmentCredits";
import { Check, ShieldCheck, Brain, Gem, Sparkles, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import PaymentDebugDialog from "./PaymentDebugDialog";

const AssessmentIntroPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { credits, hasCredits, loading: creditsLoading, fetchCredits } = useAssessmentCredits();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  
  useEffect(() => {
    // Refresh credits when page loads
    fetchCredits();
  }, [fetchCredits]);
  
  const handleStartAssessment = () => {
    if (hasCredits) {
      navigate("/assessment");
    } else {
      toast.error("You need to purchase credits first", {
        description: "Please purchase a credit to take the assessment"
      });
    }
  };
  
  const handlePurchase = async (purchaseType: "single" | "bundle") => {
    if (!user) {
      toast.error("You need to be logged in to make a purchase");
      navigate("/auth");
      return;
    }
    
    try {
      setIsPurchasing(true);
      setPurchaseError(null);
      
      const toastId = toast.loading("Setting up payment...");
      
      console.log("Invoking create-assessment-payment function");
      
      const { data, error } = await supabase.functions.invoke("create-assessment-payment", {
        body: { purchaseType }
      });
      
      if (error) {
        console.error("Error invoking create-assessment-payment:", error);
        throw new Error(error.message || "Error invoking payment function");
      }
      
      console.log("Received response from create-assessment-payment:", data);
      
      toast.dismiss(toastId);
      
      if (data?.url) {
        console.log("Redirecting to Stripe checkout:", data.url);
        toast.success("Redirecting to checkout...");
        
        // Display a toast with information about the test mode
        if (data.url.includes('checkout.stripe.com/test')) {
          toast.info("Using Stripe in test mode", {
            description: "To test, use card number 4242 4242 4242 4242 with any future date and CVC"
          });
        }
        
        // Add a small delay to ensure toast is shown
        setTimeout(() => {
          window.location.href = data.url;
        }, 1500);
      } else {
        throw new Error("No checkout URL returned from payment service");
      }
      
    } catch (error) {
      console.error("Error initiating payment:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Check for specific Stripe key error
      if (errorMessage.includes("Invalid Stripe key format") || errorMessage.includes("Invalid API Key") || errorMessage.includes("Authentication failed")) {
        const adminMessage = "Payment configuration error: Invalid Stripe API key. Please contact support.";
        console.error(adminMessage);
        setPurchaseError(adminMessage);
        
        // Show more details in the toast for admin debugging
        toast.error("Stripe API key issue", {
          description: "The Stripe secret key is invalid or incorrectly formatted. It must be a valid secret key starting with 'sk_'."
        });
      } else {
        setPurchaseError(errorMessage);
        
        toast.error("Failed to initiate payment", {
          description: `Please try again or contact support. Error: ${errorMessage}`
        });
      }
    } finally {
      setIsPurchasing(false);
    }
  };
  
  return (
    <div className="container max-w-4xl py-8 md:py-12 px-4 md:px-6 min-h-screen">
      <motion.div 
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center mb-3">
          <img 
            src="/lovable-uploads/a6a49449-db76-4794-8533-d61d6a85d466.png" 
            alt="Who Am I Logo" 
            className="h-16 w-auto" 
          />
        </div>
        <h1 className="text-4xl font-bold">Who Am I? Assessment</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Discover deep insights about your personality traits, emotional intelligence, cognitive patterns and more
        </p>
      </motion.div>
      
      {purchaseError && (
        <div className="mb-6 p-4 border border-destructive/50 rounded-lg bg-destructive/10">
          <div className="flex gap-2 items-center">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <h3 className="font-medium text-destructive">Payment Error</h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{purchaseError}</p>
          <div className="mt-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPurchaseError(null)}
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-background to-muted/50">
          <CardHeader className="pb-2">
            <Brain className="h-8 w-8 text-primary" />
            <CardTitle>Cognitive Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Understand your unique thinking patterns and decision-making processes</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-background to-muted/50">
          <CardHeader className="pb-2">
            <Gem className="h-8 w-8 text-primary" />
            <CardTitle>Emotional Intelligence</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Gain clarity on your emotional strengths and areas for growth</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-background to-muted/50">
          <CardHeader className="pb-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <CardTitle>Full Personality Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Receive a comprehensive analysis of your personality traits</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-center">Credits and Pricing</h2>
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          {/* Credits status card */}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Your Assessment Credits</CardTitle>
              <CardDescription>Use these to take the assessment</CardDescription>
            </CardHeader>
            <CardContent>
              {creditsLoading ? (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent"></div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span>Available Credits:</span>
                    <span className="text-2xl font-bold">{credits?.credits_remaining || 0}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>Bundle Purchases:</span>
                    <span>{credits?.bundle_purchases || 0}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>Bonus Credits:</span>
                    <span>{credits?.bonus_credits || 0}</span>
                  </div>
                  
                  <Button 
                    className="w-full mt-4" 
                    onClick={handleStartAssessment}
                    disabled={!hasCredits}
                  >
                    {hasCredits ? "Start Assessment" : "Purchase Credits to Start"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Purchase options */}
          <div className="space-y-4 flex-1">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  <span>Single Assessment</span>
                  <span className="text-lg">$2.99</span>
                </CardTitle>
                <CardDescription>1 assessment credit</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="mb-4 space-y-2">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-primary" /> Complete assessment
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-primary" /> Full results report
                  </li>
                </ul>
                <Button
                  onClick={() => handlePurchase("single")}
                  className="w-full"
                  disabled={isPurchasing}
                  variant="outline"
                >
                  {isPurchasing ? "Processing..." : "Purchase Single Credit"}
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-primary">
              <CardHeader className="pb-2 bg-primary/5">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex justify-between items-center w-full">
                    <span>Bundle (Save 11%)</span>
                    <span className="text-lg">$7.99</span>
                  </CardTitle>
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <CardDescription>3 assessment credits</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="mb-4 space-y-2">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-primary" /> 3 complete assessments
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-primary" /> Full results reports
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-primary" /> <span className="font-medium">Save 11% compared to single purchase</span>
                  </li>
                </ul>
                <Button
                  onClick={() => handlePurchase("bundle")}
                  className="w-full"
                  disabled={isPurchasing}
                >
                  {isPurchasing ? "Processing..." : "Purchase Bundle (Best Value)"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Debug dialog for administrators */}
      <PaymentDebugDialog />
    </div>
  );
};

export default AssessmentIntroPage;
