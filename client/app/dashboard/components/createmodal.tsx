'use client';
import { useState, useEffect } from 'react';
import { handleImageUpload } from '../utils/imageupload';
import { generateAIImage } from '../utils/generateAIImage';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import BadgeNotification from './badgenotification';
import { BadgeName } from '../utils/badges';
import { SpinningTextLoader } from '../../components/design/loader';

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
  const [imageMode, setImageMode] = useState<'upload' | 'ai'>('upload');
  const [generatingImage, setGeneratingImage] = useState(false);
  const [aiImageUrl, setAiImageUrl] = useState('');
  const [aiImagePrompt, setAiImagePrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
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
    if (!timeLog.year || isNaN(parseInt(timeLog.year))) {
      setError('Please enter a valid year');
      toast.error("Invalid Year", {
        description: "Please enter a valid year",
        duration: 5000,
        action: {
          label: "Fix",
          onClick: () => setStep(1),
        },
      });
      return false;
    }
    if (!timeLog.description.trim()) {
      setError('Please enter a description');
      toast.error("Missing Description", {
        description: "Please enter a description of your journey",
        duration: 5000,
        action: {
          label: "Fix",
          onClick: () => setStep(2),
        },
      });
      return false;
    }
    if (!timeLog.title.trim()) {
      setError('Please enter a title for your story');
      toast.error("Missing Title", {
        description: "Please enter a title for your time travel story",
        duration: 5000,
        action: {
          label: "Fix",
          onClick: () => setStep(1),
        },
      });
      return false;
    }
    if (!user.id) {
      setError('User ID is missing');
      toast.error("Authentication Error", {
        description: "User ID is missing. Please try logging in again.",
        duration: 5000,
        action: {
          label: "Dismiss",
          onClick: () => {},
        },
      });
      return false;
    }
    if (imageMode === 'upload' && !timeLog.imageFile) {
      setError('Please upload an image');
      toast.error("Missing Image", {
        description: "Please upload an image from your adventure",
        duration: 5000,
        action: {
          label: "Fix",
          onClick: () => {},
        },
      });
      return false;
    }
    if (imageMode === 'ai' && !aiImageUrl) {
      setError('Please generate an AI image');
      toast.error("Missing Image", {
        description: "Please generate an AI image for your adventure",
        duration: 5000,
        action: {
          label: "Generate",
          onClick: () => {
            if (timeLog.description && timeLog.year) {
              generateAIImage({
                description: timeLog.description,
                year: timeLog.year,
                setGeneratingImage,
                setAiImageUrl,
                setTimeLog,
                currentTimeLog: timeLog,
              });
            }
          },
        },
      });
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

      if (imageMode === 'upload' && timeLog.imageFile) {
        try {
          finalImageUrl = await handleImageUpload(timeLog.imageFile);
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
          throw new Error('Failed to upload image. Please try again.');
        }
      } else if (imageMode === 'ai' && aiImageUrl) {
        try {
          const aiImageResponse = await fetch(aiImageUrl);
          const aiImageBlob = await aiImageResponse.blob();
          const aiImageFile = new File([aiImageBlob], 'ai-generated-image.png', { type: 'image/png' });

          finalImageUrl = await handleImageUpload(aiImageFile);
        } catch (aiError) {
          console.error('AI image processing error:', aiError);
          throw new Error('Failed to process AI image. Please try again.');
        }
      }

      // Prepare the request payload
      const payload = {
        year: parseInt(timeLog.year),
        title: timeLog.title,
        description: timeLog.description.trim(),
        imageUrl: finalImageUrl,
        userId: user.id || '0',
      };
      
      console.log('Submitting log with payload:', payload);

      const response = await fetch('http://localhost:8000/addlog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      // Handle potential non-JSON response
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
        // Store all earned badges for reference
        if (data.earnedBadges && data.earnedBadges.length > 0) {
          setEarnedBadges(data.earnedBadges as BadgeName[]);
          
          // Store chronodoppler info if available
          if (data.chronodopplerInfo) {
            setChronodopplerInfo(data.chronodopplerInfo);
          }
          
          // If multiple badges were earned, always show Chronoprodigy
          if (data.earnedBadges.length > 1) {
            setEarnedBadge('chronoprodigy');
            setShowBadgeNotification(true);
          } else if (data.earnedBadges.includes('chronodoppler')) {
            // Show chronodoppler badge only if it's the only badge earned
            setEarnedBadge('chronodoppler');
            setShowBadgeNotification(true);
          } else {
            // Otherwise show the first badge earned
            setEarnedBadge(data.earnedBadges[0] as BadgeName);
            setShowBadgeNotification(true);
          }
        } else if (data.badgeName) {
          // Legacy support for single badge
          setEarnedBadge(data.badgeName as BadgeName);
          setEarnedBadges([data.badgeName as BadgeName]);
          setShowBadgeNotification(true);
        } else {
          // No badges earned, close modal
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
    // Count words by splitting on whitespace
    const count = newDescription.trim().split(/\s+/).filter(word => word.length > 0).length;
    setWordCount(count);
  };

  const handleGenerate = async () => {
    if (!timeLog.description) {
      setError('Please describe your trip first');
      return;
    }

    setError('');
    
    try {
      generateAIImage({
        description: timeLog.description,
        year: timeLog.year,
        setGeneratingImage,
        setAiImageUrl,
        setTimeLog,
        currentTimeLog: timeLog,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate image';
      setError(errorMessage);
      toast.error('Failed to generate image: ' + errorMessage);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <Card className="bg-black/70 border border-blue-500/30 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
          <CardHeader className="border-b border-blue-500/30">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold text-white font-serif">{getStepTitle()}</CardTitle>
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
          
          <form onSubmit={handleSubmit}>
            <CardContent className="p-6">
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
                  <Tabs
                    value={imageMode}
                    onValueChange={(value) => setImageMode(value as 'upload' | 'ai')}
                    className="w-full"
                  >
                    <TabsList className="grid grid-cols-2 w-full bg-black/50 border border-blue-500/30">
                      <TabsTrigger value="upload" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-300">Upload Image</TabsTrigger>
                      <TabsTrigger value="ai" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-300">Generate AI Image</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="upload" className="mt-4">
                      {!timeLog.imageFile ? (
                        <div className="border-2 border-dashed border-blue-500/30 rounded-lg p-8 text-center">
                          <p className="text-blue-300 mb-4">Upload a photo from your adventure</p>
                          <Label htmlFor="image-upload" className="cursor-pointer inline-block px-4 py-2 bg-black/50 border border-blue-500/30 text-blue-300 hover:bg-black/70 rounded-lg transition-colors">
                            <span>Choose an image</span>
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
                                onClick={() => setTimeLog({ ...timeLog, imageFile: null, customFileName: '' })}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                          <div className="relative">
                            <img
                              src={URL.createObjectURL(timeLog.imageFile)}
                              alt="Preview"
                              className="max-w-full rounded-lg border border-blue-500/30"
                            />
                            <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-blue-300">
                              Time Artifact
                            </div>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="ai" className="mt-4">
                      {!aiImageUrl ? (
                        <Button
                          type="button"
                          variant="default"
                          onClick={handleGenerate}
                          disabled={generatingImage || !timeLog.description || !timeLog.year}
                          className={`w-full ${
                            generatingImage || !timeLog.description || !timeLog.year
                              ? 'bg-gray-600'
                              : 'bg-black/50 border border-blue-500/30 text-blue-300 hover:bg-black/70'
                          }`}
                        >
                          {generatingImage ? <SpinningTextLoader /> : 'Generate Image from Story'}
                        </Button>
                      ) : (
                        <div className="space-y-4">
                          <div className="relative">
                            <img
                              src={aiImageUrl}
                              alt="AI Generated"
                              className="max-w-full rounded-lg border border-blue-500/30"
                            />
                            <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-blue-300">
                              AI Generated
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => setAiImageUrl('')}
                            className="w-full"
                          >
                            Remove & Generate New
                          </Button>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="border-t border-blue-500/30 flex justify-between p-6">
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
                  disabled={uploading || (imageMode === 'upload' && !timeLog.imageFile) || (imageMode === 'ai' && !aiImageUrl)}
                  className={
                    uploading || (imageMode === 'upload' && !timeLog.imageFile) || (imageMode === 'ai' && !aiImageUrl)
                      ? 'bg-gray-600'
                      : 'bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600'
                  }
                >
                  {uploading ? <SpinningTextLoader /> : 'Submit Journey'}
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