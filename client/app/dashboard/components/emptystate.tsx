'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CreateLogModal from './createmodal';
import StarBackground from '../../components/design/starbackground';
import PortalVisual from '../../components/design/portalvisual';
import MapModal from './map/map'; 
import Image from 'next/image';
import { BADGES } from '../utils/badges';
import { ShimmerButton } from '../../../components/magicui/shimmer-button';
import { TypingAnimation } from '../../../components/magicui/typing-animation';

interface User {
  id: number;
  name: string;
  email: string;
  createdAt?: string;
}

interface TravelLogItem {
  id: number;
  yearVisited: number;
  title: string;
  story: string;
  image: string;
  createdAt: string;
  comments: any[];
  reactions: any[];
  user: {
    id: number;
    name: string;
    email: string;
  };
}

interface UserBadge {
  badgeName: string;
}

export default function EmptyState({ 
  user, 
  otherLogs, 
  userBadges,
  onLogCreated
}: { 
  user: User, 
  otherLogs: TravelLogItem[],
  userBadges: UserBadge[],
  onLogCreated: () => Promise<void>
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [activeSection, setActiveSection] = useState('welcome');
  const [welcomeComplete, setWelcomeComplete] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('welcomeComplete') === 'true';
    }
    return false;
  });
  const [isFirstLog, setIsFirstLog] = useState(true);
  const [isClientReady, setIsClientReady] = useState(false);
  
  useEffect(() => {
    setIsClientReady(true);
  }, []);

  const toggleMap = () => {
    setShowMap(!showMap);
  };

  // Time greetings
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="relative min-h-screen">
      <StarBackground />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Main Content Area with 2-column layout */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - User Profile and Badges */}
          <div className="lg:col-span-1">
            <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-blue-500/30 h-full">
              {/* Avatar and User Info */}
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500/50 mb-4 shadow-lg shadow-blue-500/20">
                  <Image
                    src="/assets/pfp.png"
                    alt={`${user.name}'s profile`}
                    fill
                    sizes="(max-width: 768px) 100vw, 128px"
                    className="object-cover"
                  />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">
                  {user.name}
                </h1>
                
                {/* Member Since Info */}
                <div className="text-center mb-4">
                  <p className="text-sm text-blue-300">ChronosHub Member Since</p>
                  <div className="mt-2 bg-black/40 rounded-lg border border-blue-500/20 px-4 py-3 shadow-inner shadow-blue-500/10">
                    {user.createdAt ? (
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-blue-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                        </span>
                        <span className="text-lg font-medium text-white">
                          {new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    ) : (
                      <p className="text-white text-opacity-80">Date unavailable</p>
                    )}
                  </div>
                </div>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 w-full mb-6">
                  <div className="bg-black/40 p-4 rounded-lg border border-blue-500/20">
                    <p className="text-sm text-blue-300">Total Journeys</p>
                    <p className="text-3xl font-bold text-white">0</p>
                  </div>
                  <div className="bg-black/40 p-4 rounded-lg border border-blue-500/20">
                    <p className="text-sm text-blue-300">Badges Earned</p>
                    <div className="flex items-center ">
                      <p className="text-3xl font-bold text-white">{userBadges.length}</p>
                    </div>
                  </div>
                </div>
              
                {/* Motivation Message */}
                <div className="mt-8 bg-black/40 p-5 rounded-xl border border-blue-500/30 shadow-inner shadow-blue-500/10">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-2">🚀</span>
                    <h3 className="text-lg font-medium text-blue-300">Begin Your Journey</h3>
                  </div>
                  <p className="text-blue-100 text-sm">
                    Ready to chronicle your time-traveling adventures? Create your first log and start building your personal timeline of memories!
                  </p>
                 
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Welcome Section + Portal Visual + Action Buttons */}
          <div className="lg:col-span-2 flex flex-col h-full">
            {/* Top Right - Welcome Message */}
            <div className="mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-300">
                  {getTimeGreeting()}, {user.name.split(' ')[0]}
                </h2>
                <p className="text-xl text-blue-200 mb-6 italic">
                  <TypingAnimation duration={100} delay={0}>
                    Welcome to ChronosHub
                  </TypingAnimation>
                </p>
              </motion.div>
            </div>
            
           
            
            {/* Bottom Right - Action Buttons */}
            <div className="mt-auto flex flex-col items-center gap-4 max-w-xs mx-auto w-full">
              <ShimmerButton
                onClick={() => {
                  setActiveSection('create');
                  setShowCreateModal(true);
                }}
                className="w-full py-4 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold transition-all"
                shimmerColor="rgba(255, 255, 255, 0.2)"
                borderRadius="8px"
              >
                 ✍️ Log Your First Journey
              </ShimmerButton>
              
              <ShimmerButton
                onClick={() => {
                  setActiveSection('explore');
                  toggleMap();
                }}
                className="w-full py-4 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold transition-all"
                shimmerColor="rgba(255, 255, 255, 0.2)"
                borderRadius="8px"
              >
                🌍 Explore Time Map
              </ShimmerButton>
              
              <ShimmerButton
                className="w-full py-4 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold transition-all"
                shimmerColor="rgba(255, 255, 255, 0.2)"
                borderRadius="8px"
              >
                👥 Meet Travellers
              </ShimmerButton>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modals */}
      <AnimatePresence>
        {showMap && (
          <MapModal
            logs={otherLogs} 
            user={user}
            onClose={() => {
              setShowMap(false);
              setActiveSection('welcome');
            }}
          />
        )}
      </AnimatePresence>
      
      {showCreateModal && (
        <CreateLogModal 
          onClose={() => {
            setShowCreateModal(false);
            setActiveSection('welcome');
          }} 
          user={user} 
          isFirstLog={isFirstLog}
          onLogCreated={async () => {
            setIsFirstLog(false);
            await onLogCreated();
          }}
        />
      )}
    </div>
  );
}