'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { UserProfileModal } from '@/app/dashboard/components/userprofile';
import { SearchIcon, UserIcon } from 'lucide-react';
import { debounce } from 'lodash';
import Image from 'next/image';
import { SpinningTextLoader } from '../../components/design/loader';

// Define the User interface directly in the component
interface User {
  id: number;
  name: string;
  email: string;
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
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  

  // Direct API call function
  const searchUsers = async (term: string): Promise<{ success: boolean; users: User[] }> => {
    const response = await fetch('http://localhost:8000/searchUsers', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ searchTerm: term }),
    });
    return response.json();
  };

  // Debounce search to avoid excessive API calls
  // This creates a function that waits 300ms after the user stops typing
  // before executing the search - this prevents sending a request for every keystroke
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce(async (term: string) => {
      if (!term.trim()) {
        // If search is cleared, clear results
        setUsers([]);
        setHasSearched(false);
        return;
      }

      setIsLoading(true);
      try {
        const result = await searchUsers(term);
        if (result.success) {
          setUsers(result.users);
          setHasSearched(true);
        }
      } catch (error) {
        console.error('Error searching users:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300), // Wait 300ms after user stops typing before executing search
    []
  );

  useEffect(() => {
    // Focus the search input if autoFocus is enabled
    if (autoFocus && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm);
    } else {
      setUsers([]);
      setHasSearched(false);
    }
  }, [searchTerm, debouncedSearch]);

  const handleUserClick = (user: User) => {
    // Don't do anything if the user clicked is the current user
    if (user.id === currentUserId) return;
    
    // If parent provided a callback, use that
    if (onUserSelect) {
      onUserSelect(user);
    } else {
      // Otherwise handle locally
      setSelectedUser(user);
      setIsProfileOpen(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        <Input
          ref={searchInputRef}
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleInputChange}
          className="pl-10 w-full bg-black/50 border border-blue-500/30 text-white placeholder:text-blue-400/70"
        />
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
      </div>

      <div className="mt-2 rounded-md border border-blue-500/30 overflow-hidden bg-black/30">
        {/* Prompt state - when user hasn't searched yet */}
        {!searchTerm && !hasSearched && (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <UserIcon className="h-12 w-12 text-blue-500 mb-2" />
            <p className="text-blue-300">Type to search for time travelers</p>
          </div>
        )}

        {/* Empty state - when search returned no results */}
        {searchTerm && hasSearched && !isLoading && users.length === 0 && (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <UserIcon className="h-12 w-12 text-blue-500 mb-2" />
            <p className="text-blue-300">OOPS no time travellers found</p>
          </div>
        )}

        {/* Loading state with SpinningTextLoader */}
        {isLoading && (
          <div className="p-4">
            <SpinningTextLoader />
          </div>
        )}

        {/* Results */}
        {hasSearched && !isLoading && users.length > 0 && (
          <div className="max-h-64 overflow-y-auto">
            {users.map((user) => (
              <div
                key={user.id}
                onClick={() => handleUserClick(user)}
                className={`
                  flex items-center gap-3 p-3 hover:bg-blue-950/40 cursor-pointer
                  ${user.id === currentUserId ? 'opacity-50 cursor-not-allowed' : ''}
                  border-b border-blue-500/30 last:border-0
                `}
              >
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-blue-500/30">
                  <Image
                    src="/assets/pfp.png"
                    alt={user.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-blue-100">
                    {user.name}
                    {user.id === currentUserId && " (You)"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile modal - only shown if parent doesn't handle user selection */}
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