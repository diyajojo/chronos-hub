import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import Link from 'next/link';
import { useComments } from '../comments/comments';
import { useReactions } from '../reactions/reactions';
import { useEffect } from 'react';

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
  story: string;
  image: string;
  survivalChances: number;
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
  } = useComments(log?.id || 0, user?.name);

  const {
    selectedReaction,
    reactionData,
    totalReactions,
    showReactionsList,
    setShowReactionsList,
    handleReactionClick,
    fetchReactions
  } = useReactions(log?.id || 0, user?.name);

  useEffect(() => {
    if (log && isOpen) {
      fetchComments();
      fetchReactions();
    }
  }, [log?.id, isOpen]);

  if (!log) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-gradient-to-br from-indigo-950 to-blue-950 text-white border border-indigo-400/20 p-0 max-w-2xl">
          <DialogHeader className="p-6 pb-3">
            <DialogTitle className="text-2xl font-serif text-indigo-200">
              Journey to {log.yearVisited}
            </DialogTitle>
            <DialogDescription className="text-indigo-300 space-y-1">
              <div>Logged on {new Date(log.createdAt).toLocaleDateString()}</div>
              <div className="flex gap-2">
                <span>Created by Time Traveller : 
                  <Link 
                    href={`/dashboard/${log.user.id}`} 
                    className="text-indigo-200 hover:text-indigo-100 hover:underline cursor-pointer ml-1"
                  >
                    {log.user.name}
                  </Link>
                </span>
              </div>
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

          {/* Reactions Section */}
          <div className="flex justify-between items-center px-6 py-2 border-t border-indigo-500/20">
            <div className="flex space-x-4">
              <button
                onClick={() => handleReactionClick('enlightenment')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                  selectedReaction === 'enlightenment' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-indigo-900/40 hover:bg-indigo-800/40'
                }`}
              >
                <span>💡</span>
              </button>
              <button
                onClick={() => handleReactionClick('appreciation')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                  selectedReaction === 'appreciation' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-indigo-900/40 hover:bg-indigo-800/40'
                }`}
              >
                <span>🤝</span>
              </button>
              <button
                onClick={() => handleReactionClick('wonderstruck')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
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
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-indigo-900/40 hover:bg-indigo-800/40"
            >
              <span className="text-indigo-200">Total Reactions</span>
              <span className="bg-indigo-700 text-white px-2 py-0.5 rounded-full text-sm">
                {totalReactions}
              </span>
            </button>
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
                        <Link 
                          href={`/dashboard/${comment.user?.id}`}
                          className="font-medium text-indigo-300 hover:text-indigo-200 hover:underline"
                        >
                          {comment.commenter}
                        </Link>
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
                                <Link 
                                  href={`/dashboard/${reply.user?.id}`}
                                  className="font-medium text-indigo-300 text-sm hover:text-indigo-200 hover:underline"
                                >
                                  {reply.commenter}
                                </Link>
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
                                      <Link 
                                        href={`/dashboard/${nestedReply.user?.id}`}
                                        className="font-medium text-indigo-300 text-sm hover:text-indigo-200 hover:underline"
                                      >
                                        {nestedReply.commenter}
                                      </Link>
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

      {/* Reactions List Modal */}
      <Dialog open={showReactionsList} onOpenChange={setShowReactionsList}>
        <DialogContent className="bg-gradient-to-br from-indigo-950 to-blue-950 text-white border border-indigo-400/20 p-6 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-serif text-indigo-200">
              All Reactions
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
            {reactionData?.reactions.map(reaction => (
              <div 
                key={reaction.id} 
                className="flex justify-between items-center p-3 bg-indigo-900/30 rounded-lg border border-indigo-500/10"
              >
                <Link
                  href={`/dashboard/${reaction.user?.id}`}
                  className="text-indigo-200 hover:text-indigo-100 hover:underline"
                >
                  {reaction.reactor}
                </Link>
                <span>{
                  reaction.type === 'enlightenment' ? '💡' : 
                  reaction.type === 'appreciation' ? '🤝' : '😯'
                }</span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};