"use client";
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';


function HeroSection() {
  const [activeEra, setActiveEra] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const timelineRef = useRef(null);

  const router = useRouter();

  const timeEras = [
    {
      year: "3045 CE",
      title: "Chronicler's Era",
      icon: "📜",
      description: "Record your journeys with detailed logs and evidence",
      color: "from-blue-500 to-cyan-400"
    },
    {
      year: "2199 CE",
      title: "Verification Age",
      icon: "🔍",
    },
    {
      year: "1823 CE",
      title: "Witness Period",
      icon: "🗣️",
    },
    {
      year: "476 BCE",
      title: "Legacy Times",
      icon: "🏆",
    }
  ];

  // Create ambient particles
  const particles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="min-h-[calc(100vh-76px)] flex flex-col justify-between overflow-hidden px-4 sm:px-6">
      {/* Ambient Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-blue-400"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              opacity: [0, 0.7, 0],
              scale: [0, 1, 0],
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * -100],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      {/* Main Hero Content */}
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center py-8 lg:py-12">
        <div className="order-2 lg:order-1">
          <motion.h2
            className="text-center lg:text-left text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-blue-100 leading-tight font-noto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Document Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-300">
              Time Travel Adventures
            </span>
          </motion.h2>

          <motion.p
            className="text-center lg:text-left text-base sm:text-lg md:text-xl text-blue-200 mb-6 sm:mb-8 leading-relaxed font-noto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Log your journeys through time, collect temporal artifacts, and connect with 
            fellow chrononauts in this exclusive portal for time travelers.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative order-1 lg:order-2"
        >
        </motion.div>
      </div>

      {/* Temporal Timeline Explorer */}
      <div ref={timelineRef} className="mt-8 sm:mt-auto pb-8">
        {/* Spotlight effect */}
        <div
          className="absolute pointer-events-none inset-0 opacity-20 bg-gradient-radial from-blue-300 to-transparent rounded-xl"
          style={{
            backgroundSize: '600px 600px',
            backgroundPosition: `${mousePosition.x}px ${mousePosition.y}px`,
          }}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-12 relative"
        >
          <h3 className="text-center text-2xl md:text-3xl font-noto font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300">
            Journey Through The Temporal Continum
          </h3>
        </motion.div>

        {/* Interactive Timeline */}
        <div className="relative h-[180px] sm:h-[150px] mb-8 sm:mb-12 overflow-x-auto">
          <div className="absolute left-0 right-0 top-1/2 h-1 bg-gradient-to-r from-indigo-500/50 via-blue-500/50 to-cyan-500/50 min-w-[640px]"></div>

          {timeEras.map((era, index) => {
            const position = 10 + (index * 80 / (timeEras.length - 1));
            return (
              <motion.div
                key={`timeline-${index}`}
                className="absolute top-1/2 transform -translate-y-1/2 cursor-pointer z-10"
                style={{ left: `${position}%` }}
                whileHover={{ scale: 1.1 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                onClick={() => setActiveEra(activeEra === index ? null : index)}
              >
                <div className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full ${
                  activeEra === index
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                    : 'bg-blue-900/70 border border-blue-500/30'
                } shadow-lg shadow-blue-500/30 transition-all duration-300`}>
                  <span className="text-base sm:text-lg">{era.icon}</span>
                </div>
                <div className={`absolute top-8 sm:top-10 transform -translate-x-1/2 text-xs sm:text-sm ${
                  activeEra === index ? 'text-blue-100' : 'text-blue-300'
                } whitespace-nowrap transition-colors duration-300`}>
                  {era.year}
                </div>
                <div className={`absolute bottom-8 sm:bottom-10 transform -translate-x-1/2 text-xs sm:text-sm ${
                  activeEra === index ? 'text-blue-100' : 'text-blue-300'
                } font-medium whitespace-nowrap transition-colors duration-300`}>
                  {era.title}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default HeroSection;