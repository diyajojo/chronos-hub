'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CreateLogModal from './logs/createmodal';
import StarBackground from '../../components/design/starbackground';
import MapModal from './map'; 
import Image from 'next/image';
import { ShimmerButton } from '../../../components/magicui/shimmer-button';
import { SearchUsers } from './searchuser';
import FriendRequests from './friendrequest';
import FriendsList from './friendslist';
import UserGuide from './userguide';


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

// Tour steps data
const TOUR_STEPS = [
  {
    target: 'create-journey',
    title: '✍️ Create Your First Journey',
    content: 'Begin your time-traveling adventure by logging your first journey. Share your stories and memories!',
  },
  {
    target: 'explore-map',
    title: '🌍 Explore the Time Map',
    content: 'Discover a visual map of all time-travel adventures. See where and when other travelers have ventured!',
  },
  {
    target: 'meet-travelers',
    title: '👥 Meet Fellow Travelers',
    content: 'Connect with other time travelers! Search and make friends with fellow adventurers.',
  },
  {
    target: 'friend-requests',
    title: '🔔 Friend Requests',
    content: 'Keep track of your incoming friend requests here. Build your time-traveling network!',
  },
  {
    target: 'friends-list',
    title: '👥 Your Network',
    content: 'View and manage your time-traveling friends. Visit their profiles and see their journeys!',
  },
  {
    target: 'instruction-guide',
    title: '📖 Time Traveler\'s Guide',
    content: 'Access the guidebook anytime you need help navigating ChronosHub. Contains information about all features!',
  }
];

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
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [activeSection, setActiveSection] = useState('welcome');
  const [currentTourStep, setCurrentTourStep] = useState(0);
  const [showTour, setShowTour] = useState(false); // Don't show tour immediately
  const [showIntro, setShowIntro] = useState(true); // Show intro first
  const [targetElement, setTargetElement] = useState<DOMRect | null>(null);
  const [isFirstLog, setIsFirstLog] = useState(true);
  const [hasInteractedWithCreateModal, setHasInteractedWithCreateModal] = useState(false);
  const [friendsUpdated, setFriendsUpdated] = useState(0);
  

  // Expose intro state to window object so parent component can access it
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).isChronosIntroActive = showIntro;
      
      // Create and dispatch a custom event when intro state changes
      const event = new CustomEvent('chronosIntroStateChanged', { 
        detail: { isActive: showIntro }
      });
      window.dispatchEvent(event);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        (window as any).isChronosIntroActive = false;
      }
    };
  }, [showIntro]);

  const handleFriendRequestAction = () => {
    // Trigger refresh of data when friend request is accepted or rejected
    setFriendsUpdated(prev => prev + 1);
  };

  useEffect(() => {
    if (showTour) {
      const updateTargetPosition = () => {
        const element = document.getElementById(TOUR_STEPS[currentTourStep].target);
        if (element) {
          const rect = element.getBoundingClientRect();
          setTargetElement(rect);
        }
      };

      updateTargetPosition();
      window.addEventListener('resize', updateTargetPosition);
      return () => window.removeEventListener('resize', updateTargetPosition);
    }
  }, [showTour, currentTourStep]);

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

  const completeTour = () => {
    setShowTour(false);
  };

  const nextTourStep = () => {
    if (currentTourStep < TOUR_STEPS.length - 1) {
      setCurrentTourStep(prev => prev + 1);
    } else {
      completeTour();
    }
  };

  const prevTourStep = () => {
    if (currentTourStep > 0) {
      setCurrentTourStep(prev => prev - 1);
    }
  };

  const startTour = () => {
    setShowIntro(false);
    setShowTour(true);
  };

  // Only track when user has interacted with create modal, but don't reset intro
  useEffect(() => {
    if (showCreateModal) {
      setHasInteractedWithCreateModal(true);
    }
  }, [showCreateModal]);
  
  // Hide intro if user has interacted with create modal once
  useEffect(() => {
    if (hasInteractedWithCreateModal) {
      setShowIntro(false);
    }
  }, [hasInteractedWithCreateModal]);

  return (
    <div className="relative min-h-screen">
      <StarBackground />
      
      <div className="container mx-auto px-4 py-4 relative z-10  flex flex-col">
        {/* Social Icons - Add at the top of EmptyState */}
        {!showIntro && (
          <div className="flex justify-center md:justify-end items-center space-x-4 sm:space-x-6 mb-8 md:absolute md:top-4 md:right-4 md:mb-0 pointer-events-auto z-20">
            <div id="instruction-guide" className="cursor-pointer">
              <UserGuide />
            </div>
            <div className="cursor-pointer">
              <FriendsList userId={user.id} />
            </div>
            <div className="cursor-pointer">
              <FriendRequests userId={user.id} onRequestAction={handleFriendRequestAction} />
            </div>
          </div>
        )}

        {/* Intro Overlay */}
        <AnimatePresence>
          {showIntro && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50"
            >
              {/* Dark blue gradient background */}
              <div className="absolute inset-0 bg-gradient-to-b from-blue-950/95 via-indigo-950/95 to-black/95 backdrop-blur-sm">
                {/* Subtle animated stars in background */}
                <div className="absolute inset-0 overflow-hidden opacity-30">
                  {Array.from({ length: 50 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute h-1 w-1 rounded-full bg-white"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        opacity: Math.random() * 0.8 + 0.2,
                        animation: `twinkle ${Math.random() * 8 + 2}s infinite ease-in-out ${Math.random() * 2}s`
                      }}
                    />
                  ))}
                </div>
                
                {/* Decorative floating image circles */}
                <div className="absolute inset-0 overflow-hidden">
                  {/* LEFT SIDE IMAGES */}
                  
                  {/* Left top */}
                  <div
                    className="absolute left-[10%] top-[15%] w-16 sm:w-24 md:w-36 h-16 sm:h-24 md:h-36 rounded-full overflow-hidden border-2 border-blue-500/20"
                    style={{ opacity: 0.5 }}
                  >
                    <Image
                      src="/assets/intro/1.png"
                      alt="Time travel visual"
                      fill
                      className="object-cover"
                      style={{ filter: "brightness(0.7) saturate(1.2)" }}
                    />
                  </div>
                  
                  {/* Left middle */}
                  <div
                    className="absolute left-[15%] top-[45%] w-16 sm:w-24 md:w-36 h-16 sm:h-24 md:h-36 rounded-full overflow-hidden border-2 border-purple-500/20"
                    style={{ opacity: 0.5 }}
                  >
                    <Image
                      src="/assets/intro/5.png"
                      alt="Time travel visual"
                      fill
                      className="object-cover"
                      style={{ filter: "brightness(0.7) saturate(1.2)" }}
                    />
                  </div>
                  
                  {/* Left bottom */}
                  <div
                    className="absolute left-[10%] bottom-[15%] w-16 sm:w-24 md:w-36 h-16 sm:h-24 md:h-36 rounded-full overflow-hidden border-2 border-indigo-500/20"
                    style={{ opacity: 0.5 }}
                  >
                    <Image
                      src="/assets/intro/3.png"
                      alt="Time travel visual"
                      fill
                      className="object-cover"
                      style={{ filter: "brightness(0.65) saturate(1.2)" }}
                    />
                  </div>
                  
                  {/* RIGHT SIDE IMAGES */}
                  
                  {/* Right top */}
                  <div
                    className="absolute right-[10%] top-[15%] w-16 sm:w-24 md:w-36 h-16 sm:h-24 md:h-36 rounded-full overflow-hidden border-2 border-blue-500/20"
                    style={{ opacity: 0.5 }}
                  >
                    <Image
                      src="/assets/intro/4.png"
                      alt="Time travel visual"
                      fill
                      className="object-cover"
                      style={{ filter: "brightness(0.7) saturate(1.2)" }}
                    />
                  </div>
                  
                  {/* Right middle */}
                  <div
                    className="absolute right-[15%] top-[45%] w-16 sm:w-24 md:w-36 h-16 sm:h-24 md:h-36 rounded-full overflow-hidden border-2 border-purple-500/20"
                    style={{ opacity: 0.5 }}
                  >
                    <Image
                      src="/assets/intro/2.png"
                      alt="Time travel visual"
                      fill
                      className="object-cover"
                      style={{ filter: "brightness(0.7) saturate(1.2)" }}
                    />
                  </div>
                  
                  {/* Right bottom */}
                  <div
                    className="absolute right-[10%] bottom-[15%] w-16 sm:w-24 md:w-36 h-16 sm:h-24 md:h-36 rounded-full overflow-hidden border-2 border-indigo-500/20"
                    style={{ opacity: 0.5 }}
                  >
                    <Image
                      src="/assets/intro/6.png"
                      alt="Time travel visual"
                      fill
                      className="object-cover"
                      style={{ filter: "brightness(0.7) saturate(1.2)" }}
                    />
                  </div>
                </div>
              </div>

              {/* Centered content */}
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.8 }}
                  className="max-w-2xl w-full p-4 sm:p-8 text-center"
                >
                  {/* Chronos Hub logo/icon */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 1 }}
                    className="w-24 h-24 sm:w-28 md:w-36 sm:h-28 md:h-36 mx-auto mb-6 sm:mb-8 md:mb-10 relative"
                  >
                    <div className=""></div>
                    <Image
                      src="/assets/logo.png"
                      alt="ChronosHub"
                      width={160}
                      height={160}
                      className="relative z-10"
                    />
                  </motion.div>

                  {/* Creative welcome message */}
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 md:mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-blue-200">
                     You've Crossed The Threshold
                  </h2>
                  
                  {/* Immersive description */}
                  <div className="mb-6 sm:mb-8 md:mb-12 text-blue-100 text-base sm:text-lg md:text-xl leading-relaxed max-w-xl mx-auto space-y-3 sm:space-y-4 md:space-y-6">
                    <p>
                      You're no longer <span className="text-blue-300 font-bold">{user.name.split(' ')[0]}</span> from the ordinary world. You are now a <span className="text-blue-300 font-semibold">Chrono Traveler</span> in this realm between timelines. 🌠
                    </p>
                    <p>
                      The normal rules of time don't apply here. You're caught in the streams of history, floating between eras, with no way back to the mundane world. 🕰️
                    </p>
                    <p className="text-blue-200">
                      The only path forward is to embrace your new identity and venture through the timestream.
                    </p>
                  </div>

                  {/* Creative button */}
                  <button
                    onClick={startTour}
                    className="px-6 sm:px-7 md:px-8 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-900 hover:from-blue-800 hover:via-indigo-800 hover:to-blue-800 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-md shadow-blue-900/30"
                  >
                    🚀 Let's Begin Journey
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tour Overlay */}
        <AnimatePresence>
          {showTour && targetElement && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50"
            >
              {/* Semi-transparent overlay with spotlight */}
              <div className="absolute inset-0 bg-black/70">
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                  <defs>
                    <mask id="spotlight">
                      <rect width="100%" height="100%" fill="white"/>
                      <circle
                        cx={targetElement.left + targetElement.width / 2}
                        cy={targetElement.top + targetElement.height / 2}
                        r={Math.max(targetElement.width, targetElement.height) / 1.5}
                        fill="black"
                      />
                    </mask>
                  </defs>
                  <rect width="100%" height="100%" fill="black" mask="url(#spotlight)" />
                </svg>
              </div>

              {/* Tour tooltip with dynamic positioning */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bg-blue-950/90 backdrop-blur-xl p-4 sm:p-5 md:p-6 rounded-xl border border-blue-500/30 shadow-xl shadow-blue-500/10 w-64 sm:w-72 md:w-80"
                style={{
                  ...(() => {
                    const step = TOUR_STEPS[currentTourStep];
                    if (step.target === 'meet-travelers') {
                      // Position tooltip higher up for the Meet Travelers button
                      return {
                        left: targetElement.left + targetElement.width / 2 - 160,
                        top: targetElement.top - 200 // Position above the button instead of below
                      };
                    } else if (step.target === 'instruction-guide') {
                      // Position tooltip for the user guide button
                      return {
                        left: targetElement.left,
                        top: targetElement.bottom + 15 // Position below the instruction guide button
                      };
                    } else if (step.target === 'create-journey') {
                      // Position tooltip lower for the Create Your First Journey button
                      return {
                        left: targetElement.left + targetElement.width / 2 - 160,
                        top: targetElement.bottom + (window.innerWidth < 768 ? 10 : 28) // More space on mobile, less on desktop
                      };
                    }
                    // Default positioning for other elements (below the element)
                    return {
                      left: targetElement.left + targetElement.width / 2 - 160,
                      top: targetElement.bottom + 20
                    };
                  })()
                }}
              >
                {/* Pointing arrow with dynamic positioning */}
                <div 
                  className={`absolute w-4 h-4 bg-blue-950/90 border-l border-t border-blue-500/30 transform ${
                    TOUR_STEPS[currentTourStep].target === 'meet-travelers'
                      ? 'left-1/2 -translate-x-1/2 -bottom-2 rotate-[225deg]' // Arrow points down for meet travelers
                    : TOUR_STEPS[currentTourStep].target === 'instruction-guide'
                      ? 'left-8 -top-2 rotate-45' // Arrow points up for instruction guide
                    : TOUR_STEPS[currentTourStep].target === 'create-journey'
                      ? '-top-2 left-1/2 -translate-x-1/2 rotate-45' // Arrow points up for create journey
                    : '-top-2 left-1/2 -translate-x-1/2 rotate-45' // Arrow points up for other elements
                  }`}
                />

                <h3 className="text-lg sm:text-xl font-bold text-blue-200 mb-2">
                  {TOUR_STEPS[currentTourStep].title}
                </h3>
                <p className="text-sm sm:text-base text-blue-100 mb-4">
                  {TOUR_STEPS[currentTourStep].content}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <button
                      onClick={prevTourStep}
                      disabled={currentTourStep === 0}
                      className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm transition-colors
                        ${currentTourStep === 0 
                          ? 'bg-blue-900/50 text-blue-300 cursor-not-allowed' 
                          : 'bg-blue-600 hover:bg-blue-500 text-white'}`
                      }
                    >
                      Previous
                    </button>
                    <button
                      onClick={nextTourStep}
                      className="px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                    >
                      {currentTourStep === TOUR_STEPS.length - 1 ? 'Got it!' : 'Next'}
                    </button>
                  </div>
                  <span className="text-blue-300 text-xs sm:text-sm">
                    {currentTourStep + 1} / {TOUR_STEPS.length}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area with 2-column layout - adjusted for viewport height */}
        <div className="mt-6 md:mt-16 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 flex-grow pb-4">
          
          {/* Left Column - User Profile and Badges */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-blue-500/30 h-full">
              {/* Avatar and User Info */}
              <div className="flex flex-col items-center">
                <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-blue-500/50 mb-3 shadow-lg shadow-blue-500/20">
                  <Image
                    src="/assets/pfp.png"
                    alt={`${user.name}'s profile`}
                    fill
                    sizes="(max-width: 768px) 100vw, 128px"
                    className="object-cover"
                  />
                </div>
                <h1 className="text-xl md:text-2xl font-bold text-white text-center mb-2">
                  {user.name}
                </h1>
                
                {/* Member Since Info */}
                <div className="text-center mb-3 w-full">
                  <p className="text-sm text-blue-300">ChronosHub Member Since</p>
                  <div className="mt-1 bg-black/40 rounded-lg border border-blue-500/20 px-3 py-2 shadow-inner shadow-blue-500/10">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 w-full mb-4">
                  <div className="bg-black/40 p-3 rounded-lg border border-blue-500/20">
                    <p className="text-sm text-blue-300">Total Journeys</p>
                    <p className="text-2xl font-bold text-white">0</p>
                  </div>
                  <div id="badges-card" className="bg-black/40 p-3 rounded-lg border border-blue-500/20">
                    <p className="text-sm text-blue-300">Badges Earned</p>
                    <div className="flex items-center">
                      <p className="text-2xl font-bold text-white">{userBadges.length}</p>
                    </div>
                  </div>
                </div>
              
                {/* Motivation Message */}
                <div className="mt-3 bg-black/40 p-4 rounded-xl border border-blue-500/30 shadow-inner shadow-blue-500/10">
                  <div className="flex items-center mb-2">
                    <span className="text-xl mr-2">🚀</span>
                    <h3 className="text-base font-medium text-blue-300">Begin Your Journey</h3>
                  </div>
                  <p className="text-blue-100 text-sm">
                    Ready to chronicle your time-traveling adventures? Create your first log and start building your personal timeline of memories!
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Welcome Section + Action Buttons */}
          <div className="lg:col-span-2 flex flex-col h-full order-1 lg:order-2 mb-4 lg:mb-0">
            {/* Top Right - Welcome Message */}
            <div className="mb-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-300">
                  {getTimeGreeting()}, {user.name.split(' ')[0]}
                </h2>
                <h3 className="text-lg sm:text-xl md:text-2xl text-blue-200 mb-4 italic">
                  Welcome to ChronosHub
                </h3>
              </motion.div>
            </div>
            
            {/* Action Buttons - Centered in the layout */}
            <div className="flex flex-col items-center justify-center flex-grow">
              <div className="w-full max-w-xs sm:max-w-sm">
                <ShimmerButton
                  id="create-journey"
                  onClick={() => {
                    setActiveSection('create');
                    setShowCreateModal(true);
                  }}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold transition-all mb-3"
                  shimmerColor="rgba(255, 255, 255, 0.2)"
                  borderRadius="8px"
                >
                   ✍️ Log Your First Journey
                </ShimmerButton>
                
                <ShimmerButton
                  id="explore-map"
                  onClick={() => {
                    setActiveSection('explore');
                    toggleMap();
                  }}
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold transition-all mb-3"
                  shimmerColor="rgba(255, 255, 255, 0.2)"
                  borderRadius="8px"
                >
                  🌍 Explore Time Map
                </ShimmerButton>
                
                <ShimmerButton
                  id="meet-travelers"
                  onClick={() => setShowSearchModal(true)}
                  className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold transition-all"
                  shimmerColor="rgba(255, 255, 255, 0.2)"
                  borderRadius="8px"
                >
                  👥 Meet Travellers
                </ShimmerButton>
              </div>
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
            setShowIntro(false);
            setShowTour(false);
          }}
        />
      )}
      
      {/* Search Users Modal */}
      <AnimatePresence>
        {showSearchModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-black/70" onClick={() => setShowSearchModal(false)}></div>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-blue-950/90 backdrop-blur-xl p-6 rounded-xl border border-blue-500/30 w-full max-w-md shadow-xl shadow-blue-500/10"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-blue-200">Find Time Travellers</h2>
                <button 
                  onClick={() => setShowSearchModal(false)}
                  className="text-blue-300 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <SearchUsers currentUserId={user.id} autoFocus={true} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}