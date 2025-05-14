import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useComments } from '../../utils/comments';
import { useReactions } from '../../utils/reactions';
import { useEffect, useState, useMemo } from 'react';
import { UserProfileModal } from '../userprofile';

// Using the same interface definitions as in MapModal component
interface Comment {
  id: string;
  text: string;
  time: string;
  commenter: string;
  parentId: string | null;
  replies: Comment[];
  user: {
    id: number;
  };
}

interface TravelLogItem {
  id: number;
  yearVisited: number;
  title: string;
  story: string;
  image: string;
  createdAt: string;
  comments: Comment[];
  user: {
    id: number;
    name: string;
    email: string;
  };
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface ReactionData {
  reactions: {
    id: string;
    type: string;
    reactor: string;
    user?: {
      id: number;
    };
  }[];
  counts: {
    [key: string]: number;
  };
}

interface ViewModalProps {
  log: TravelLogItem | null;
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

export const ViewModal = ({ log, user, isOpen, onClose }: ViewModalProps) => {
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<{ id: number, name: string }>({ id: 0, name: '' });
  
  const {
    comments,
    newComment,
    replyingTo,
    replyText,
    setNewComment,
    setReplyText,
    handleCommentSubmit,
    handleReplySubmit,
    handleReplyClick,
    cancelReply,
    fetchComments
  } = useComments(log?.id || 0, user?.id);

  const {
    selectedReaction,
    reactionData,
    totalReactions,
    showReactionsList,
    setShowReactionsList,
    handleReactionClick,
    fetchReactions
  } = useReactions(log?.id || 0, user?.id);

  // Organize comments into a hierarchy
  const commentThreads = useMemo(() => {
    if (!comments) return [];
    
    // Filter top-level comments
    return comments.filter(comment => !comment.parentId);
  }, [comments]);

  // When modal opens, fetch data
  useEffect(() => {
    if (log && isOpen) {
      fetchComments();
      fetchReactions();
    }
  }, [log?.id, isOpen]);

  const handleProfileClick = (clickedUser: { id: number, name: string }) => {
    // Don't open profile modal if it's the current user
    if (clickedUser.id === user.id) {
      return;
    }
    setSelectedProfile(clickedUser);
    setProfileModalOpen(true);
  };

  if (!log) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-gradient-to-br from-indigo-950 to-blue-950 text-white border border-indigo-400/20 p-0 max-w-2xl">
          <DialogHeader className="p-4 pb-2">
            <DialogTitle className="text-xl font-serif text-indigo-200">
              Journey to {log.yearVisited}
            </DialogTitle>
            <div className="text-indigo-300 text-sm space-y-1">
              <div className="flex gap-2">
                <span>Created by Time Traveller : 
                  {log.user.id === user.id ? (
                    <span className="text-indigo-200 ml-1">You</span>
                  ) : (
                    <button 
                      className="text-indigo-200 ml-1 hover:underline hover:text-indigo-100"
                      onClick={() => handleProfileClick({ id: log.user.id, name: log.user.name })}
                    >
                      {log.user.name}
                    </button>
                  )}
                </span>
              </div>
            </div>
          </DialogHeader>
          
          {/* Image */}
          <div className="px-4">
            <div className="rounded-lg overflow-hidden mb-4 bg-indigo-950/70 border border-indigo-400/20">
              <div className="relative w-full h-56">
                <img
                  src={log.image || "/api/placeholder/600/400"}
                  alt={`Time travel to ${log.yearVisited}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="mt-2 px-4">
            
            <div className="text-md text-blue-300 mb-2">Title: {log.title}</div> 
            <div className="text-white text-sm whitespace-pre-wrap max-h-40 overflow-y-auto">{log.story}</div>
          </div>
          
          {/* Reactions Section */}
          <div className="flex justify-between items-center px-4 py-2 border-t border-indigo-500/20 mt-4">
            <div className="flex space-x-3">
              <button 
                onClick={() => handleReactionClick('enlightenment')}
                className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition text-sm ${
                  selectedReaction === 'enlightenment' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-indigo-900/40 hover:bg-indigo-800/40'
                }`}
              >
                <span>💡</span>
              </button>
              <button 
                onClick={() => handleReactionClick('appreciation')}
                className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition text-sm ${
                  selectedReaction === 'appreciation' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-indigo-900/40 hover:bg-indigo-800/40'
                }`}
              >
                <span>🤝</span>
              </button>
              <button 
                onClick={() => handleReactionClick('wonderstruck')}
                className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition text-sm ${
                  selectedReaction === 'wonderstruck' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-indigo-900/40 hover:bg-indigo-800/40'
                }`}
              >
                <span>😯</span>
              </button>
            </div>
            
            <button
              onClick={() => setShowReactionsList(true)}
              className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-indigo-900/40 hover:bg-indigo-800/40 text-sm"
            >
              <span className="text-indigo-200 text-sm">Total Reactions</span>
              <span className="bg-indigo-700 text-white px-2 py-0.5 rounded-full text-xs">
                {totalReactions}
              </span>
            </button>
          </div>
          
          {/* Comments Section */}
          <div className="border-t border-indigo-500/20 px-4 py-3">
            <h3 className="text-indigo-200 font-medium mb-2 text-sm">Comments</h3>
            
