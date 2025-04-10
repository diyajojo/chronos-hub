'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/layout/navbar';
import StarBackground from '../components/design/starbackground';
import { handleImageUpload } from './utils/uploadImage';
import { generateAIImage } from './utils/generateAIImage';

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

interface TravelLogItem {
  id: number;
  yearVisited: number;
  story: string;
  image: string;
  survivalChances: number;
  rating: number;
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
  const [imageMode, setImageMode] = useState<'upload' | 'ai'>('upload');
  const [generatingImage, setGeneratingImage] = useState(false);
  const [aiImageUrl, setAiImageUrl] = useState('');
  const [userLogs, setUserLogs] = useState<TravelLogItem[]>([]);
  const [hasLogs, setHasLogs] = useState(false);

  const fetchUserLogs = async (userId: string) => {
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
      if (data.logs) 
        {
        setUserLogs(data.logs);
        setHasLogs(true);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let finalImageUrl = '';
      if (imageMode === 'upload' && timeLog.imageFile) {
        setUploading(true);
        finalImageUrl = await handleImageUpload(timeLog.imageFile);
      } else if (imageMode === 'ai' && aiImageUrl) {
        setUploading(true);
        const aiImageResponse = await fetch(aiImageUrl);
        const aiImageBlob = await aiImageResponse.blob();
        const aiImageFile = new File([aiImageBlob], 'ai-generated-image.png', { type: 'image/png' });

        // Upload AI-generated image to Cloudinary
        finalImageUrl = await handleImageUpload(aiImageFile);
      }

      // Submit log with AI rating and calculated survival chance
      const response = await fetch('http://localhost:8000/addlog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          year: timeLog.year,
          description: timeLog.description,
          survivalChance: timeLog.survivalChance,
          imageUrl: finalImageUrl,
          rating: 0,
          userId: user?.id,
        }),
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
        if (user?.id) {
          await fetchUserLogs(user.id);
        }
      }
    } catch (error) {
      console.error('Error submitting travel log:', error);
    } finally {
      setUploading(false);
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
          console.log('Authentication failed :', data.error);
          router.replace('/login');
          return;
        }

        setUser(data.user);
        if (data.user?.id) {
          await fetchUserLogs(data.user.id);
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
          <div className="text-white">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-indigo-950 overflow-hidden relative">
      <StarBackground />
      <Navbar hideAuthButtons={true} />

      <main className="container mx-auto px-6 py-12 relative z-10">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="bg-black/30 backdrop-blur-md rounded-lg p-8 border border-blue-500/30">
            <h1 className="text-4xl font-bold text-white mb-4">
              Welcome, {user?.name} the Time Traveler!
            </h1>
          </div>

          {!hasLogs ? (
            <div className="bg-black/30 backdrop-blur-md rounded-lg p-8 border border-blue-500/30">
              <p className="text-blue-300 mb-6">Begin your time-traveling adventure by logging your first journey!</p>
              <button
                onClick={() => setShowNewLogForm(!showNewLogForm)}
                className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition-all"
              >
                {showNewLogForm ? 'Cancel' : 'Log Your First Journey'}
              </button>
              {showNewLogForm && (
                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                  {/* Existing form code */}
                  <div>
                    <label className="block text-blue-300 mb-2">Year Visited</label>
                    <input
                      type="text"
                      className="w-full bg-black/50 border border-blue-500/30 rounded-lg p-3 text-white"
                      placeholder="e.g., 1920 or 3050"
                      value={timeLog.year}
                      onChange={(e) => setTimeLog({ ...timeLog, year: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-blue-300 mb-2">Description</label>
                    <textarea
                      className="w-full bg-black/50 border border-blue-500/30 rounded-lg p-3 text-white h-32"
                      placeholder="Tell us about your adventure..."
                      value={timeLog.description}
                      onChange={(e) => setTimeLog({ ...timeLog, description: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-blue-300 mb-2">Survival Chance: {timeLog.survivalChance}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={timeLog.survivalChance}
                      onChange={(e) => setTimeLog({ ...timeLog, survivalChance: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex gap-4 mb-4">
                      <button
                        type="button"
                        onClick={() => setImageMode('upload')}
                        className={`flex-1 py-2 rounded-lg ${
                          imageMode === 'upload' ? 'bg-blue-600 text-white' : 'bg-black/30 text-blue-300'
                        }`}
                      >
                        Upload Image
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageMode('ai')}
                        className={`flex-1 py-2 rounded-lg ${
                          imageMode === 'ai' ? 'bg-blue-600 text-white' : 'bg-black/30 text-blue-300'
                        }`}
                      >
                        Generate AI Image
                      </button>
                    </div>

                    {imageMode === 'upload' && !timeLog.imageFile && (
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
                                customFileName: file.name.split('.')[0],
                              });
                            }
                          }}
                          className="w-full bg-black/50 border border-blue-500/30 rounded-lg p-3 text-white"
                        />
                      </>
                    )}

                    {imageMode === 'ai' && !timeLog.imageFile && (
                      <div className="space-y-4">
                        <p className="text-blue-300 mb-2">AI image will be generated based on your story details</p>
                        <button
                          type="button"
                          onClick={() =>
                            generateAIImage({
                              description: timeLog.description,
                              year: timeLog.year,
                              survivalChance: timeLog.survivalChance,
                              setGeneratingImage,
                              setAiImageUrl,
                              setTimeLog,
                              currentTimeLog: timeLog,
                            })
                          }
                          disabled={generatingImage || !timeLog.description || !timeLog.year}
                          className={`w-full py-2 rounded-lg ${
                            generatingImage || !timeLog.description || !timeLog.year
                              ? 'bg-gray-600 cursor-not-allowed'
                              : 'bg-purple-600 hover:bg-purple-700'
                          } text-white`}
                        >
                          {generatingImage ? 'Generating...' : 'Generate Image from Story'}
                        </button>
                      </div>
                    )}

                    {timeLog.imageFile && (
                      <div className="mt-4 space-y-4">
                        <div>
                          <label className="block text-blue-300 mb-2">Custom File Name </label>
                          <div className="flex gap-4">
                            <input
                              type="text"
                              value={timeLog.customFileName}
                              onChange={(e) => setTimeLog({ ...timeLog, customFileName: e.target.value })}
                              className="flex-1 bg-black/50 border border-blue-500/30 rounded-lg p-3 text-white"
                              placeholder="Enter custom file name (for your reference)"
                            />
                            <button
                              type="button"
                              onClick={() => setTimeLog({ ...timeLog, imageFile: null, customFileName: '' })}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"
                            >
                              Remove
                            </button>
                          </div>
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
                      uploading ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {uploading ? 'Uploading Image...' : 'Submit Journey'}
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-black/30 backdrop-blur-md rounded-lg p-8 border border-blue-500/30">
                <button
                  onClick={() => setShowNewLogForm(!showNewLogForm)}
                  className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition-all"
                >
                  {showNewLogForm ? 'Cancel' : 'Log New Journey'}
                </button>
                {showNewLogForm && (
                  <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                    {/* Existing form code */}
                    <div>
                      <label className="block text-blue-300 mb-2">Year Visited</label>
                      <input
                        type="text"
                        className="w-full bg-black/50 border border-blue-500/30 rounded-lg p-3 text-white"
                        placeholder="e.g., 1920 or 3050"
                        value={timeLog.year}
                        onChange={(e) => setTimeLog({ ...timeLog, year: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-blue-300 mb-2">Description</label>
                      <textarea
                        className="w-full bg-black/50 border border-blue-500/30 rounded-lg p-3 text-white h-32"
                        placeholder="Tell us about your adventure..."
                        value={timeLog.description}
                        onChange={(e) => setTimeLog({ ...timeLog, description: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-blue-300 mb-2">Survival Chance: {timeLog.survivalChance}%</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={timeLog.survivalChance}
                        onChange={(e) => setTimeLog({ ...timeLog, survivalChance: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <div className="flex gap-4 mb-4">
                        <button
                          type="button"
                          onClick={() => setImageMode('upload')}
                          className={`flex-1 py-2 rounded-lg ${
                            imageMode === 'upload' ? 'bg-blue-600 text-white' : 'bg-black/30 text-blue-300'
                          }`}
                        >
                          Upload Image
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageMode('ai')}
                          className={`flex-1 py-2 rounded-lg ${
                            imageMode === 'ai' ? 'bg-blue-600 text-white' : 'bg-black/30 text-blue-300'
                          }`}
                        >
                          Generate AI Image
                        </button>
                      </div>

                      {imageMode === 'upload' && !timeLog.imageFile && (
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
                                  customFileName: file.name.split('.')[0],
                                });
                              }
                            }}
                            className="w-full bg-black/50 border border-blue-500/30 rounded-lg p-3 text-white"
                          />
                        </>
                      )}

                      {imageMode === 'ai' && !timeLog.imageFile && (
                        <div className="space-y-4">
                          <p className="text-blue-300 mb-2">AI image will be generated based on your story details</p>
                          <button
                            type="button"
                            onClick={() =>
                              generateAIImage({
                                description: timeLog.description,
                                year: timeLog.year,
                                survivalChance: timeLog.survivalChance,
                                setGeneratingImage,
                                setAiImageUrl,
                                setTimeLog,
                                currentTimeLog: timeLog,
                              })
                            }
                            disabled={generatingImage || !timeLog.description || !timeLog.year}
                            className={`w-full py-2 rounded-lg ${
                              generatingImage || !timeLog.description || !timeLog.year
                                ? 'bg-gray-600 cursor-not-allowed'
                                : 'bg-purple-600 hover:bg-purple-700'
                            } text-white`}
                          >
                            {generatingImage ? 'Generating...' : 'Generate Image from Story'}
                          </button>
                        </div>
                      )}

                      {timeLog.imageFile && (
                        <div className="mt-4 space-y-4">
                          <div>
                            <label className="block text-blue-300 mb-2">Custom File Name </label>
                            <div className="flex gap-4">
                              <input
                                type="text"
                                value={timeLog.customFileName}
                                onChange={(e) => setTimeLog({ ...timeLog, customFileName: e.target.value })}
                                className="flex-1 bg-black/50 border border-blue-500/30 rounded-lg p-3 text-white"
                                placeholder="Enter custom file name (for your reference)"
                              />
                              <button
                                type="button"
                                onClick={() => setTimeLog({ ...timeLog, imageFile: null, customFileName: '' })}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"
                              >
                                Remove
                              </button>
                            </div>
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
                        uploading ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {uploading ? 'Uploading Image...' : 'Submit Journey'}
                    </button>
                  </form>
                )}
              </div>

              <div className="bg-black/30 backdrop-blur-md rounded-lg p-8 border border-blue-500/30">
                <h2 className="text-2xl font-bold text-white mb-6">Your Time Travel Logs</h2>
                <div className="space-y-4">
                  {userLogs.map((log) => (
                    <div key={log.id} className="p-4 bg-black/20 rounded-lg border border-blue-500/20">
                      <h3 className="text-xl text-white">Year: {log.yearVisited}</h3>
                      <p className="text-blue-300 mt-2">{log.story}</p>
                      <img src={log.image} alt="Travel log" className="mt-4 rounded-lg w-full" />
                      <div className="mt-4 flex justify-between text-blue-300">
                        <span>Survival Chance: {log.survivalChances}%</span>
                        <span>Rating: {log.rating}/10</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}