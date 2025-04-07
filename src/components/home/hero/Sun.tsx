
import React from 'react';
import { motion } from 'framer-motion';

interface SunProps {
  mounted: boolean;
}

const Sun: React.FC<SunProps> = ({ mounted }) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20
      }}
      animate={{
        opacity: mounted ? 0.9 : 0,
        y: 0
      }}
      transition={{
        duration: 2,
        delay: 0.5
      }}
      className="absolute top-[15%] right-[15%] h-20 w-20 rounded-full bg-yellow-200"
      style={{
        boxShadow: '0 0 40px 10px rgba(254, 240, 138, 0.8)'
      }}
    />
  );
};

export default Sun;
