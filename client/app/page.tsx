"use client";
import Navbar from './components/layout/navbar';
import HeroSection from './components/layout/hero';
import StarBackground from './components/design/starbackground';
import FloatingMagicalElements from './components/design/floatingelements';

export default function LandingPage() {
  return (
    <div className="h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-indigo-950 overflow-hidden relative">
      {/* Background Elements */}
      <StarBackground />
      <FloatingMagicalElements />
     
      
      <Navbar />
      <main className="container mx-auto px-6 py-8 h-[calc(100vh-76px)] relative z-10">
        <HeroSection />
      </main>
      
      {/* Add styles for the star twinkling animation */}
      <style jsx global>{`
        @keyframes twinkle {
          0% { opacity: 0.3; }
          100% { opacity: 1; }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}



