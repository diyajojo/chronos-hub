'use client';
import { motion } from 'framer-motion';

export default function PortalVisual() {
  return (
    <motion.div 
      className="relative h-64 mb-6 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 1 }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-48 h-48">
          <motion.div 
            className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-800/80 via-blue-600/40 to-blue-900/80"
            animate={{ 
              rotate: 360,
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              rotate: { duration: 20, ease: "linear", repeat: Infinity },
              scale: { duration: 3, repeat: Infinity, repeatType: "reverse" }
            }}
          />
          
          {/* Portal swirls */}
          <motion.div 
            className="absolute inset-2 rounded-full border-2 border-blue-400/30"
            animate={{ rotate: -180 }}
            transition={{ duration: 15, ease: "linear", repeat: Infinity }}
          />
          <motion.div 
            className="absolute inset-8 rounded-full border border-purple-500/40"
            animate={{ rotate: 200 }}
            transition={{ duration: 12, ease: "linear", repeat: Infinity }}
          />
          <motion.div 
            className="absolute inset-16 rounded-full border border-cyan-400/50"
            animate={{ rotate: -220 }}
            transition={{ duration: 8, ease: "linear", repeat: Infinity }}
          />
          
          {/* Glowing center */}
          <motion.div 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white"
            animate={{ 
              boxShadow: [
                "0 0 10px 2px rgba(255,255,255,0.7), 0 0 20px 5px rgba(130,100,255,0.5)",
                "0 0 15px 3px rgba(255,255,255,0.9), 0 0 30px 8px rgba(130,100,255,0.7)",
                "0 0 10px 2px rgba(255,255,255,0.7), 0 0 20px 5px rgba(130,100,255,0.5)"
              ],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>
      </div>
      
      {/* Time artifact floating on top */}
      <motion.div 
        className="relative z-10 text-6xl"
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 5, 0, -5, 0]
        }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        🕰️
      </motion.div>
    </motion.div>
  );
}
