
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAIAnalysis } from "@/hooks/useAIAnalysis";
import {
  Download,
  ArrowRight,
  Award,
  Brain,
  Heart,
  Lightbulb,
  Zap,
  PieChart,
  Briefcase,
  BookOpen,
  BarChart,
} from "lucide-react";
import PersonalityTraitCard from "./PersonalityTraitCard";
import IntelligenceDomainChart from "./IntelligenceDomainChart";
import CareerSuggestions from "./CareerSuggestions";
import RelationshipPatterns from "./RelationshipPatterns";
import LearningPathways from "./LearningPathways";

const ReportPage: React.FC = () => {
  const { analysis } = useAIAnalysis();
  const navigate = useNavigate();
  
  // If no analysis is available, redirect to assessment
  React.useEffect(() => {
    if (!analysis) {
      // In a real app, you might check for saved analysis in localStorage or a database
      navigate("/assessment");
    }
  }, [analysis, navigate]);
  
  if (!analysis) {
    return (
      <div className="container max-w-4xl py-8 px-4 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Analysis Available</h1>
          <p className="text-muted-foreground mb-6">
            Please complete the assessment to view your personalized report.
          </p>
          <Button onClick={() => navigate("/assessment")}>
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
      <div className="flex justify-between items-start mb-8 flex-col md:flex-row">
        <div>
          <h1 className="text-3xl font-bold">Your Analysis Report</h1>
          <p className="text-muted-foreground mt-2">
            Based on your assessment responses
          </p>
        </div>
        <Button variant="outline" className="flex items-center mt-4 md:mt-0" onClick={() => console.log("Download report")}>
          <Download className="h-4 w-4 mr-2" /> Download Report
        </Button>
      </div>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Overview */}
        <motion.div variants={itemVariants}>
          <Card className="glass-panel overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 pb-4">
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-primary" /> Overview
              </CardTitle>
              <CardDescription>Your personality at a glance</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-lg leading-relaxed">{analysis.overview}</p>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card/30 p-4 rounded-lg border border-border/40">
                  <div className="flex items-center mb-2">
                    <Brain className="h-5 w-5 mr-2 text-primary" />
                    <h3 className="text-sm font-medium">Intelligence Score</h3>
                  </div>
                  <div className="text-2xl font-bold">{analysis.intelligenceScore}/100</div>
                </div>
                
                <div className="bg-card/30 p-4 rounded-lg border border-border/40">
                  <div className="flex items-center mb-2">
                    <Heart className="h-5 w-5 mr-2 text-primary" />
                    <h3 className="text-sm font-medium">Emotional Intelligence</h3>
                  </div>
                  <div className="text-2xl font-bold">{analysis.emotionalIntelligenceScore}/100</div>
                </div>
                
                <div className="bg-card/30 p-4 rounded-lg border border-border/40">
                  <div className="flex items-center mb-2">
                    <PieChart className="h-5 w-5 mr-2 text-primary" />
                    <h3 className="text-sm font-medium">Cognitive Style</h3>
                  </div>
                  <div className="text-md font-medium">{analysis.cognitiveStyle.primary}</div>
                  <div className="text-sm text-muted-foreground">{analysis.cognitiveStyle.secondary}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Top Traits */}
        <motion.div variants={itemVariants}>
          <Card className="glass-panel overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 pb-4">
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-primary" /> Top Personality Traits
              </CardTitle>
              <CardDescription>Your most prominent characteristics</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {analysis.traits.slice(0, 5).map((trait, index) => (
                  <PersonalityTraitCard key={index} trait={trait} index={index} />
                ))}
                
                {analysis.traits.length > 5 && (
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => navigate("/traits")}
                  >
                    View All {analysis.traits.length} Traits
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Intelligence */}
        <motion.div variants={itemVariants}>
          <Card className="glass-panel overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 pb-4">
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2 text-primary" /> Intelligence Profile
              </CardTitle>
              <CardDescription>Your cognitive strengths and style</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <h3 className="font-medium">Intelligence Score</h3>
                  <span className="font-semibold">{analysis.intelligenceScore}/100</span>
                </div>
                <Progress value={analysis.intelligenceScore} className="h-2" />
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium text-lg mb-2">Type: {analysis.intelligence.type}</h3>
                <p className="text-muted-foreground mb-4">{analysis.intelligence.description}</p>
                
                <h4 className="font-medium text-md mb-3 flex items-center">
                  <BarChart className="h-4 w-4 mr-2 text-primary" />
                  Intelligence Domains
                </h4>
                
                <IntelligenceDomainChart domains={analysis.intelligence.domains} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Motivators & Inhibitors */}
        <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6">
          <Card className="glass-panel overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 pb-4">
              <CardTitle className="flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-primary" /> Motivators
              </CardTitle>
              <CardDescription>What drives you forward</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-2">
                {analysis.motivators.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-flex items-center justify-center rounded-full bg-primary/10 h-6 w-6 text-sm text-primary mr-3 mt-0.5 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card className="glass-panel overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-red-500/10 to-orange-500/10 pb-4">
              <CardTitle className="flex items-center">
                <Heart className="h-5 w-5 mr-2 text-primary" /> Inhibitors
              </CardTitle>
              <CardDescription>What may hold you back</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-2">
                {analysis.inhibitors.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-flex items-center justify-center rounded-full bg-primary/10 h-6 w-6 text-sm text-primary mr-3 mt-0.5 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Growth Areas */}
        <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6">
          <Card className="glass-panel overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-rose-500/10 to-red-500/10 pb-4">
              <CardTitle>Weaknesses</CardTitle>
              <CardDescription>Areas that may need attention</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-2">
                {analysis.weaknesses.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-flex items-center justify-center rounded-full bg-primary/10 h-6 w-6 text-sm text-primary mr-3 mt-0.5 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card className="glass-panel overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 pb-4">
              <CardTitle>Growth Areas</CardTitle>
              <CardDescription>Opportunities for development</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-2">
                {analysis.growthAreas.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-flex items-center justify-center rounded-full bg-primary/10 h-6 w-6 text-sm text-primary mr-3 mt-0.5 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Careers and Values */}
        <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6">
          <CareerSuggestions careers={analysis.careerSuggestions} />
          
          <Card className="glass-panel overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 pb-4">
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-primary" /> Your Core Values
              </CardTitle>
              <CardDescription>Principles that guide your decisions</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {analysis.valueSystem.map((value, index) => (
                  <div
                    key={index}
                    className="border border-border/40 p-3 rounded-md flex items-center bg-card/30"
                  >
                    <span className="inline-flex items-center justify-center rounded-full bg-primary/10 h-6 w-6 text-sm text-primary mr-3 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Relationship Patterns and Learning Pathways */}
        <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6">
          <RelationshipPatterns relationshipPatterns={analysis.relationshipPatterns} />
          <LearningPathways pathways={analysis.learningPathways} />
        </motion.div>
        
        {/* Roadmap */}
        <motion.div variants={itemVariants}>
          <Card className="glass-panel overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-violet-500/10 pb-4">
              <CardTitle className="flex items-center">
                <ArrowRight className="h-5 w-5 mr-2 text-primary" /> Your Personalized Roadmap
              </CardTitle>
              <CardDescription>Steps to become your best self</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-lg leading-relaxed">{analysis.roadmap}</p>
              
              <div className="mt-8">
                <Button 
                  className="w-full sm:w-auto" 
                  onClick={() => navigate("/tracker")}
                >
                  Begin Your Growth Journey
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ReportPage;
