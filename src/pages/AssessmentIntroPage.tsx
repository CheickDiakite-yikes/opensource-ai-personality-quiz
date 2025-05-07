
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, CreditCard, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import PaymentDebugDialog from '@/components/assessment/PaymentDebugDialog';

const AssessmentIntroPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDebugDialog, setShowDebugDialog] = useState(false);
  const [hasAttemptedPayment, setHasAttemptedPayment] = useState(false);

  const handleStartAssessment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Starting payment process for user:', user?.id);
      const { data, error } = await supabase.functions.invoke('create-assessment-payment', {
        body: { 
          returnUrl: `${window.location.origin}/assessment`,
        }
      });

      if (error) {
        console.error('Error creating payment session:', error);
        setError(`Payment error: ${error.message}`);
        toast.error('Could not create payment session', { 
          description: error.message
        });
        return;
      }

      if (!data || !data.url) {
        console.error('Invalid response from payment function:', data);
        setError('Could not generate payment link. Please try again later.');
        toast.error('Invalid payment response', {
          description: 'The system could not generate a valid payment link'
        });
        return;
      }

      console.log('Payment session created successfully, redirecting to:', data.url);
      setHasAttemptedPayment(true);
      
      // Add a short delay before redirecting to allow the toast to be seen
      toast.success('Redirecting to secure payment...', {
        duration: 2000,
      });
      
      setTimeout(() => {
        window.location.href = data.url;
      }, 1500);

    } catch (err) {
      console.error('Exception during payment process:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      toast.error('Payment system error', {
        description: err instanceof Error ? err.message : 'Please try again later'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = user?.email === 'admin@example.com' || user?.email?.includes('admin');

  return (
    <div className="container max-w-4xl py-12">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-serif font-bold mb-2">Premium Assessment</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Gain deep insights into your personality, strengths, and growth areas with our 
            comprehensive psychological assessment.
          </p>
        </div>

        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Premium Assessment
            </CardTitle>
            <CardDescription>
              Our complete personality assessment with detailed analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Comprehensive Analysis</p>
                  <p className="text-sm text-muted-foreground">
                    Detailed assessment of your personality traits, cognitive patterns, and emotional intelligence
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Personalized Growth Roadmap</p>
                  <p className="text-sm text-muted-foreground">
                    Tailored recommendations for personal development based on your unique profile
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Career & Relationship Insights</p>
                  <p className="text-sm text-muted-foreground">
                    Discover ideal career paths and relationship patterns that match your personality
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Payment Error</AlertTitle>
                <AlertDescription className="text-xs">
                  {error}
                  {isAdmin && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2 text-xs h-7" 
                      onClick={() => setShowDebugDialog(true)}
                    >
                      Debug Payment
                    </Button>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Price</p>
                  <p className="text-sm text-muted-foreground">One-time payment</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">$19.99</p>
                  <p className="text-xs text-muted-foreground">USD</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              size="lg"
              onClick={handleStartAssessment}
              disabled={isLoading || hasAttemptedPayment}
            >
              {isLoading ? (
                <>Processing...</>
              ) : hasAttemptedPayment ? (
                <>Redirecting to payment...</>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Start Assessment ($19.99)
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        <div className="text-center text-sm text-muted-foreground">
          <p>Secure payment processing provided by Stripe</p>
          <p className="mt-1">
            Already purchased?{" "}
            <Button variant="link" className="p-0 h-auto text-sm" onClick={() => navigate("/assessment")}>
              Go to Assessment
            </Button>
          </p>
          
          {isAdmin && (
            <div className="mt-4 text-xs bg-muted p-2 rounded-md inline-block">
              <p>Admin Controls</p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-7 mt-1" 
                onClick={() => setShowDebugDialog(true)}
              >
                Debug Payment System
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {showDebugDialog && (
        <PaymentDebugDialog 
          open={showDebugDialog}
          onClose={() => setShowDebugDialog(false)}
        />
      )}
    </div>
  );
};

export default AssessmentIntroPage;
