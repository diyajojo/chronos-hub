'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/layout/navbar';
import StarBackground from '../components/design/starbackground';

interface User {
  id: string;
  name: string;
  email: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch('/api/verify', {
          credentials: 'include' // Add this to ensure cookies are sent
        });
        const data = await response.json();
        
        if (!response.ok || !data.authenticated) 
          {
          console.log('Authentication failed :', data.error);
          router.replace('/login');
          return;
        }
        
        setUser(data.user);
      } 
      catch (error) {
        console.error('Verification error:', error);
        router.replace('/login');
      } 
      finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [router]);

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-indigo-950">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading...</div>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-indigo-950 overflow-hidden relative">
      <StarBackground />
      <Navbar hideAuthButtons={true} />
      
      <main className="container mx-auto px-6 py-12 relative z-10">
        <div className="max-w-4xl mx-auto bg-black/30 backdrop-blur-md rounded-lg p-8 border border-blue-500/30">
          <h1 className="text-3xl font-bold text-white mb-6">
            Welcome, {user?.name}!
          </h1>
        </div>
      </main>
    </div>
  );
}
