import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  Room,
  Player,
  StoryConfig,
  PlayerStoryState,
  LeaderboardEntry,
  RoomStats,
  ThemeType,
  DifficultyLevel
} from './types/game';

import { Header } from './components/Header';
import { CreateRoomModal } from './components/CreateRoomModal';
import { JoinRoomForm } from './components/JoinRoomForm';
import { HostLobby } from './components/HostLobby';
import { PlayerLobby } from './components/PlayerLobby';
import { CountdownOverlay } from './components/CountdownOverlay';
import { GameInterface } from './components/GameInterface';
import { StoryTransition } from './components/StoryTransition';
import { VictoryPodium } from './components/VictoryPodium';
import { Sparkles, Users, KeyRound, Play, Shield, Award } from 'lucide-react';

type AppView =
  | 'LANDING'
  | 'CREATE_MODAL'
  | 'JOIN_FORM'
  | 'HOST_LOBBY'
  | 'PLAYER_LOBBY'
  | 'COUNTDOWN'
  | 'GAME_PLAYING'
  | 'STORY_TRANSITION'
  | 'VICTORY_PODIUM';

export default function App() {
  const [view, setView] = useState<AppView>('LANDING');
  const [room, setRoom] = useState<Room | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [sessionToken, setSessionToken] = useState<string>('');
  const [activeStory, setActiveStory] = useState<StoryConfig | null>(null);
  const [storyState, setStoryState] = useState<PlayerStoryState | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [stats, setStats] = useState<RoomStats>({
    fastestStoryTimes: [],
    highestScorePlayer: { name: 'N/A', score: 0 },
    averageCompletionTimeSeconds: 0,
    totalParticipants: 0
  });

  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(120);
  const [completedStoryTitle, setCompletedStoryTitle] = useState('');
  const [completedScore, setCompletedScore] = useState(0);
  const [completedSeconds, setCompletedSeconds] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const timerRef = useRef<any>(null);

  // Clear old session data on mount (one-time migration)
  useEffect(() => {
    const migrationKey = 'theme_migration_v1';
    if (!localStorage.getItem(migrationKey)) {
      localStorage.removeItem('escape_session_token');
      localStorage.setItem(migrationKey, 'done');
      console.log('Cleared old session data for theme migration');
    }
  }, []);

  // Initialize socket connection
  useEffect(() => {
    const socket = io(window.location.origin, {
      reconnectionAttempts: 5,
      timeout: 10000
    });
    socketRef.current = socket;

    socket.on('room:player_joined', (data) => {
      console.log('Player joined event:', data);
      if (room) {
        fetchRoomDetails(room.code);
      }
    });

    socket.on('game:countdown', () => {
      setView('COUNTDOWN');
    });

    socket.on('game:started', () => {
      fetchGameState();
    });

    socket.on('leaderboard:updated', ({ leaderboard: newLeaderboard }) => {
      setLeaderboard(newLeaderboard);
    });

    socket.on('game:completed', ({ leaderboard: finalLb, stats: finalStats }) => {
      setLeaderboard(finalLb);
      setStats(finalStats);
      setView('VICTORY_PODIUM');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Timer loop for active story deadline
  useEffect(() => {
    if (view === 'GAME_PLAYING' && storyState && storyState.deadline) {
      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        const remaining = Math.max(0, Math.round((storyState.deadline - Date.now()) / 1000));
        setTimeRemainingSeconds(remaining);

        if (remaining <= 0) {
          clearInterval(timerRef.current);
          fetchGameState(); // Auto refresh story on timeout
        }
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [view, storyState]);

  // Fetch Room Details
  const fetchRoomDetails = async (code: string) => {
    try {
      const token = sessionToken || localStorage.getItem('escape_session_token') || '';
      const res = await fetch(`/api/rooms/${code}?sessionToken=${token}`);
      const data = await res.json();
      if (res.ok) {
        setRoom(data.room);
        // Always fetch leaderboard when fetching room details
        await fetchLeaderboard(code);
      }
    } catch (err) {
      console.error('Error fetching room details:', err);
    }
  };

  // Fetch Leaderboard
  const fetchLeaderboard = async (code: string) => {
    try {
      const token = sessionToken || localStorage.getItem('escape_session_token') || '';
      const res = await fetch(`/api/rooms/${code}/leaderboard?sessionToken=${token}`);
      const data = await res.json();
      if (res.ok) {
        console.log('Leaderboard fetched:', data.leaderboard);
        setLeaderboard(data.leaderboard || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    }
  };

  // Fetch Game State (for playing/reconnecting)
  const fetchGameState = async () => {
    const token = sessionToken || localStorage.getItem('escape_session_token') || '';
    if (!token) return;

    try {
      const res = await fetch(`/api/games/state?sessionToken=${token}`);
      const data = await res.json();
      if (res.ok) {
        setPlayer(data.player);
        setActiveStory(data.story);
        setStoryState(data.storyState);
        setLeaderboard(data.leaderboard || []);
        setView('GAME_PLAYING');
      }
    } catch (err) {
      console.error('Error fetching game state:', err);
    }
  };

  // Create Room Handler
  const handleCreateRoom = async (params: {
    hostName: string;
    theme: ThemeType;
    difficulty: DifficultyLevel;
    storiesCount: number;
    timePerStorySeconds: number;
    maxPlayers: number;
  }) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create room.');

      setRoom(data.room);
      setPlayer(data.player);
      setSessionToken(data.sessionToken);
      localStorage.setItem('escape_session_token', data.sessionToken);

      if (socketRef.current) {
        socketRef.current.emit('room:join_socket', {
          roomCode: data.room.code,
          sessionToken: data.sessionToken
        });
      }

      // Fetch leaderboard immediately
      await fetchLeaderboard(data.room.code);
      setView('HOST_LOBBY');
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Join Room Handler
  const handleJoinRoom = async (code: string, playerName: string) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/rooms/${code}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to join room.');

      setRoom(data.room);
      setPlayer(data.player);
      setSessionToken(data.sessionToken);
      localStorage.setItem('escape_session_token', data.sessionToken);

      if (socketRef.current) {
        socketRef.current.emit('room:join_socket', {
          roomCode: data.room.code,
          sessionToken: data.sessionToken
        });
      }

      // Fetch leaderboard immediately
      await fetchLeaderboard(data.room.code);

      if (data.room.status === 'PLAYING') {
        fetchGameState();
      } else {
        setView('PLAYER_LOBBY');
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Start Game Handler (Host)
  const handleStartGame = async () => {
    if (!room || !sessionToken) return;

    try {
      const res = await fetch(`/api/rooms/${room.code}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionToken })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to start game.');
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  // Submit Prompt Handler
  const handleSubmitPrompt = async (promptText: string) => {
    if (!sessionToken) return;

    try {
      const res = await fetch('/api/games/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionToken, prompt: promptText })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error processing prompt.');

      setPlayer(data.player);
      setStoryState(data.storyState);
      if (data.leaderboard) setLeaderboard(data.leaderboard);

      if (data.isStoryCompleted) {
        setCompletedStoryTitle(activeStory?.title || 'Story');
        setCompletedScore(data.storyState.score);
        setCompletedSeconds(data.storyState.completionSeconds);

        if (data.isGameCompleted) {
          fetchLeaderboard(room ? room.code : '');
          setView('VICTORY_PODIUM');
        } else {
          setView('STORY_TRANSITION');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  // Add Demo Bots Handler
  const handleAddBots = async (count: number) => {
    if (!room) return;
    try {
      await fetch(`/api/rooms/${room.code}/add-bots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count })
      });
      await fetchLeaderboard(room.code);
    } catch (err) {
      console.error('Error adding bots:', err);
    }
  };

  // Exit/Leave Room Handler
  const handleExitRoom = () => {
    if (socketRef.current && room) {
      socketRef.current.emit('room:leave', { 
        roomCode: room.code, 
        sessionToken 
      });
    }
    
    // Clear local state
    setRoom(null);
    setPlayer(null);
    setActiveStory(null);
    setStoryState(null);
    setLeaderboard([]);
    setSessionToken('');
    localStorage.removeItem('escape_session_token');
    
    // Return to landing
    setView('LANDING');
  };

  const currentRankEntry = leaderboard.find((l) => l.playerId === player?.id);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30">
      {/* Global Header */}
      <Header
        roomCode={room?.code}
        theme={(room?.theme as ThemeType) || 'SCHOOL_DAY'}
        storyIndex={player ? player.currentStoryIndex + 1 : 1}
        totalStories={room?.storiesCount || 3}
        timeRemainingSeconds={view === 'GAME_PLAYING' ? timeRemainingSeconds : undefined}
        playerRank={currentRankEntry}
        totalPlayersCount={leaderboard.length || 1}
        playerName={player?.name}
      />

      {/* Main Container */}
      <main className="flex-1 flex flex-col justify-center p-3 sm:p-6 max-w-7xl w-full mx-auto">
        {/* Error Notification */}
        {errorMsg && (
          <div className="mb-4 p-4 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-sm flex items-center justify-between shadow-lg">
            <span>{errorMsg}</span>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-xs font-bold text-red-400 hover:text-white underline ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* VIEW 1: LANDING */}
        {view === 'LANDING' && (
          <div className="max-w-2xl mx-auto text-center space-y-8 my-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 px-4 py-1.5 rounded-full text-blue-400 font-mono text-xs font-bold uppercase tracking-widest shadow-lg">
              <Sparkles className="w-4 h-4" /> FUN LEARNING GAME FOR KIDS
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
                SOLVE PUZZLES. <br />
                <span className="bg-gradient-to-r from-blue-400 via-green-300 to-purple-400 bg-clip-text text-transparent">
                  HELP OTHERS. BE A HERO!
                </span>
              </h1>
              <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
                Talk to friendly characters and solve fun problems! Perfect for kids to learn problem-solving while having fun with friends!
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left max-w-xl mx-auto">
              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
                <span className="text-xl">🎒</span>
                <div className="font-bold text-xs text-white mt-1">School Day</div>
                <div className="text-[10px] text-slate-400">Classroom Fun</div>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
                <span className="text-xl">🐶</span>
                <div className="font-bold text-xs text-green-400 mt-1">Pet Rescue</div>
                <div className="text-[10px] text-slate-400">Help Animals</div>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
                <span className="text-xl">🏴‍☠️</span>
                <div className="font-bold text-xs text-orange-400 mt-1">Treasure Hunt</div>
                <div className="text-[10px] text-slate-400">Find Secrets</div>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
                <span className="text-xl">🦸</span>
                <div className="font-bold text-xs text-purple-400 mt-1">Superhero</div>
                <div className="text-[10px] text-slate-400">Save the Day</div>
              </div>
            </div>

            {/* Action Options */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => setView('CREATE_MODAL')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-black text-base shadow-xl shadow-blue-900/30 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" /> CREATE ROOM (START GAME)
              </button>

              <button
                onClick={() => setView('JOIN_FORM')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <KeyRound className="w-5 h-5 text-green-400" /> JOIN ROOM (PLAY WITH FRIENDS)
              </button>
            </div>
          </div>
        )}

        {/* VIEW 2: CREATE ROOM MODAL */}
        {view === 'CREATE_MODAL' && (
          <CreateRoomModal
            onCreateRoom={handleCreateRoom}
            onCancel={() => setView('LANDING')}
            isLoading={isLoading}
          />
        )}

        {/* VIEW 3: JOIN ROOM FORM */}
        {view === 'JOIN_FORM' && (
          <div className="flex justify-center">
            <JoinRoomForm onJoinRoom={handleJoinRoom} isLoading={isLoading} />
          </div>
        )}

        {/* VIEW 4: HOST LOBBY */}
        {view === 'HOST_LOBBY' && room && (
          <HostLobby
            room={room}
            players={leaderboard}
            onStartGame={handleStartGame}
            onAddBots={handleAddBots}
            onExitRoom={handleExitRoom}
          />
        )}

        {/* VIEW 5: PLAYER LOBBY */}
        {view === 'PLAYER_LOBBY' && room && player && (
          <PlayerLobby
            room={room}
            playerName={player.name}
            totalPlayersCount={leaderboard.length}
            onExitRoom={handleExitRoom}
          />
        )}

        {/* VIEW 6: COUNTDOWN OVERLAY */}
        {view === 'COUNTDOWN' && (
          <CountdownOverlay onComplete={() => fetchGameState()} />
        )}

        {/* VIEW 7: GAME PLAYING INTERFACE */}
        {view === 'GAME_PLAYING' && activeStory && storyState && player && (
          <GameInterface
            story={activeStory}
            storyState={storyState}
            player={player}
            leaderboard={leaderboard}
            totalPlayersCount={leaderboard.length}
            theme={room?.theme || 'SCHOOL_DAY'}
            onSubmitPrompt={handleSubmitPrompt}
            onExitRoom={handleExitRoom}
          />
        )}

        {/* VIEW 8: STORY TRANSITION */}
        {view === 'STORY_TRANSITION' && (
          <StoryTransition
            completedStoryTitle={completedStoryTitle}
            scoreEarned={completedScore}
            completionSeconds={completedSeconds}
            onNext={() => fetchGameState()}
          />
        )}

        {/* VIEW 9: VICTORY PODIUM */}
        {view === 'VICTORY_PODIUM' && (
          <VictoryPodium
            leaderboard={leaderboard}
            stats={stats}
            onPlayAgain={() => {
              setRoom(null);
              setPlayer(null);
              setView('LANDING');
            }}
          />
        )}
      </main>

      {/* Global Footer */}
      <footer className="py-4 border-t border-slate-900 text-center text-xs text-slate-500 font-mono">
        Kids Learning Game • Talk to Characters • Solve Fun Problems • Play with Friends
      </footer>
    </div>
  );
}
