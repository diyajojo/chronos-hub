'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Content from '../components/contentstate';
import EmptyState from '../components/emptystate';
import StarBackground from '../../components/design/starbackground';
import { toast } from "sonner";
import { SpinningTextLoader } from '../../components/design/loader';
import { API_BASE_URL } from '@/lib/config';

interface User {
  id: number;
  name: string;
  email: string;
  createdAt?: string;
}

interface UserBadge {
  badgeName: string;
}

export default function Dashboard() {
  const router = useRouter();
  const params = useParams();
  const userId = params.userId;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasLogs, setHasLogs] = useState(false);
  const [otherLogs, setOtherLogs] = useState([]);
  const [userLogs, setUserLogs] = useState([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Mark component as hydrated (client-side)
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Add new useEffect for handling back navigation
  useEffect(() => {
    const handleBackNavigation = async (event: PopStateEvent) => {
      // Check if user is authenticated
      try {
        const authResponse = await fetch('/api/verify', {
          credentials: 'include',
        });
        const authData = await authResponse.json();
        
        if (authData.authenticated) {
          // If authenticated, prevent navigation and stay on dashboard
          window.history.pushState(null, '', window.location.href);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };

    window.addEventListener('popstate', handleBackNavigation);
    // Push initial state to enable popstate handling
    window.history.pushState(null, '', window.location.href);

    return () => {
      window.removeEventListener('popstate', handleBackNavigation);
    };
  }, []);

  useEffect(() => {
    const loadDashboardData = async () => {
      console.log("Dashboard loading started");
      setLoading(true);
      try {
        // Verify authentication
        const authResponse = await fetch('/api/verify', {
          credentials: 'include',
        });
        const authData = await authResponse.json();
        
        if (!authResponse.ok || !authData.authenticated) {
          if (authData.error === 'User not found') {
            toast.error("Your account no longer exists", {
              description: "You have been logged out because your account was deleted.",
              duration: 5000,
            });
            router.replace('/login');
            return;
          }
          // Only redirect to login if there's no valid authentication
          if (!document.cookie.includes('token')) {
            router.replace('/login');
            return;
          }
        }
        
        console.log('User data from auth:', JSON.stringify(authData.user));
        
        // Get full user profile from API with createdAt field
        try {
          const profileResponse = await fetch(`${API_BASE_URL}/user/${authData.user.id}`, {
            credentials: 'include',
          });
          
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            console.log('User profile data:', JSON.stringify(profileData.user));
            
            // Set user with complete profile data
            setUser(profileData.user);
          } else {
            // Fallback to auth data if profile fetch fails
            setUser(authData.user);
            console.error('Failed to fetch user profile, using auth data');
          }
        } catch (profileError) {
          console.error('Error fetching user profile:', profileError);
          // Fallback to auth data
          setUser(authData.user);
        }

        // Redirect to own dashboard if userId doesn't match
        if (userId !== authData.user.id.toString()) {
          router.replace(`/dashboard/${authData.user.id}`);
          return;
        }

        // Fetch logs for the current user
        try {
          const response = await fetch(`${API_BASE_URL}/fetchlogs`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ userId: authData.user.id }),
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

          // Fetch badges
          try {
            console.log('Fetching badges for user:', authData.user.id);
            const badgesResponse = await fetch(`${API_BASE_URL}/userbadges`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({ userId: authData.user.id }),
            });

            if (badgesResponse.ok) {
              const badgesData = await badgesResponse.json();
              if (badgesData.success) {
                console.log('Badges fetched successfully:', badgesData.badges);
                setUserBadges(badgesData.badges);
              } else {
                console.error('Failed to fetch badges:', badgesData.error);
              }
            } else {
              console.error('Badge fetch response not ok:', badgesResponse.status);
            }
          } catch (badgeError) {
            console.error('Error fetching badges:', badgeError);
            // Don't fail the whole dashboard if badges fail to load
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          setHasLogs(false);
          setOtherLogs([]);
          setUserLogs([]);
        }
      } catch (error) {
        console.error('Error loading dashboard:', error);
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [userId, router]);

  const updateLogs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/fetchlogs`, {
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
      
      // Also update badges
      try {
        console.log('Refreshing badges for user:', userId);
        const badgesResponse = await fetch(`${API_BASE_URL}/userbadges`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ userId }),
        });

        if (badgesResponse.ok) {
          const badgesData = await badgesResponse.json();
          if (badgesData.success) {
            console.log('Badges refreshed successfully:', badgesData.badges);
            setUserBadges(badgesData.badges);
          }
        }
      } catch (badgeError) {
        console.error('Error refreshing badges:', badgeError);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      setHasLogs(false);
      setOtherLogs([]);
      setUserLogs([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-indigo-950 overflow-hidden relative">
      <StarBackground />
      
      <main className="container mx-auto px-6 py-8 relative z-10">
        {loading ? (
          // Show the SpinningTextLoader while data is being fetched
          <div className="min-h-[80vh] flex items-center justify-center">

              <SpinningTextLoader />
           
          </div>
        ) : (
          // Once loading is complete, render the appropriate component
          user && isHydrated && (
            hasLogs ? (
              <Content 
                user={user}
                otherLogs={otherLogs} 
                userLogs={userLogs}
                userBadges={userBadges}
                onLogCreated={updateLogs}
              />
            ) : (
              <EmptyState 
                user={user}
                otherLogs={otherLogs}
                userBadges={userBadges}
                onLogCreated={updateLogs}
              />
            )
          )
        )}
      </main>
    </div>
  );
}