
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Brain, PieChart, Lightbulb, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const FeatureSection: React.FC = () => {
  const navigate = useNavigate();
  
  // Features for the landing page
  const features = [
    {
      icon: Brain,
      title: "Personality Insights",
      description: "Discover your unique traits and how they shape your behavior"
    },
    {
      icon: PieChart,
      title: "Detailed Analysis",
      description: "Get a comprehensive breakdown of your strengths and growth areas"
    },
    {
      icon: Lightbulb,
      title: "Growth Roadmap",
      description: "Follow a personalized path to become your best self"
    },
    {
      icon: Zap,
      title: "Activity Tracker",
      description: "Track your progress with gamified self-improvement tasks"
    }
  ];

  return (
    <div id="features" className="bg-secondary/50 py-20 relative z-10">
      <div className="container max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered platform analyzes your responses to provide deep insights about your personality and tailored growth opportunities.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-background rounded-xl p-6 shadow-lg border border-border hover:shadow-xl transition-shadow"
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Button 
              size="lg" 
              className="px-8 rounded-full"
              onClick={() => navigate("/assessment")}
            >
              Start Your Journey <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
