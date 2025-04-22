'use client';
import { useState, useEffect } from 'react';
import CreateLogModal from './createmodal';
import { AnimatePresence } from 'framer-motion';
import MapModal from './map/map';

interface TravelLogItem {
  id: number;
  yearVisited: number;
  story: string;
  image: string;
  survivalChances: number;
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

export default function Content({ user, otherLogs, userLogs, currentUser }: { 
  user: User, 
  otherLogs: TravelLogItem[], 
  userLogs: TravelLogItem[],
  currentUser: User,
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(false);  // Changed to false since we get data from props
  const [stats, setStats] = useState({
    totalTrips: 0,
    highestRated: { rating: 0, year: '' },
    rank: 0,
    totalLikes: 0
  });
  const [activeTab, setActiveTab] = useState('logs');

  return (
    <div className="container mx-auto px-4 py-8 relative z-10">
      {/* User Panel */}
      <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-blue-500/30 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar and Badge */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-black/50 flex items-center justify-center text-3xl font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
          
          {/* User Info and Stats */}
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-white text-center md:text-left">
              {user.name}
            </h1>
            
            {/* Tabs */}
            <div className="flex gap-8 mb-6">
              <button 
                onClick={() => setActiveTab('logs')}
                className={`${activeTab === 'logs' ? 'text-white' : 'text-blue-400'}`}
              >
                Time Logs
              </button>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-black/40 p-4 rounded-lg border border-blue-500/20">
                <p className="text-sm text-blue-300">Total Journeys</p>
                <p className="text-2xl font-bold text-white">{stats.totalTrips}</p>
              </div>
              <div className="bg-black/40 p-4 rounded-lg border border-blue-500/20">
                <p className="text-sm text-blue-300">Best Rating</p>
                <p className="text-2xl font-bold text-white">{stats.highestRated.rating}/10</p>
                <p className="text-xs text-blue-400">{stats.highestRated.year}</p>
              </div>
              <div className="bg-black/40 p-4 rounded-lg border border-blue-500/20">
                <p className="text-sm text-blue-300">Traveler Rank</p>
                <p className="text-2xl font-bold text-white">#{stats.rank}</p>
              </div>
              <div className="bg-black/40 p-4 rounded-lg border border-blue-500/20">
                <p className="text-sm text-blue-300">Engagement</p>
                <p className="text-2xl font-bold text-white">{stats.totalLikes}</p>
                <p className="text-xs text-blue-400">reactions</p>
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
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            log.survivalChances > 70 ? 'bg-green-900/60 text-green-300' : 
                            log.survivalChances > 40 ? 'bg-yellow-900/60 text-yellow-300' : 
                            'bg-red-900/60 text-red-300'
                          }`}>
                            {log.survivalChances}% Survival
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
        <CreateLogModal onClose={() => setShowCreateModal(false)} user={user} />
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