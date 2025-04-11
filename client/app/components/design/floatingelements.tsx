import { motion } from 'framer-motion';
import React from 'react';

function FloatingMagicalElements() {

  const magicalElements = [
    { type: 'spaceship', emoji: '🛸', size: 'w-12 h-12', animationDelay: 0 },
    { type: 'rocket', emoji: '🚀', size: 'w-10 h-10', animationDelay: 2 },
    { type: 'alien', emoji: '👽', size: 'w-8 h-8', animationDelay: 5 },
    { type: 'planet', emoji: '🪐', size: 'w-14 h-14', animationDelay: 7 },
    { type: 'robot', emoji: '🤖', size: 'w-9 h-9', animationDelay: 3 },
    { type: 'crystal', emoji: '💎', size: 'w-7 h-7', animationDelay: 1 },
    { type: 'comet', emoji: '☄️', size: 'w-10 h-10', animationDelay: 4 },
    { type: 'astronaut', emoji: '👨‍🚀', size: 'w-8 h-8', animationDelay: 6 }
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {magicalElements.map((element, index) => (
        <motion.div
          key={`magical-${index}`}
          className={`absolute ${element.size} flex items-center justify-center`}
          style={{
            left: `${Math.random() * 80 + 10}%`,
            top: `${Math.random() * 80 + 10}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0.7, 1, 0.7],
            scale: [1, 1.1, 1],
            x: [0, Math.random() * 200 - 100, 0],
            y: [0, Math.random() * 200 - 100, 0],
            rotate: [0, Math.random() * 360, 0]
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            delay: element.animationDelay,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut'
          }}
        >
          <span className="text-3xl filter drop-shadow-lg">{element.emoji}</span>
          {/* Subtle glow effect behind each element */}
          <div className="absolute inset-0 rounded-full bg-blue-400 opacity-20 blur-md" />
        </motion.div>
      ))}
      
      {/* Additional time orbs with pulsing effect */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute rounded-full bg-gradient-to-r from-indigo-500/30 to-blue-500/20"
          style={{
            width: `${Math.random() * 50 + 30}px`,
            height: `${Math.random() * 50 + 30}px`,
            left: `${Math.random() * 90 + 5}%`,
            top: `${Math.random() * 80 + 10}%`,
            filter: 'blur(8px)'
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 2
          }}
        />
      ))}
    </div>
  );
}

export default FloatingMagicalElements;