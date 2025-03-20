
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "@/components/home/HeroSection";
import FeatureSection from "@/components/home/FeatureSection";
import TestimonialSection from "@/components/home/TestimonialSection";
import CTASection from "@/components/home/CTASection";
import BackgroundElements from "@/components/home/BackgroundElements";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  
  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setTimeout(() => {
      navigate("/assessment");
    }, 1000);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 overflow-hidden relative">
        {/* Background and floating elements */}
        <BackgroundElements />
        
        {/* Main content sections */}
        <HeroSection onAuthSuccess={handleAuthSuccess} />
        <FeatureSection />
        <TestimonialSection />
        <CTASection />
      </div>
    </div>
  );
};

export default Index;
