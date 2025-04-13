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
  id: number;
  username: string;
  text: string;
  time: string;  // Changed from timestamp to time
  commenter: string;  // Add commenter field
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
  currentUser?: string;
  onAddComment?: (logId: number, comment: string) => void;
}

export const ViewModal = ({ 
  log, 
  user,
  isOpen, 
  onClose, 
  currentUser,
  onAddComment
}: ViewModalProps) => {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      if (log && isOpen) {
        try {
          const response = await fetch(`http://localhost:8000/fetchcomments`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              travelLogId: log.id
            })
          });
          if (response.ok) {
            const data = await response.json();
            setComments(data);
          }
        } catch (error) {
          console.error('Error fetching comments:', error);
        }
      }
    };

    fetchComments();
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
            travelLogId: log.id,
            text: newComment,
            commenter: user?.name
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to add comment');
        }

        const newCommentData = await response.json();
        
        // Add the new comment to the comments state with correct time
        setComments(prevComments => [...prevComments, {
          id: newCommentData.id,
          username: user?.name || '',
          text: newCommentData.text,
          time: newCommentData.time,
          commenter: newCommentData.commenter
        }]);
        
        setNewComment('');
      } 
      catch (error) {
        console.error('Error adding comment:', error);
      }
    }
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
          <div className="space-y-3 max-h-40 overflow-y-auto mb-4">
            {comments.length === 0 ? (
              <p className="text-indigo-400 text-sm italic">No temporal observations yet.</p>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className="bg-indigo-900/30 p-3 rounded-lg border border-indigo-500/10">
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