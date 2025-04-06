
import React from "react";
import HeroSection from "@/components/home/HeroSection";
import FeatureSection from "@/components/home/FeatureSection";
import TestimonialSection from "@/components/home/TestimonialSection";
import CTASection from "@/components/home/CTASection";
import BackgroundElements from "@/components/home/BackgroundElements";
import PageTransition from "@/components/ui/PageTransition";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
  
  return (
    <PageTransition>
      <div className="relative overflow-hidden">
        <BackgroundElements />
        
        <HeroSection onGetStarted={handleGetStarted} isAuthenticated={!!user} />
        <FeatureSection />
        <TestimonialSection />
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
