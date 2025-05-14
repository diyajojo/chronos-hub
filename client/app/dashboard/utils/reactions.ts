import { useState } from 'react';
interface ReactionData {
  reactions: {
    id: string;
    type: string;
    reactor: string;
    user?: {
      id: string | number;
    };
  }[];
  counts: {
    [key: string]: number;
  };
}
import { API_BASE_URL } from '@/lib/config';

export const useReactions = (logId: number, userId: number) => {
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [reactionData, setReactionData] = useState<ReactionData | null>(null);
  const [totalReactions, setTotalReactions] = useState(0);
  const [showReactionsList, setShowReactionsList] = useState(false);

  const fetchReactions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/fetchreactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ travelLogId: logId })
      });

      if (response.ok) {
        const data = await response.json();
        setReactionData(data);
        setTotalReactions(Object.values(data.counts).reduce((sum: number, count: any) => sum + Number(count), 0));
        // Look for the user's reaction based on userId
        const userReaction = data.reactions.find((r: any) => r.userId === userId);
        setSelectedReaction(userReaction ? userReaction.type : null);
      }
    } catch (error) {
      console.error('Error fetching reactions:', error);
    }
  };

  const handleReactionClick = async (type: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/addreaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          travelLogId: logId,
          type,
          reactor: userId,  // Send the user ID directly
        }),
      });

      if (response.ok) {
        if (selectedReaction === type) {
          setSelectedReaction(null);
          setTotalReactions(prev => prev - 1);
        } else if (selectedReaction) {
          setSelectedReaction(type);
        } else {
          setSelectedReaction(type);
          setTotalReactions(prev => prev + 1);
        }
        await fetchReactions();
      }
    } catch (error) {
      console.error('Error toggling reaction:', error);
    }
  };

  return {
    selectedReaction,
    reactionData,
    totalReactions,
    showReactionsList,
    setShowReactionsList,
    handleReactionClick,
    fetchReactions
  };
};
