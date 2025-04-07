
import { useState, useEffect } from 'react';
import { CloudProps } from './Cloud';
import { BirdProps } from './Bird';
import { LeafProps } from './Leaf';
import { SparklesProps } from './Sparkles';

export interface AnimationElements {
  mounted: boolean;
  clouds: CloudProps[];
  birds: (BirdProps & { key: string })[];
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
  sparkles: SparklesProps[];
}

export function useAnimationElements(): AnimationElements {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Generate clouds - adding more clouds and distributing them better
  const clouds: CloudProps[] = [
    {
      left: '10%',
      top: '15%',
      width: 140,
      delay: 0,
      duration: 120
    },
    {
      left: '5%',
      top: '35%',
      width: 110,
      delay: 15,
      duration: 150
    },
    {
      left: '15%',
      top: '55%',
      width: 90,
      delay: 30,
      duration: 100
    },
    {
      left: '-5%',
      top: '70%',
      width: 160,
      delay: 5,
      duration: 140
    },
    {
      left: '20%',
      top: '10%',
      width: 100,
      delay: 25,
      duration: 130
    },
    {
      left: '0%',
      top: '25%',
      width: 130,
      delay: 40,
      duration: 115
    },
    {
      left: '12%',
      top: '45%',
      width: 120,
      delay: 60,
      duration: 135
    }
  ];

  // Generate leaves - increased number for more liveliness
  const leaves = Array.from(
    {
      length: 15
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

  // Generate birds - increased number and better distribution
  const birds = Array.from(
    {
      length: 7
    },
    (_, i) => ({
      key: `bird-${i}`,
      initialX: Math.random() * 30,
      initialY: Math.random() * 35 + 5,
      size: Math.random() * 4 + 4,
      duration: Math.random() * 20 + 40,
      delay: Math.random() * 5,
      yMovement: Math.random() * 10 - 5
    })
  );

  // Generate sparkles - new magical effect
  const sparkles = Array.from(
    {
      length: 12
    },
    (_, i) => ({
      key: `sparkle-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 60 + 10,
      size: Math.random() * 6 + 2,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2
    })
  );

  return {
    mounted,
    clouds,
    birds,
    leaves,
    sparkles
  };
}
