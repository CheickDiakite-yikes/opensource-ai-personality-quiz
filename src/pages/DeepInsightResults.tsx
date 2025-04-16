
import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Sparkles, Brain, Heart, Lightbulb, Compass, ArrowLeft } from "lucide-react";
import { 
  Card, CardHeader, CardTitle, CardDescription, CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { toast } from "sonner";

// Mock AI analysis function (in real app, this would call an API)
const generateMockAnalysis = (responses: Record<string, string>) => {
  // For demo purposes, we'll just return a predefined analysis
  return {
    overview: "You are a thoughtful and introspective individual who carefully weighs options before making decisions. You have a rich inner life and tend to be selective in social situations, preferring meaningful connections over numerous casual acquaintances. Your approach to personal growth is balanced between structured self-improvement and following your intuition.",
    coreTraits: {
      primary: "Analytical Thinker",
      secondary: "Selective Socializer",
      strengths: [
        "Deep critical thinking abilities",
        "Strong attention to detail",
        "Authentic and genuine in relationships",
        "Self-reflective and growth-minded"
      ],
      challenges: [
        "May overthink decisions at times",
        "Can be reluctant to open up in new social settings",
        "Might be too self-critical during setbacks",
        "Sometimes struggles to balance reflection with action"
      ]
    },
    cognitivePatterning: {
      decisionMaking: "You favor a methodical approach to decisions, carefully weighing evidence and options. When faced with complexity, you're likely to spend time analyzing rather than making snap judgments.",
      learningStyle: "Your learning thrives when you can deeply understand concepts rather than memorize facts. You connect new information to existing knowledge frameworks and prefer to master topics thoroughly.",
      attention: "Your attention is selective and deep rather than broad and scattered. You can focus intently on subjects of interest but may tune out when topics don't engage your curiosity."
    },
    emotionalArchitecture: {
      emotionalAwareness: "You have well-developed emotional awareness, particularly regarding your own internal states. You're able to recognize and name your feelings with nuance and understand their origins.",
      regulationStyle: "You tend to process emotions internally before expressing them. This gives you emotional stability but might sometimes create delays in communicating your feelings to others.",
      empathicCapacity: "You have strong empathic abilities, particularly one-on-one. You're able to tune into others' emotional states and respond with appropriate support."
    },
    interpersonalDynamics: {
      attachmentStyle: "Your attachment style shows a preference for deep, meaningful connections with a select group rather than wide social circles. Trust builds gradually for you, but once established, your loyalty is steadfast.",
      communicationPattern: "You communicate thoughtfully and with precision. You value listening and understanding before expressing your own perspective.",
      conflictResolution: "In conflict, you tend to step back to analyze the situation before responding. You prefer finding common ground and mutual understanding over winning arguments."
    },
    growthPotential: {
      developmentAreas: [
        "Embracing more spontaneity in decision-making",
        "Expanding comfort in broader social settings",
        "Balancing self-reflection with active engagement",
        "Communicating emotions more readily with trusted others"
      ],
      recommendations: [
        "Practice making some decisions with less analysis to develop intuitive judgment",
        "Set small, progressive goals for social interaction in new contexts",
        "Establish reflection routines that conclude with concrete action steps",
        "Create regular check-ins with trusted friends to share emotional experiences"
      ]
    }
  };
};

// Result component
const DeepInsightResults = () => {
  const location = useLocation();
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real implementation, this would call an API with the responses
    const responses = location.state?.responses || {};
    
    // Simulate API call with timeout
    const timer = setTimeout(() => {
      const mockResult = generateMockAnalysis(responses);
      setAnalysis(mockResult);
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [location.state]);
  
  if (loading) {
    return (
      <div className="container max-w-4xl py-16 flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <Sparkles className="h-16 w-16 text-primary animate-pulse" />
          <div className="absolute top-0 left-0 h-16 w-16 animate-spin border-4 border-primary border-t-transparent rounded-full opacity-50"></div>
        </div>
        <h2 className="text-2xl font-bold">Generating your deep insight analysis...</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Our AI is carefully analyzing your responses to create a comprehensive personality profile.
        </p>
      </div>
    );
  }
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };
  
  return (
    <motion.div 
      className="container max-w-4xl py-8 px-4 md:px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-2">
          <Link to="/deep-insight">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Assessment
            </Button>
          </Link>
        </div>
        
        <header className="text-center">
          <motion.div 
            className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full text-primary mb-4"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            <Sparkles className="h-6 w-6" />
          </motion.div>
          <motion.h1 
            className="text-3xl md:text-4xl font-bold mb-2"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            Your Deep Insight Analysis
          </motion.h1>
          <motion.p 
            className="text-muted-foreground max-w-2xl mx-auto"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            Based on your responses, we've created a comprehensive analysis of your personality,
            cognitive patterns, and potential growth areas.
          </motion.p>
        </header>
        
        {/* Overview */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={3}
        >
          <Card>
            <CardHeader>
              <CardTitle>Personal Overview</CardTitle>
              <CardDescription>A summary of your core personality traits</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{analysis.overview}</p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-secondary/20 p-4 rounded-md">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <div className="bg-primary/20 p-1.5 rounded-full mr-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    Primary Type
                  </h3>
                  <p>{analysis.coreTraits.primary}</p>
                </div>
                <div className="bg-secondary/20 p-4 rounded-md">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <div className="bg-primary/20 p-1.5 rounded-full mr-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    Secondary Type
                  </h3>
                  <p>{analysis.coreTraits.secondary}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Detailed Analysis Tabs */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={4}
        >
          <Tabs defaultValue="cognitive" className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="cognitive" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                <span className="hidden sm:inline">Cognitive</span>
              </TabsTrigger>
              <TabsTrigger value="emotional" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Emotional</span>
              </TabsTrigger>
              <TabsTrigger value="interpersonal" className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                <span className="hidden sm:inline">Interpersonal</span>
              </TabsTrigger>
              <TabsTrigger value="growth" className="flex items-center gap-2">
                <Compass className="h-4 w-4" />
                <span className="hidden sm:inline">Growth</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="cognitive">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    Cognitive Patterning
                  </CardTitle>
                  <CardDescription>How you process information and make decisions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Decision Making Style</h3>
                    <p>{analysis.cognitivePatterning.decisionMaking}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Learning Approach</h3>
                    <p>{analysis.cognitivePatterning.learningStyle}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Attention Pattern</h3>
                    <p>{analysis.cognitivePatterning.attention}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="emotional">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Emotional Architecture
                  </CardTitle>
                  <CardDescription>How you experience and manage emotions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Emotional Awareness</h3>
                    <p>{analysis.emotionalArchitecture.emotionalAwareness}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Regulation Style</h3>
                    <p>{analysis.emotionalArchitecture.regulationStyle}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Empathic Capacity</h3>
                    <p>{analysis.emotionalArchitecture.empathicCapacity}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="interpersonal">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    Interpersonal Dynamics
                  </CardTitle>
                  <CardDescription>How you relate to and interact with others</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Attachment Style</h3>
                    <p>{analysis.interpersonalDynamics.attachmentStyle}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Communication Pattern</h3>
                    <p>{analysis.interpersonalDynamics.communicationPattern}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Conflict Resolution</h3>
                    <p>{analysis.interpersonalDynamics.conflictResolution}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="growth">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Compass className="h-5 w-5 text-primary" />
                    Growth Potential
                  </CardTitle>
                  <CardDescription>Areas for development and personal evolution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Development Areas</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {analysis.growthPotential.developmentAreas.map((area: string, i: number) => (
                        <li key={i}>{area}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Recommendations</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {analysis.growthPotential.recommendations.map((rec: string, i: number) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
        
        {/* Strengths and Challenges */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={5}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Core Strengths</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2">
                  {analysis.coreTraits.strengths.map((strength: string, i: number) => (
                    <li key={i}>{strength}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Growth Challenges</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2">
                  {analysis.coreTraits.challenges.map((challenge: string, i: number) => (
                    <li key={i}>{challenge}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </motion.div>
        
        {/* Actions */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={6}
          className="flex justify-center"
        >
          <Button 
            className="flex items-center gap-2" 
            onClick={() => toast.success("Report saved to your profile!")}
          >
            <Sparkles className="h-4 w-4" />
            Save This Analysis
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DeepInsightResults;
