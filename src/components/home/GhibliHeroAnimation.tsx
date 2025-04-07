
import React from 'react';
import SkyElements from './hero/SkyElements';
import Sun from './hero/Sun';
import Cloud from './hero/Cloud';
import Bird from './hero/Bird';
import Hills from './hero/Hills';
import Leaf from './hero/Leaf';
import HeroContent from './hero/HeroContent';
import { useAnimationElements } from './hero/useAnimationElements';

const GhibliHeroAnimation: React.FC = () => {
  const { mounted, clouds, birds, leaves } = useAnimationElements();

  return (
    <div className="relative h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden rounded-b-3xl">
      {/* Sky and static elements */}
      <SkyElements />
      
      {/* Sun */}
      <Sun mounted={mounted} />
      
      {/* Clouds */}
      <div className="relative z-10">
        {clouds.map((cloud, index) => (
          <Cloud key={`cloud-${index}`} {...cloud} />
        ))}
      </div>
      
      {/* Birds */}
      <div className="relative z-20">
        {birds.map((bird) => (
          <Bird key={bird.key} {...bird} />
        ))}
      </div>
      
      {/* Hills in background */}
      <div className="relative z-30">
        <Hills />
      </div>
      
      {/* Falling leaves */}
      <div className="relative z-40">
        {leaves.map(leaf => (
          <Leaf key={leaf.key} {...leaf} />
        ))}
      </div>
      
      {/* Content overlay */}
      <div className="relative z-50">
        <HeroContent mounted={mounted} />
      </div>
    </div>
  );
};

export default GhibliHeroAnimation;
