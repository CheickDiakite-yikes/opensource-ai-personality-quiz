
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
    <div className="relative h-[500px] md:h-[600px] overflow-hidden rounded-b-lg">
      {/* Sky and static elements */}
      <SkyElements />
      
      {/* Sun */}
      <Sun mounted={mounted} />
      
      {/* Clouds */}
      {clouds.map((cloud, index) => (
        <Cloud key={`cloud-${index}`} {...cloud} />
      ))}
      
      {/* Birds */}
      {birds.map((bird) => (
        <Bird key={bird.key} {...bird} />
      ))}
      
      {/* Hills */}
      <Hills />
      
      {/* Falling leaves */}
      {leaves.map(leaf => (
        <Leaf key={leaf.key} {...leaf} />
      ))}
      
      {/* Content overlay */}
      <HeroContent mounted={mounted} />
    </div>
  );
};

export default GhibliHeroAnimation;
