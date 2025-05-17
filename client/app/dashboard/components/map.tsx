'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { ViewModal } from './logs/viewmodal';


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

// New interface for grouped logs
interface GroupedLogs {
  year: number;
  logs: TravelLogItem[];
  position: { x: number; y: number };
}

const MapModal = ({ logs, user, userLogs = [], onClose }: { 
  logs: TravelLogItem[], 
  user: User,
  userLogs?: TravelLogItem[],
  onClose: () => void 
}) => {
  const [selectedLog, setSelectedLog] = useState<TravelLogItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [expandedYear, setExpandedYear] = useState<number | null>(null);
  const [activeView, setActiveView] = useState<'world' | 'user'>('world');
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [pinScale, setPinScale] = useState(1);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  // Determine which logs to display based on active view
  const displayLogs = activeView === 'world' ? logs : userLogs;
  const isMobile = windowWidth <= 768;
  
  // Update window width on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Adjust pin scale based on screen width
      if (window.innerWidth <= 480) {
        setPinScale(0.85);
      } else if (window.innerWidth <= 768) {
        setPinScale(0.95);
      } else {
        setPinScale(1);
      }
    };
    
    // Set initial pin scale
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Reset expanded year when switching tabs
  useEffect(() => {
    setExpandedYear(null);
  }, [activeView]);
  
  // Log data for debugging
  useEffect(() => {
    console.log('Active View:', activeView);
    console.log('Display Logs Count:', displayLogs.length);
    console.log('User Logs Count:', userLogs.length);
  }, [activeView, displayLogs, userLogs]);

  // Close with ESC key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isDetailsOpen) {
          setIsDetailsOpen(false);
        } else if (expandedYear !== null) {
          setExpandedYear(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isDetailsOpen, onClose, expandedYear]);


  // Generate positions for year markers that stay within the map boundaries and distribute them better
  const getPositionForYear = (year: number) => {
    // Use year value to create a deterministic but seemingly random position
    const absYear = Math.abs(year);
    const seed = (absYear * 13) % 10000;
    
    // Find how many logs exist for this year
    const logsForYear = displayLogs.filter(log => log.yearVisited === year).length;
    
    // For prehistoric eras (negative years), place in left side of map
    if (year < 0) {
      const x = 5 + (seed % 30); // 5-35% from left
      // If multiple logs, place in top portion
      const y = logsForYear > 1 ? 15 + ((seed * 17) % 35) : 15 + ((seed * 17) % 70);
      return { x, y };
    }
    // For future eras (2100+), place in right side of map
    else if (year > 2100) {
      const x = 65 + (seed % 30); // 65-95% from left
      // If multiple logs, place in top portion
      const y = logsForYear > 1 ? 15 + ((seed * 23) % 35) : 15 + ((seed * 23) % 70);
      return { x, y };
    }
    // For historical and contemporary eras, distribute in middle area
    else {
      let baseX;
      
      if (year < 500) {
        baseX = 35 + (year * 0.01) % 10;
      } else if (year < 1500) {
        baseX = 40 + (year * 0.008) % 10;
      } else if (year < 1900) {
        baseX = 45 + (year * 0.006) % 10;
      } else {
        baseX = 50 + (year * 0.004) % 10;
      }
      
      // If multiple logs, constrain to top 40% of map
      const baseY = logsForYear > 1 
        ? 15 + ((seed * 19) % 25)  // 15-40% from top
        : 15 + ((seed * 19) % 70); // 15-85% from top
      
      return { x: baseX, y: baseY };
    }
  };
  
  // Adjust positions to prevent pins from being too close to each other (especially for mobile)
  const adjustPinPositions = (initialPositions: GroupedLogs[]) => {
    // Minimum distance between pins (in percentage points)
    // Using a higher value for mobile to make pins easier to tap
    const minDistance = isMobile ? 10 : 5;
    
    const adjustedPositions = [...initialPositions];
    
    // Simple collision resolution algorithm
    for (let i = 0; i < adjustedPositions.length; i++) {
      for (let j = i + 1; j < adjustedPositions.length; j++) {
        const pin1 = adjustedPositions[i];
        const pin2 = adjustedPositions[j];
        
        // Calculate Euclidean distance between pins
        const distance = Math.sqrt(
          Math.pow(pin1.position.x - pin2.position.x, 2) + 
          Math.pow(pin1.position.y - pin2.position.y, 2)
        );
        
        // If pins are too close
        if (distance < minDistance) {
          // Move pins away from each other
          const angle = Math.atan2(
            pin2.position.y - pin1.position.y,
            pin2.position.x - pin1.position.x
          );
          
          // Calculate how much we need to move pins
          const moveDistance = (minDistance - distance) / 2;
          
          // Apply movement (keeping pins in bounds: 5-95%)
          pin1.position.x = Math.max(5, Math.min(95, pin1.position.x - moveDistance * Math.cos(angle)));
          pin1.position.y = Math.max(5, Math.min(95, pin1.position.y - moveDistance * Math.sin(angle)));
          
          pin2.position.x = Math.max(5, Math.min(95, pin2.position.x + moveDistance * Math.cos(angle)));
          pin2.position.y = Math.max(5, Math.min(95, pin2.position.y + moveDistance * Math.sin(angle)));
        }
      }
    }
    
    return adjustedPositions;
  };

  const handleLogClick = (log: TravelLogItem) => {
    console.log('Log clicked:', log);
    setSelectedLog(log);
    setIsDetailsOpen(true);
  };

  // Group logs by year
  const groupedLogs = useMemo(() => {
    const yearMap = new Map<number, TravelLogItem[]>();
    
    // Group logs by year
    displayLogs.forEach(log => {
      if (!yearMap.has(log.yearVisited)) {
        yearMap.set(log.yearVisited, []);
      }
      yearMap.get(log.yearVisited)?.push(log);
    });
    
    // Convert map to array of grouped logs with positions
    const groupedArray = Array.from(yearMap.entries()).map(([year, yearLogs]) => ({
      year,
      logs: yearLogs,
      position: getPositionForYear(year)
    }));
    
    // Sort by year and apply collision detection/resolution
    const sortedArray = groupedArray.sort((a, b) => a.year - b.year);
    return adjustPinPositions(sortedArray);
  }, [displayLogs, isMobile]);

  // Check if a pin is in a dense cluster
  const isPinInDenseArea = (pinYear: number) => {
    if (!isMobile) return false; // Only care about this on mobile
    
    // Find this pin's position
    const thisPin = groupedLogs.find(log => log.year === pinYear);
    if (!thisPin) return false;
    
    // Count pins that are relatively close
    const nearbyPins = groupedLogs.filter(log => {
      if (log.year === pinYear) return false;
      
      const distance = Math.sqrt(
        Math.pow(log.position.x - thisPin.position.x, 2) + 
        Math.pow(log.position.y - thisPin.position.y, 2)
      );
      
      // We use a slightly higher threshold than the collision detection
      // to identify areas that are dense but not necessarily colliding
      return distance < 15; // 15% proximity
    });
    
    return nearbyPins.length >= 2; // Consider dense if 2 or more nearby pins
  };

  const handleYearClick = (year: number) => {
    if (expandedYear === year) {
      setExpandedYear(null);
    } else {
      setExpandedYear(year);
    }
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
        
        {/* Tab controls */}
        <div className={`absolute top-2 left-2 z-30 flex flex-col ${isMobile ? 'w-[calc(100%-4rem)]' : ''}`}>
          <div className="flex gap-2">
            <button 
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeView === 'world' 
                  ? 'bg-amber-500/80 text-white' 
                  : 'bg-black/50 text-amber-300 hover:bg-black/70'
              } ${isMobile ? 'flex-1 text-xs' : ''}`}
              onClick={() => {
                setActiveView('world');
                console.log('Switching to World view');
              }}
            >
              {isMobile ? 'World' : 'Worldwide Journeys'}
            </button>
            <button 
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeView === 'user' 
                  ? 'bg-blue-500/80 text-white' 
                  : 'bg-black/50 text-blue-300 hover:bg-black/70'
              } ${isMobile ? 'flex-1 text-xs' : ''}`}
              onClick={() => {
                setActiveView('user');
                console.log('Switching to User view');
              }}
            >
              {isMobile ? 'My Journeys' : 'My Journeys'}
            </button>
          </div>
          <div className="text-xs text-gray-300/80 mt-1 px-2">
            {activeView === 'world' 
              ? (isMobile ? 'All travelers' : 'Exploring time journeys from all travelers')
              : (isMobile ? 'Your time travels' : 'Viewing only your personal time travels')}
          </div>
        </div>
        
        {/* Map container */}
        <div className="relative w-full h-[95vh] overflow-hidden">
          <div ref={mapContainerRef} className="relative h-full w-full flex items-center justify-center overflow-hidden">
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
              
              {/* Display message if no logs to show */}
              {displayLogs.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/70 text-white p-6 rounded-lg max-w-sm text-center">
                    <h3 className="font-urbanist text-lg font-bold mb-2">
                      {activeView === 'user' ? 'No Personal Journeys Yet' : 'No Journeys Discovered'}
                    </h3>
                    <p className="font-urbanist text-amber-300">
                      {activeView === 'user' 
                        ? 'Your time travel adventures will appear here once you start logging journeys.' 
                        : 'Time travelers have not recorded any journeys yet.'}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Render grouped logs by year */}
              {groupedLogs.map((groupedLog) => {
                const { year, logs, position } = groupedLog;
                const isExpanded = expandedYear === year;
                const multipleLogsExist = logs.length > 1;
                const isInDenseArea = isPinInDenseArea(year);
                
                // Determine pin color based on number of logs
                const getPinColorClass = () => {
                  if (logs.length >= 5) return "text-purple-500";
                  if (logs.length >= 3) return "text-orange-500";
                  if (logs.length >= 2) return "text-yellow-500";
                  return "text-red-600";
                };
                
                // Determine glow color based on number of logs
                const getGlowColorClass = () => {
                  if (logs.length >= 5) return "bg-purple-500";
                  if (logs.length >= 3) return "bg-orange-500";
                  if (logs.length >= 2) return "bg-yellow-500";
                  return "bg-red-500";
                };
                
                return (
                  <motion.div
                    key={year}
                    className="absolute"
                    style={{ 
                      left: `${position.x}%`, 
                      top: `${position.y}%`,
                      zIndex: isExpanded ? 20 : 10,
                      transform: `scale(${pinScale})`
                    }}
                    animate={{ 
                      scale: isExpanded ? pinScale * 1.1 : pinScale,
                      opacity: 1 
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                  >
                    {/* Main year marker */}
                    <button
                      onClick={() => multipleLogsExist ? handleYearClick(year) : handleLogClick(logs[0])}
                      className="relative group"
                    >
                      {/* Year label - always visible */}
                      <div 
                        className={`absolute -top-6 left-1/2 transform -translate-x-1/2 text-amber-200 font-bold text-xs 
                          ${isInDenseArea ? 'bg-blue-800/90 border border-blue-400' : 'bg-black/70'} 
                          px-2 py-0.5 rounded-full z-10`}
                      >
                        {year}
                      </div>
                      
                      {/* Pin indicator */}
                      <div className="relative filter drop-shadow-lg">
                        <div className="relative">
                          {/* Pin with consistent size */}
                          <span role="img" aria-label="map-pin" className={`text-3xl ${getPinColorClass()}`}>📍</span>
                          
                          {/* Glow effect */}
                          <div className={`absolute inset-0 animate-pulse ${getGlowColorClass()} opacity-50 rounded-full blur-md -z-10`} 
                               style={{ animationDuration: `${1.5 - Math.min(logs.length * 0.1, 0.8)}s` }}></div>

                          {/* Badge showing number of logs when there are multiple */}
                          {multipleLogsExist && (
                            <div className="absolute -right-2 -top-2 w-5 h-5 rounded-full bg-blue-700 border border-white text-white flex items-center justify-center text-xs font-bold">
                              {logs.length}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Enlarged click/tap area for mobile (invisible) */}
                      {isMobile && (
                        <div className="absolute -inset-4 bg-transparent z-0"></div>
                      )}
                    </button>

                    {/* Expanded view for multiple logs in same year */}
                    {isExpanded && (
                      <motion.div 
                        className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 bg-gray-900/95 rounded-lg border border-amber-500/50 shadow-xl p-3 w-64 z-30"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-amber-300 font-bold">Journeys to {year}</h3>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedYear(null);
                            }}
                            className="font-urbanist text-gray-400 hover:text-white"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1 thin-scrollbar">
                          {logs.map((log, index) => (
                            <motion.div 
                              key={log.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="bg-black/50 border border-blue-500/30 rounded-lg p-2 cursor-pointer hover:bg-blue-900/30"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLogClick(log);
                              }}
                            >
                              <div className="flex gap-2 items-center">
                                <div className="font-urbanist rounded-full bg-blue-500/50 w-7 h-7 flex items-center justify-center text-xs text-white overflow-hidden">
                                  {log.user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-white font-medium text-xs truncate">{log.title}</p>
                                  <p className="text-gray-400 text-xs truncate">
                                    {log.user.id === user.id ? 
                                      "You" : 
                                      `By ${log.user.name}`}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Helper label for mobile */}
        {isMobile && groupedLogs.length > 0 && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs text-center text-white max-w-[80%]">
            <p>{groupedLogs.length} time locations available</p>
            <p className="text-amber-300/90 text-2xs mt-0.5">Tap pins to view journeys</p>
            {groupedLogs.some(log => isPinInDenseArea(log.year)) && (
              <p className="text-blue-300/90 text-2xs mt-0.5 italic">Pins with blue labels are in dense areas</p>
            )}
          </div>
        )}
        
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