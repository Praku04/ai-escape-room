import React from 'react';
import { ThemeType, LeaderboardEntry } from '../types/game';
import { THEME_STYLES } from './ThemeStyles';
import { Trophy, Clock, Users, ShieldAlert } from 'lucide-react';

interface HeaderProps {
  roomCode?: string;
  theme?: ThemeType;
  storyIndex?: number;
  totalStories?: number;
  timeRemainingSeconds?: number;
  totalTimeSeconds?: number;
  playerRank?: LeaderboardEntry;
  totalPlayersCount?: number;
  playerName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  roomCode,
  theme = 'SCHOOL_DAY',
  storyIndex = 1,
  totalStories = 3,
  timeRemainingSeconds,
  playerRank,
  totalPlayersCount = 1,
  playerName
}) => {
  const tStyle = THEME_STYLES[theme] || THEME_STYLES['SCHOOL_DAY'];

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <header className={`w-full py-3 px-4 ${tStyle.headerBg} sticky top-0 z-40 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: App Title & Theme */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl shadow-md">
            {tStyle.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg tracking-wider text-white">KIDS PUZZLE GAME</h1>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${tStyle.cardBorder} ${tStyle.accentColor} font-mono uppercase`}>
                {theme.replace('_', ' ')}
              </span>
            </div>
            {playerName && (
              <p className="text-xs text-slate-400">
                Playing as <span className="text-white font-medium">{playerName}</span>
              </p>
            )}
          </div>
        </div>

        {/* Center: Story Step & Timer */}
        {timeRemainingSeconds !== undefined && (
          <div className="flex items-center gap-4 bg-slate-900/80 px-4 py-1.5 rounded-xl border border-slate-700/50 shadow-inner">
            <div className="text-xs font-medium text-slate-300">
              PUZZLE <span className="text-teal-400 font-bold">{storyIndex}</span> / {totalStories}
            </div>

            <div className="h-4 w-[1px] bg-slate-700" />

            <div className={`flex items-center gap-1.5 font-mono text-lg font-bold ${
              timeRemainingSeconds <= 20 ? 'text-red-400 animate-pulse' : timeRemainingSeconds <= 45 ? 'text-amber-400' : 'text-teal-400'
            }`}>
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeRemainingSeconds)}</span>
            </div>
          </div>
        )}

        {/* Right: Room Code & Player Rank */}
        <div className="flex items-center gap-3">
          {roomCode && (
            <div className="flex items-center gap-2 bg-slate-950/60 px-3 py-1 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-400">ROOM:</span>
              <span className="font-mono font-bold text-amber-400 text-sm tracking-widest">{roomCode}</span>
            </div>
          )}

          {playerRank && (
            <div className="flex items-center gap-2 bg-indigo-950/60 px-3 py-1 rounded-lg border border-indigo-500/30">
              <Trophy className="w-4 h-4 text-amber-400" />
              <div className="text-xs text-slate-300">
                RANK <span className="font-bold text-white">#{playerRank.rank}</span> / {totalPlayersCount}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
