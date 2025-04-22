'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Content from '../components/contentstate';
import EmptyState from '../components/emptystate';
import StarBackground from '../../components/design/starbackground';

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserBadge {
  badgeName: string;
}

export default function Dashboard() {
  const router = useRouter();
  const params = useParams();
  const userId = params.userId;
  const [user, setUser] = useState<User | null>(null);
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasLogs, setHasLogs] = useState(false);
  const [otherLogs, setOtherLogs] = useState([]);
  const [userLogs, setUserLogs] = useState([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);

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

          // Fetch badges for the profile user
          const badgesResponse = await fetch('http://localhost:8000/userbadges', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ userId }),
          });

          if (!badgesResponse.ok) {
            throw new Error('Failed to fetch badges');
          }

          const badgesData = await badgesResponse.json();
          if (badgesData.success) {
            setUserBadges(badgesData.badges);
          }
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

  const updateLogs = async () => {
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
    } catch (error) {
      console.error('Error fetching logs:', error);
      setHasLogs(false);
      setOtherLogs([]);
      setUserLogs([]);
    }
  };

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
              user={profileUser}
              otherLogs={otherLogs}
              currentUser={user}
              userBadges={userBadges}
              onLogCreated={updateLogs}
            />
          )
        ) : (
          profileUser && user && (
            <Content 
              user={profileUser}
              otherLogs={otherLogs} 
              userLogs={userLogs}
              currentUser={user}
              userBadges={userBadges}
              onLogCreated={updateLogs}
            />
          )
        )}
      </main>
    </div>
  );
}