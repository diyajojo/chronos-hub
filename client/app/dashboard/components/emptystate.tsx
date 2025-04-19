'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CreateLogModal from './createmodal';
import StarBackground from '../../components/design/starbackground';
import PortalVisual from '../../components/design/portalvisual';
import MapModal from './map/map'; 

interface User {
  id: number;
  name: string;
  email: string;
}

interface TravelLogItem {
  id: number;
  yearVisited: number;
  story: string;
  image: string;
  survivalChances: number;
  createdAt: string;
  comments: any[];
  reactions: any[];
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export default function EmptyState({ user, otherLogs, currentUser }: { 
  user: User, 
  otherLogs: TravelLogItem[],
  currentUser: User,
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [activeSection, setActiveSection] = useState('welcome');

  const toggleMap = () => {
    setShowMap(!showMap);
  };

  return (
    <div className="relative min-h-screen">
      <StarBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Left side - Welcome message */}
          <motion.div 
            className="md:w-2/5"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <h1 className="text-4xl font-serif mb-3 text-white">
                <motion.span 
                  className="inline-block"
                  animate={{ rotate: [0, 5, 0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 5, repeatDelay: 5 }}
                >
                  ⏳
                </motion.span>{" "}
                Greetings, Temporal Explorer
              </h1>
              <h2 className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 font-bold">
                {user.name}
              </h2>
              <p className="mt-4 text-blue-200 italic">
                "The paths of time spread before you like cosmic tendrils..."
              </p>
            </motion.div>
            
            {/* Portal visual */}
            <PortalVisual />
          </motion.div>
          
          {/* Right side - dynamic rendering of buttons */}
          <motion.div 
            className="md:w-3/5 flex items-center justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="flex space-x-4">
              {[
                { id: 'create', label: 'Chronicle', icon: '✍️' },
                { id: 'explore', label: 'Discover', icon: '🔍' }
              ].map(section => (
                <motion.button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id);
                    if (section.id === 'create') setShowCreateModal(true);
                    if (section.id === 'explore') toggleMap();
                  }}
                  className={`relative px-8 py-4 rounded-lg text-white text-lg transition-all ${
                    activeSection === section.id 
                      ? 'bg-gradient-to-r from-blue-700 to-blue-500 shadow-lg'
                      : 'bg-blue-900/30 hover:bg-blue-800/50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="mr-2">{section.icon}</span>
                  {section.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Fantasy Map Modal */}
      <AnimatePresence>
        {showMap && (
          <MapModal
            logs={otherLogs} 
            user={user}
            onClose={() => {
              setShowMap(false);
              setActiveSection('welcome');
            }}
          />
        )}
      </AnimatePresence>
      
      {/* Create Log Modal */}
      {showCreateModal && (
        <CreateLogModal onClose={() => {
          setShowCreateModal(false);
          setActiveSection('welcome');
        }} user={user} />
      )}
    </div>
  );
}