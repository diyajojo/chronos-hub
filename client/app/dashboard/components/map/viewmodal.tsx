import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useState, useEffect } from 'react';

interface TravelLogItem {
  id: number;
  yearVisited: number;
  story: string;
  image: string;
  survivalChances: number;
  createdAt: string;
  comments: Comment[];
}

interface Comment {
  id: string;
  text: string;
  time: string;
  commenter: string;
  parentId: string | null;
  replies: Comment[];
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface ViewModalProps {
  log: TravelLogItem | null;
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

// Keep track of the direct parent for proper nesting
type ReplyTarget = {
  id: string;
  commenter: string;
};

export const ViewModal = ({ 
  log, 
  user,
  isOpen, 
  onClose, 
}: ViewModalProps) => {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyingTo, setReplyingTo] = useState<ReplyTarget | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (log && isOpen) {
        try {
          // Fetch comments
          const commentsResponse = await fetch(`http://localhost:8000/fetchcomments`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              travelLogId: log.id
            })
          });

          if (commentsResponse.ok) {
            const commentsData = await commentsResponse.json();
            setComments(commentsData);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();
  }, [log?.id, isOpen]);

  if (!log) return null;
  
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      try {
        const response = await fetch('http://localhost:8000/addcomment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            travelLogId: Number(log.id), // Ensure it's a number
            text: newComment,
            commenter: user?.name,
            parentId: null
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || 'Failed to add comment');
        }

        const newCommentData = await response.json();
        
        // Add the new comment to the comments state
        setComments(prevComments => [...prevComments, newCommentData]);
        
        setNewComment('');
      } 
      catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  const handleReplyClick = (comment: Comment) => {
    // When clicking reply, store the direct parent's ID
    setReplyingTo({
      id: comment.id,
      commenter: comment.commenter
    });
    setReplyText('');
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (replyText.trim() && replyingTo !== null) {
      try {
        // Use the direct parent's ID for proper nesting
        const response = await fetch('http://localhost:8000/addcomment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            travelLogId: Number(log.id),
            text: replyText,
            commenter: user?.name,
            parentId: replyingTo.id // This is the direct parent ID
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to add reply');
        }

        const newReplyData = await response.json();
        
        // Function to update comments with nested structure preserved
        const updateCommentsWithReply = (comments: Comment[]): Comment[] => {
          return comments.map(comment => {
            // If this is the comment being replied to
            if (comment.id === replyingTo.id) {
              return {
                ...comment,
                replies: [...(comment.replies || []), newReplyData]
              };
            }
            
            // Check for the parent in nested replies
            if (comment.replies && comment.replies.length > 0) {
              return {
                ...comment,
                replies: updateCommentsWithReply(comment.replies)
              };
            }
            
            return comment;
          });
        };

        setComments(prevComments => updateCommentsWithReply(prevComments));
        setReplyText('');
        setReplyingTo(null);
      } 
      catch (error) {
        console.error('Error adding reply:', error);
      }
    }
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setReplyText('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-indigo-950 to-blue-950 text-white border border-indigo-400/20 p-0 max-w-2xl">
        <DialogHeader className="p-6 pb-3">
          <DialogTitle className="text-2xl font-serif text-indigo-200">
            Journey to {log.yearVisited}
          </DialogTitle>
          <DialogDescription className="text-indigo-300">
            Logged on {new Date(log.createdAt).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        
        {/* Image */}
        <div className="px-6">
          <div className="rounded-lg overflow-hidden mb-4 bg-indigo-950/70 border border-indigo-400/20">
            <img
              src={log.image || "/api/placeholder/600/400"}
              alt={`Time travel to ${log.yearVisited}`}
              className="w-full h-64 object-fit"
            />
          </div>
        </div>
        
        {/* Content */}
        <div className="px-6 mb-4 max-h-48 overflow-y-auto">
          <div className="prose prose-invert max-w-none">
            <p className="text-indigo-100 leading-relaxed whitespace-pre-line">
              {log.story}
            </p>
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex justify-center p-6 pt-2 pb-4 bg-indigo-950/60">
          <div className="bg-indigo-900/40 p-3 rounded-lg border border-indigo-500/20 w-full max-w-sm">
            <div className="text-xs text-indigo-300 mb-1 text-center">Survival Chances</div>
            <div className="flex items-center">
              <div className="text-lg text-indigo-100 font-bold">{log.survivalChances}%</div>
              <div className="ml-2 flex-1 bg-indigo-950/60 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-indigo-400"
                  style={{ width: `${log.survivalChances}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="border-t border-indigo-500/20 px-6 py-4">
          <h3 className="text-indigo-200 font-medium mb-3">Comments</h3>
          
          {/* Comment List */}
          <div className="space-y-4 max-h-64 overflow-y-auto mb-4">
            {comments.length === 0 ? (
              <p className="text-indigo-400 text-sm italic">No temporal observations yet.</p>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className="space-y-2">
                  {/* Main Comment */}
                  <div className="bg-indigo-900/30 p-3 rounded-lg border border-indigo-500/10">
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-indigo-300">{comment.commenter}</span>
                      <span className="text-xs text-indigo-400">
                        {new Date(comment.time).toLocaleString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-indigo-100 text-sm mt-1">{comment.text}</p>
                    <button 
                      onClick={() => handleReplyClick(comment)}
                      className="text-xs text-indigo-400 mt-2 hover:text-indigo-200"
                    >
                      Reply
                    </button>
                  </div>
                  
                  {/* Show reply form for top-level comment */}
                  {replyingTo?.id === comment.id && (
                    <form onSubmit={handleReplySubmit} className="pl-4 mt-2">
                      <div className="bg-indigo-900/20 p-2 rounded-lg border border-indigo-500/10">
                        <div className="text-xs text-indigo-300 mb-2">
                          Replying to <span className="font-medium">{comment.commenter}</span>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={replyText}
                            onChange={e => setReplyText(e.target.value)}
                            placeholder="Write your reply..."
                            className="flex-1 bg-indigo-900/40 border border-indigo-500/30 rounded-lg py-1 px-3 text-indigo-100 placeholder-indigo-400 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
                          />
                        </div>
                        <div className="flex justify-end mt-2 space-x-2">
                          <button
                            type="button"
                            onClick={cancelReply}
                            className="text-xs py-1 px-2 text-indigo-300 hover:text-indigo-100"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs py-1 px-3 rounded transition"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                  
                  {/* Replies to this comment */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="pl-4 space-y-2">
                      {comment.replies.map(reply => (
                        <div key={reply.id} className="space-y-2">
                          <div 
                            className="bg-indigo-900/20 p-2 rounded-lg border border-indigo-500/10 ml-4"
                          >
                            <div className="flex justify-between items-start">
                              <span className="font-medium text-indigo-300 text-sm">{reply.commenter}</span>
                              <span className="text-xs text-indigo-400">
                                {new Date(reply.time).toLocaleString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <p className="text-indigo-100 text-sm mt-1">{reply.text}</p>
                            <button 
                              onClick={() => handleReplyClick(reply)}
                              className="text-xs text-indigo-400 mt-2 hover:text-indigo-200"
                            >
                              Reply
                            </button>
                          </div>
                          
                          {/* Show reply form for this reply */}
                          {replyingTo?.id === reply.id && (
                            <form onSubmit={handleReplySubmit} className="pl-4 mt-2">
                              <div className="bg-indigo-900/20 p-2 rounded-lg border border-indigo-500/10 ml-4">
                                <div className="text-xs text-indigo-300 mb-2">
                                  Replying to <span className="font-medium">{reply.commenter}</span>
                                </div>
                                <div className="flex items-center">
                                  <input
                                    type="text"
                                    value={replyText}
                                    onChange={e => setReplyText(e.target.value)}
                                    placeholder="Write your reply..."
                                    className="flex-1 bg-indigo-900/40 border border-indigo-500/30 rounded-lg py-1 px-3 text-indigo-100 placeholder-indigo-400 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
                                  />
                                </div>
                                <div className="flex justify-end mt-2 space-x-2">
                                  <button
                                    type="button"
                                    onClick={cancelReply}
                                    className="text-xs py-1 px-2 text-indigo-300 hover:text-indigo-100"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="submit"
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs py-1 px-3 rounded transition"
                                  >
                                    Reply
                                  </button>
                                </div>
                              </div>
                            </form>
                          )}
                          
                          {/* Render nested replies */}
                          {reply.replies && reply.replies.length > 0 && (
                            <div className="pl-4">
                              {reply.replies.map(nestedReply => (
                                <div 
                                  key={nestedReply.id} 
                                  className="bg-indigo-900/20 p-2 rounded-lg border border-indigo-500/10 ml-4"
                                >
                                  <div className="flex justify-between items-start">
                                    <span className="font-medium text-indigo-300 text-sm">{nestedReply.commenter}</span>
                                    <span className="text-xs text-indigo-400">
                                      {new Date(nestedReply.time).toLocaleString('en-US', { 
                                        month: 'short', 
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </span>
                                  </div>
                                  <p className="text-indigo-100 text-sm mt-1">{nestedReply.text}</p>
                                  <button 
                                    onClick={() => handleReplyClick(nestedReply)}
                                    className="text-xs text-indigo-400 mt-2 hover:text-indigo-200"
                                  >
                                    Reply
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
          
          {/* Comment Input */}
          <form onSubmit={handleCommentSubmit} className="mt-2">
            <div className="flex items-center">
              <input
                type="text"
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Share your temporal observations..."
                className="flex-1 bg-indigo-900/40 border border-indigo-500/30 rounded-l-lg py-2 px-3 text-indigo-100 placeholder-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-r-lg transition"
              >
                Post
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};