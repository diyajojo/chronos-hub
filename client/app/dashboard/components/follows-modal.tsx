'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface FollowsModalProps {
  type: 'followers' | 'following';
  users: Array<{ id: number; name: string }>;
  onClose: () => void;
}

export default function FollowsModal({ type, users, onClose }: FollowsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-black/80 border border-blue-500/30 rounded-lg w-full max-w-md p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white capitalize">
            {type}
          </h3>
          <button 
            onClick={onClose}
            className="text-blue-300 hover:text-blue-100"
          >
            ✕
          </button>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {users.length > 0 ? (
            <div className="space-y-2">
              {users.map(user => (
                <Link 
                  href={`/dashboard/${user.id}`} 
                  key={user.id}
                  className="flex items-center p-3 rounded-lg bg-blue-950/40 hover:bg-blue-900/40 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-800/50 flex items-center justify-center mr-3">
                    {user.name[0].toUpperCase()}
                  </div>
                  <span className="text-blue-100">{user.name}</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-blue-300">
              No {type} yet
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
