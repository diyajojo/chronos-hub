import { useState } from 'react';


interface Comment {
  id: string;
  text: string;
  time: string;
  commenter: string;
  parentId: string | null;
  replies: Comment[];
}

interface ReplyTarget {
  id: string;
  commenter: string;
};


export const useComments = (logId: number, userName: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<ReplyTarget | null>(null);
  const [replyText, setReplyText] = useState('');

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:8000/fetchcomments`, {
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
      const response = await fetch('http://localhost:8000/addcomment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          travelLogId: logId,
          text: newComment,
          commenter: userName,
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
      const response = await fetch('http://localhost:8000/addcomment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          travelLogId: logId,
          text: replyText,
          commenter: userName,
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
