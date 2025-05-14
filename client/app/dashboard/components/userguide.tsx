'use client';

import { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { BADGES } from '../utils/badges';
import Image from 'next/image';

interface GuideStep {
  title: string;
  elementId?: string;
  longDescription: string;
}

export default function UserGuide() {
  const [currentStep, setCurrentStep] = useState(0);
  
  const guideSteps: GuideStep[] = [
    {
      title: "Welcome to ChronosHub!",
      longDescription: "ChronosHub is a time travel application where you can share your fictional journeys through time. Post your stories from different eras, connect with fellow time travelers, and earn badges for your adventures. This is your space to create and share experiences across the timestream."
    },
    {
      title: "Log Your Journey",
      elementId: "create-journey",
      longDescription: "Click this button to create a new time-travel log. You can specify the year you visited, add a title and story for your journey, and include an image of your adventure. Every journey you share expands your timeline and may earn you special badges."
    },
    {
      title: "Explore Time Map",
      elementId: "explore-map",
      longDescription: "The Time Map provides a visual representation of all time-travel journeys. You can see where and when other travelers have visited, discover interesting stories from different eras, and get inspired for your next adventure."
    },
    {
      title: "Meet Fellow Travelers",
      elementId: "meet-travelers",
      longDescription: "Search for other time travelers by name, view their profiles, and send friend requests. This feature helps you build your network of fellow adventurers and discover exciting journeys shared by others."
    },
    {
      title: "Friend Requests",
      elementId: "friend-requests",
      longDescription: "The notification bell shows when other travelers want to connect with you. You can accept or decline these friend requests. Building your network enhances your ChronosHub experience and unlocks social engagement features."
    },
    {
      title: "Your Friends Network",
      elementId: "friends-list",
      longDescription: "View all your connected friends, access their profiles, and explore their time-travel journeys. Your network of fellow time travelers is displayed here, making it easy to stay connected with other adventurers across time."
    },
    {
      title: "Achievement Badges",
      elementId: "badges-card",
      longDescription: "Badges are earned through your activities on ChronosHub. Each badge represents a different achievement in your time-traveling journey."
    }
  ];

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
    
    // Highlight the related element if elementId exists
    const step = guideSteps[index];
    if (step.elementId) {
      const element = document.getElementById(step.elementId);
      if (element) {
        // Scroll to element
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Add highlight effect
        element.classList.add('ring-4', 'ring-amber-400', 'ring-opacity-70', 'ring-offset-2');
        
        // Remove highlight after 3 seconds
        setTimeout(() => {
          element.classList.remove('ring-4', 'ring-amber-400', 'ring-opacity-70', 'ring-offset-2');
        }, 3000);
      }
    }
  };

  // Render badge images and descriptions for the Achievement Badges step
  const renderBadgeContent = () => {
    if (currentStep === 6) { // Achievement Badges step (index is now 6 since we removed one step)
      return (
        <div className="mt-4 space-y-4">
          {Object.entries(BADGES).map(([key, badge]) => (
            <div key={key} className="flex items-center gap-3 p-2 bg-blue-900/30 rounded-lg border border-blue-500/20">
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image 
                  src={badge.imageUrl} 
                  alt={badge.name}
                  fill
                  sizes="48px"
                  className="object-contain"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-100">{badge.name}</p>
                <p className="text-xs text-blue-300">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button id="user-guide" className="relative p-2 text-indigo-200 hover:text-white transition">
          <BookOpen size={30} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0 bg-black/70 backdrop-blur-xl border border-blue-500/30 text-white shadow-xl shadow-blue-500/10 font-josefinSans">
        <div className="font-urbanist p-3 border-b border-blue-500/30">
          <h3 className="text-blue-200">ChronosHub Guide</h3>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <h4 className="font-urbanist text-lg font-medium text-blue-100">{guideSteps[currentStep].title}</h4>
            
            <div className="mt-3 p-3 bg-blue-900/30 rounded-md border border-blue-500/20">
              <p className="font-urbanist text-sm text-blue-100 leading-relaxed whitespace-pre-line">
                {guideSteps[currentStep].longDescription}
              </p>
            </div>
            
            {renderBadgeContent()}
          </div>
          
          <div className="flex justify-between items-center mt-6">
            <button 
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className="font-urbanist px-3 py-1 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed bg-black/50 border border-blue-500/30 hover:bg-black/70 text-blue-300"
            >
              Previous
            </button>
            
            <div className="flex gap-1">
              {guideSteps.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => handleStepClick(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep ? 'bg-blue-500' : 'bg-blue-500/30'
                  }`}
                />
              ))}
            </div>
            
            <button 
              onClick={() => setCurrentStep(prev => Math.min(guideSteps.length - 1, prev + 1))}
              disabled={currentStep === guideSteps.length - 1}
              className="font-urbanist px-3 py-1 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-500 text-white"
            >
              Next
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
} 