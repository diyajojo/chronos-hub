'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { BADGES } from '../utils/badges';
import Image from 'next/image';
import { ScratchToReveal } from "@/components/magicui/scratch-to-reveal";

interface BadgeNotificationProps {
  badgeName: keyof typeof BADGES;
  onClose: () => void;
  onLogCreated?: () => Promise<void>;
  isFirstLog?: boolean;
}

export default function BadgeNotification({ badgeName, onClose, onLogCreated, isFirstLog = false }: BadgeNotificationProps) {
  // Safety check to ensure badge exists in the BADGES object
  if (!BADGES[badgeName]) {
    console.error(`Badge "${badgeName}" not found in BADGES object`);
    setTimeout(onClose, 100); // Close the notification if badge doesn't exist
    return null;
  }
  
  const badge = BADGES[badgeName];
  console.log(`Showing badge notification for: ${badgeName}`, badge);

  // Determine the congratulation message based on the badge type
  const getCongratulationMessage = () => {
    if (isFirstLog) 
      {
      return "Congratulations on your first journey through time!";
    } else if (badgeName === 'chronoexplorer') {
      return "You've discovered the secret of midnight  time travel!";
    } 
    else if (badgeName === 'chronodoppler') {
      return "Another traveler posted from your year — you’ve triggered a Chronodoppler!";
    }
    else if (badgeName === 'chronoblink') {
      return "A hundred words, a hundred moments — you blinked, and time stood still.";
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
          width={500}
          height={350}
          minScratchPercentage={70}
          className="relative bg-gradient-to-br from-blue-900/90 to-purple-900/90 border border-blue-500/30 rounded-3xl p-8 shadow-2xl overflow-hidden"
        >
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={handleClose}
              className="text-blue-300 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col items-center text-center space-y-6">
            <div className="relative w-32 h-32">
              <Image
                src={badge.imageUrl}
                alt={badge.name}
                fill
                sizes="(max-width: 768px) 100vw, 128px"
                className="object-contain"
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">{badge.name}</h3>
              <p className="text-blue-300">{badge.description}</p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-sm text-blue-400"
            >
              {getCongratulationMessage()}
            </motion.div>
          </div>
        </ScratchToReveal>
      </motion.div>
    </AnimatePresence>
  );
}