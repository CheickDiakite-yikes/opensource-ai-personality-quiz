
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Brain, PieChart, Lightbulb, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const FeatureSection: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Features for the landing page with enhanced SEO content
  const features = [
    {
      icon: Brain,
      title: "Advanced Personality Insights",
      description: "Our AI analyzes your unique traits and behaviors to deliver a comprehensive personality profile that truly understands you"
    },
    {
      icon: PieChart,
      title: "Detailed Intelligence Analysis",
      description: "Discover your cognitive strengths and multiple intelligence types with in-depth breakdowns of your mental capabilities"
    },
    {
      icon: Lightbulb,
      title: "Personalized Growth Roadmap",
      description: "Follow a tailored development path based on your assessment results to become your authentic best self"
    },
    {
      icon: Zap,
      title: "Interactive Progress Tracker",
      description: "Monitor your personal growth journey with engaging self-improvement activities designed for your personality type"
    }
  ];

  return (
    <div id="features" className="bg-secondary/50 py-16 md:py-20 relative z-10">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">How Our Personality Test Works</h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Our sophisticated AI platform analyzes your responses to provide deeply personalized insights about your personality traits and tailored growth opportunities that truly understand you.
          </p>
        </motion.div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
          {features.map((feature, index) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-background rounded-xl p-4 sm:p-6 shadow-lg border border-border hover:shadow-xl transition-shadow h-full"
            >
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" aria-hidden="true" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm sm:text-base text-muted-foreground">{feature.description}</p>
            </motion.article>
          ))}
        </div>
        
        <div className="mt-10 md:mt-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Button 
              size={isMobile ? "default" : "lg"} 
              className={`px-6 sm:px-8 rounded-full ${isMobile ? 'py-2.5' : ''}`}
              onClick={() => navigate("/assessment")}
              aria-label="Start personality assessment"
            >
              Start Your Self-Discovery Journey <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
