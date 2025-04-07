
import { useState, useEffect } from 'react';
import { CloudProps } from './Cloud';
import { BirdProps } from './Bird';
import { LeafProps } from './Leaf';

export interface AnimationElements {
  mounted: boolean;
  clouds: CloudProps[];
  birds: BirdProps[];
  leaves: {
    key: string;
    initialX: number;
    initialY: number;
    size: number;
    rotationDuration: number;
    fallDuration: number;
    delay: number;
    rotationDirection: number;
  }[];
}

export function useAnimationElements(): AnimationElements {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Generate clouds
  const clouds: CloudProps[] = [
    {
      left: '10%',
      top: '20%',
      width: 120,
      delay: 0,
      duration: 120
    },
    {
      left: '5%',
      top: '40%',
      width: 100,
      delay: 15,
      duration: 150
    },
    {
      left: '15%',
      top: '60%',
      width: 80,
      delay: 30,
      duration: 100
    },
    {
      left: '-5%',
      top: '70%',
      width: 140,
      delay: 5,
      duration: 140
    },
    {
      left: '20%',
      top: '10%',
      width: 90,
      delay: 25,
      duration: 130
    }
  ];

  // Generate leaves
  const leaves = Array.from(
    {
      length: 10
    },
    (_, i) => ({
      key: `leaf-${i}`,
      initialX: Math.random() * 100,
      initialY: Math.random() * 30 + 10,
      size: Math.random() * 15 + 10,
      rotationDuration: Math.random() * 10 + 20,
      fallDuration: Math.random() * 15 + 15,
      delay: Math.random() * 10,
      rotationDirection: Math.random() > 0.5 ? 1 : -1
    })
  );

  // Generate birds
  const birds: BirdProps[] = Array.from(
    {
      length: 5
    },
    (_, i) => ({
      key: `bird-${i}`,
      initialX: Math.random() * 20,
      initialY: Math.random() * 30 + 10,
      size: Math.random() * 4 + 4,
      duration: Math.random() * 20 + 40,
      delay: Math.random() * 5,
      yMovement: Math.random() * 10 - 5
    })
  );

  return {
    mounted,
    clouds,
    birds,
    leaves
  };
}
