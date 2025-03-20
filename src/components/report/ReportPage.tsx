
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAIAnalysis } from "@/hooks/useAIAnalysis";
import ReportHeader from "./ReportHeader";
import OverviewSection from "./sections/OverviewSection";
import PersonalityTraitsSection from "./sections/PersonalityTraitsSection";
import IntelligenceSection from "./sections/IntelligenceSection";
import MotivationSection from "./sections/MotivationSection";
import GrowthAreasSection from "./sections/GrowthAreasSection";
import CareerValuesSection from "./sections/CareerValuesSection";
import RelationshipLearningSection from "./sections/RelationshipLearningSection";
import RoadmapSection from "./sections/RoadmapSection";

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
          <button 
            className="bg-primary text-primary-foreground px-4 py-2 rounded"
            onClick={() => navigate("/assessment")}
          >
            Take Assessment
          </button>
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
  
  return (
    <div className="container max-w-5xl py-6 md:py-10 px-4 min-h-screen">
      <ReportHeader />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Overview */}
        <OverviewSection analysis={analysis} />
        
        {/* Top Traits */}
        <PersonalityTraitsSection traits={analysis.traits} />
        
        {/* Intelligence */}
        <IntelligenceSection analysis={analysis} />
        
        {/* Motivators & Inhibitors */}
        <MotivationSection 
          motivators={analysis.motivators} 
          inhibitors={analysis.inhibitors} 
        />
        
        {/* Growth Areas */}
        <GrowthAreasSection 
          weaknesses={analysis.weaknesses} 
          growthAreas={analysis.growthAreas} 
        />
        
        {/* Careers and Values */}
        <CareerValuesSection 
          careerSuggestions={analysis.careerSuggestions} 
          valueSystem={analysis.valueSystem} 
        />
        
        {/* Relationship Patterns and Learning Pathways */}
        <RelationshipLearningSection 
          relationshipPatterns={analysis.relationshipPatterns} 
          learningPathways={analysis.learningPathways} 
        />
        
        {/* Roadmap */}
        <RoadmapSection roadmap={analysis.roadmap} />
      </motion.div>
    </div>
  );
};

export default ReportPage;
