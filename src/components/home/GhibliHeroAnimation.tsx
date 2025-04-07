
import React from 'react';
import SkyElements from './hero/SkyElements';
import Sun from './hero/Sun';
import Cloud from './hero/Cloud';
import Bird from './hero/Bird';
import Hills from './hero/Hills';
import Leaf from './hero/Leaf';
import HeroContent from './hero/HeroContent';
import HeroButtons from './hero/HeroButtons';
import { useAnimationElements } from './hero/useAnimationElements';

const GhibliHeroAnimation: React.FC = () => {
  const { mounted, clouds, birds, leaves } = useAnimationElements();

  return (
    <div className="relative h-[550px] md:h-[650px] overflow-hidden rounded-b-lg">
      {/* Dark overlay to improve contrast */}
      <div className="absolute inset-0 bg-black/30 z-5"></div>
      
      {/* Sky and static elements */}
      <SkyElements />
      
      {/* Sun */}
      <Sun mounted={mounted} />
      
      {/* Clouds - reduce quantity for less clutter */}
      {clouds.slice(0, 3).map((cloud, index) => (
        <Cloud key={`cloud-${index}`} {...cloud} />
      ))}
      
      {/* Birds - reduce quantity for less clutter */}
      {birds.slice(0, 3).map((bird) => (
        <Bird key={bird.key} {...bird} />
      ))}
      
      {/* Hills */}
      <Hills />
      
      {/* Falling leaves - reduce quantity for less clutter */}
      {leaves.slice(0, 5).map(leaf => (
        <Leaf key={leaf.key} {...leaf} />
      ))}
      
      {/* Content overlay */}
      <HeroContent mounted={mounted} />
      
      {/* Hero Buttons - positioned absolutely relative to parent */}
      <HeroButtons />
    </div>
  );
};

export default GhibliHeroAnimation;
