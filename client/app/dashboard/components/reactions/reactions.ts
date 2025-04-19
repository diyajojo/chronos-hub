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

export const useReactions = (logId: number, userName: string) => {
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [reactionData, setReactionData] = useState<ReactionData | null>(null);
  const [totalReactions, setTotalReactions] = useState(0);
  const [showReactionsList, setShowReactionsList] = useState(false);

  const fetchReactions = async () => {
    try {
      const response = await fetch(`http://localhost:8000/fetchreactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ travelLogId: logId })
      });

      if (response.ok) {
        const data = await response.json();
        setReactionData(data);
        setTotalReactions(Object.values(data.counts).reduce((sum: number, count: any) => sum + Number(count), 0));
        const userReaction = data.reactions.find((r: { reactor: string }) => r.reactor === userName);
        setSelectedReaction(userReaction ? userReaction.type : null);
      }
    } catch (error) {
      console.error('Error fetching reactions:', error);
    }
  };

  const handleReactionClick = async (type: string) => {
    try {
      const response = await fetch('http://localhost:8000/addreaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          travelLogId: logId,
          type,
          reactor: userName,
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
