"use client";

import { FC } from 'react';
import { motion } from 'framer-motion';

const TimeParticles: FC = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full h-24 pointer-events-none overflow-hidden">
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-2 h-2 rounded-full bg-blue-300 opacity-50"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: 0
          }}
          animate={{
            y: [0, -100 - Math.random() * 400],
            opacity: [0.7, 0],
            x: [0, (Math.random() * 100) - 50]
          }}
          transition={{
            duration: 3 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 5
          }}
        />
      ))}
    </div>
  );
};

export default TimeParticles;
