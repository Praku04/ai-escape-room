import React, { useState } from 'react';
import { ArrowRight, KeyRound, User, Sparkles } from 'lucide-react';

interface JoinRoomFormProps {
  onJoinRoom: (roomCode: string, playerName: string) => void;
  isLoading?: boolean;
}

export const JoinRoomForm: React.FC<JoinRoomFormProps> = ({
  onJoinRoom,
  isLoading = false
}) => {
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode.trim() || !playerName.trim()) return;

    onJoinRoom(roomCode.toUpperCase().trim(), playerName.trim());
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 mx-auto rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <KeyRound className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-white">JOIN ROOM</h2>
        <p className="text-xs text-slate-400">Enter your 5-character room code and player handle.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-amber-400" /> ROOM CODE
          </label>
          <input
            type="text"
            required
            maxLength={6}
            placeholder="e.g. X7K92"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-center text-xl font-mono font-bold tracking-widest text-amber-400 placeholder-slate-600 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-teal-400" /> YOUR NAME
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Anshika, Rahul"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-teal-400"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !roomCode.trim() || !playerName.trim()}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-teal-900/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? 'Connecting...' : 'JOIN ESCAPE ROOM'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
