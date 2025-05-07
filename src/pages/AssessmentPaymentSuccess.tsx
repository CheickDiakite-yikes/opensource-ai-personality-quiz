
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const AssessmentPaymentSuccess: React.FC = () => {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    // Automatically redirect to assessment intro after countdown
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      navigate("/assessment");
    }
  }, [countdown, navigate]);

  return (
    <motion.div 
      className="container max-w-2xl py-16 flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-green-100 dark:bg-green-900/30 p-5 rounded-full mb-6">
        <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
      </div>
      
      <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Thank you for your purchase. Your assessment credits have been applied to your account.
      </p>
      
      <div className="flex flex-col items-center gap-2 mb-8">
        <div className="text-lg">Redirecting to assessment in</div>
        <div className="bg-primary/10 text-primary font-bold text-2xl h-12 w-12 rounded-full flex items-center justify-center">
          {countdown}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild>
          <Link to="/assessment">
            Start Assessment Now
          </Link>
        </Button>
        
        {user && (
          <Button variant="outline" asChild>
            <Link to="/profile">
              <CreditCard className="mr-2 h-4 w-4" />
              View My Credits
            </Link>
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default AssessmentPaymentSuccess;
