
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const HeroButtons: React.FC = () => {
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
    <motion.div 
      className="absolute bottom-12 left-0 right-0 px-4 z-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.5, duration: 0.7 }}
    >
      <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 justify-center">
        <motion.button 
          onClick={handleGetStarted} 
          className="ghibli-btn-primary group relative overflow-hidden"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="relative z-10 font-bold">{user ? "Take Assessment" : "Get Started"}</span>
          <ArrowRight className="relative z-10 ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>
        
        <motion.button 
          onClick={handleLearnMore} 
          className="ghibli-btn-secondary group"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="relative z-10 font-bold">Learn More</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default HeroButtons;
