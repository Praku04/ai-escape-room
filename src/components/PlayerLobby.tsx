import React from 'react';
import { Room } from '../types/game';
import { THEME_STYLES } from './ThemeStyles';
import { Users, Clock, Loader2, LogOut } from 'lucide-react';

interface PlayerLobbyProps {
  room: Room;
  playerName: string;
  totalPlayersCount: number;
  onExitRoom?: () => void;
}

export const PlayerLobby: React.FC<PlayerLobbyProps> = ({
  room,
  playerName,
  totalPlayersCount,
  onExitRoom
}) => {
  const themeStyle = THEME_STYLES[room.theme];

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6 space-y-6 my-12">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 text-center space-y-6 shadow-2xl">
        {/* Room Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-slate-950 px-3 py-1 rounded-full border border-slate-800 text-xs font-mono font-bold text-amber-400">
            ROOM CODE: {room.code}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center justify-center gap-2">
            <span>{themeStyle.icon}</span> {themeStyle.name}
          </h2>
          <p className="text-xs text-slate-400">{themeStyle.subtitle}</p>
        </div>

        {/* Player Status Badge */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-semibold uppercase">YOU ARE REGISTERED AS</div>
          <div className="text-xl font-bold text-teal-400">{playerName}</div>
        </div>

        {/* Live Participants Count */}
        <div className="flex items-center justify-center gap-2 text-sm text-slate-300">
          <Users className="w-4 h-4 text-purple-400" />
          <span><strong className="text-white font-mono text-base">{totalPlayersCount}</strong> Players joined</span>
        </div>

        {/* Waiting Animation */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-center gap-2 text-amber-400 font-semibold text-sm">
            <Loader2 className="w-5 h-5 animate-spin" />
            Waiting for host to start...
          </div>
          <p className="text-xs text-slate-400">
            The game will begin synchronized for all players as soon as the host initiates the session.
          </p>
        </div>
        
        {/* Exit Button */}
        {onExitRoom && (
          <div className="pt-3 border-t border-slate-800">
            <button
              onClick={onExitRoom}
              className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-medium text-sm transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              LEAVE ROOM
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
