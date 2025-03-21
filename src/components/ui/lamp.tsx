
"use client";
import React, { useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useTransform } from "framer-motion";

export const LampContainer = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    }
  };
  
  const size = useTransform(
    [mouseX, mouseY],
    ([latestX, latestY]) => {
      const brightness = hovered ? 1.4 : 1;
      return `${350 + (latestY as number) * 0.2}px ${brightness}`;
    }
  );

  const template = useMotionTemplate`radial-gradient(${size} circle at ${mouseX}px ${mouseY}px, hsl(var(--primary) / 0.25), transparent 80%)`;

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-hidden">
        <div className="absolute inset-0 z-[-1] opacity-0 transition-opacity duration-500 group-hover/hero:opacity-100"></div>
        <motion.div
          className="absolute inset-0 z-[-1] bg-gradient-to-b from-transparent to-background"
          style={{ backgroundImage: template }}
        />
      </div>
      <div className="relative z-10 flex min-h-[50vh] w-full flex-col items-center justify-center overflow-visible">
        {children}
      </div>
    </div>
  );
};
