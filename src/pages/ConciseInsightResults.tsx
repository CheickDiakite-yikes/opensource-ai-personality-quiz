
import React from "react";
import { motion } from "framer-motion";
import { useConciseInsightResults } from "@/features/concise-insight/hooks/useConciseInsightResults";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Share2, Download, Brain, HeartHandshake, Users, Lightbulb, Star, Sparkles, RefreshCw } from "lucide-react";
import { TabContent } from "@/features/concise-insight/components/report-tabs/TabContent";
import { toast } from "sonner";

// Loading component
const ResultsLoading = () => (
  <div className="container max-w-4xl py-12 px-4 flex flex-col items-center justify-center min-h-[400px]">
    <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4" />
    <h2 className="text-2xl font-bold">Generating Your Analysis</h2>
    <p className="text-muted-foreground max-w-md text-center mt-2">
      Our AI is analyzing your responses to create personalized insights.
      This may take a moment...
    </p>
  </div>
);

// Error component
const ResultsError = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="container max-w-4xl py-12 px-4 flex flex-col items-center justify-center min-h-[400px]">
    <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
      <span className="text-destructive text-2xl">!</span>
    </div>
    <h2 className="text-2xl font-bold">Analysis Error</h2>
    <p className="text-muted-foreground max-w-md text-center mt-2">
      {error || "There was an error generating your analysis. Please try again."}
    </p>
    <Button className="mt-6" onClick={onRetry}>
      Try Again
    </Button>
  </div>
);

// Main component
const ConciseInsightResults: React.FC = () => {
  const { analysis, loading, error, refreshAnalysis } = useConciseInsightResults();
  
  const handleRefresh = () => {
    toast.loading("Refreshing your analysis...");
    refreshAnalysis();
  };
  
  if (loading) {
    return <ResultsLoading />;
  }
  
  if (error || !analysis) {
    return <ResultsError error={error || "No analysis data found"} onRetry={refreshAnalysis} />;
  }
  
  return (
    <motion.div 
      className="container max-w-4xl py-8 px-4 md:px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex flex-col gap-8">
        <header className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Personality Analysis</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover insights about your personality traits, cognitive patterns, and emotional architecture
          </p>
        </header>
        
        {/* Overview Card */}
        <Card className="border-2 border-primary/10">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Star className="h-6 w-6 text-primary" />
              Personal Overview
            </CardTitle>
            <CardDescription>A summary of your core personality traits and patterns</CardDescription>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none space-y-4">
            <p>{analysis.overview}</p>
            
            {/* Display Uniqueness Markers if they exist */}
            {analysis.uniquenessMarkers && Array.isArray(analysis.uniquenessMarkers) && analysis.uniquenessMarkers.length > 0 && (
              <div className="pt-2">
                <h3 className="flex items-center gap-2 text-lg font-medium border-b pb-1">
                  <Sparkles className="h-5 w-5 text-primary" /> What Makes You Distinctive
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  {analysis.uniquenessMarkers.map((marker, i) => (
                    <li key={i}>{marker}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Core Archetype */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Your Core Archetype
            </CardTitle>
            <CardDescription>Your dominant personality pattern</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">
                  Primary: <Badge variant="outline" className="ml-2">{analysis.coreProfiling.primaryArchetype}</Badge>
                </h3>
                <h4 className="text-lg font-medium mb-2">
                  Secondary: <Badge variant="outline" className="ml-2">{analysis.coreProfiling.secondaryArchetype}</Badge>
                </h4>
              </div>
            </div>
            <p className="text-muted-foreground">{analysis.coreProfiling.description}</p>
          </CardContent>
        </Card>
        
        {/* Main Tabs */}
        <Tabs defaultValue="cognitive">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="cognitive" className="flex items-center gap-1">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">Cognitive</span>
            </TabsTrigger>
            <TabsTrigger value="emotional" className="flex items-center gap-1">
              <HeartHandshake className="h-4 w-4" />
              <span className="hidden sm:inline">Emotional</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Social</span>
            </TabsTrigger>
            <TabsTrigger value="growth" className="flex items-center gap-1">
              <Lightbulb className="h-4 w-4" />
              <span className="hidden sm:inline">Growth</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="cognitive" className="mt-0">
            <TabContent tabValue="cognitive" analysis={analysis} />
          </TabsContent>
          
          <TabsContent value="emotional" className="mt-0">
            <TabContent tabValue="emotional" analysis={analysis} />
          </TabsContent>
          
          <TabsContent value="social" className="mt-0">
            <TabContent tabValue="social" analysis={analysis} />
          </TabsContent>
          
          <TabsContent value="growth" className="mt-0">
            <TabContent tabValue="growth" analysis={analysis} />
          </TabsContent>
        </Tabs>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" /> Download PDF
          </Button>
          <Button variant="secondary" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" /> Share Results
          </Button>
          <Button variant="ghost" className="flex items-center gap-2" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" /> Refresh Analysis
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ConciseInsightResults;