            {/* Comment List */}
            <div className="space-y-3 max-h-48 overflow-y-auto mb-3">
              {!comments || comments.length === 0 ? (
                <p className="text-indigo-400 text-xs italic">No temporal observations yet.</p>
              ) : (
                comments.map(comment => (
                  <div key={comment.id} className="space-y-2">
                    {/* Main Comment */}
                    <div className="bg-indigo-900/30 p-2 rounded-lg border border-indigo-500/10">
                      <div className="flex justify-between items-start">
                        {comment.user?.id && comment.user.id === user.id ? (
                          <span className="font-medium text-indigo-300 text-xs">You</span>
                        ) : (
                          <button 
                            onClick={() => handleProfileClick({ 
                              id: comment.user?.id ? Number(comment.user.id) : 0, 
                              name: comment.commenter 
                            })}
                            className="font-medium text-indigo-300 text-xs hover:underline hover:text-indigo-200"
                          >
                            {comment.commenter}
                          </button>
                        )}
                        <span className="text-xs text-indigo-400">
                          {new Date(comment.time).toLocaleString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-indigo-100 text-xs mt-1">{comment.text}</p>
                      <button 
                        onClick={() => handleReplyClick(comment)}
                        className="text-xs text-indigo-400 mt-1 hover:text-indigo-200"
                      >
                        Reply
                      </button>
                    </div>
                    
                    {/* Show reply form for top-level comment */}
                    {replyingTo?.id === comment.id && (
                      <form onSubmit={(e) => {
                        handleReplySubmit(e);
                        setTimeout(() => fetchComments(), 500); // Fetch comments after submission
                      }} className="pl-3 mt-1">
                        <div className="bg-indigo-900/20 p-2 rounded-lg border border-indigo-500/10">
                          <div className="text-xs text-indigo-300 mb-1">
                            Replying to <span className="font-medium">
                              {comment.user?.id && comment.user.id === user.id ? "yourself" : comment.commenter}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="text"
                              value={replyText}
                              onChange={e => setReplyText(e.target.value)}
                              placeholder="Write your reply..."
                              className="flex-1 bg-indigo-900/40 border border-indigo-500/30 rounded-lg py-1 px-2 text-indigo-100 placeholder-indigo-400 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-400"
                            />
                          </div>
                          <div className="flex justify-end mt-1 space-x-2">
                            <button
                              type="button"
                              onClick={cancelReply}
                              className="text-xs py-0.5 px-2 text-indigo-300 hover:text-indigo-100"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs py-0.5 px-2 rounded transition"
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      </form>
                    )}
                    
                    {/* Replies to this comment */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="pl-3 space-y-2">
                        {comment.replies.map(reply => (
                          <div key={reply.id} className="space-y-1">
                            <div 
                              className="bg-indigo-900/20 p-2 rounded-lg border border-indigo-500/10 ml-2"
                            >
                              <div className="flex justify-between items-start">
                                {reply.user?.id && reply.user.id === user.id ? (
                                  <span className="font-medium text-indigo-300 text-xs">You</span>
                                ) : (
                                  <button 
                                    onClick={() => handleProfileClick({ 
                                      id: reply.user?.id ? Number(reply.user.id) : 0, 
                                      name: reply.commenter 
                                    })}
                                    className="font-medium text-indigo-300 text-xs hover:underline hover:text-indigo-200"
                                  >
                                    {reply.commenter}
                                  </button>
                                )}
                                <span className="text-xs text-indigo-400">
                                  {new Date(reply.time).toLocaleString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                              <p className="text-indigo-100 text-xs mt-1">{reply.text}</p>
                              <button 
                                onClick={() => handleReplyClick(reply)}
                                className="text-xs text-indigo-400 mt-1 hover:text-indigo-200"
                              >
                                Reply
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            
            {/* Comment Input */}
            <form onSubmit={(e) => {
              handleCommentSubmit(e);
              setTimeout(() => fetchComments(), 500); // Fetch comments after submission
            }} className="mt-2">
              <div className="flex items-center">
                <input
                  type="text"
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder="Share your temporal observations..."
                  className="flex-1 bg-indigo-900/40 border border-indigo-500/30 rounded-l-lg py-1 px-2 text-indigo-100 placeholder-indigo-400 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-400"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded-r-lg transition text-xs"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reactions List Modal */}
      <Dialog open={showReactionsList} onOpenChange={setShowReactionsList}>
        <DialogContent className="bg-gradient-to-br from-indigo-950 to-blue-950 text-white border border-indigo-400/20 p-4 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-serif text-indigo-200">
              All Reactions
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
            {reactionData?.reactions.map(reaction => (
              <div 
                key={reaction.id} 
                className="flex justify-between items-center p-2 bg-indigo-900/30 rounded-lg border border-indigo-500/10"
              >
                {reaction.user?.id && reaction.user.id === user.id ? (
                  <span className="text-indigo-200 text-sm">You</span>
                ) : (
                  <button 
                    onClick={() => handleProfileClick({ 
                      id: reaction.user?.id ? Number(reaction.user.id) : 0, 
                      name: reaction.reactor 
                    })}
                    className="text-indigo-200 text-sm hover:underline hover:text-indigo-100"
                  >
                    {reaction.reactor}
                  </button>
                )}
                <span>{
                  reaction.type === 'enlightenment' ? '💡' : 
                  reaction.type === 'appreciation' ? '🤝' : '😯'
                }</span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* User Profile Modal */}
      <UserProfileModal 
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        user={selectedProfile}
        currentUserId={user.id}
      />
    </>
  );
};