
import React from "react";
import FeatureSection from "@/components/home/FeatureSection";
import TestimonialSection from "@/components/home/TestimonialSection";
import CTASection from "@/components/home/CTASection";
import GhibliHeroAnimation from "@/components/home/GhibliHeroAnimation";
import PageTransition from "@/components/ui/PageTransition";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
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
        <section className="relative">
          <GhibliHeroAnimation />
          
          {/* Features section starts immediately after the hero */}
          <div id="features" className="pt-8">
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
        </section>
      </div>
    </PageTransition>
  );
};

export default HomePage;
