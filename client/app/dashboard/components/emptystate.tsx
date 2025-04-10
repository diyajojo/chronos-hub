'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import CreateLogModal from './createmodal';
import TimePortalEffect from '../../components/design/timeportal';
import TimeParticles from '../../components/design/timeparticles';
import TimeTraveller from '../../components/design/timetraveller';

interface User {
  id: string;
  name: string;
  email: string;
}

export default function EmptyState({ user }: { user: User })  {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeEra, setActiveEra] = useState('future');

  // Array of welcome phrases that will rotate
  const welcomePhrases = [
    "Ready to bend time?",
    "The timeline awaits your mark",
    "Every journey begins with a single step",
    "History is yours to discover"
  ];
  const [welcomeIndex, setWelcomeIndex] = useState(0);

  // Cycle through welcome phrases
  useEffect(() => {
    const interval = setInterval(() => {
      setWelcomeIndex((prev) => (prev + 1) % welcomePhrases.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const timeEras = {
    future: {
      title: "Future Tech",
      year: "3045",
      icon: "🚀",
      color: "from-cyan-400 to-blue-500",
      description: "Gleaming cityscapes and flying vehicles await you in this realm of technology beyond imagination."
    },
    ancient: {
      title: "Ancient Wonders",
      year: "300 BCE",
      icon: "🏛️",
      color: "from-amber-400 to-orange-500",
      description: "Majestic temples and mysterious rituals from civilizations long past."
    },
    medieval: {
      title: "Medieval Era",
      year: "1242",
      icon: "⚔️",
      color: "from-emerald-400 to-green-600",
      description: "Knights, castles, and magical forests where legends were born."
    },
    renaissance: {
      title: "Renaissance",
      year: "1508",
      icon: "🎭",
      color: "from-purple-400 to-indigo-500",
      description: "Art, discovery and rebirth in a time of great cultural awakening."
    }
  };

  return (
    <div className="relative">
      {/* Top greeting area */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-3xl md:text-4xl font-serif mb-3 text-white">
          Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300 font-bold">
            {user.name}
          </span>
        </h1>
        <motion.p 
          key={welcomeIndex}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          className="text-xl text-blue-300"
        >
          {welcomePhrases[welcomeIndex]}
        </motion.p>
      </motion.div>

      {/* Main content area */}
      <div className="grid md:grid-cols-5 gap-8">
        {/* Left section - Timeline image */}
        <motion.div 
          className="md:col-span-2 relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="w-full h-64 md:h-96 relative rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/40 to-indigo-600/40 rounded-xl backdrop-blur-sm border border-blue-400/30">
              <Image 
                src="/api/placeholder/600/600"
                alt="Time Travel Visualization" 
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                style={{ objectFit: 'cover' }}
                className="rounded-xl opacity-70"
              />
              <div className="absolute inset-0">
                <TimePortalEffect />
              </div>
            </div>
          </div>
          <TimeTraveller />
        </motion.div>

        {/* Right section - Enchanted Story Book Style */}
        <motion.div 
          className="md:col-span-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="bg-black/30 backdrop-blur-md rounded-xl border border-blue-500/30 overflow-hidden relative">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-blue-400/50 rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-blue-400/50 rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-blue-400/50 rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-blue-400/50 rounded-br-lg"></div>
            
            <div className="p-6 border-b border-blue-500/20">
              <h2 className="text-2xl font-bold text-white font-serif">Begin Your Chronicles</h2>
              <p className="text-blue-300 mt-2 italic">Every great adventure begins with a first step through time...</p>
            </div>
            
            <div className="p-6">
              <button
                onClick={() => setShowCreateModal(true)}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-bold text-lg transition-all hover:scale-105 hover:shadow-glow flex items-center justify-center gap-3"
              >
                <span className="text-2xl">🕰️</span>
                <span>Record Your First Time Jump</span>
              </button>
              
              <div className="mt-8">
                <h3 className="text-lg text-blue-200 mb-4 font-serif">Enchanted Destinations</h3>
                
                {/* Fairy Tale Scrolling Story Book */}
                <div className="space-y-4">
                  {Object.entries(timeEras).map(([key, era]) => (
                    <motion.div 
                      key={key}
                      onClick={() => setActiveEra(key)}
                      className={`p-4 rounded-lg cursor-pointer transition-all duration-300 border relative overflow-hidden
                        ${activeEra === key 
                          ? `border-${key === 'future' ? 'blue' : key === 'ancient' ? 'orange' : key === 'medieval' ? 'green' : 'purple'}-400/70 bg-gradient-to-r ${era.color}/30`
                          : 'border-blue-500/10 bg-black/20 hover:bg-black/40'
                        }`}
                      whileHover={{ 
                        scale: 1.02,
                        transition: { duration: 0.2 }
                      }}
                    >
                      {/* Magical sparkle effects in corners for active era */}
                      {activeEra === key && (
                        <>
                          <div className="absolute top-0 right-0 w-8 h-8 opacity-70">
                            <div className="absolute w-2 h-2 bg-white rounded-full animate-pulse" 
                                style={{top: '5px', right: '10px', animationDelay: '0.2s'}}></div>
                            <div className="absolute w-1 h-1 bg-white rounded-full animate-pulse" 
                                style={{top: '10px', right: '5px', animationDelay: '0.4s'}}></div>
                          </div>
                          <div className="absolute bottom-0 left-0 w-8 h-8 opacity-70">
                            <div className="absolute w-2 h-2 bg-white rounded-full animate-pulse" 
                                style={{bottom: '5px', left: '10px', animationDelay: '0.6s'}}></div>
                            <div className="absolute w-1 h-1 bg-white rounded-full animate-pulse" 
                                style={{bottom: '10px', left: '5px', animationDelay: '0.8s'}}></div>
                          </div>
                        </>
                      )}
                      
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-3">{era.icon}</span>
                        <div>
                          <span className="text-white font-medium">{era.title}</span>
                          <p className="text-sm text-blue-300 mt-1">{era.year}</p>
                        </div>
                      </div>
                      
                      {activeEra === key && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-2 text-sm text-blue-200 pl-9 border-l border-blue-500/30"
                        >
                          {era.description}
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Tips with magical scroll design */}
          <motion.div 
            className="mt-6 bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
            <div className="absolute -bottom-3 -right-3 w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></div>
            
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-600/30 flex items-center justify-center mr-3">
                <span className="text-blue-300 text-lg">✨</span>
              </div>
              <h3 className="text-lg font-medium text-blue-300 font-serif">Traveler's Wisdom</h3>
            </div>
            <p className="text-blue-200 italic">
              "When documenting your journeys, include specific details about local customs, 
              architecture, or language that wouldn't be found in history books. The magic of believability 
              lies in the smallest of details."
            </p>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Floating time particles */}
      <TimeParticles />
      
      {showCreateModal && (
        <CreateLogModal onClose={() => setShowCreateModal(false)} user={user}/>
      )}
    </div>
  );
}