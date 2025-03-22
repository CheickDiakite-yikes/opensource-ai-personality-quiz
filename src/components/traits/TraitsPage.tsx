
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAIAnalysis } from "@/hooks/useAIAnalysis";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import TraitsDetail from "./TraitsDetail";
import { useIsMobile } from "@/hooks/use-mobile";

const TraitsPage: React.FC = () => {
  const { analysis, isLoading } = useAIAnalysis();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Redirect if no analysis is available
  React.useEffect(() => {
    if (!analysis && !isLoading) {
      navigate("/assessment");
    }
  }, [analysis, navigate, isLoading]);
  
  if (isLoading) {
    return (
      <div className={`container max-w-5xl ${isMobile ? 'py-4 px-3' : 'py-6 md:py-10 px-4'}`}>
        <div className="space-y-4 md:space-y-6">
          <div className="h-8 w-40 bg-muted rounded animate-pulse"></div>
          <div className="h-64 bg-muted rounded animate-pulse"></div>
        </div>
      </div>
    );
  }
  
  if (!analysis) {
    return (
      <div className={`container max-w-5xl ${isMobile ? 'py-4 px-3' : 'py-6 md:py-10 px-4'}`}>
        <h2 className="text-2xl font-bold">No analysis found</h2>
        <p className="mt-2">Complete the assessment to view your personality traits.</p>
        <Button onClick={() => navigate("/assessment")} className="mt-4">
          Take Assessment
        </Button>
      </div>
    );
  }
  
  return (
    <div className={`container max-w-5xl ${isMobile ? 'py-4 px-3' : 'py-6 md:py-10 px-4'} min-h-screen`}>
      <Button 
        variant="ghost" 
        className="mb-4 md:mb-6" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 md:space-y-8"
      >
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/20 to-secondary/20 pb-4">
            <CardTitle className="text-foreground mobile-heading">All Personality Traits</CardTitle>
            <CardDescription className="text-foreground/80 mobile-text-sm">Detailed view of all your personality traits from the assessment</CardDescription>
          </CardHeader>
          <CardContent className={`${isMobile ? 'pt-4 px-3' : 'pt-6'}`}>
            <TraitsDetail traits={analysis.traits} />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default TraitsPage;
