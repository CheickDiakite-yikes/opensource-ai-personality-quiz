import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bird, Cat, CloudSun, Flower, Fish } from "lucide-react";
import PageTransition from "@/components/ui/PageTransition";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import GhibliHeroAnimation from "@/components/home/GhibliHeroAnimation";

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
  
  const floatingIcons = [
    { icon: <CloudSun size={30} className="text-blue-400" />, className: "top-[15%] left-[10%] animate-float" },
    { icon: <Bird size={25} className="text-yellow-500" />, className: "top-[30%] left-[25%] animate-float-x" },
    { icon: <Flower size={22} className="text-pink-400" />, className: "bottom-[40%] right-[15%] animate-sway" },
    { icon: <Cat size={28} className="text-orange-400" />, className: "top-[20%] right-[20%] animate-soft-bounce" },
    { icon: <Fish size={24} className="text-blue-500" />, className: "bottom-[30%] left-[20%] animate-float" },
  ];
  
  return (
    <PageTransition>
      <div className="relative overflow-hidden min-h-screen forest-background">
        {/* Animated Clouds */}
        <div className="clouds">
          <div className="cloud cloud-1"></div>
          <div className="cloud cloud-2"></div>
          <div className="cloud cloud-3"></div>
          <div className="cloud cloud-4"></div>
        </div>
        
        {/* Floating elements */}
        {floatingIcons.map((item, index) => (
          <div 
            key={index}
            className={`absolute z-10 ${item.className}`}
            style={{ animationDelay: `${index * 0.7}s` }}
          >
            {item.icon}
          </div>
        ))}
        
        <div className="container mx-auto relative z-10">
          {/* Hero section */}
          <section className="relative py-16 md:py-24 text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-3xl mx-auto"
            >
              {/* Replace static wooden sign with animated Ghibli scene */}
              <div className="relative mx-auto mb-8 max-w-lg">
                <GhibliHeroAnimation />
              </div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="space-y-6"
              >
                <h1 className="text-4xl md:text-5xl font-indie text-amber-900 leading-tight">
                  Discover Who You Really Are
                </h1>
                
                <p className="text-xl text-amber-800 mb-8 max-w-xl mx-auto font-medium">
                  Our advanced AI personality assessment delivers deep insights into your unique traits, cognitive patterns, and emotional intelligence.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    className="ghibli-button group"
                    onClick={handleGetStarted}
                  >
                    {user ? "Take Assessment" : "Get Started"}
                    <ArrowRight className="ml-2 h-4 w-4 inline group-hover:translate-x-1 transition-transform" />
                  </button>
                  
                  <button 
                    className="ghibli-secondary-button"
                    onClick={() => {
                      const featuresElement = document.getElementById("features");
                      if (featuresElement) {
                        featuresElement.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                  >
                    Learn More
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </section>
          
          {/* Features Section */}
          <section id="features" className="py-12 md:py-16 relative z-10">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-indie text-amber-900 mb-3">How It Works</h2>
              <p className="text-amber-800 max-w-2xl mx-auto">Our personality assessment uses advanced AI to analyze your responses and provide personalized insights.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4">
              {/* Feature 1 */}
              <motion.div 
                className="ghibli-card p-6"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-amber-600 text-xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold text-amber-800 mb-3 text-center">Take the Assessment</h3>
                <p className="text-center text-amber-700">Answer thoughtfully designed questions about your thoughts, feelings, and behaviors.</p>
              </motion.div>
              
              {/* Feature 2 */}
              <motion.div 
                className="ghibli-card p-6"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-amber-600 text-xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold text-amber-800 mb-3 text-center">AI Analysis</h3>
                <p className="text-center text-amber-700">Our AI processes your responses to identify patterns and insights about your personality.</p>
              </motion.div>
              
              {/* Feature 3 */}
              <motion.div 
                className="ghibli-card p-6"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-amber-600 text-xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold text-amber-800 mb-3 text-center">Discover Yourself</h3>
                <p className="text-center text-amber-700">Receive personalized insights about your traits, strengths, and potential growth areas.</p>
              </motion.div>
            </div>
          </section>
          
          {/* Testimonial Section */}
          <section className="py-12 md:py-16 relative z-10">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-indie text-amber-900 mb-3">What People Say</h2>
              <p className="text-amber-800 max-w-2xl mx-auto">Here's what others have discovered about themselves.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto px-4">
              {/* Testimonial 1 */}
              <div className="ghibli-card p-6 relative">
                <div className="flex items-start mb-4">
                  <div className="h-12 w-12 bg-amber-200 rounded-full flex items-center justify-center mr-4">
                    <span className="text-amber-800 font-bold">M</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-amber-800">Mei</h4>
                    <p className="text-amber-600 text-sm">Artist</p>
                  </div>
                </div>
                <p className="text-amber-700 italic">"This assessment revealed aspects of my personality I never consciously realized. Now I understand why I approach creative projects the way I do!"</p>
              </div>
              
              {/* Testimonial 2 */}
              <div className="ghibli-card p-6 relative">
                <div className="flex items-start mb-4">
                  <div className="h-12 w-12 bg-amber-200 rounded-full flex items-center justify-center mr-4">
                    <span className="text-amber-800 font-bold">T</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-amber-800">Totoro</h4>
                    <p className="text-amber-600 text-sm">Forest Guide</p>
                  </div>
                </div>
                <p className="text-amber-700 italic">"The insights about my empathetic nature and how I connect with others were spot on. I've improved my relationships by applying what I learned."</p>
              </div>
            </div>
          </section>
          
          {/* CTA Section */}
          <section className="py-12 md:py-24 relative z-10 text-center">
            <div className="relative max-w-3xl mx-auto px-4">
              <div className="ghibli-card p-8 md:p-10">
                <h2 className="text-2xl md:text-3xl font-indie text-amber-900 mb-4">Start Your Self-Discovery Journey Today</h2>
                <p className="text-amber-800 mb-6">Unlock insights about your personality, potential, and purpose</p>
                <button 
                  className="ghibli-button"
                  onClick={handleGetStarted}
                >
                  {user ? "Take Assessment" : "Sign Up Now"}
                </button>
                
                {/* Character */}
                <img 
                  src="/lovable-uploads/d92ae7df-b723-4e78-b516-e372194df445.png"
                  alt="Ghibli Character"
                  className="absolute -bottom-10 -right-10 w-28 h-auto transform rotate-6 hidden md:block"
                />
              </div>
              
              {/* Grass and flowers at bottom */}
              <div className="grass"></div>
              <div className="flowers">
                <div className="flower"></div>
                <div className="flower"></div>
                <div className="flower"></div>
                <div className="flower"></div>
                <div className="flower"></div>
                <div className="flower"></div>
                <div className="flower"></div>
                <div className="flower"></div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
  );
};

export default HomePage;
