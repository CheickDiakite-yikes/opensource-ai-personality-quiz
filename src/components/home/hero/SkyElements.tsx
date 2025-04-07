
import React from 'react';

const SkyElements: React.FC = () => {
  return (
    <>
      {/* Sky background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-300/80 via-blue-200/60 to-orange-100/50" />
      
      {/* Decorative sparkles */}
      <div className="absolute top-[10%] left-[15%] h-3 w-3 bg-white rounded-full opacity-70 animate-pulse-subtle"></div>
      <div className="absolute top-[15%] left-[30%] h-2 w-2 bg-white rounded-full opacity-60 animate-pulse-subtle" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute top-[8%] left-[70%] h-4 w-4 bg-white rounded-full opacity-50 animate-pulse-subtle" style={{ animationDelay: '0.7s' }}></div>
      <div className="absolute top-[20%] left-[85%] h-2 w-2 bg-white rounded-full opacity-70 animate-pulse-subtle" style={{ animationDelay: '2.1s' }}></div>
      <div className="absolute top-[25%] left-[45%] h-3 w-3 bg-white rounded-full opacity-60 animate-pulse-subtle" style={{ animationDelay: '1.2s' }}></div>
      
      {/* Trees */}
      <div className="ghibli-tree left" />
      <div className="ghibli-tree right" />
      
      {/* Grass */}
      <div className="ghibli-grass" />
    </>
  );
};

export default SkyElements;
