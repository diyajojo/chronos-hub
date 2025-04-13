'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import StarBackground from '../components/design/starbackground';
import EmptyState from './components/emptystate';
import Content from './components/contentstate';

interface User {
  id: string;
  name: string;
  email: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasLogs, setHasLogs] = useState(false);
  const [otherLogs, setOtherLogs] = useState([]);
  const [userLogs, setUserLogs] = useState([]);

  // Check if user has any logs
  const checkUserLogs = async (userId: string) => {
    try {
      const response = await fetch('http://localhost:8000/fetchlogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      
      if (data.userLogs && data.userLogs.length > 0) {
        setHasLogs(true);
        
        setUserLogs(data.userLogs);
      } else {
        setHasLogs(false);
      }
      console.log('other user logs:', data.otherLogs);
      setOtherLogs(data.otherLogs || []);
    } catch (error) {
      console.error('Error checking user logs:', error);
      setHasLogs(false);
      setOtherLogs([]);
      setUserLogs([]);
    }
  };

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch('/api/verify', {
          credentials: 'include',
        });
        const data = await response.json();

        if (!response.ok || !data.authenticated) {
          console.log('Authentication failed:', data.error);
          router.replace('/login');
          return;
        }

        setUser(data.user);
        if (data.user?.id) {
          await checkUserLogs(data.user.id);
        }
      } catch (error) {
        console.error('Verification error:', error);
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [router]);

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
          // For new users with no logs
          user && <EmptyState user={user} otherLogs={otherLogs} />
        ) : (
          // For users with existing logs
          user && <Content user={user} otherLogs={otherLogs} userLogs={userLogs} />
        )}
      </main>
    </div>
  );
}