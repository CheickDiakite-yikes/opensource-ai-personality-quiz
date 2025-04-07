
import React from 'react';

const SkyElements: React.FC = () => {
  return (
    <>
      {/* Sky background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-300/80 via-blue-200/60 to-orange-100/50" />
      
      {/* Trees */}
      <div className="ghibli-tree left" />
      <div className="ghibli-tree right" />
      
      {/* Grass */}
      <div className="ghibli-grass" />
    </>
  );
};

export default SkyElements;
