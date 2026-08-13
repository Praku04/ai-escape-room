import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { LeaderboardEntry, RoomStats } from '../types/game';
import { Trophy, Medal, Clock, Users, Zap, RefreshCw, Share2 } from 'lucide-react';

interface VictoryPodiumProps {
  leaderboard: LeaderboardEntry[];
  stats: RoomStats;
  onPlayAgain?: () => void;
}

export const VictoryPodium: React.FC<VictoryPodiumProps> = ({
  leaderboard,
  stats,
  onPlayAgain
}) => {
  useEffect(() => {
    // Trigger confetti explosion on completion
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  const top1 = leaderboard[0];
  const top2 = leaderboard[1];
  const top3 = leaderboard[2];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-8 my-8">
      {/* Title Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-4 py-1.5 rounded-full text-amber-400 font-mono text-xs font-bold uppercase tracking-widest">
          🏆 GAME OVER — GREAT JOB EVERYONE!
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">🎉 WINNERS! 🎉</h1>
        <p className="text-slate-400 text-sm">Amazing work solving all the puzzles!</p>
      </div>

      {/* Podium Grid */}
      <div className="grid grid-cols-3 gap-3 sm:gap-6 items-end pt-8 pb-4">
        {/* 2nd Place */}
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 text-center space-y-2 shadow-xl h-48 sm:h-56 flex flex-col justify-between">
          <div className="w-10 h-10 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold text-lg border border-slate-600">
            🥈
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-white text-sm sm:text-lg truncate">{top2 ? top2.name : 'N/A'}</h3>
            <p className="font-mono text-amber-400 font-extrabold text-xs sm:text-base">
              {top2 ? top2.totalScore.toLocaleString() : '0'} PTS
            </p>
          </div>
          <span className="text-[10px] uppercase font-mono text-slate-400 font-bold bg-slate-950 py-1 rounded-lg">2ND PLACE</span>
        </div>

        {/* 1st Place (Tallest) */}
        <div className="bg-gradient-to-b from-amber-500/20 to-slate-900 border-2 border-amber-400 rounded-2xl p-4 sm:p-6 text-center space-y-3 shadow-2xl h-60 sm:h-72 flex flex-col justify-between relative -top-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-amber-400/20 flex items-center justify-center text-amber-400 font-black text-2xl border border-amber-400/60 shadow-lg shadow-amber-400/20">
            🥇
          </div>
          <div className="space-y-1">
            <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-widest">CHAMPION</span>
            <h2 className="font-black text-white text-lg sm:text-2xl truncate">{top1 ? top1.name : 'N/A'}</h2>
            <p className="font-mono text-amber-300 font-black text-lg sm:text-2xl">
              {top1 ? top1.totalScore.toLocaleString() : '0'} PTS
            </p>
          </div>
          <span className="text-xs uppercase font-mono text-slate-950 font-black bg-amber-400 py-1.5 rounded-lg shadow-md">
            WINNER
          </span>
        </div>

        {/* 3rd Place */}
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 text-center space-y-2 shadow-xl h-44 sm:h-52 flex flex-col justify-between">
          <div className="w-10 h-10 mx-auto rounded-full bg-amber-900/30 flex items-center justify-center text-amber-600 font-bold text-lg border border-amber-800/40">
            🥉
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-white text-sm sm:text-lg truncate">{top3 ? top3.name : 'N/A'}</h3>
            <p className="font-mono text-amber-400 font-extrabold text-xs sm:text-base">
              {top3 ? top3.totalScore.toLocaleString() : '0'} PTS
            </p>
          </div>
          <span className="text-[10px] uppercase font-mono text-slate-400 font-bold bg-slate-950 py-1 rounded-lg">3RD PLACE</span>
        </div>
      </div>

      {/* Game Analytics Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <h3 className="font-bold text-white text-base border-b border-slate-800 pb-2 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" /> GAME STATS
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="block text-xs text-slate-400">Total Players</span>
            <span className="font-mono font-bold text-lg text-white mt-1 block">{stats.totalParticipants}</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="block text-xs text-slate-400">Average Time</span>
            <span className="font-mono font-bold text-lg text-teal-400 mt-1 block">{stats.averageCompletionTimeSeconds}s</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="block text-xs text-slate-400">Top Score</span>
            <span className="font-mono font-bold text-lg text-amber-400 mt-1 block">{stats.highestScorePlayer.score}</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="block text-xs text-slate-400">Best Player</span>
            <span className="font-mono font-bold text-sm text-purple-300 mt-1 block truncate">{stats.highestScorePlayer.name}</span>
          </div>
        </div>

        {/* Fastest Story Solvers List */}
        {stats.fastestStoryTimes.length > 0 && (
          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Fastest Puzzle Solvers</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {stats.fastestStoryTimes.map((st) => (
                <div key={st.storyIndex} className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-xs flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-200">Puzzle {st.storyIndex}</div>
                    <div className="text-[11px] text-teal-400 font-medium">{st.playerName}</div>
                  </div>
                  <div className="font-mono font-bold text-amber-400">{st.timeSeconds}s</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
        <h3 className="font-bold text-white text-base border-b border-slate-800 pb-2">ALL PLAYERS</h3>
        <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
          {leaderboard.map((entry) => (
            <div
              key={entry.playerId}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono"
            >
              <div className="flex items-center gap-3">
                <span className={`w-6 font-bold ${entry.rank <= 3 ? 'text-amber-400' : 'text-slate-500'}`}>
                  #{entry.rank}
                </span>
                <span className="text-white font-medium text-sm">{entry.name}</span>
              </div>

              <div className="flex items-center gap-4 text-slate-400">
                <span>{entry.completedStories} Puzzles</span>
                <span>{entry.totalTimeSeconds}s</span>
                <span className="text-amber-400 font-bold text-sm">{entry.totalScore} PTS</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      {onPlayAgain && (
        <div className="flex justify-center pt-2">
          <button
            onClick={onPlayAgain}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-black text-base shadow-lg shadow-green-900/30 transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            PLAY AGAIN
          </button>
        </div>
      )}
    </div>
  );
};
