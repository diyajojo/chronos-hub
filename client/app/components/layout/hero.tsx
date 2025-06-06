import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShimmerButton } from '@/components/magicui/shimmer-button';

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
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-start sm:items-center py-4 sm:py-8 lg:py-12 mt-2 sm:mt-4 min-h-[65vh] sm:min-h-0">
        <div className="order-2 lg:order-1 flex flex-col justify-between h-full">
          <div>
          <motion.h2
              className="font-urbanist text-center lg:text-left text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-6 text-blue-100 leading-tight font-josefinsans"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Brb, Just Grabbing Coffee
            <span className="font-urbanist block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-300">
            With Shakespeare ☕
            </span>
          </motion.h2>

          <motion.p
              className="font-urbanist mt-4 sm:mt-8 text-center lg:text-left text-base sm:text-lg md:text-xl text-blue-200 mb-3 sm:mb-8 leading-relaxed font-josefinsans"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Ever wondered how you'd look in the 80s with that classic mullet? 
            Curious what you'd wear to a party in 3045?
            Want to see yourself as a medieval knight or a future astronaut?
          </motion.p>

          <motion.p
              className="font-urbanist text-center lg:text-left text-base sm:text-lg md:text-xl text-blue-200 mb-3 sm:mb-8 leading-relaxed font-josefinsans"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            ChronosHub is here for you, it's like Instagram but with a time travel twist! Post your time travel stories, 
             upload images of your adventures, and connect with friends across different eras.
          </motion.p>
          </div>

          <motion.div
            className="flex justify-center lg:justify-start mt-4 sm:mt-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <ShimmerButton
              onClick={() => router.push('/signup')}
              className="text-lg font-medium px-8 py-4"
              shimmerColor="rgba(255, 255, 255, 0.2)"
              shimmerDuration="2s"
              background="linear-gradient(to right, rgb(37, 99, 235), rgb(79, 70, 229))"
            >
              Get Started
            </ShimmerButton>
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
      <div ref={timelineRef} className="mt-4 sm:mt-auto pb-4 sm:pb-8">
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
          className="mb-6 sm:mb-12 relative"
        >
          <h3 className="font-urbanist text-center text-xl sm:text-2xl md:text-3xl font-josefinsans font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300">
            Where We're Going, We Don't Need Roads
          </h3>
        </motion.div>

        {/* Interactive Timeline */}
        <div className="relative h-[200px] sm:h-[150px] mb-4 sm:mb-12 overflow-x-auto">
          <div className="absolute left-0 right-0 top-1/2 h-1 bg-gradient-to-r from-indigo-500/50 via-blue-500/50 to-cyan-500/50 w-[200%] sm:w-full"></div>

          {timeEras.map((era, index) => {
            // Create more space between timeline items on mobile
            const position = index * (90 / (timeEras.length - 1));
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
                <div className={`w-8 h-8 sm:w-8 sm:h-8 flex items-center justify-center rounded-full ${
                  activeEra === index
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                    : 'bg-blue-900/70 border border-blue-500/30'
                } shadow-lg shadow-blue-500/30 transition-all duration-300`}>
                  <span className="text-base sm:text-lg">{era.icon}</span>
                </div>
                {/* Year */}
                <div className={`absolute top-10 transform -translate-x-1/2 text-sm ${
                  activeEra === index ? 'text-blue-100' : 'text-blue-300'
                } whitespace-nowrap transition-colors duration-300 font-medium`}>
                  {era.year}
                </div>
                {/* Title - Only show on desktop */}
                <div className={`absolute bottom-8 transform -translate-x-1/2 hidden sm:block text-xs sm:text-sm ${
                  activeEra === index ? 'text-blue-100' : 'text-blue-300'
                } font-medium whitespace-nowrap transition-colors duration-300 bg-blue-950/80 backdrop-blur-sm px-2 py-1 rounded`}>
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