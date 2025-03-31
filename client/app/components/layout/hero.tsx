// components/layout/HeroSection.js
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import TimePortalEffect from '../design/timeportal';
import TimeTraveller from '../design/timetraveller';

export default function HeroSection() {
  return (
    <div className="grid md:grid-cols-2 gap-12 items-center">
      <div>
        <motion.h2 
          className="text-4xl md:text-6xl font-serif font-bold mb-6 text-blue-100 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Journey Through the
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-300">
            Tapestry of Time
          </span>
        </motion.h2>
        
        <motion.p 
          className="text-lg md:text-xl text-blue-200 mb-8 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Share your time travel adventures, collect magical artifacts, and connect with fellow chrononauts in a universe where every era awaits your discovery.
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
       
        </motion.div>
      </div>
      
      {/* Hero image implementation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="relative"
      >
        <div className="relative w-full h-96 md:h-full rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-lg backdrop-blur-sm border border-blue-400/30 overflow-hidden">
            {/* Main image */}
            <div className="relative w-full h-full">
              <Image 
                src='/assets/hero.jpeg'
                alt="Child looking at stars in a magical night sky" 
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                style={{ objectFit: 'cover' }}
                className="rounded-lg"
              />
              
              {/* Overlay to ensure text is readable if needed */}
              <div className="absolute inset-0 bg-blue-900/10 rounded-lg"></div>
              
              <TimePortalEffect />
            </div>
          </div>
        </div>
        
        {/* Decorative time traveler silhouette */}
        <TimeTraveller />
      </motion.div>
    </div>
  );
}

