import React, { useState } from 'react';
import { ThemeType, DifficultyLevel } from '../types/game';
import { THEME_STYLES } from './ThemeStyles';
import { Sparkles, ArrowRight, Shield, Clock, Layers, Users } from 'lucide-react';

interface CreateRoomModalProps {
  onCreateRoom: (params: {
    hostName: string;
    theme: ThemeType;
    difficulty: DifficultyLevel;
    storiesCount: number;
    timePerStorySeconds: number;
    maxPlayers: number;
  }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  onCreateRoom,
  onCancel,
  isLoading = false
}) => {
  const [hostName, setHostName] = useState('');
  const [theme, setTheme] = useState<ThemeType>('MYSTERY');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('MEDIUM');
  const [storiesCount, setStoriesCount] = useState(3);
  const [timePerStorySeconds, setTimePerStorySeconds] = useState(120);
  const [maxPlayers, setMaxPlayers] = useState(500);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostName.trim()) return;

    onCreateRoom({
      hostName: hostName.trim(),
      theme,
      difficulty,
      storiesCount,
      timePerStorySeconds,
      maxPlayers
    });
  };

  const themes: ThemeType[] = ['REAL_WORLD', 'MYSTERY', 'NEURAL_BREAK', 'AVALORIA'];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 my-8">
        {/* Title */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-400" />
              CREATE AI ESCAPE ROOM
            </h2>
            <p className="text-sm text-slate-400">Configure room settings and invite up to 500 competitive players.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Host Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Host Name / Alias
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Mastermind, GameMaster, Priya"
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* CHOOSE YOUR WORLD */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              CHOOSE YOUR WORLD
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {themes.map((t) => {
                const style = THEME_STYLES[t];
                const isSelected = theme === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTheme(t)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{style.icon}</span>
                      <div>
                        <div className={`font-bold text-sm ${isSelected ? 'text-amber-400' : 'text-white'}`}>
                          {style.name}
                        </div>
                        <div className="text-xs text-slate-400">{style.subtitle}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-400" /> DIFFICULTY LEVEL
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['EASY', 'MEDIUM', 'HARD'] as DifficultyLevel[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                    difficulty === d
                      ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Room Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div>
              <label className="block text-xs text-slate-400 mb-1 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-teal-400" /> Stories Count
              </label>
              <select
                value={storiesCount}
                onChange={(e) => setStoriesCount(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
              >
                <option value={1}>1 Story (Quick)</option>
                <option value={3}>3 Stories (Standard)</option>
                <option value={5}>5 Stories (Marathon)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> Time / Story
              </label>
              <select
                value={timePerStorySeconds}
                onChange={(e) => setTimePerStorySeconds(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
              >
                <option value={60}>60 Seconds (Blitz)</option>
                <option value={120}>120 Seconds (2 Mins - Default)</option>
                <option value={180}>180 Seconds (3 Mins)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-purple-400" /> Max Capacity
              </label>
              <select
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
              >
                <option value={50}>50 Players</option>
                <option value={200}>200 Players</option>
                <option value={500}>500 Players (Max)</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !hostName.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-900/30 transition-all flex items-center gap-2 text-sm disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'CREATE ROOM'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
