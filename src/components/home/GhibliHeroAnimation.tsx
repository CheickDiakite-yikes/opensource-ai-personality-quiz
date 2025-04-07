
import React from 'react';
import SkyElements from './hero/SkyElements';
import Sun from './hero/Sun';
import Cloud from './hero/Cloud';
import Bird from './hero/Bird';
import Hills from './hero/Hills';
import Leaf from './hero/Leaf';
import HeroContent from './hero/HeroContent';
import { useAnimationElements } from './hero/useAnimationElements';
import Sparkles from './hero/Sparkles';

const GhibliHeroAnimation: React.FC = () => {
  const { mounted, clouds, birds, leaves, sparkles } = useAnimationElements();

  return (
    <div className="relative h-[600px] sm:h-[650px] md:h-[700px] lg:h-[750px] overflow-hidden rounded-b-3xl">
      {/* Sky and static elements */}
      <SkyElements />
      
      {/* Sun */}
      <Sun mounted={mounted} />
      
      {/* Sparkles */}
      {sparkles.map((sparkle) => (
        <Sparkles key={sparkle.key} {...sparkle} />
      ))}
      
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
