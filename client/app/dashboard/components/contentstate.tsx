'use client';
import { useState, useEffect } from 'react';
import CreateLogModal from './createmodal';
import { AnimatePresence } from 'framer-motion';
import MapModal from './map/map';
import { BADGES } from '../utils/badges';
import Image from 'next/image';
import { ShimmerButton } from '@/components/magicui/shimmer-button';

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
    totalEngagement: 0
  });
  const [activeTab, setActiveTab] = useState('logs');

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
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
              <div className="bg-black/40 p-4 rounded-lg border border-blue-500/20">
                <p className="text-sm text-blue-300">Total Journeys</p>
                <p className="text-2xl font-bold text-white">{stats.totalTrips}</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Create Log Button and Map Button */}
          <div className="lg:col-span-1">
            
              <div className="space-y-4">
                <ShimmerButton
                  onClick={() => setShowCreateModal(true)}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold transition-all"
                  shimmerColor="rgba(255, 255, 255, 0.2)"
                  borderRadius="8px"
                >
                  ✍️ Log New Journey
                </ShimmerButton>
                
                <ShimmerButton
                  onClick={() => setShowMap(true)}
                  className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold transition-all"
                  shimmerColor="rgba(255, 255, 255, 0.2)"
                  borderRadius="8px"
                >
                  🌍 Explore Time Map
                </ShimmerButton>
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
            userLogs={userLogs}
            user={user}
            onClose={() => setShowMap(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}