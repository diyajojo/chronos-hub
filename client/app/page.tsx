"use client";

import { useState, useEffect } from 'react';
import Navbar from './components/layout/navbar';
import HeroSection from './components/layout/hero';
import TimeDial from './components/layout/featuresdial';
import StarBackground from './components/design/starbackground';
import TimeParticles from './components/design/timeparticles';


export default function LandingPage() {
  const [activeEra, setActiveEra] = useState('future');
  
  // Rotate through different eras automatically
  useEffect(() => {
    const intervals = ['future', 'ancient', 'medieval', 'renaissance'];
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % intervals.length;
      setActiveEra(intervals[currentIndex]);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-indigo-950 overflow-hidden relative">
      <StarBackground/>
      <Navbar />
      
      <main className="container mx-auto px-6 py-12 md:py-16 relative z-10">
        <HeroSection />
        <TimeDial activeEra={activeEra} setActiveEra={setActiveEra}  />
      </main>
      
      <TimeParticles />
      
      {/* Add styles for the star twinkling animation */}
      <style jsx global>{`
        @keyframes twinkle {
          0% { opacity: 0.3; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}