'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ViewModal } from './viewmodal';


 interface TravelLogItem {
  id: number;
  yearVisited: number;
  title: string;
  story: string;
  image: string;
  createdAt: string;
  comments: Comment[];
  user: {
    id: number;
    name: string;
    email: string;
  };
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface Comment {
  id: string;
  text: string;
  time: string;
  commenter: string;
  parentId: string | null;
  replies: Comment[];
  user: {
    id: number;
  };
}

const MapModal = ({ logs, user, onClose }: { 
  logs: TravelLogItem[] , 
  user: User,
  onClose: () => void 
}) => {
  const [selectedLog, setSelectedLog] = useState<TravelLogItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  // Close with ESC key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isDetailsOpen) {
          setIsDetailsOpen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isDetailsOpen, onClose]);


  // Generate positions for year markers that stay within the map boundaries
  const getPositionForYear = (year: number) => {
    const seed = year % 100000;
    const x = 15 + (seed % 70);
    const y = 15 + ((seed * 13) % 70);
    return { x, y };
  };

  const handleLogClick = (log: TravelLogItem) => {
    setSelectedLog(log);
    setIsDetailsOpen(true);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative bg-gradient-to-br from-amber-50/5 to-blue-900/5 backdrop-blur rounded-lg overflow-hidden border border-amber-200/30 shadow-2xl max-w-5xl w-full max-h-[95vh] m-4"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {/* Close button */}
        <button 
          className="absolute top-2 right-2 z-30 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/70"
          onClick={onClose}
        >
          ✕
        </button>
        
        {/* Map container */}
        <div className="relative w-full h-[95vh] overflow-hidden">
          <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
            <div className="relative h-full w-full flex items-center justify-center">
              <img 
                src="/assets/map.jpg" 
                alt="Fantasy temporal map" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/api/placeholder/1200/800";
                }}
              />
              
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/15 to-purple-900/15"></div>
              
              {logs.map(log => {
                const position = getPositionForYear(log.yearVisited);
                return (
                  <motion.div
                    key={log.id}
                    className="absolute"
                    style={{ 
                      left: `${position.x}%`, 
                      top: `${position.y}%` 
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                  >
                    <button
                      onClick={() => handleLogClick(log)}
                      className="relative group"
                    >
                      {/* Year label with improved visibility */}
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-amber-200 font-bold text-xs bg-black/70 px-2</div> py-0.5 rounded-full z-10">
                        {log.yearVisited}
                      </div>
                      
                      {/* Pin emoji with enhanced glow */}
                      <div className="relative text-2xl filter drop-shadow-lg">
                        <span role="img" aria-label="map-pin" className="text-red-600">📍</span>
                        <div className="absolute inset-0 animate-pulse bg-red-500 opacity-50 rounded-full blur-md -z-10"></div>
                      </div>

                      {/* Tooltip */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-gray-900/90 text-white text-xs w-40 p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <div className="font-bold text-xs">Journey to {log.yearVisited}</div>
                        <div className="truncate text-xs">{log.story.substring(0, 5)}...</div>
                        <div className="text-blue-300 mt-0.5 text-center text-xs">Click to view</div>
                      </div>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* View Modal */}
        <ViewModal
          log={selectedLog}
          user={user}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
        />
      </motion.div>
    </motion.div>
  );
};

export default MapModal;