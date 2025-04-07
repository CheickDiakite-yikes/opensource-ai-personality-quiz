
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
      className="absolute bottom-4 left-0 right-0 px-4 z-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.5, duration: 0.7 }}
    >
      <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4 justify-center">
        <motion.button 
          onClick={handleGetStarted} 
          className="ghibli-btn-enhanced group relative overflow-hidden"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="relative z-10">{user ? "Take Assessment" : "Get Started"}</span>
          <ArrowRight className="relative z-10 ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 opacity-80"></div>
        </motion.button>
        
        <motion.button 
          onClick={handleLearnMore} 
          className="ghibli-btn-alt group"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="relative z-10">Learn More</span>
          <div className="absolute inset-0 bg-gradient-to-r from-stone-600 to-stone-700 opacity-80"></div>
        </motion.button>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -bottom-6 left-0 right-0 h-12 bg-contain bg-repeat-x z-0 opacity-40"
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='20' viewBox='0 0 60 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10c2-4 5-7 10-7s8 3 10 7c2-4 5-7 10-7s8 3 10 7c2-4 5-7 10-7s8 3 10 7' stroke='%2381c784' stroke-width='1.5' fill='none' /%3E%3C/svg%3E")` }}>
      </div>
    </motion.div>
  );
};

export default HeroButtons;
