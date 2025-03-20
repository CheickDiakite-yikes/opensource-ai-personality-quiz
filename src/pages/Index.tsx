
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthForm from "@/components/auth/AuthForm";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Star, 
  Sparkles, 
  Brain, 
  Users, 
  PieChart, 
  Zap, 
  Lightbulb 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  
  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setTimeout(() => {
      navigate("/assessment");
    }, 1000);
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };
  
  // Fixed animation variants with proper typing
  const floatingIconsVariants = {
    initial: { y: 0 },
    animate: { 
      y: [0, -15, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "mirror" as "mirror",
        ease: "easeInOut",
        delay: Math.random() * 2
      }
    }
  };

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

  // Testimonials
  const testimonials = [
    {
      quote: "This app helped me understand why I react to situations the way I do. Game-changing!",
      author: "Sarah K.",
      role: "Marketing Director"
    },
    {
      quote: "The personalized growth plan is exactly what I needed to make meaningful changes.",
      author: "Michael T.",
      role: "Software Engineer"
    },
    {
      quote: "The assessment was so accurate! I finally feel like I understand myself better.",
      author: "Jessica L.",
      role: "Teacher"
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 overflow-hidden relative">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 opacity-10 animate-rotate-glow">
            <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-r from-blue-400 to-purple-500 blur-3xl" />
          </div>
          <div className="absolute bottom-20 right-10 opacity-10 animate-pulse-subtle">
            <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 blur-3xl" />
          </div>
          <div className="absolute top-1/4 right-1/4 opacity-10">
            <div className="w-[300px] h-[300px] rounded-full bg-gradient-to-r from-pink-400 to-purple-400 blur-3xl" />
          </div>
        </div>
        
        {/* Floating Icons */}
        <motion.div 
          className="absolute top-20 right-20 text-primary/20"
          variants={floatingIconsVariants}
          initial="initial"
          animate="animate"
        >
          <Brain size={40} />
        </motion.div>
        <motion.div 
          className="absolute bottom-40 left-20 text-primary/20"
          variants={floatingIconsVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 1 }}
        >
          <Star size={30} />
        </motion.div>
        <motion.div 
          className="absolute top-40 left-[40%] text-primary/20"
          variants={floatingIconsVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.5 }}
        >
          <Sparkles size={35} />
        </motion.div>
        <motion.div 
          className="absolute bottom-80 right-[30%] text-primary/20"
          variants={floatingIconsVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 1.5 }}
        >
          <Users size={38} />
        </motion.div>
        
        {/* Hero Section */}
        <div className="container max-w-6xl mx-auto px-4 py-12 md:py-20 relative z-10">
          <motion.div 
            className="grid md:grid-cols-2 gap-12 items-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="text-center md:text-left">
              <Badge variant="outline" className="mb-4 px-3 py-1 text-sm bg-primary/10 border-primary/20">
                <Sparkles className="h-3.5 w-3.5 mr-1.5" /> AI-Powered Self-Discovery
              </Badge>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block mb-6"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Discover Your <span className="text-gradient">True Self</span>
                </h1>
              </motion.div>
              
              <motion.p 
                variants={itemVariants}
                className="text-xl md:text-2xl text-muted-foreground mb-8"
              >
                AI-powered insights to understand your personality and become the best version of yourself.
              </motion.p>
              
              <motion.div variants={itemVariants} className="space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row items-center justify-center md:justify-start">
                <Button 
                  size="lg" 
                  className="px-8 h-12 rounded-full shadow-lg"
                  onClick={() => navigate("/assessment")}
                >
                  Start Assessment <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="px-8 h-12 rounded-full"
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Learn More
                </Button>
              </motion.div>
              
              <motion.div 
                variants={itemVariants}
                className="mt-12 flex flex-wrap justify-center md:justify-start gap-6"
              >
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <span className="text-primary font-semibold">50</span>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Insightful Questions</p>
                    <p className="text-muted-foreground">Tailored to understand you</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <span className="text-primary font-semibold">AI</span>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Advanced Analysis</p>
                    <p className="text-muted-foreground">Powered by AI technology</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <span className="text-primary font-semibold">❤️</span>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Growth Tracking</p>
                    <p className="text-muted-foreground">Gamified self-improvement</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="relative">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                className="relative z-10"
              >
                <AuthForm onSuccess={handleAuthSuccess} />
              </motion.div>
              
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-3xl blur-xl -z-10 transform scale-95 translate-y-4" />
            </motion.div>
          </motion.div>
        </div>
        
        {/* Features Section */}
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
        
        {/* Testimonials Section */}
        <div className="py-20 relative z-10">
          <div className="container max-w-6xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Others Say</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join thousands who have transformed their lives through self-discovery.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.author}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="bg-background rounded-xl p-6 shadow-lg border border-border"
                >
                  <div className="flex gap-2 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-lg mb-6 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-muted-foreground text-sm">{testimonial.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary/10 to-blue-400/10 py-20 relative z-10">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Discover Your True Self?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Take the first step toward self-discovery and personal growth today.
              </p>
              <Button 
                size="lg" 
                className="px-10 py-6 h-auto text-lg rounded-full shadow-lg"
                onClick={() => navigate("/assessment")}
              >
                Start Assessment <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
