"use client";

import { motion } from 'framer-motion';

interface TimeDialProps {
  activeEra: string;
  setActiveEra: (era: string) => void;
}

interface FeatureData {
  title: string;
  icon: string;
  description: string;
  color: string;
}

export default function TimeDial({ activeEra, setActiveEra }: TimeDialProps) {
  const timeEras: Record<string, FeatureData> = {
    future: {
      title: "Futuristic Adventures",
      icon: "🚀",
      description: "Explore high-tech societies, interstellar travel, and mind-bending future technologies",
      color: "from-cyan-400 to-blue-500"
    },
    ancient: {
      title: "Ancient Mysteries",
      icon: "🏛️",
      description: "Uncover secrets of forgotten civilizations, witness the building of wonders, and meet legendary figures",
      color: "from-amber-400 to-orange-500"
    },
    medieval: {
      title: "Medieval Quests",
      icon: "⚔️",
      description: "Experience the age of knights, castles, and magical folklore in a time of epic tales",
      color: "from-emerald-400 to-green-600"
    },
    renaissance: {
      title: "Renaissance Discovery",
      icon: "🎭",
      description: "Witness the rebirth of art, science, and human potential in this pivotal era",
      color: "from-purple-400 to-indigo-500"
    }
  };

  return (
    <div className="mt-24 md:mt-32 relative">
      <motion.h3 
        className="text-center text-3xl font-serif font-bold mb-12 text-blue-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
          Travel Through Time's Dimensions
        </span>
      </motion.h3>
      
      {/* Circular time dial */}
      <div className="relative mx-auto w-full max-w-4xl h-96 mb-16">
        {/* Center of the dial */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-900 bg-opacity-60 rounded-full border-4 border-blue-400 border-opacity-30 z-10 flex items-center justify-center">
          <div className="text-4xl animate-pulse">⏳</div>
        </div>
        
        {/* Time era points */}
        {Object.entries(timeEras).map(([era, data], index) => {
          const isActive = activeEra === era;
          const angle = (index * 90) * (Math.PI / 180);
          const radius = 160;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          
          return (
            <motion.div 
              key={era}
              className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 ${isActive ? 'z-20' : 'z-0'}`}
              animate={{ 
                x: x,
                y: y,
                scale: isActive ? 1.1 : 0.9,
                opacity: isActive ? 1 : 0.7
              }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className={`w-48 p-1 rounded-xl bg-gradient-to-br ${data.color} cursor-pointer`}
                whileHover={{ scale: 1.05 }}
                onClick={() => setActiveEra(era)}
              >
                <div className="bg-blue-900 bg-opacity-90 p-4 rounded-lg">
                  <div className="text-3xl mb-2">{data.icon}</div>
                  <h4 className="text-lg font-medium text-blue-100 mb-1">{data.title}</h4>
                  {isActive && (
                    <motion.p 
                      className="text-blue-300 text-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {data.description}
                    </motion.p>
                  )}
                </div>
              </motion.div>
              
              {/* Connection line to center */}
              {isActive && (
                <motion.div 
                  className="absolute left-1/2 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent origin-left z-0"
                  style={{ 
                    width: radius,
                    transform: `translate(-50%, -50%) rotate(${angle * (180/Math.PI)}deg)`
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                />
              )}
            </motion.div>
          );
        })}
        
        {/* Animated rings */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-blue-400 border-opacity-20 animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-blue-400 border-opacity-10 animate-ping" style={{ animationDuration: '4s' }} />
      </div>
      
    </div>
  );
}

