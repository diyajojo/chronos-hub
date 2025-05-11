'use client';
import { useState, useEffect } from 'react';
import CreateLogModal from './createmodal';
import { AnimatePresence } from 'framer-motion';
import MapModal from './map/map';
import { BADGES } from '../utils/badges';
import Image from 'next/image';

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
  const [loading, setLoading] = useState(false);
  const [isFirstLog, setIsFirstLog] = useState(userLogs.length === 0);
  const [stats, setStats] = useState({
    totalTrips: userLogs.length,
    totalBadges: userBadges.length,
    rank: 0,
    totalLikes: 0
  });
  const [activeTab, setActiveTab] = useState('logs');

  useEffect(() => {
    const fetchUserBadges = async () => {
      try {
        const response = await fetch('http://localhost:8000/userbadges', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ userId: user.id }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch badges');
        }

        const data = await response.json();
        if (data.success) {
          setStats(prev => ({
            ...prev,
            totalBadges: data.badges.length
          }));
        }
      } catch (error) {
        console.error('Error fetching badges:', error);
      }
    };

    fetchUserBadges();
  }, [user.id]);

  return (
    <div className="container mx-auto px-4 py-8 relative z-10">
      {/* User Panel */}
      <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-blue-500/30 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
    {/* Avatar and Badge */}
<div className="flex flex-col items-center">
  <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-blue-500/30">
    <Image
      src="/assets/pfp.png"
      alt={`${user.name}'s profile`}
      fill
      sizes="(max-width: 768px) 100vw, 96px"
      className="object-cover"
    />
  </div>
</div>
          
          {/* User Info and Stats */}
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-white text-center md:text-left">
              {user.name}
            </h1>
            
          
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-black/40 p-4 rounded-lg border border-blue-500/20">
                <p className="text-sm text-blue-300">Total Journeys</p>
                <p className="text-2xl font-bold text-white">{stats.totalTrips}</p>
              </div>
              <div className="bg-black/40 p-4 rounded-lg border border-blue-500/20">
                <p className="text-sm text-blue-300">Badges Earned</p>
                <p className="text-2xl font-bold text-white">{stats.totalBadges}</p>
              </div>
              <div className="bg-black/40 p-4 rounded-lg border border-blue-500/20">
                <p className="text-sm text-blue-300">Engagement</p>
                <p className="text-2xl font-bold text-white">{stats.totalLikes}</p>
                <p className="text-xs text-blue-400">reactions</p>
              </div>
            </div>

            {/* Badges Display */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-blue-300 mb-3">Your Badges</h3>
              <div className="grid grid-cols-2 gap-4">
                {userBadges.map(({ badgeName }) => {
                  const badge = BADGES[badgeName as keyof typeof BADGES];
                  if (!badge) return null;
                  
                  return (
                    <div 
                      key={badgeName}
                      className="bg-black/40 p-4 rounded-lg border border-blue-500/20 flex items-center gap-4"
                    >
                      <div className="relative w-12 h-12">
                        <Image
                          src={badge.imageUrl}
                          alt={badge.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 48px"
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <p className="text-white font-medium">{badge.name}</p>
                        <p className="text-sm text-blue-300">{badge.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tab Content */}
      {activeTab === 'logs' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Create Log Button and Featured Log */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-blue-500/30">
              <div className="space-y-4">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-bold transition-all hover:shadow-glow"
                >
                  Log New Journey
                </button>
                
                <button
                  onClick={() => setShowMap(true)}
                  className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-bold transition-all hover:shadow-glow"
                >
                  🔍 Discover Other Journeys
                </button>
              </div>
              
              <div className="mt-6 border-t border-blue-500/20 pt-6">
                <h3 className="text-lg font-medium text-blue-300 mb-3">Next Destination Ideas</h3>
                <div className="space-y-3">
                  {["Renaissance Italy", "Ancient Egypt", "Year 3000", "Dinosaur Era"].map((era, idx) => (
                    <div 
                      key={idx}
                      className="bg-black/20 p-3 rounded-lg hover:bg-black/40 transition-all cursor-pointer flex justify-between items-center"
                    >
                      <span className="text-blue-200">{era}</span>
                      <span className="text-xs text-blue-400">Explore</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Tips or Featured Content */}
            <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-blue-500/30">
              <h3 className="text-lg font-medium text-white mb-3">Featured Traveler Tip</h3>
              <p className="text-blue-200 text-sm">
                When visiting the future, be mindful of temporal contamination. 
                Bringing back knowledge about future events could disrupt the timeline!
              </p>
            </div>
          </div>
          
          {/* Right Column - Travel Logs Grid */}
          <div className="lg:col-span-2">
            <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-blue-500/30">
              <h2 className="text-2xl font-bold text-white mb-6">Your Time Travel Logs</h2>
              
              {userLogs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userLogs.map((log) => (
                    <div 
                      key={log.id} 
                      className="bg-black/40 rounded-lg overflow-hidden border border-blue-500/20 hover:border-blue-500/50 transition-all group"
                    >
                      <div className="relative">
                        <img 
                          src={log.image} 
                          alt={`Year ${log.yearVisited}`} 
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-0 right-0 bg-black/70 py-1 px-3 rounded-bl-lg">
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-xl font-bold text-white">Year {log.yearVisited}</h3>
                          <span className="px-2 py-1 rounded text-xs font-medium bg-blue-900/60 text-blue-300">
                            {log.title}
                          </span>
                        </div>
                        
                        <p className="text-blue-200 line-clamp-3 mb-3">{log.story}</p>
                        
                        <div className="flex justify-between items-center text-xs text-blue-400">
                          <span>{new Date(log.createdAt).toLocaleDateString()}</span>
                          <button className="hover:text-blue-300 transition-colors">Read More</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-blue-300">No travel logs yet. Start your first journey!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
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
            user={user}
            onClose={() => setShowMap(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}