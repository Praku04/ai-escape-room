import React, { useState } from 'react';
import { Room, LeaderboardEntry } from '../types/game';
import { THEME_STYLES } from './ThemeStyles';
import { Copy, Check, Play, Users, Bot, Sparkles } from 'lucide-react';

interface HostLobbyProps {
  room: Room;
  players: LeaderboardEntry[];
  onStartGame: () => void;
  onAddBots: (count: number) => void;
  isStarting?: boolean;
}

export const HostLobby: React.FC<HostLobbyProps> = ({
  room,
  players,
  onStartGame,
  onAddBots,
  isStarting = false
}) => {
  const [copied, setCopied] = useState(false);
  const themeStyle = THEME_STYLES[room.theme];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(room.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center justify-center gap-3">
          <Sparkles className="w-8 h-8 text-amber-400" />
          AI ESCAPE ROOM HOST LOBBY
        </h1>
        <p className="text-slate-400 text-sm">Share the room code with participants. The game begins when you click Start.</p>
      </div>

      {/* Room Code Card */}
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-6 text-center space-y-3 shadow-xl">
        <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">ROOM CODE</span>
        <div className="flex items-center justify-center gap-4">
          <div className="font-mono text-5xl sm:text-6xl font-black tracking-widest text-amber-400 bg-slate-950 px-6 py-3 rounded-xl border border-slate-800 shadow-inner">
            {room.code}
          </div>
          <button
            onClick={handleCopyCode}
            className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-slate-200 transition-colors"
            title="Copy Code"
          >
            {copied ? <Check className="w-6 h-6 text-teal-400" /> : <Copy className="w-6 h-6" />}
          </button>
        </div>
        <p className="text-xs text-slate-400">Players join using: ROOM CODE ({room.code}) + PLAYER NAME</p>
      </div>

      {/* Room Config Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <span className="block text-xs text-slate-400">THEME</span>
          <span className="font-bold text-sm text-white flex items-center gap-1 mt-0.5">
            {themeStyle.icon} {themeStyle.name}
          </span>
        </div>
        <div>
          <span className="block text-xs text-slate-400">DIFFICULTY</span>
          <span className="font-bold text-sm text-indigo-400 mt-0.5">{room.difficulty}</span>
        </div>
        <div>
          <span className="block text-xs text-slate-400">STORIES</span>
          <span className="font-bold text-sm text-teal-400 mt-0.5">{room.storiesCount} Stories</span>
        </div>
        <div>
          <span className="block text-xs text-slate-400">TIME LIMIT</span>
          <span className="font-bold text-sm text-amber-400 mt-0.5">{room.timePerStorySeconds}s / Story</span>
        </div>
      </div>

      {/* Player List Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-400" />
            <h3 className="font-bold text-white text-lg">PLAYERS IN LOBBY</h3>
          </div>
          <span className="text-xs font-mono font-semibold px-3 py-1 bg-slate-950 rounded-lg text-teal-400 border border-slate-800">
            {players.length} / {room.maxPlayers} PLAYERS
          </span>
        </div>

        {/* Player Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-60 overflow-y-auto p-1">
          {players.map((p) => (
            <div
              key={p.playerId}
              className="flex items-center gap-2 bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800/80 text-sm"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
              <span className="font-medium text-slate-200 truncate">{p.name}</span>
            </div>
          ))}
        </div>

        {/* Demo Bot Add Control */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
          <span className="text-xs text-slate-400">Demo Simulation: Test with multi-player scaling</span>
          <button
            onClick={() => onAddBots(20)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Bot className="w-3.5 h-3.5 text-purple-400" /> Add 20 Test Players
          </button>
        </div>
      </div>

      {/* Start Game Action */}
      <div className="pt-2">
        <button
          onClick={onStartGame}
          disabled={isStarting || players.length === 0}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-500 via-teal-600 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white font-extrabold text-lg shadow-xl shadow-teal-900/40 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          <Play className="w-6 h-6 fill-current" />
          {isStarting ? 'STARTING COUNTDOWN...' : 'START GAME NOW'}
        </button>
      </div>
    </div>
  );
};
