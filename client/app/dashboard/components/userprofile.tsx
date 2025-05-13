'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { BADGES } from '../utils/badges';

interface UserBadge {
  badgeName: string;
  earnedAt: string;
}

interface TravelLogItem {
  id: number;
  yearVisited: number;
  title: string;
  story: string;
  image: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

interface UserStats {
  totalJourneys: number;
  firstJourneyDate: string | null;
}

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: number;
    name: string;
    image?: string;
  };
  currentUserId?: number;
}

export function UserProfileModal({ isOpen, onClose, user, currentUserId }: UserProfileProps) {
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [userLogs, setUserLogs] = useState<TravelLogItem[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalJourneys: 0,
    firstJourneyDate: null
  });
  const [loading, setLoading] = useState({
    badges: true,
    logs: true,
    stats: true
  });
  const [friendshipStatus, setFriendshipStatus] = useState<string | null>(null);
  const [friendshipId, setFriendshipId] = useState<number | null>(null);
  const [friendActionLoading, setFriendActionLoading] = useState(false);
  
  useEffect(() => {
    if (isOpen && user.id && currentUserId && user.id !== currentUserId) {
      // Fetch friendship status
      const checkFriendshipStatus = async () => {
        try {
          const response = await fetch('http://localhost:8000/friendship/status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ 
              user1Id: currentUserId, 
              user2Id: user.id 
            }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              setFriendshipStatus(data.status);
              if (data.friendship) {
                setFriendshipId(data.friendship.id);
              }
            }
          }
        } catch (error) {
          console.error('Error checking friendship status:', error);
        }
      };
      
      checkFriendshipStatus();
    }
  }, [isOpen, user.id, currentUserId]);

  useEffect(() => {
    if (isOpen && user.id) {
      // Fetch user badges
      const fetchBadges = async () => {
        setLoading(prev => ({ ...prev, badges: true }));
        try {
          const response = await fetch('http://localhost:8000/userbadges', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ userId: user.id }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              setUserBadges(data.badges);
            }
          }
        } catch (error) {
          console.error('Error fetching user badges:', error);
        } finally {
          setLoading(prev => ({ ...prev, badges: false }));
        }
      };

      const fetchLogs = async () => {
        setLoading(prev => ({ ...prev, logs: true }));
        try {
          const response = await fetch('http://localhost:8000/fetchlogs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ userId: user.id }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              setUserLogs(data.userLogs || []);
              
              // Calculate stats from logs
              calculateStats(data.userLogs || []);
            }
          }
        } catch (error) {
          console.error('Error fetching user logs:', error);
        } finally {
          setLoading(prev => ({ ...prev, logs: false }));
        }
      };

    
      fetchBadges();
      fetchLogs();
    }
  }, [isOpen, user.id]);


  const calculateStats = (logs: TravelLogItem[]) => {
    setLoading(prev => ({ ...prev, stats: true }));
    try {
      // Find earliest journey date
      let firstJourneyDate = null;
      if (logs.length > 0) {
        const dates = logs.map(log => new Date(log.createdAt));
        dates.sort((a, b) => a.getTime() - b.getTime());
        firstJourneyDate = dates[0].toLocaleDateString();
      }
      
      setStats({
        totalJourneys: logs.length,
        firstJourneyDate
      });
    } catch (error) {
      console.error('Error calculating stats:', error);
    } finally {
      setLoading(prev => ({ ...prev, stats: false }));
    }
  };


  const getHistoricalPeriod = (year: number): string => {
    if (year < -5000) return "Prehistoric";
    if (year < -500) return "Ancient World";
    if (year < 0) return "Classical Antiquity";
    if (year < 500) return "Common Era";
    if (year < 1500) return "Medieval Period";
    if (year < 1900) return "Renaissance & Early Modern";
    if (year < 2000) return "Industrial & Modern";
    if (year < 2100) return "Contemporary";
    if (year < 3000) return "Near Future";
    return "Distant Future";
  };

 const getTravelerRank=(journeyCount: number): string =>{
    if (journeyCount === 0) return "Time Tourist";
    if (journeyCount < 3) return "Novice Traveler";
    if (journeyCount < 7) return "Seasoned Explorer";
    if (journeyCount < 12) return "Chrono Navigator";
    if (journeyCount < 20) return "Temporal Voyager";
    return "Legendary Time Master";
  } 

  const handleSendFriendRequest = async () => {
    if (!currentUserId || !user.id) return;
    
    setFriendActionLoading(true);
    try {
      const response = await fetch('http://localhost:8000/friendship/send-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          senderId: currentUserId, 
          receiverId: user.id 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setFriendshipStatus('pending');
          setFriendshipId(data.friendship.id);
        }
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
    } finally {
      setFriendActionLoading(false);
    }
  };

  const handleAcceptFriendRequest = async () => {
    if (!friendshipId) return;
    
    setFriendActionLoading(true);
    try {
      const response = await fetch('http://localhost:8000/friendship/accept-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ friendshipId }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setFriendshipStatus('accepted');
        }
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
    } finally {
      setFriendActionLoading(false);
    }
  };

  const handleRejectFriendRequest = async () => {
    if (!friendshipId) return;
    
    setFriendActionLoading(true);
    try {
      const response = await fetch('http://localhost:8000/friendship/reject-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ friendshipId }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setFriendshipStatus(null);
          setFriendshipId(null);
        }
      }
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    } finally {
      setFriendActionLoading(false);
    }
  };

  const getFriendActionButton = () => {
    // Check if current user is viewing their own profile
    if (currentUserId === user.id) return null;
    
    if (friendActionLoading) {
      return (
        <button disabled className="bg-indigo-800 text-white px-3 py-1.5 rounded-md opacity-70 text-sm">
          <span className="animate-pulse">Loading...</span>
        </button>
      );
    }

    switch (friendshipStatus) {
      case 'pending':
        return (
          <button className="bg-violet-700 text-white px-3 py-1.5 rounded-md text-sm flex items-center gap-1 shadow-md">
             Request Sent
          </button>
        );
      case 'accepted':
        return (
          <button className="bg-emerald-600 text-white px-3 py-1.5 rounded-md text-sm flex items-center gap-1 shadow-md">
            <span>✓</span> Friends
          </button>
        );
      default:
        return (
          <button 
            onClick={handleSendFriendRequest} 
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1.5 rounded-md transition text-sm flex items-center gap-1 shadow-md"
          >
           Add Friend
          </button>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-indigo-950 to-blue-950 text-white border border-indigo-400/20 p-0 max-w-2xl">
        {/* Add DialogTitle for accessibility, can be visually hidden if needed */}
        <DialogTitle className="sr-only">User Profile</DialogTitle>
        
        {/* Header with profile info */}
        <div className="p-6 border-b border-indigo-500/20">
          <div className="flex justify-between items-start mt-4">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-500/50">
                <Image
                  src={user.image || "/assets/pfp.png"}
                  alt={`${user.name}'s profile`}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-indigo-200">{user.name}</h2>
                <p className="text-indigo-400 text-sm">Time Traveler</p>
              </div>
            </div>
            {getFriendActionButton()}
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="badges" className="w-full">
          <div className="px-6 pt-4">
            <TabsList className="w-full bg-indigo-900/40 border border-indigo-500/20">
              <TabsTrigger value="badges" className="flex-1 data-[state=active]:bg-indigo-700 text-white">
                Badges
              </TabsTrigger>
              <TabsTrigger value="journeys" className="flex-1 data-[state=active]:bg-indigo-700 text-white">
                Journeys
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex-1 data-[state=active]:bg-indigo-700 text-white">
                Time Analytics
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Badges Tab */}
          <TabsContent value="badges" className="p-6 focus:outline-none">
            {loading.badges ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin h-8 w-8 border-t-2 border-indigo-500 rounded-full"></div>
              </div>
            ) : userBadges.length > 0 ? (
              <div className="space-y-4">
                {userBadges.map(({ badgeName }) => {
                  const badge = BADGES[badgeName as keyof typeof BADGES];
                  if (!badge) return null;
                  
                  return (
                    <div 
                      key={badgeName}
                      className="bg-indigo-900/40 p-4 rounded-lg border border-indigo-500/20 flex items-center gap-4"
                    >
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <Image
                          src={badge.imageUrl}
                          alt={badge.name}
                          fill
                          sizes="48px"
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-indigo-200 font-medium">{badge.name}</p>
                        <p className="text-xs text-indigo-400">{badge.description}</p>
    
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-indigo-300">No badges earned yet</p>
                <p className="text-xs text-indigo-400 mt-2">Complete journeys to earn badges!</p>
              </div>
            )}
          </TabsContent>

          {/* Journeys Tab */}
          <TabsContent value="journeys" className="p-6 focus:outline-none">
            {loading.logs ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin h-8 w-8 border-t-2 border-indigo-500 rounded-full"></div>
              </div>
            ) : userLogs.length > 0 ? (
              <div className="space-y-6">
                {/* Group by historical period */}
                {Object.entries(
                  userLogs.reduce((acc, log) => {
                    const period = getHistoricalPeriod(log.yearVisited);
                    if (!acc[period]) acc[period] = [];
                    acc[period].push(log);
                    return acc;
                  }, {} as Record<string, TravelLogItem[]>)
                ).map(([period, logs]) => (
                  <div key={period} className="space-y-3">
                    <h3 className="text-indigo-200 font-medium border-b border-indigo-500/20 pb-1">{period}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {logs.map(log => (
                        <div 
                          key={log.id} 
                          className="bg-indigo-900/40 rounded-lg overflow-hidden border border-indigo-500/20 flex flex-col h-48"
                        >
                          <div className="relative h-28">
                            <Image
                              src={log.image || "/api/placeholder/600/400"}
                              alt={`Journey to ${log.yearVisited}`}
                              fill
                              sizes="(max-width: 768px) 100vw, 300px"
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/80 to-transparent"></div>
                          </div>
                          <div className="p-3 flex-1 flex flex-col justify-between">
                            <div>
                              <p className="text-lg font-bold text-white truncate">{log.title}</p>
                              <p className="text-sm text-indigo-300">Year {log.yearVisited}</p>
                            </div>
                            <p className="text-xs text-indigo-400 mt-1">
                              {new Date(log.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-indigo-300">No journeys recorded yet</p>
                <p className="text-xs text-indigo-400 mt-2">This traveler hasn't logged any time travels</p>
              </div>
            )}
          </TabsContent>

          {/* Stats/Analytics Tab */}
          <TabsContent value="stats" className="p-6 focus:outline-none">
            {loading.stats ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin h-8 w-8 border-t-2 border-indigo-500 rounded-full"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Total Journeys */}
                <div className="bg-indigo-900/40 p-4 rounded-lg border border-indigo-500/20">
                  <p className="text-sm text-indigo-400">Total Journeys</p>
                  <p className="text-xl font-bold text-white">{stats.totalJourneys}</p>
                </div>
                
                {/* First Journey Date */}
                <div className="bg-indigo-900/40 p-4 rounded-lg border border-indigo-500/20">
                  <p className="text-sm text-indigo-400">First Journey</p>
                  <p className="text-xl font-bold text-white">{stats.firstJourneyDate || 'None'}</p>
                </div>
                
                {/* Traveler Classification */}
                <div className="bg-indigo-900/40 p-4 rounded-lg border border-indigo-500/20">
                  <p className="text-sm text-indigo-400">Traveler Classification</p>
                  <p className="text-xl font-bold text-white">{getTravelerRank(stats.totalJourneys)}</p>
                  <p className="text-xs text-indigo-400 mt-1">Based on journey count and accomplishments</p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}


