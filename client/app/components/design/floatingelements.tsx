import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';

function FloatingMagicalElements() {
  // State to track viewport size
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if we're on mobile and update state accordingly
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener to update on resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Define elements based on screen size
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

  // Use fewer elements on mobile
  const displayElements = isMobile 
    ? magicalElements.slice(0, 4) // Show only 4 elements on mobile
    : magicalElements;
    
  // Number of orbs to show (fewer on mobile)
  const orbCount = isMobile ? 2 : 5;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {displayElements.map((element, index) => {
        // Calculate more distributed positions
        // For mobile, ensure they're more spread out
        const leftPos = isMobile 
          ? `${15 + (index * 70 / displayElements.length)}%` // More evenly distributed on mobile
          : `${Math.random() * 80 + 10}%`;
        
        const topPos = isMobile
          ? `${20 + (index * 60)}%` // Stagger vertically on mobile
          : `${Math.random() * 80 + 10}%`;
          
        // Adjust element size for mobile
        const mobileSize = isMobile 
          ? element.size.replace(/w-(\d+)/, (_, num) => `w-${Math.max(6, parseInt(num) - 2)}`) 
                       .replace(/h-(\d+)/, (_, num) => `h-${Math.max(6, parseInt(num) - 2)}`)
          : element.size;
        
        return (
          <motion.div
            key={`magical-${index}`}
            className={`absolute ${mobileSize} flex items-center justify-center`}
            style={{
              left: leftPos,
              top: topPos,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.7, 1, 0.7],
              scale: [1, 1.1, 1],
              x: [0, isMobile ? Math.random() * 80 - 40 : Math.random() * 200 - 100, 0],
              y: [0, isMobile ? Math.random() * 80 - 40 : Math.random() * 200 - 100, 0],
              rotate: [0, Math.random() * 360, 0]
            }}
            transition={{
              duration: (20 + Math.random() * 10) * (isMobile ? 1.5 : 1), // Slower on mobile
              delay: element.animationDelay * (isMobile ? 1.5 : 1),
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut'
            }}
          >
            <span className={`${isMobile ? 'text-2xl' : 'text-3xl'} filter drop-shadow-lg`}>
              {element.emoji}
            </span>
            {/* Subtle glow effect behind each element */}
            <div className="absolute inset-0 rounded-full bg-blue-400 opacity-20 blur-md" />
          </motion.div>
        );
      })}
      
      {/* Additional time orbs with pulsing effect */}
      {Array.from({ length: orbCount }).map((_, i) => {
        const size = isMobile 
          ? Math.random() * 30 + 20  // Smaller orbs on mobile
          : Math.random() * 50 + 30;
          
        const leftPos = isMobile
          ? `${15 + (i * 70 / orbCount)}%` // More evenly distributed on mobile
          : `${Math.random() * 90 + 5}%`;
          
        const topPos = isMobile
          ? `${15 + ((i + displayElements.length) * 50 / (orbCount + displayElements.length))}%`
          : `${Math.random() * 80 + 10}%`;
        
        return (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full bg-gradient-to-r from-indigo-500/30 to-blue-500/20"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: leftPos,
              top: topPos,
              filter: 'blur(8px)'
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * (isMobile ? 3 : 2) // More delay between animations on mobile
            }}
          />
        );
      })}
    </div>
  );
}

export default FloatingMagicalElements;