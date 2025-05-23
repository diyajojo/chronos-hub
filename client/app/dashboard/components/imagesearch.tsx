'use client';
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ImageSearchProps {
  onImageSelect: (imageUrl: string) => void;
}

export default function ImageSearch({ onImageSelect }: ImageSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ url: string; thumbnail: string }>>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a search term");
      return;
    }

    setLoading(true);
    setSearchResults([]);

    try {
      console.log('Searching for:', searchQuery);
      const response = await fetch(`/api/image-search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      if (response.status === 429) {
        toast.error(data.details || "Daily search limit reached. Please try again tomorrow.", {
          duration: 5000,
        });
        return;
      }

      if (!response.ok) {
        console.error('Search error:', data);
        throw new Error(data.error || data.details || 'Search failed');
      }

      if (!data.items?.length) {
        toast.error("No images found for your search");
        return;
      }

      setSearchResults(data.items);
    } catch (error: any) {
      console.error('Search failed:', error);
      toast.error(error.message || "Failed to search for images");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Search for images..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-black/50 border border-blue-500/30 text-white flex-grow"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button
          type="button"
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {loading && (
        <div className="text-center text-blue-300">
          Searching for images...
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="max-h-[280px] overflow-y-auto p-2 bg-black/20 rounded-lg">
          <div className="grid grid-cols-4 gap-2">
            {searchResults.map((image, index) => (
              <div
                key={index}
                className="relative cursor-pointer hover:opacity-80 transition-opacity border border-blue-500/30 rounded-md overflow-hidden aspect-square"
                onClick={() => onImageSelect(image.url)}
              >
                <img
                  src={image.thumbnail}
                  alt={`Search result ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
