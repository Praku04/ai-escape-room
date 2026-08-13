import React, { useEffect, useState } from 'react';
import { Sparkles, Trophy, Clock, ArrowRight } from 'lucide-react';

interface StoryTransitionProps {
  completedStoryTitle: string;
  scoreEarned: number;
  completionSeconds: number;
  nextStoryTitle?: string;
  onNext: () => void;
}

export const StoryTransition: React.FC<StoryTransitionProps> = ({
  completedStoryTitle,
  scoreEarned,
  completionSeconds,
  nextStoryTitle,
  onNext
}) => {
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    if (countdown <= 0) {
      onNext();
      return;
    }
    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, onNext]);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-teal-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-center space-y-6 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 mx-auto rounded-full bg-teal-500/20 border border-teal-500/50 flex items-center justify-center text-teal-400">
          <Sparkles className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-teal-400">✨ PUZZLE SOLVED! ✨</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">{completedStoryTitle}</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 flex items-center justify-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> Points Earned
            </span>
            <span className="text-2xl font-bold font-mono text-amber-400">+{scoreEarned}</span>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-slate-400 flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 text-teal-400" /> Your Time
            </span>
            <span className="text-2xl font-bold font-mono text-teal-400">{completionSeconds}s</span>
          </div>
        </div>

        {nextStoryTitle && (
          <div className="text-xs text-slate-400 bg-slate-950/60 py-2.5 px-4 rounded-xl border border-slate-800">
            NEXT PUZZLE: <strong className="text-white">{nextStoryTitle}</strong>
          </div>
        )}

        <button
          onClick={onNext}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all"
        >
          <span>CONTINUE ({countdown}s)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
