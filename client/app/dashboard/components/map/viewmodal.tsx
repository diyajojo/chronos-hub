import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface TravelLogItem {
  id: number;
  yearVisited: number;
  story: string;
  image: string;
  survivalChances: number;
  rating: number;
  createdAt: string;
}

interface ViewModalProps {
  log: TravelLogItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ViewModal = ({ log, isOpen, onClose }: ViewModalProps) => {
  if (!log) return null;

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
              className="w-full h-64 object-cover"
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
        <div className="grid grid-cols-2 gap-4 p-6 pt-2 bg-indigo-950/60">
          <div className="bg-indigo-900/40 p-3 rounded-lg border border-indigo-500/20">
            <div className="text-xs text-indigo-300 mb-1">Survival Rating</div>
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
          <div className="bg-indigo-900/40 p-3 rounded-lg border border-indigo-500/20">
            <div className="text-xs text-indigo-300 mb-1">Journey Rating</div>
            <div className="flex items-center">
              <div className="text-lg text-indigo-100 font-bold">{log.rating}/10</div>
              <div className="ml-2 flex">
                {Array.from({ length: 5 }, (_, i) => (
                  <span 
                    key={i} 
                    className={`text-lg ${i < Math.round(log.rating/2) ? 'text-indigo-300' : 'text-indigo-950'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
