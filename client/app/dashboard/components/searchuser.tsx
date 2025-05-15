'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { UserProfileModal } from '@/app/dashboard/components/userprofile';
import { SearchIcon, UserIcon } from 'lucide-react';
import { debounce } from 'lodash';
import Image from 'next/image';
import { API_BASE_URL } from '@/lib/config';

// Define the User interface directly in the component
interface User {
  id: number;
  name: string;
  email: string;
  isOnline?: boolean;
}

export interface SearchUsersProps {
  currentUserId?: number;
  onUserSelect?: (user: User) => void;
  className?: string;
  autoFocus?: boolean;
}

export function SearchUsers({ 
  currentUserId, 
  onUserSelect, 
  className = '',
  autoFocus = true 
}: SearchUsersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fetch all users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/users`, {
          credentials: 'include',
        });
        const data = await response.json();
        if (data.success) {
          setUsers(data.users);
          setFilteredUsers(data.users);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users locally based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const handleUserClick = (user: User) => {
    if (user.id === currentUserId) return;
    
    if (onUserSelect) {
      onUserSelect(user);
    } else {
      setSelectedUser(user);
      setIsProfileOpen(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className={`w-[90%] max-w-full sm:max-w-md md:max-w-lg mx-auto ${className}`}>
      <div className="relative">
        <Input
          ref={searchInputRef}
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleInputChange}
          className="pl-10 w-full bg-black/50 border border-blue-500/30 text-white placeholder:text-blue-400/70 text-sm sm:text-base"
        />
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
      </div>

      <div className="mt-2 rounded-md border border-blue-500/30 overflow-hidden bg-black/30">
        {/* Loading state */}
        {isLoading && (
          <div className="p-2 sm:p-4 flex justify-center">
            <p className="text-blue-300 text-sm sm:text-base">Loading users...</p>
          </div>
        )}

        {/* User list */}
        {!isLoading && filteredUsers.length > 0 && (
          <div className="max-h-64 overflow-y-auto">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => handleUserClick(user)}
                className={`
                  flex items-center gap-2 sm:gap-3 p-2 sm:p-3 hover:bg-blue-950/40 cursor-pointer
                  ${user.id === currentUserId ? 'opacity-50 cursor-not-allowed' : ''}
                  border-b border-blue-500/30 last:border-0
                `}
              >
                <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-blue-500/30">
                  <Image
                    src="/assets/pfp.png"
                    alt={user.name}
                    fill
                    sizes="(max-width: 640px) 32px, 40px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-blue-100 text-sm sm:text-base">
                    {user.name}
                    {user.id === currentUserId && " (You)"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filteredUsers.length === 0 && (
          <div className="flex flex-col items-center justify-center p-3 sm:p-6 text-center">
            <UserIcon className="h-8 w-8 sm:h-12 sm:w-12 text-blue-500 mb-1 sm:mb-2" />
            <p className="text-blue-300 text-sm sm:text-base">No users found</p>
          </div>
        )}
      </div>

      {/* Profile modal */}
      {!onUserSelect && selectedUser && (
        <UserProfileModal
          isOpen={isProfileOpen}
          onClose={() => {
            setIsProfileOpen(false);
            setSelectedUser(null);
          }}
          user={{ id: selectedUser.id, name: selectedUser.name }}
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
} 