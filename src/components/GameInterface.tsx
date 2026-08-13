import React, { useState, useRef, useEffect } from 'react';
import {
  StoryConfig,
  PlayerStoryState,
  LeaderboardEntry,
  Player,
  ThemeType
} from '../types/game';
import { THEME_STYLES } from './ThemeStyles';
import { Send, Trophy, Sparkles, AlertCircle, FileText, CheckCircle2, ChevronRight, User, LogOut } from 'lucide-react';

interface GameInterfaceProps {
  story: StoryConfig;
  storyState: PlayerStoryState;
  player: Player;
  leaderboard: LeaderboardEntry[];
  totalPlayersCount: number;
  theme: ThemeType;
  onSubmitPrompt: (promptText: string) => Promise<void>;
  onExitRoom?: () => void;
  isSubmitting?: boolean;
}

export const GameInterface: React.FC<GameInterfaceProps> = ({
  story,
  storyState,
  player,
  leaderboard,
  totalPlayersCount,
  theme,
  onSubmitPrompt,
  onExitRoom,
  isSubmitting = false
}) => {
  const [promptInput, setPromptInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const themeStyle = THEME_STYLES[theme];

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [storyState.conversation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim() || isSubmitting) return;

    const text = promptInput.trim();
    setPromptInput('');
    await onSubmitPrompt(text);
  };

  const userRankEntry = leaderboard.find((l) => l.playerId === player.id) || {
    rank: 1,
    totalScore: player.totalScore
  };

  return (
    <div className={`max-w-7xl mx-auto p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-4 gap-4 ${themeStyle.fontFamily}`}>
      {/* Main Chat / Interaction Area (3 Columns) */}
      <div className="lg:col-span-3 flex flex-col space-y-4">
        {/* Story Briefing Card */}
        <div className={`${themeStyle.cardBg} border ${themeStyle.cardBorder} rounded-2xl p-4 sm:p-5 shadow-xl space-y-3`}>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{story.character.avatar}</span>
              <div>
                <h2 className={`font-bold text-lg sm:text-xl ${themeStyle.textColor}`}>{story.title}</h2>
                <p className="text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">{story.character.name}</span> • {story.character.role}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-teal-400 font-mono">
                DIFFICULTY: {story.difficulty}
              </span>
              {onExitRoom && (
                <button
                  onClick={onExitRoom}
                  className="px-2.5 py-1 rounded-full bg-red-950/60 hover:bg-red-900/60 border border-red-700/50 text-red-300 hover:text-red-200 text-xs font-medium transition-all flex items-center gap-1"
                  title="Exit Game"
                >
                  <LogOut className="w-3 h-3" />
                  EXIT
                </button>
              )}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
            "{story.description}"
          </p>
        </div>

        {/* Conversation Stream / Terminal */}
        <div className={`${themeStyle.terminalBg} rounded-2xl p-4 sm:p-5 h-[420px] sm:h-[480px] overflow-y-auto flex flex-col space-y-4 shadow-inner border`}>
          {storyState.conversation.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div className="flex items-center gap-1.5 px-1 text-[11px] text-slate-400 font-mono">
                  {isUser ? (
                    <>
                      <span>{player.name}</span>
                      <User className="w-3 h-3 text-amber-400" />
                    </>
                  ) : (
                    <>
                      <span>{story.character.name}</span>
                      <Sparkles className="w-3 h-3 text-teal-400" />
                    </>
                  )}
                </div>

                <div
                  className={`max-w-[88%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-amber-500/20 text-amber-100 border border-amber-500/30 rounded-tr-none'
                      : msg.isSuccess
                      ? 'bg-teal-950/80 text-teal-100 border border-teal-500/50 shadow-lg shadow-teal-950/50 rounded-tl-none font-medium'
                      : `${themeStyle.cardBg} ${themeStyle.textColor} border ${themeStyle.cardBorder} rounded-tl-none`
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Prompt Submission Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              disabled={isSubmitting || storyState.status !== 'IN_PROGRESS'}
              placeholder={
                storyState.status === 'IN_PROGRESS'
                  ? 'Type what you want to say or ask...'
                  : 'Puzzle ended.'
              }
              className={`w-full ${themeStyle.terminalBg} text-white placeholder-slate-500 rounded-xl px-4 py-3.5 pr-12 text-sm focus:outline-none focus:border-amber-400 border transition-all`}
            />
            <span className="absolute right-3 top-3.5 text-[10px] font-mono text-slate-500">
              {promptInput.length}/300
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !promptInput.trim() || storyState.status !== 'IN_PROGRESS'}
            className={`${themeStyle.primaryButton} px-5 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all disabled:opacity-50`}
          >
            {isSubmitting ? (
              <span className="animate-spin">⌛</span>
            ) : (
              <>
                <span>SEND</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Side Panel: Score, Discovered Facts & Live Leaderboard (1 Column) */}
      <div className="flex flex-col space-y-4">
        {/* Your Score Card */}
        <div className={`${themeStyle.cardBg} border ${themeStyle.cardBorder} rounded-2xl p-4 shadow-xl space-y-2`}>
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center justify-between">
            <span>YOUR SCORE</span>
            <span className="text-amber-400 font-mono font-bold">RANK #{userRankEntry.rank}</span>
          </div>
          <div className="text-3xl font-black font-mono text-amber-400 tracking-tight">
            {player.totalScore.toLocaleString()} PTS
          </div>
        </div>

        {/* Discovered Facts Log */}
        <div className={`${themeStyle.cardBg} border ${themeStyle.cardBorder} rounded-2xl p-4 shadow-xl space-y-3 flex-1`}>
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <FileText className="w-4 h-4 text-teal-400" />
            <h3 className="font-bold text-sm text-white">CLUES FOUND</h3>
          </div>

          {storyState.discoveredFacts.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-2">
              No clues found yet. Ask questions to discover clues!
            </p>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {storyState.discoveredFacts.map((fact, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-slate-950/80 p-2 rounded-lg border border-slate-800 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                  <span>{fact}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Leaderboard Card */}
        <div className={`${themeStyle.cardBg} border ${themeStyle.cardBorder} rounded-2xl p-4 shadow-xl space-y-3`}>
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-sm text-white">TOP PLAYERS</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">{totalPlayersCount} PLAYING</span>
          </div>

          <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
            {leaderboard.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-4">
                Leaderboard loading...
              </p>
            ) : (
              leaderboard.slice(0, 5).map((entry) => {
                const isMe = entry.playerId === player.id;
                return (
                  <div
                    key={entry.playerId}
                    className={`flex items-center justify-between p-2 rounded-lg text-xs font-mono transition-all ${
                      isMe
                        ? 'bg-amber-500/20 border border-amber-500/40 text-amber-200 font-bold'
                        : 'bg-slate-950/60 border border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-5 text-slate-400">#{entry.rank}</span>
                      <span className="truncate max-w-[100px]">{entry.name}</span>
                    </div>
                    <span className="text-amber-400">{entry.totalScore}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
