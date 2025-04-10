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

interface TimeLog {
  year: string;
  description: string;
  survivalChance: number;
  imageUrl: string;
  rating: number;
  imageFile: File | null;
  customFileName: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showNewLogForm, setShowNewLogForm] = useState(false);
  const [timeLog, setTimeLog] = useState<TimeLog>({
    year: '',
    description: '',
    survivalChance: 50,
    imageUrl: '',
    rating: 0,
    imageFile: null,
    customFileName: '',
  });

  const sanitizeFileName = (fileName: string) => {
    // Remove special characters and spaces, replace with underscores
    return fileName
      .replace(/[^a-zA-Z0-9.]/g, '_')
      .replace(/_{2,}/g, '_')
      .toLowerCase();
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      
      // Create FormData for Cloudinary upload
      const formData = new FormData();
      formData.append('file', file);
      
      // Replace these with your actual Cloudinary credentials
      formData.append('upload_preset', 'chronos-hub'); 
      
      // Upload to Cloudinary directly from the frontend
      const response = await fetch('https://api.cloudinary.com/v1_1/dj3pdnthr/image/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Error uploading to Cloudinary');
      }
      
      // Return the secure URL provided by Cloudinary
      return data.secure_url;
    } 
    catch (error) 
    {
      console.error('Error uploading image to Cloudinary:', error);
      throw error;
    }
    finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let imageUrl = null;
      if (timeLog.imageFile) {
        // Upload to Cloudinary and get back the URL
        imageUrl = await handleImageUpload(timeLog.imageFile);
      }

      const response = await fetch('http://localhost:8000/database/addlog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          year: timeLog.year,
          description: timeLog.description,
          survivalChance: timeLog.survivalChance,
          imageUrl: imageUrl, // This now contains the Cloudinary URL
          rating: 0,
          userId: user?.id
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setTimeLog({
          year: '',
          description: '',
          survivalChance: 50,
          imageUrl: '',
          rating: 0,
          imageFile: null,
          customFileName: '',
        });
        setShowNewLogForm(false);
      }
    } catch (error) {
      console.error('Error submitting travel log:', error);
    }
  };

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch('/api/verify', {
          credentials: 'include'
        });
        const data = await response.json();
        
        if (!response.ok || !data.authenticated) {
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
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Welcome Card */}
          <div className="bg-black/30 backdrop-blur-md rounded-lg p-8 border border-blue-500/30">
            <h1 className="text-4xl font-bold text-white mb-4">
              Welcome, {user?.name} the Time Traveler!
            </h1>
            <div className="h-4 bg-gray-700/50 rounded-full overflow-hidden">
              <div className="h-full w-0 bg-blue-500 rounded-full transition-all duration-1000" />
            </div>
            <p className="text-blue-300 mt-4">Complete your first time travel log to unlock more features!</p>
          </div>

          {/* New Log Form */}
          <div className="bg-black/30 backdrop-blur-md rounded-lg p-8 border border-blue-500/30">
            <button
              onClick={() => setShowNewLogForm(!showNewLogForm)}
              className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition-all"
            >
              {showNewLogForm ? 'Cancel' : 'Log Your First Journey'}
            </button>
            
            {showNewLogForm && (
              <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                <div>
                  <label className="block text-blue-300 mb-2">Year Visited</label>
                  <input
                    type="text"
                    className="w-full bg-black/50 border border-blue-500/30 rounded-lg p-3 text-white"
                    placeholder="e.g., 1920 or 3050"
                    value={timeLog.year}
                    onChange={(e) => setTimeLog({...timeLog, year: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-blue-300 mb-2">Description</label>
                  <textarea
                    className="w-full bg-black/50 border border-blue-500/30 rounded-lg p-3 text-white h-32"
                    placeholder="Tell us about your adventure..."
                    value={timeLog.description}
                    onChange={(e) => setTimeLog({...timeLog, description: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-blue-300 mb-2">Survival Chance: {timeLog.survivalChance}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={timeLog.survivalChance}
                    onChange={(e) => setTimeLog({...timeLog, survivalChance: parseInt(e.target.value)})}
                    className="w-full"
                  />
                </div>

                <div>
                  {!timeLog.imageFile ? (
                    <>
                      <label className="block text-blue-300 mb-2">Upload Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setTimeLog({ 
                              ...timeLog, 
                              imageFile: file,
                              customFileName: file.name.split('.')[0]
                            });
                          }
                        }}
                        className="w-full bg-black/50 border border-blue-500/30 rounded-lg p-3 text-white"
                      />
                    </>
                  ) : (
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="block text-blue-300 mb-2">Custom File Name (for reference only)</label>
                        <div className="flex gap-4">
                          <input
                            type="text"
                            value={timeLog.customFileName}
                            onChange={(e) => setTimeLog({...timeLog, customFileName: e.target.value})}
                            className="flex-1 bg-black/50 border border-blue-500/30 rounded-lg p-3 text-white"
                            placeholder="Enter custom file name (for your reference)"
                          />
                          <button
                            type="button"
                            onClick={() => setTimeLog({...timeLog, imageFile: null, customFileName: ''})}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"
                          >
                            Remove
                          </button>
                        </div>
                        <p className="text-sm text-blue-300 mt-1">
                          Note: Cloudinary will assign its own file name, this is just for your reference
                        </p>
                      </div>
                      <div className="mt-2">
                        <img
                          src={URL.createObjectURL(timeLog.imageFile)}
                          alt="Preview"
                          className="max-w-xs rounded-lg"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={uploading}
                  className={`w-full py-4 rounded-lg text-white font-semibold transition-all ${
                    uploading 
                      ? 'bg-gray-600 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {uploading ? 'Uploading Image...' : 'Submit Journey'}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}