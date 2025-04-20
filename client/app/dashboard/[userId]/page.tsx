'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import StarBackground from '../../components/design/starbackground';
import EmptyState from '../components/emptystate';
import Content from '../components/contentstate';
import followService from '../utils/followsystem';

interface User {
  id: number;
  name: string;
  email: string;
  followers?: { followerId: number }[];
  following?: { followingId: number }[];
}

export default function Dashboard() {
  const router = useRouter();
  const params = useParams();
  const userId = params.userId;
  // both is same if logged in user makes no visit to other user's profile 
  const [user, setUser] = useState<User | null>(null);
  const [profileUser, setProfileUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);
  const [hasLogs, setHasLogs] = useState(false);
  const [otherLogs, setOtherLogs] = useState([]);
  const [userLogs, setUserLogs] = useState([]);
  const [followData, setFollowData] = useState({
    followers: 0,
    following: 0
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        // Verify authentication
        const authResponse = await fetch('/api/verify', {
          credentials: 'include',
        });
        const authData = await authResponse.json();
        
        if (!authResponse.ok || !authData.authenticated) {
          router.replace('/login');
          return;
        }
        
        setUser(authData.user);

        // Check if userId from params is valid , if not redirect to own dashboard
        if (!userId || userId === 'undefined') {
          router.replace(`/dashboard/${authData.user.id}`);
          return;
        }

        // Fetch user data based on params id , if it is same as the logged in user , the response will be the same from api/verify
        try {
          const profileResponse = await fetch(`http://localhost:8000/user/${userId}`, {
            credentials: 'include',
          });
          
          // if response is not ok , redirect to own dashboard
          if (!profileResponse.ok) 
          {
            console.error('Error fetching user profile');
            router.replace(`/dashboard/${authData.user.id}`);
            return;
          }

          const profileData = await profileResponse.json();
          
          // if response is not oke , redirect to own dashboard
          if (!profileData.user || !profileData) {
            router.replace(`/dashboard/${authData.user.id}`);
            return;
          }
          
          setProfileUser(profileData.user);

          // Fetch follow data
          if (profileData.user) {
            try {
              const [followersData, followingData] = await Promise.all([
                followService.checkFollowStatus(Number(userId)),
                followService.checkFollowStatus(Number(userId))
              ]);

              setFollowData({
                followers: followersData.count,
                following: followingData.count
              });
            } catch (error) {
              console.error('Error fetching follow data:', error);
            }
          }
        } catch (profileError) {
          console.error('Error fetching profile:', profileError);
          router.replace(`/dashboard/${authData.user.id}`);
          return;
        }

        // Fetch logs for the profile user
        try {
          const response = await fetch('http://localhost:8000/fetchlogs', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ userId }),
          });
          
          if (!response.ok) {
            throw new Error('Failed to fetch logs');
          }

          const data = await response.json();
          
          if (data.userLogs && data.userLogs.length > 0) {
            setHasLogs(true);
            setUserLogs(data.userLogs);
          } else {
            setHasLogs(false);
          }
          setOtherLogs(data.otherLogs || []);
        } catch (logsError) {
          console.error('Error fetching logs:', logsError);
          setHasLogs(false);
          setOtherLogs([]);
          setUserLogs([]);
        }
      } catch (error) {
        console.error('Error loading dashboard:', error);
        setHasLogs(false);
        setOtherLogs([]);
        setUserLogs([]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [userId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-indigo-950">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-400 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-blue-300">Traveling through time...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-indigo-950 overflow-hidden relative">
      <StarBackground />
      
      <main className="container mx-auto px-6 py-8 relative z-10">
        {!hasLogs ? (
          profileUser && user && (
            <EmptyState 
              user={profileUser}      // The profile being viewed
              otherLogs={otherLogs}
              currentUser={user}      // The logged-in user
              followData={followData}
            />
          )
        ) : (
          profileUser && user && (
            <Content 
              user={profileUser}
              otherLogs={otherLogs} 
              userLogs={userLogs}
              currentUser={user}
              followData={followData}
            />
          )
        )}
      </main>
    </div>
  );
}