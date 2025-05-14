'use client';
import { useState, useEffect } from 'react';
import CreateLogModal from './logs/createmodal';
import { AnimatePresence, motion } from 'framer-motion';
import MapModal from './map';
import { BADGES } from '../utils/badges';
import Image from 'next/image';
import { ShimmerButton } from '../../../components/magicui/shimmer-button';
import { TypingAnimation } from '../../../components/magicui/typing-animation';
import { SearchUsers } from './searchuser';
import FriendRequests from './friendrequest';
import FriendsList from './friendslist';
import UserGuide from './userguide';


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

interface User {
  id: number;
  name: string;
  email: string;
  createdAt?: string;
}

interface UserBadge {
  badgeName: string;
}

export default function Content({ 
  user, 
  otherLogs, 
  userLogs,
  userBadges,
  onLogCreated
}: { 
  user: User, 
  otherLogs: TravelLogItem[], 
  userLogs: TravelLogItem[],
  userBadges: UserBadge[],
  onLogCreated: () => Promise<void>
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [isFirstLog, setIsFirstLog] = useState(userLogs.length === 0);
  const [stats, setStats] = useState({
    totalTrips: userLogs.length,
    totalEngagement: 0
  });
  const [friendsUpdated, setFriendsUpdated] = useState(0);
  

  // Time greetings
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const handleFriendRequestAction = () => {
    // Trigger refresh of data when friend request is accepted or rejected
    setFriendsUpdated(prev => prev + 1);
  };

  useEffect(() => {
    // Calculate total engagement (reactions and comments)
    const calculateEngagement = () => {
      let totalReactions = 0;
      let totalComments = 0;
      
      userLogs.forEach(log => {
        totalReactions += log.reactions?.length || 0;
        totalComments += log.comments?.length || 0;
      });
      
      setStats(prev => ({
        ...prev,
        totalEngagement: totalReactions + totalComments
      }));
    };
    
    calculateEngagement();
  }, [userLogs]);

  return (
    <div className="container mx-auto px-4 py-4 relative z-10 flex flex-col">
      {/* Social Icons - Add at the top of ContentState similar to Dashboard */}
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

      {/* Main Content Area with 2-column layout */}
      <div className="mt-6 md:mt-16 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 flex-grow pb-4">
        
        {/* Left Column - User Profile and Badges */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-blue-500/30 ">
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
              
              {/* Stats Card */}
              <div className="mt-2 w-full bg-black/40 p-3 rounded-lg border border-blue-500/20 mb-3">
                <p className="text-sm text-blue-300">Total Journeys</p>
                <p className="text-2xl font-bold text-white">{stats.totalTrips}</p>
              </div>
            </div>

            {/* Badges Display */}
            <div id="badges-card" className="mt-3">
              <h3 className="text-base font-medium text-blue-300 mb-2">Your Badges</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                {userBadges.map(({ badgeName }) => {
                  const badge = BADGES[badgeName as keyof typeof BADGES];
                  if (!badge) return null;
                  
                  return (
                    <div 
                      key={badgeName}
                      className="bg-black/40 p-3 rounded-lg border border-blue-500/20 flex items-center gap-3 hover:bg-black/60 transition-all"
                    >
                      <div className="relative w-10 h-10 flex-shrink-0">
                        <Image
                          src={badge.imageUrl}
                          alt={badge.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 48px"
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{badge.name}</p>
                        <p className="text-xs text-blue-300">{badge.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Mobile-only Action Buttons - Moved outside profile div but still in left column */}
          <div className="mt-4 block lg:hidden">
            <ShimmerButton
              onClick={() => setShowCreateModal(true)}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold transition-all mb-3"
              shimmerColor="rgba(255, 255, 255, 0.2)"
              borderRadius="8px"
            >
              ✍️ Log New Journey
            </ShimmerButton>
            
            <ShimmerButton
              onClick={() => setShowMap(true)}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold transition-all mb-3"
              shimmerColor="rgba(255, 255, 255, 0.2)"
              borderRadius="8px"
            >
              🌍 Explore Time Map
            </ShimmerButton>
            
            <ShimmerButton
              onClick={() => setShowSearchModal(true)}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold transition-all"
              shimmerColor="rgba(255, 255, 255, 0.2)"
              borderRadius="8px"
            >
              👥 Meet Travellers
            </ShimmerButton>
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
              <p className="text-sm sm:text-base md:text-lg text-blue-200 mb-4 italic">
                <TypingAnimation duration={100} delay={0}>
                  Welcome back to ChronosHub
                </TypingAnimation>
              </p>
            </motion.div>
          </div>
          
          {/* Desktop-only Action Buttons */}
          <div className="hidden lg:flex flex-col items-center justify-center flex-grow">
            <div className="w-full max-w-xs sm:max-w-sm">
              <ShimmerButton
                onClick={() => setShowCreateModal(true)}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold transition-all mb-3"
                shimmerColor="rgba(255, 255, 255, 0.2)"
                borderRadius="8px"
              >
                ✍️ Log New Journey
              </ShimmerButton>
              
              <ShimmerButton
                onClick={() => setShowMap(true)}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold transition-all mb-3"
                shimmerColor="rgba(255, 255, 255, 0.2)"
                borderRadius="8px"
              >
                🌍 Explore Time Map
              </ShimmerButton>
              
              <ShimmerButton
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
      
      {/* Modals */}
      {showCreateModal && (
        <CreateLogModal 
          onClose={() => setShowCreateModal(false)} 
          user={user}
          isFirstLog={isFirstLog}
          onLogCreated={async () => {
            setIsFirstLog(false);
            await onLogCreated();
            setStats(prev => ({
              ...prev,
              totalTrips: prev.totalTrips + 1
            }));
          }}
        />
      )}
      
      <AnimatePresence>
        {showMap && (
          <MapModal 
            logs={otherLogs} 
            userLogs={userLogs}
            user={user}
            onClose={() => setShowMap(false)}
          />
        )}
      </AnimatePresence>
      
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