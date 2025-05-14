'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { BADGES, BadgeName } from '../utils/badges';
import Image from 'next/image';
import { ScratchToReveal } from "@/components/magicui/scratch-to-reveal";
import { useState, useEffect } from 'react';

interface ChronodopplerInfo {
  year: number;
  travelers: {
    name: string;
    userId: number;
  }[];
}

interface BadgeNotificationProps {
  badgeName: keyof typeof BADGES;
  onClose: () => void;
  onLogCreated?: () => Promise<void>;
  isFirstLog?: boolean;
  chronodopplerInfo?: ChronodopplerInfo;
  earnedBadges?: string[];
}

export default function BadgeNotification({ 
  badgeName, 
  onClose, 
  onLogCreated, 
  isFirstLog = false, 
  chronodopplerInfo,
  earnedBadges = []
}: BadgeNotificationProps) {
  // Safety check to ensure badge exists in the BADGES object
  if (!BADGES[badgeName]) {
    console.error(`Badge "${badgeName}" not found in BADGES object`);
    setTimeout(onClose, 100); // Close the notification if badge doesn't exist
    return null;
  }
  
  const badge = BADGES[badgeName];
  const isChronoProdigy = badgeName === 'chronoprodigy';
  const isChronoDoppler = badgeName === 'chronodoppler';
  const [dimensions, setDimensions] = useState({ width: 500, height: 400 });
  
  // Set dimensions based on screen size
  useEffect(() => {
    const updateDimensions = () => {
      const isSmallScreen = window.innerWidth < 640;
      setDimensions({
        width: isSmallScreen ? Math.min(320, window.innerWidth - 40) : 500,
        height: isSmallScreen ? 380 : 400
      });
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  console.log(`Showing badge notification for: ${badgeName}`, badge);
  console.log(`Earned badges: ${earnedBadges.join(', ')}`);

  // Determine the congratulation message based on the badge type
  const getCongratulationMessage = () => {
    if (badgeName === 'chronosprout' || isFirstLog) {
      return "Congratulations on your first journey through time!";
    } 
    else if (badgeName === 'chronoexplorer') {
      return "You've discovered the secret of midnight time travel!";
    } 
    else if (badgeName === 'chronodoppler') {
      return chronodopplerInfo 
        ? `You visited the year ${chronodopplerInfo.year} along with other time travelers!` 
        : "Another traveler posted from your year — you've triggered a Chronodoppler!";
    }
    else if (badgeName === 'chronoblink') {
      return "A hundred words, a hundred moments — you blinked, and time stood still.";
    }
    else if (badgeName === 'chronoprodigy') {
      const badgeNames = earnedBadges
        .filter(b => b !== 'chronoprodigy')
        .map(b => BADGES[b as BadgeName]?.name || b)
        .join(', ');
      return `An extraordinary achievement! You've unlocked: ${badgeNames}`;
    }
    else {
      return "Congratulations! You've earned a new badge!";
    }
  };

  const handleClose = async () => {
    try {
      console.log('Badge notification closing, calling onLogCreated if available');
      // Update the state first
      if (onLogCreated) {
        await onLogCreated();
      }
      // Close the notification
      onClose();
    } catch (error) {
      console.error('Error handling badge notification:', error);
      // Still close the notification even if there's an error
      onClose();
    }
  };

  // Helper function to render badge icons
  const renderBadgeIcon = (badgeName: string, size: 'small' | 'large' = 'small') => {
    if (!BADGES[badgeName as BadgeName]) return null;
    
    const sizePx = size === 'small' ? 8 : 32;
    
    return (
      <div className="flex flex-col items-center">
        <div className={`relative w-${sizePx} h-${sizePx} mb-1`}>
          <Image
            src={BADGES[badgeName as BadgeName].imageUrl}
            alt={BADGES[badgeName as BadgeName].name}
            fill
            sizes={`${sizePx}px`}
            className="object-contain"
          />
        </div>
        {size === 'small' && (
          <span className="text-[10px] text-yellow-100">{BADGES[badgeName as BadgeName].name}</span>
        )}
      </div>
    );
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="badge-notification"
        initial={{ opacity: 0, y: 50, scale: 0.3 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose} />
        
        <ScratchToReveal
          width={dimensions.width}
          height={dimensions.height}
          minScratchPercentage={isChronoProdigy ? 40 : 70}
          className={`relative bg-gradient-to-br ${
            isChronoProdigy 
              ? 'from-purple-800/90 to-indigo-900/90 border-2 border-yellow-500/80' 
              : 'from-blue-900/90 to-purple-900/90 border border-blue-500/30'
          } rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-w-full`}
        >
          {/* Scratch instructions */}
          <div className="absolute top-2 left-0 right-0 z-10 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex flex-col items-center justify-center"
            >
              <div className="flex items-center justify-center mb-1">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 text-white/90" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 15L19 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span className="text-white/90 text-xs sm:text-sm font-medium tracking-wide">Scratch to reveal your badge!</span>
              </div>
              
              {/* Animated scratch demonstration */}
              <motion.div 
                className="relative w-16 sm:w-20 h-6 sm:h-8 mt-1 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div 
                  className="absolute top-0 left-0 w-4 sm:w-5 h-4 sm:h-5 bg-white/80 rounded-full blur-[1px]"
                  animate={{ 
                    x: ["0%", "100%", "0%"],
                    y: ["0%", "30%", "0%"]
                  }}
                  transition={{ 
                    duration: 2.5, 
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                />
                <motion.div
                  className="absolute top-0 right-0 h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ 
                    x: ["-100%", "100%"]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    repeatDelay: 1.5
                  }}
                />
              </motion.div>
            </motion.div>
          </div>
          
          {isChronoProdigy && (
            <motion.div 
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0.2, 0.7, 0.3, 0.8, 0.4, 1] }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-purple-500/10" />
              <div className="absolute inset-0 bg-[url('/sparkles.svg')] bg-repeat-space opacity-20" />
            </motion.div>
          )}

          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={handleClose}
              className="text-blue-300 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6">
            <motion.div 
              className="relative w-24 h-24 sm:w-32 sm:h-32"
              animate={isChronoProdigy ? {
                scale: [1, 1.05, 1],
                rotate: [0, -3, 0, 3, 0],
              } : {}}
              transition={isChronoProdigy ? { 
                duration: 2.5, 
                repeat: Infinity,
                repeatType: "reverse" 
              } : {}}
            >
              <Image
                src={badge.imageUrl}
                alt={badge.name}
                fill
                sizes="(max-width: 640px) 96px, 128px"
                className={`object-contain ${isChronoProdigy ? 'drop-shadow-[0_0_10px_rgba(255,215,0,0.6)]' : ''}`}
              />
            </motion.div>

            <div className="space-y-2">
              <h3 className={`text-xl sm:text-2xl font-bold ${isChronoProdigy ? 'text-yellow-300' : 'text-white'}`}>
                {isChronoProdigy && '✨ '}{badge.name}{isChronoProdigy && ' ✨'}
              </h3>
              <p className={`text-sm sm:text-base ${isChronoProdigy ? 'text-yellow-200' : 'text-blue-300'}`}>
                {badge.description}
              </p>
              
              {isChronoDoppler && chronodopplerInfo && (
                <div className="mt-3 bg-blue-900/30 p-2 rounded-lg border border-blue-500/20">
                  <p className="text-xs sm:text-sm text-blue-200 font-medium">
                    Time travelers who also visited year {chronodopplerInfo.year}:
                  </p>
                  <div className="mt-2 space-y-1">
                    {chronodopplerInfo.travelers.map((traveler, index) => (
                      <p key={index} className="text-xs text-blue-300 font-semibold">
                        {traveler.name}
                      </p>
                    ))}
                  </div>
                </div>
              )}
              
              {isChronoProdigy && (
                <>
                  <p className="text-xs text-yellow-300/80 mt-1">An extraordinarily rare achievement!</p>
               
                  {earnedBadges.length > 0 ? (
                    <>
                      <p className="text-xs text-yellow-100 mb-1">You've also unlocked these badges:</p>
                      <div className="flex justify-center gap-2 sm:gap-3 flex-wrap">
                        {earnedBadges
                          .filter(b => b !== 'chronoprodigy') // Filter out the prodigy badge since we're already showing it
                          .map((badgeName, index) => (
                            <div key={index} className="flex flex-col items-center">
                              <div className="relative w-6 sm:w-8 h-6 sm:h-8 mb-1">
                                <Image
                                  src={BADGES[badgeName as BadgeName]?.imageUrl || ''}
                                  alt={BADGES[badgeName as BadgeName]?.name || badgeName}
                                  fill
                                  sizes="(max-width: 640px) 24px, 32px"
                                  className="object-contain"
                                />
                              </div>
                              <span className="text-[8px] sm:text-[10px] text-yellow-100 font-medium">
                                {BADGES[badgeName as BadgeName]?.name || badgeName}
                              </span>
                              
                            </div>
                          ))}
                      </div>
                    </>
                  ) : (
                    // Fallback to the default badges (backward compatibility)
                    <>
                      <p className="text-xs text-yellow-100 mb-1">You've also unlocked these badges:</p>
                      <div className="flex justify-center space-x-3">
                        <div className="flex flex-col items-center">
                          <div className="relative w-6 sm:w-8 h-6 sm:h-8 mb-1">
                            <Image
                              src={BADGES['chronosprout'].imageUrl}
                              alt={BADGES['chronosprout'].name}
                              fill
                              sizes="(max-width: 640px) 24px, 32px"
                              className="object-contain"
                            />
                          </div>
                          <span className="text-[8px] sm:text-[10px] text-yellow-100 font-medium">Chronosprout</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="relative w-6 sm:w-8 h-6 sm:h-8 mb-1">
                            <Image
                              src={BADGES['chronoblink'].imageUrl}
                              alt={BADGES['chronoblink'].name}
                              fill
                              sizes="(max-width: 640px) 24px, 32px"
                              className="object-contain"
                            />
                          </div>
                          <span className="text-[8px] sm:text-[10px] text-yellow-100 font-medium">Chronoblink</span>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={`text-xs sm:text-sm ${isChronoProdigy ? 'text-yellow-300' : 'text-blue-400'}`}
            >
              {getCongratulationMessage()}
            </motion.div>
          </div>
        </ScratchToReveal>
      </motion.div>
    </AnimatePresence>
  );
}