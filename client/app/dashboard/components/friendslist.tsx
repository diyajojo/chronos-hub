'use client';

import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import Image from 'next/image';
import { UserProfileModal } from './userprofile';

interface Friend {
  id: number;
  name: string;
  email: string;
}

interface FriendsListProps {
  userId: number;
}

export default function FriendsList({ userId }: FriendsListProps) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const fetchFriends = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/friendship/friends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setFriends(data.friends);
        }
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchFriends();
    }
  }, [userId]);

  const handleOpenProfile = (friend: Friend) => {
    setSelectedFriend(friend);
    setShowProfileModal(true);
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <button id="friends-list" className="relative p-2 text-indigo-200 hover:text-white transition">
            <Users size={30} />
            {friends.length > 0 && (
              <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {friends.length}
              </span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0 bg-black/70 backdrop-blur-xl border border-blue-500/30 text-white shadow-xl shadow-blue-500/10">
          <div className="p-3 border-b border-blue-500/30">
            <h3 className="font-medium text-blue-200">Friends</h3>
          </div>
          
          {loading ? (
            <div className="flex justify-center p-4">
              <p className="text-blue-300">Loading friends...</p>
            </div>
          ) : friends.length > 0 ? (
            <div className="max-h-80 overflow-y-auto">
              {friends.map((friend) => (
                <div 
                  key={friend.id}            
                  className="p-3 border-b border-blue-500/30 last:border-0 hover:bg-blue-950/40 transition cursor-pointer"
                  onClick={() => handleOpenProfile(friend)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden border border-blue-500/30 flex-shrink-0">
                      <Image
                        src={"/assets/pfp.png"}
                        alt={friend.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-blue-100 truncate">{friend.name}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-blue-300">
              <p>No friends yet</p>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {selectedFriend && (
        <UserProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          user={{
            id: selectedFriend.id,
            name: selectedFriend.name
          }}
          currentUserId={userId}
        />
      )}
    </>
  );
} 