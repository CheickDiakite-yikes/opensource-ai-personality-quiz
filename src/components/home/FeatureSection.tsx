
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Brain, PieChart, Lightbulb, Zap, Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const FeatureSection: React.FC = () => {
  const navigate = useNavigate();

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
    <div id="features" className="relative z-10 py-12 md:py-24 overflow-hidden">
      {/* Enhanced Ghibli-inspired background with richer paper texture and organic elements */}
      <div className="absolute inset-0 bg-secondary/20 ghibli-rich-texture overflow-hidden">
        {/* Additional animated forest elements in background */}
        <div className="absolute w-full h-full opacity-10 ghibli-pattern-overlay"></div>
        
        {/* Enhanced decorative background elements */}
        <div className="absolute right-0 top-0 w-40 h-40 md:w-72 md:h-72 opacity-30 md:opacity-40 animate-drift-right">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#66bb6a" d="M45.7,-77.2C59.9,-69.2,72.4,-57.7,79.7,-43.5C87,-29.3,89.1,-12.3,88.6,4.5C88,21.4,84.7,38.2,76.5,52.2C68.2,66.2,54.8,77.4,40,82.7C25.1,88,8.9,87.4,-5.9,84.1C-20.7,80.9,-34,75,-49.1,67.4C-64.2,59.8,-81,50.6,-89.7,36.3C-98.4,22.1,-99.1,2.9,-95.8,-15.6C-92.6,-34.2,-85.5,-52,-72.8,-63.3C-60,-74.7,-41.5,-79.6,-25,-77.7C-8.6,-75.9,6,-79.2,19.9,-79.2C33.7,-79.2,32.6,-85.8,45.7,-77.2Z" transform="translate(100 100) scale(0.8)" />
          </svg>
        </div>
        <div className="absolute left-0 bottom-0 w-40 h-40 md:w-80 md:h-80 opacity-30 md:opacity-40 animate-drift-left">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#81c784" d="M48.2,-69.2C62.5,-62.4,74.4,-49.3,81.1,-33.8C87.7,-18.3,89.2,-0.3,85,15.6C80.8,31.5,71,45.3,58.4,55.6C45.9,65.9,30.5,72.8,14.7,75.1C-1.2,77.4,-17.5,75.2,-33,69.2C-48.4,63.2,-63,53.5,-70.3,39.8C-77.7,26.2,-77.8,8.6,-75.8,-8.6C-73.7,-25.9,-69.5,-42.8,-59.4,-54.1C-49.3,-65.4,-33.4,-71.1,-18.1,-72.7C-2.8,-74.4,12,-76,26.7,-75.6C41.4,-75.1,54,-75.9,48.2,-69.2Z" transform="translate(100 100) scale(0.8)" />
          </svg>
        </div>
        
        {/* Floating leaves animation */}
        <div className="absolute h-full w-full overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div 
              key={`floating-leaf-${i}`} 
              className="floating-leaf" 
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.8}s`,
                opacity: 0.4 + Math.random() * 0.2
              }}
            >
              <Leaf 
                size={12 + Math.random() * 24} 
                className="text-primary/40"
                style={{ transform: `rotate(${Math.random() * 360}deg)` }}
              />
            </div>
          ))}
        </div>
        
        {/* Organic blob shapes */}
        <div className="ghibli-blob opacity-20 w-64 h-64 -top-12 -left-12"></div>
        <div className="ghibli-blob opacity-15 w-80 h-80 -bottom-20 -right-16" 
             style={{ animationDelay: '3s', backgroundColor: 'rgba(142, 209, 125, 0.15)' }}></div>
      </div>
      
      {/* Enhanced Content container with richer styling */}
      <div className="container max-w-6xl mx-auto px-4 py-4 sm:py-10 md:py-16 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16 relative"
        >
          {/* Enhanced decorative elements */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 opacity-50 animate-sway">
            <svg viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20,25 Q35,5 50,25 Q65,45 80,25" stroke="#66bb6a" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M30,15 Q50,35 70,15" stroke="#81c784" strokeWidth="2" strokeLinecap="round" fill="none" />
              <path d="M25,30 Q50,10 75,30" stroke="#a5d6a7" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 4" fill="none" />
            </svg>
          </div>
          
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground ghibli-title">
            How Our Personality Test Works
          </h2>
          <p className="text-lg max-w-3xl mx-auto text-muted-foreground leading-relaxed">
            Our sophisticated AI platform analyzes your responses to provide deeply personalized insights 
            about your personality traits and tailored growth opportunities that truly understand you.
          </p>
        </motion.div>
        
        {/* Enhanced feature cards with better styling for improved accessibility */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.article 
              key={feature.title} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-background/80 backdrop-blur-md rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 border border-primary/10 ghibli-card"
            >
              <div className="h-14 w-14 rounded-lg bg-primary/15 flex items-center justify-center mb-5 ghibli-icon-container">
                <feature.icon className="h-7 w-7 text-primary" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-3 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.article>
          ))}
        </div>
        
        <div className="mt-16 text-center relative">
          {/* Enhanced decorative leaf elements */}
          <div className="absolute -bottom-16 right-1/4 w-20 h-20 opacity-40 animate-drift-left">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50,0 C70,25 100,50 50,100 C0,50 30,25 50,0 Z" fill="#66bb6a" />
            </svg>
          </div>
          <div className="absolute -bottom-8 left-1/4 w-16 h-16 opacity-30 animate-soft-bounce">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50,0 C70,25 100,50 50,100 C0,50 30,25 50,0 Z" fill="#81c784" />
            </svg>
          </div>
          <div className="absolute bottom-0 left-2/3 w-12 h-12 opacity-25 animate-sway">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50,0 C65,30 90,60 50,100 C10,60 35,30 50,0 Z" fill="#a5d6a7" />
            </svg>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Button 
              size="lg" 
              className="ghibli-btn-enhanced px-8 py-6 h-auto rounded-full flex items-center justify-center" 
              onClick={() => navigate("/assessment")} 
              aria-label="Start personality assessment"
            >
              <span className="text-lg">Start Your Self-Discovery Journey</span> 
              <ArrowRight className="ml-3 h-5 w-5" aria-hidden="true" />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
