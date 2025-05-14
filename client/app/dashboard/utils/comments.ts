import { useState } from 'react';
import { API_BASE_URL } from '@/lib/config';


interface Comment {
  id: string;
  text: string;
  time: string;
  commenter: string;
  parentId: string | null;
  replies: Comment[];
  user?: {
    id: string | number;
  };
}

interface ReplyTarget {
  id: string;
  commenter: string;
};


export const useComments = (logId: number, userId: number) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<ReplyTarget | null>(null);
  const [replyText, setReplyText] = useState('');

  const fetchComments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/fetchcomments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ travelLogId: logId })
      });

      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/addcomment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          travelLogId: logId,
          text: newComment,
          commenter: userId,  // Send the user ID directly
          parentId: null
        }),
      });

      if (response.ok) {
        const newCommentData = await response.json();
        setComments(prev => [...prev, newCommentData]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !replyingTo) return;

    try {
      const response = await fetch(`${API_BASE_URL}/addcomment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          travelLogId: logId,
          text: replyText,
          commenter: userId,  // Send the user ID directly
          parentId: replyingTo.id
        }),
      });

      if (response.ok) {
        const newReplyData = await response.json();
        setComments(prev => updateCommentsWithReply(prev, replyingTo.id, newReplyData));
        setReplyText('');
        setReplyingTo(null);
      }
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  const updateCommentsWithReply = (comments: Comment[], parentId: string, newReply: Comment): Comment[] => {
    return comments.map(comment => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), newReply]
        };
      }
      if (comment.replies?.length) {
        return {
          ...comment,
          replies: updateCommentsWithReply(comment.replies, parentId, newReply)
        };
      }
      return comment;
    });
  };

  return {
    comments,
    newComment,
    replyingTo,
    replyText,
    setNewComment,
    setReplyText,
    handleCommentSubmit,
    handleReplySubmit,
    handleReplyClick: (comment: Comment) => {
      setReplyingTo({
        id: comment.id,
        commenter: comment.commenter
      });
      setReplyText('');
    },
    cancelReply: () => {
      setReplyingTo(null);
      setReplyText('');
    },
    fetchComments
  };
};

export async function fetchComments(logId: number): Promise<Comment[]> {
  try {
    // Make API call to fetch comments
    const response = await fetch(`${API_BASE_URL}/fetchcomments`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ logId }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }

    const data = await response.json();
    return data.comments || [];
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

export async function addComment(
  logId: number,
  text: string,
  parentId: string | null = null
): Promise<Comment | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/addcomment`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        logId,
        text,
        parentId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to add comment');
    }

    const data = await response.json();
    return data.comment;
  } catch (error) {
    console.error('Error adding comment:', error);
    return null;
  }
}

export async function addReply(
  logId: number,
  text: string,
  parentId: string
): Promise<Comment | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/addcomment`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        logId,
        text,
        parentId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to add reply');
    }

    const data = await response.json();
    return data.comment;
  } catch (error) {
    console.error('Error adding reply:', error);
    return null;
  }
}
