import React from "react";
import FeatureSection from "@/components/home/FeatureSection";
import TestimonialSection from "@/components/home/TestimonialSection";
import CTASection from "@/components/home/CTASection";
import GhibliHeroAnimation from "@/components/home/GhibliHeroAnimation";
import PageTransition from "@/components/ui/PageTransition";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
const HomePage: React.FC = () => {
  const {
    user
  } = useAuth();
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
      featuresElement.scrollIntoView({
        behavior: "smooth"
      });
    }
  };
  return <PageTransition>
      <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white">
        {/* Hero section with animated Ghibli-style scene */}
        <section className="relative">
          <GhibliHeroAnimation />
          
          {/* Call to action buttons */}
          <div className="container mx-auto px-4 -mt-32 md:-mt-28 relative z-10">
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <motion.button onClick={handleGetStarted} className="ghibli-btn-enhanced group flex items-center justify-center w-full sm:w-64 text-lg" whileHover={{
              scale: 1.03
            }} whileTap={{
              scale: 0.97
            }} initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.5,
              delay: 2.3
            }}>
                <span>{user ? "Take Assessment" : "Get Started"}</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <motion.button onClick={handleLearnMore} className="ghibli-btn-secondary flex items-center justify-center w-full sm:w-64 text-lg" whileHover={{
              scale: 1.03
            }} whileTap={{
              scale: 0.97
            }} initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.5,
              delay: 2.5
            }}>
                <span>Learn More</span>
                <Sparkles className="ml-2 h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </section>
        
        {/* Feature section with Ghibli styling */}
        <div id="features" className="pt-12 py-0">
          <FeatureSection />
        </div>
        
        {/* Testimonial section with Ghibli styling */}
        <TestimonialSection />
        
        {/* CTA section with Ghibli styling */}
        <CTASection title="Start Your Self-Discovery Journey Today" description="Unlock insights about your personality, potential, and purpose" buttonText={user ? "Take Assessment" : "Sign Up Now"} onAction={handleGetStarted} />
      </div>
    </PageTransition>;
};
export default HomePage;