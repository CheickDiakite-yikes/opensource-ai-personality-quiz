
import React from "react";
import FeatureSection from "@/components/home/FeatureSection";
import TestimonialSection from "@/components/home/TestimonialSection";
import CTASection from "@/components/home/CTASection";
import GhibliHeroAnimation from "@/components/home/GhibliHeroAnimation";
import PageTransition from "@/components/ui/PageTransition";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    if (user) {
      navigate("/assessment");
    } else {
      navigate("/auth");
    }
  };
  
  const handleLearnMore = () => {
    const featuresElement = document.getElementById("features");
    if (featuresElement) {
      featuresElement.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  return (
    <PageTransition>
      <div className="relative overflow-hidden bg-ghibli-gradient">
        {/* Hero section with animated Ghibli-style scene */}
        <section className="relative pb-4">
          <GhibliHeroAnimation />
          
          {/* Call to action buttons */}
          <div className="container mx-auto px-4 -mt-16 relative z-10">
            <div className="flex flex-col gap-6 justify-center items-center">
              <motion.button 
                onClick={handleGetStarted} 
                className="ghibli-btn group flex items-center justify-center w-full sm:w-64 text-lg"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 2.3 }}
              >
                <span>{user ? "Take Assessment" : "Get Started"}</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <motion.button 
                onClick={handleLearnMore} 
                className="bg-secondary/80 hover:bg-secondary text-secondary-foreground rounded-full px-6 py-3 font-medium shadow-md transition-all duration-300 w-full sm:w-64"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 2.5 }}
              >
                Learn More
              </motion.button>
            </div>
          </div>
          
          {/* Removed the banner element that was here */}
        </section>
        
        {/* Feature section with Ghibli styling */}
        <div id="features">
          <FeatureSection />
        </div>
        
        {/* Testimonial section with Ghibli styling */}
        <TestimonialSection />
        
        {/* CTA section with Ghibli styling */}
        <CTASection 
          title="Start Your Self-Discovery Journey Today"
          description="Unlock insights about your personality, potential, and purpose"
          buttonText={user ? "Take Assessment" : "Sign Up Now"}
          onAction={handleGetStarted}
        />
      </div>
    </PageTransition>
  );
};

export default HomePage;
