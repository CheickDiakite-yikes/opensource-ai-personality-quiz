
import React from "react";
import FeatureSection from "@/components/home/FeatureSection";
import TestimonialSection from "@/components/home/TestimonialSection";
import CTASection from "@/components/home/CTASection";
import HeroSection from "@/components/home/HeroSection";
import PageTransition from "@/components/ui/PageTransition";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

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
        {/* Hero section with HeroSection component */}
        <HeroSection onGetStarted={handleGetStarted} isAuthenticated={!!user} />
        
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
