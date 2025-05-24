'use client';
import { useState } from 'react';
import { handleImageUpload } from '../../utils/imageupload';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import BadgeNotification from '../badgenotification';
import { BadgeName } from '../../utils/badges';
import { API_BASE_URL } from '@/lib/config';
import ImageSearch from '../imagesearch';

interface CreateLogModalProps {
  onClose: () => void;
  user: {
    id: number;
    name: string;
    email: string;
  };
  isFirstLog: boolean;
  onLogCreated: () => Promise<void>;
}

interface TimeLog {
  year: string;
  title: string;
  description: string;
  imageUrl: string;
  imageFile: File | null;
  customFileName: string;
}

export default function CreateLogModal({ onClose, user, isFirstLog, onLogCreated }: CreateLogModalProps) {
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showBadgeNotification, setShowBadgeNotification] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState<BadgeName | null>(null);
  const [earnedBadges, setEarnedBadges] = useState<BadgeName[]>([]);
  const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [chronodopplerInfo, setChronodopplerInfo] = useState<any>(null);

  const [timeLog, setTimeLog] = useState<TimeLog>({
    year: '',
    title: '',
    description: '',
    imageUrl: '',
    imageFile: null,
    customFileName: '',
  });

  const validateForm = () => {
    if (!timeLog.year) {
      setError('Please select a year');
      return false;
    }

    if (!timeLog.title) {
      setError('Please enter a title');
      return false;
    }

    if (!timeLog.description) {
      setError('Please describe your trip');
      return false;
    }

    if (!timeLog.imageFile && !timeLog.imageUrl) {
      setError('Please upload an image');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      let finalImageUrl = '';
      setUploading(true);

      if (timeLog.imageUrl) {
        finalImageUrl = timeLog.imageUrl;
      } else if (timeLog.imageFile) {
        try {
          finalImageUrl = await handleImageUpload(timeLog.imageFile);
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
          throw new Error('Failed to upload image. Please try again.');
        }
      }

      const payload = {
        year: parseInt(timeLog.year),
        title: timeLog.title,
        description: timeLog.description.trim(),
        imageUrl: finalImageUrl,
        userId: user.id || '0',
      };

      console.log('Submitting log with payload:', payload);

      const response = await fetch(`${API_BASE_URL}/addlog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      let data;
      try {
        const textResponse = await response.text();
        try {
          data = JSON.parse(textResponse);
        } catch (parseError) {
          console.error('Server response is not valid JSON:', textResponse);
          throw new Error('Server returned an invalid response');
        }
      } catch (responseError) {
        console.error('Error reading response:', responseError);
        throw new Error('Failed to read server response');
      }

      if (!response.ok) {
        console.error('Server error details:', data);
        throw new Error(data.error || data.details || 'Failed to submit log');
      }

      if (data.success) {
        console.log('Log submitted successfully:', data);
        if (data.earnedBadges && data.earnedBadges.length > 0) {
          setEarnedBadges(data.earnedBadges as BadgeName[]);

          if (data.chronodopplerInfo) {
            setChronodopplerInfo(data.chronodopplerInfo);
          }

          if (data.earnedBadges.length > 1) {
            setEarnedBadge('chronoprodigy');
            setShowBadgeNotification(true);
          } else if (data.earnedBadges.includes('chronodoppler')) {
            setEarnedBadge('chronodoppler');
            setShowBadgeNotification(true);
          } else {
            setEarnedBadge(data.earnedBadges[0] as BadgeName);
            setShowBadgeNotification(true);
          }
        } else if (data.badgeName) {
          setEarnedBadge(data.badgeName as BadgeName);
          setEarnedBadges([data.badgeName as BadgeName]);
          setShowBadgeNotification(true);
        } else {
          await onLogCreated();
          onClose();
        }
      } else {
        throw new Error('Failed to submit log');
      }
    } catch (error: any) {
      console.error('Error submitting travel log:', error);
      setError(error.message || 'Failed to submit travel log');
      toast.error("Failed to Save Travel Log", {
        description: error.message || "Please try again.",
        duration: 5000,
        action: {
          label: "Dismiss",
          onClick: () => {},
        },
      });
    } finally {
      setUploading(false);
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return "When did you travel?";
      case 2: return "Tell your story";
      case 3: return "Proof of travel";
      default: return "Log your journey";
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value;
    setTimeLog({ ...timeLog, description: newDescription });
    setWordCount(newDescription.split(/\s+/).filter(Boolean).length);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-2xl bg-blue-950/50 border border-blue-500/30 shadow-lg flex flex-col max-h-[90vh]">
          <CardHeader className="p-6 shrink-0">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold text-white font-urbanist">{getStepTitle()}</CardTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose}
                className="text-blue-300 hover:text-white"
              >
                ✕
              </Button>
            </div>
            
            <Progress 
              value={(step / 3) * 100} 
              className="h-1 bg-blue-900/50 rounded-full" 
            />
          </CardHeader>
          
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <CardContent className="font-urbanist p-6 overflow-y-auto">
              {error && (
                <Alert variant="destructive" className="mb-6 bg-red-500/20 border border-red-500/50 text-red-300">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="year" className="text-blue-300 mb-2 font-medium">Which year did you visit?</Label>
                    <Input
                      id="year"
                      type="text"
                      className="bg-black/50 border border-blue-500/30 text-white"
                      placeholder="e.g., 1920 or 3050"
                      value={timeLog.year}
                      onChange={(e) => setTimeLog({ ...timeLog, year: e.target.value })}
                      required
                    />
                    <p className="text-amber-300/80 text-xs mt-1.5 italic">
                      ⚠️ Time Travel Warning: Extreme years may fly you out of the ChronoHub zone!
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="title" className="text-blue-300 mb-2 font-medium">Title of your story</Label>
                    <Input
                      id="title"
                      type="text"
                      className="bg-black/50 border border-blue-500/30 text-white"
                      placeholder="Enter a title for your time travel story"
                      value={timeLog.title}
                      onChange={(e) => setTimeLog({ ...timeLog, title: e.target.value })}
                      required
                    />
                  </div>
                </div>
              )}
              
              {step === 2 && (
                <div className="space-y-4">
                  <div className="grid gap-3">
                    <Label htmlFor="description" className="text-blue-200">Your Time Travel Story</Label>
                    <Textarea 
                      id="description" 
                      rows={8}
                      placeholder="Describe what you saw and experienced on your journey..."
                      value={timeLog.description}
                      onChange={handleDescriptionChange}
                      className=" mt-2 bg-blue-950/40 border-blue-500/30 text-blue-200 resize-none"
                    />
                    <div className="text-sm text-blue-400">
                      <span>Word Count: {wordCount}</span>
                    </div>
                    <p className="text-xs text-blue-400/70 italic">Exactly 100 words may unlock a secret badge!</p>
                  </div>
                </div>
              )}
              
              {step === 3 && (
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-blue-500/30 rounded-lg p-8 text-center">
                    {!timeLog.imageFile && !timeLog.imageUrl ? (
                      <>
                        <p className="text-blue-300 mb-4">Upload a photo from your adventure</p>
                        <div className="space-y-4">
                          <div className="flex flex-col space-y-2">
                            <p className="text-sm text-blue-300">Search for images</p>
                            <ImageSearch
                              onImageSelect={async (imageUrl) => {
                                try {
                                  const response = await fetch(`${API_BASE_URL}/upload-from-url`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ imageUrl }),
                                    credentials: 'include',
                                  });
                                  const data = await response.json();
                                  if (!response.ok) throw new Error(data.error || 'Failed to upload image');
                                  setTimeLog({
                                    ...timeLog,
                                    imageFile: null,
                                    imageUrl: data.secure_url,
                                    customFileName: 'cloudinary-image',
                                  });
                                } catch (error) {
                                  toast.error("Failed to upload image from URL");
                                }
                              }}
                            />
                          </div>
                          
                          <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                              <div className="w-full border-t border-blue-500/30"></div>
                            </div>
                            <div className="relative flex justify-center">
                              <span className="px-2 text-blue-300 text-sm bg-blue-950">OR</span>
                            </div>
                          </div>
                          
                          <Label htmlFor="image-upload" className="cursor-pointer inline-block px-4 py-2 bg-black/50 border border-blue-500/30 text-blue-300 hover:bg-black/70 rounded-lg transition-colors">
                            <span>Choose from device</span>
                            <Input
                              id="image-upload"
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
                              className="hidden"
                            />
                          </Label>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="artifact-name" className="text-blue-300 mb-2">Artifact Name</Label>
                          <div className="flex gap-4">
                            <Input
                              id="artifact-name"
                              type="text"
                              value={timeLog.customFileName}
                              onChange={(e) => setTimeLog({ ...timeLog, customFileName: e.target.value })}
                              className="bg-black/50 border border-blue-500/30 text-white"
                              placeholder="Name your time artifact"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              onClick={() => setTimeLog({ ...timeLog, imageFile: null, imageUrl: '', customFileName: '' })}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                        <div className="relative">
                          <img
                            src={timeLog.imageFile ? URL.createObjectURL(timeLog.imageFile) : timeLog.imageUrl}
                            alt="Preview"
                            className="max-w-full rounded-lg border border-blue-500/30"
                          />
                          <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-blue-300">
                            Time Artifact
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="border-t border-blue-500/30 flex justify-between p-6 shrink-0">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  className="bg-black/50 border border-blue-500/30 text-blue-300 hover:bg-black/70"
                >
                  Back
                </Button>
              ) : (
                <div></div>
              )}
              
              {step < 3 ? (
                <Button
                  type="button"
                  variant="default"
                  onClick={() => setStep(step + 1)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={step === 1 && !timeLog.year || step === 2 && !timeLog.description}
                >
                  Continue
                </Button>
              ) : (
                <Button
                type="submit"
                variant="default"
                disabled={uploading || (!timeLog.imageFile && !timeLog.imageUrl)}
                className={
                  uploading || (!timeLog.imageFile && !timeLog.imageUrl)
                    ? 'bg-gray-600'
                    : 'bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600'
                }
              >
                {uploading ? 'Saving Journey...' : 'Submit Journey'}
              </Button>
              )}
            </CardFooter>
          </form>
        </Card>
      </div>

      {showBadgeNotification && earnedBadge && (
        <BadgeNotification
          badgeName={earnedBadge}
          onClose={() => {
            setShowBadgeNotification(false);
            onClose();
          }}
          onLogCreated={onLogCreated}
          isFirstLog={isFirstLog}
          chronodopplerInfo={chronodopplerInfo}
          earnedBadges={earnedBadges}
        />
      )}
    </>
  );
}