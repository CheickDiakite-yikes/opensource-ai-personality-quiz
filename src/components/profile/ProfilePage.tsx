
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAIAnalysis } from "@/hooks/useAIAnalysis";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Award, 
  ChartBar, 
  ArrowLeft, 
  Brain, 
  Lightbulb,
  Sparkles,
  Loader2
} from "lucide-react";
import TopTraitsTable from "./TopTraitsTable";
import ProfileStats from "./ProfileStats";
import ShareProfile from "./ShareProfile";

const ProfilePage: React.FC = () => {
  const { analysis, isLoading } = useAIAnalysis();
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <div className="container max-w-4xl py-8 px-4 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Loading Profile</h1>
          <p className="text-muted-foreground">
            Please wait while we load your personalized profile data...
          </p>
        </div>
      </div>
    );
  }
  
  // If no analysis is available, redirect to assessment
  React.useEffect(() => {
    if (!analysis && !isLoading) {
      navigate("/assessment");
    }
  }, [analysis, navigate, isLoading]);
  
  if (!analysis) {
    return (
      <div className="container max-w-4xl py-8 px-4 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Analysis Available</h1>
          <p className="text-muted-foreground mb-6">
            Please complete the assessment to view your personalized profile.
          </p>
          <Button 
            onClick={() => navigate("/assessment")}
          >
            Take Assessment
          </Button>
        </div>
      </div>
    );
  }
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };
  
  return (
    <div className="container max-w-5xl py-6 md:py-10 px-4 min-h-screen">
      <Button 
        variant="ghost" 
        className="mb-6" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Profile Header with Avatar */}
        <motion.div 
          variants={itemVariants} 
          className="flex flex-col md:flex-row justify-between items-center gap-6 py-4"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-primary/20 shadow-lg avatar-glow">
                <AvatarImage src="/placeholder.svg" alt="Profile" />
                <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary/40 text-2xl font-semibold text-primary-foreground">
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Your Profile</h1>
              <p className="text-muted-foreground">Based on your assessment from {analysis.createdAt ? new Date(analysis.createdAt).toLocaleDateString() : 'recently'}</p>
            </div>
          </div>
          
          <ShareProfile analysis={analysis} />
        </motion.div>
        
        {/* Intelligence Score Card */}
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden gradient-border">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 pb-4">
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2 text-primary" /> Intelligence Profile
              </CardTitle>
              <CardDescription>Your cognitive strengths and intelligence type</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="relative w-32 h-32 flex-shrink-0">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 animate-pulse-subtle"></div>
                  <div className="absolute inset-2 rounded-full bg-card flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{analysis.intelligenceScore}</div>
                      <div className="text-xs text-muted-foreground">Intelligence</div>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 flex items-center">
                    {analysis.intelligence.type} <Sparkles className="h-5 w-5 ml-2 text-amber-500" />
                  </h3>
                  <p className="text-muted-foreground">{analysis.intelligence.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Top 10 Traits */}
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 pb-4">
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-primary" /> Your Top 10 Personality Traits
              </CardTitle>
              <CardDescription>Based on your assessment results</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <TopTraitsTable traits={analysis.traits.slice(0, 10)} />
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Key Insights & Stats */}
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 pb-4">
              <CardTitle className="flex items-center">
                <ChartBar className="h-5 w-5 mr-2 text-primary" /> Key Insights & Stats
              </CardTitle>
              <CardDescription>A deeper look at your personality metrics</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ProfileStats analysis={analysis} />
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Growth Path */}
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden gradient-border">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 pb-4">
              <CardTitle className="flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-primary" /> Your Growth Pathway
              </CardTitle>
              <CardDescription>Personalized development opportunities</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p className="italic text-muted-foreground border-l-4 border-primary/30 pl-4 py-2">
                  "{analysis.roadmap.split('.')[0]}."
                </p>
                
                <h4 className="font-semibold mt-4">Recommended Learning Pathways:</h4>
                <ul className="space-y-2">
                  {analysis.learningPathways.slice(0, 3).map((pathway, index) => (
                    <li key={index} className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary mr-3 mt-0.5">
                        {index + 1}
                      </div>
                      <span>{pathway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
