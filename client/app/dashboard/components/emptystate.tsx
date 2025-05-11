'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CreateLogModal from './createmodal';
import StarBackground from '../../components/design/starbackground';
import PortalVisual from '../../components/design/portalvisual';
import MapModal from './map/map'; 
import Image from 'next/image';
import { BADGES } from '../utils/badges';

interface User {
  id: number;
  name: string;
  email: string;
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

  const toggleMap = () => {
    setShowMap(!showMap);
  };


  return (
    <div className="relative min-h-screen">
      <StarBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
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
      sizes="96px"
      className="object-cover"
    />
  </div>
</div>
            
            {/* User Info and Stats */}
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-white text-center md:text-left mb-4">
                {user.name}
              </h1>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-black/40 p-4 rounded-lg border border-blue-500/20">
                  <p className="text-sm text-blue-300">Total Journeys</p>
                  <p className="text-2xl font-bold text-white">0</p>
                </div>
                <div className="bg-black/40 p-4 rounded-lg border border-blue-500/20">
                  <p className="text-sm text-blue-300">Badges Earned</p>
                  <p className="text-2xl font-bold text-white">{userBadges.length}</p>
                </div>
                <div className="bg-black/40 p-4 rounded-lg border border-blue-500/20">
                  <p className="text-sm text-blue-300">Engagement</p>
                  <p className="text-2xl font-bold text-white">0</p>
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

        {/* Portal Visual and Action Buttons */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-[500px] h-[500px]">
            <PortalVisual />
          </div>
          
          <div className="flex space-x-4 mb-10">
            {[
              { id: 'create', label: 'Chronicle', icon: '✍️' },
              { id: 'explore', label: 'Discover', icon: '🔍' }
            ].map(section => (
              <motion.button
                key={section.id}
                onClick={() => {
                  setActiveSection(section.id);
                  if (section.id === 'create') setShowCreateModal(true);
                  if (section.id === 'explore') toggleMap();
                }}
                className={`relative px-8 py-4 rounded-lg text-white text-lg transition-all ${
                  activeSection === section.id 
                    ? 'bg-gradient-to-r from-blue-700 to-blue-500 shadow-lg'
                    : 'bg-blue-900/30 hover:bg-blue-800/50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="mr-2">{section.icon}</span>
                {section.label}
              </motion.button>
            ))}
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