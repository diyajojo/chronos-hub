'use client';

import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';

interface FriendRequest {
  id: number;
  user1: {
    id: number;
    name: string;
    email: string;
  };
}

interface FriendRequestsProps {
  userId: number;
  onRequestAction: () => void;
}

export default function FriendRequests({ userId, onRequestAction }: FriendRequestsProps) {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchFriendRequests = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/friendship/friend-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setRequests(data.pendingRequests);
        }
      }
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchFriendRequests();
    }
  }, [userId]);

  const handleAcceptRequest = async (friendshipId: number) => {
    setActionLoading(friendshipId);
    try {
      const response = await fetch('http://localhost:8000/friendship/accept-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ friendshipId }),
      });

      if (response.ok) {
        // Remove from list and refresh
        setRequests(prev => prev.filter(req => req.id !== friendshipId));
        onRequestAction();
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectRequest = async (friendshipId: number) => {
    setActionLoading(friendshipId);
    try {
      const response = await fetch('http://localhost:8000/friendship/reject-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ friendshipId }),
      });

      if (response.ok) {
        // Remove from list
        setRequests(prev => prev.filter(req => req.id !== friendshipId));
        onRequestAction();
      }
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button id="friend-requests" className="relative p-2 text-indigo-200 hover:text-white transition">
          <Bell size={30} />
          {requests.length > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {requests.length}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-black/70 backdrop-blur-xl border border-blue-500/30 text-white shadow-xl shadow-blue-500/10">
        <div className="p-3 border-b border-blue-500/30">
          <h3 className="font-medium text-blue-200">Friend Requests</h3>
        </div>
        
        {loading ? (
          <div className="flex justify-center p-4">
            <p className="text-blue-300">Loading requests...</p>
          </div>
        ) : requests.length > 0 ? (
          <div className="max-h-80 overflow-y-auto">
            {requests.map((request) => (
              <div key={request.id} className="p-3 border-b border-blue-500/30 last:border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-blue-100">{request.user1.name}</p>
                    <p className="text-xs text-blue-300">Sent you a friend request</p>
                  </div>
                  <div className="flex gap-2">
                    {actionLoading === request.id ? (
                      <div className="flex justify-center p-1">
                        <p className="text-blue-300 text-xs">Processing...</p>
                      </div>
                    ) : (
                      <>
                        <button 
                          onClick={() => handleAcceptRequest(request.id)}
                          className="bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded-md text-xs transition-colors"
                        >
                          Accept
                        </button>
                        <button 
                          onClick={() => handleRejectRequest(request.id)}
                          className="bg-black/50 border border-blue-500/30 hover:bg-black/70 text-blue-300 px-2 py-1 rounded-md text-xs transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-blue-300">
            <p>No pending friend requests</p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
} 