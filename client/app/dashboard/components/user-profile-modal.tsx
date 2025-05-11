'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: number;
    name: string;
    image?: string;
  };
}

export function UserProfileModal({ isOpen, onClose, user }: UserProfileProps) {
  // Dummy data for the profile
  const dummyBadges = [
    { id: 1, name: 'Time Pioneer', description: 'First journey completed', imageUrl: '/assets/badge-pioneer.png' },
    { id: 2, name: 'Temporal Explorer', description: 'Visited 5 different eras', imageUrl: '/assets/badge-explorer.png' },
    { id: 3, name: 'Chrono Master', description: 'Mastered time travel', imageUrl: '/assets/badge-master.png' }
  ];

  const dummyJourneys = [
    { id: 1, year: 1492, title: 'Columbus Voyage'},
    { id: 2, year: 1969, title: 'Moon Landing' },
    { id: 3, year: 3045, title: 'Mars Colony' }
  ];

  const dummyStats = {
    totalJourneys: 12,
    favoritePeriod: 'Renaissance',
    survivability: '87%',
    totalReactions: 256
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-indigo-950 to-blue-950 text-white border border-indigo-400/20 p-0 max-w-2xl">
        {/* Header with profile info */}
        <div className="p-6 border-b border-indigo-500/20">
          <div className="flex justify-between items-start mt-4">
            <div className="flex items-center gap-4 ">
              <div className="relative w-16 h-16  rounded-full overflow-hidden border-2 border-indigo-500/50">
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
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md transition flex items-center gap-2 mt-4">
              <span>+</span> Add Friend
            </button>
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
                Stats
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Badges Tab */}
          <TabsContent value="badges" className="p-6 focus:outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dummyBadges.map(badge => (
                <div key={badge.id} className="bg-indigo-900/40 p-4 rounded-lg border border-indigo-500/20 flex items-center gap-4">
                  <div>
                    <p className="text-indigo-200 font-medium">{badge.name}</p>
                    <p className="text-xs text-indigo-400">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Journeys Tab */}
          <TabsContent value="journeys" className="p-6 focus:outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dummyJourneys.map(journey => (
                <div key={journey.id} className="bg-indigo-900/40 rounded-lg overflow-hidden border border-indigo-500/20">
                  <div className="relative h-32">
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/80 to-transparent"></div>
                    <div className="absolute bottom-2 left-3 text-white">
                      <p className="text-lg font-bold">{journey.title}</p>
                      <p className="text-sm text-indigo-300">Year {journey.year}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="p-6 focus:outline-none">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-indigo-900/40 p-4 rounded-lg border border-indigo-500/20">
                <p className="text-sm text-indigo-400">Total Journeys</p>
                <p className="text-xl font-bold text-white">{dummyStats.totalJourneys}</p>
              </div>
              <div className="bg-indigo-900/40 p-4 rounded-lg border border-indigo-500/20">
                <p className="text-sm text-indigo-400">Favorite Period</p>
                <p className="text-xl font-bold text-white">{dummyStats.favoritePeriod}</p>
              </div>
              <div className="bg-indigo-900/40 p-4 rounded-lg border border-indigo-500/20">
                <p className="text-sm text-indigo-400">Survivability</p>
                <p className="text-xl font-bold text-white">{dummyStats.survivability}</p>
              </div>
              <div className="bg-indigo-900/40 p-4 rounded-lg border border-indigo-500/20">
                <p className="text-sm text-indigo-400">Total Reactions</p>
                <p className="text-xl font-bold text-white">{dummyStats.totalReactions}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 