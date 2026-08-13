import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { RoomManager } from './src/server/roomManager';
import { StoryGenerator } from './src/game-engine/storyGenerator';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = 3000;
const roomManager = new RoomManager();

app.use(express.json());

// -------------------------------------------------------------
// REST API ENDPOINTS
// -------------------------------------------------------------

// POST /api/rooms - Create Room
app.post('/api/rooms', (req, res) => {
  try {
    const {
      hostName,
      theme = 'MYSTERY',
      difficulty = 'MEDIUM',
      storiesCount = 3,
      timePerStorySeconds = 120,
      maxPlayers = 500
    } = req.body;

    if (!hostName || typeof hostName !== 'string') {
      return res.status(400).json({ error: 'Host name is required.' });
    }

    const { room, hostPlayer } = roomManager.createRoom(
      hostName,
      theme,
      difficulty,
      Number(storiesCount) || 3,
      Number(timePerStorySeconds) || 120,
      Number(maxPlayers) || 500
    );

    // Sanitize stories for client
    const sanitizedRoom = {
      ...room,
      stories: room.stories.map(StoryGenerator.sanitizeStoryForClient)
    };

    return res.json({
      room: sanitizedRoom,
      player: hostPlayer,
      sessionToken: hostPlayer.sessionToken
    });
  } catch (err: any) {
    console.error('Error creating room:', err);
    return res.status(500).json({ error: 'Failed to create room.' });
  }
});

// GET /api/rooms/:code - Fetch Room Info
app.get('/api/rooms/:code', (req, res) => {
  const code = req.params.code;
  const room = roomManager.getRoom(code);

  if (!room) {
    return res.status(404).json({ error: 'Room not found.' });
  }

  const players = roomManager.getRoomPlayers(room.id);
  const sanitizedRoom = {
    ...room,
    stories: room.stories.map(StoryGenerator.sanitizeStoryForClient)
  };

  return res.json({
    room: sanitizedRoom,
    playersCount: players.length,
    players: players.map((p) => ({
      id: p.id,
      name: p.name,
      isHost: p.isHost,
      totalScore: p.totalScore,
      completedStoriesCount: p.completedStoriesCount
    }))
  });
});

// POST /api/rooms/:code/join - Join Room
app.post('/api/rooms/:code/join', (req, res) => {
  const code = req.params.code;
  const { playerName } = req.body;

  if (!playerName || typeof playerName !== 'string') {
    return res.status(400).json({ error: 'Player name is required.' });
  }

  const result = roomManager.joinRoom(code, playerName);
  if ('error' in result) {
    return res.status(400).json({ error: result.error });
  }

  const { room, player } = result;
  const sanitizedRoom = {
    ...room,
    stories: room.stories.map(StoryGenerator.sanitizeStoryForClient)
  };

  // Broadcast player joined to room via socket
  io.to(code.toUpperCase()).emit('room:player_joined', {
    player: { id: player.id, name: player.name, totalScore: player.totalScore },
    playersCount: roomManager.getRoomPlayers(room.id).length
  });

  return res.json({
    room: sanitizedRoom,
    player,
    sessionToken: player.sessionToken
  });
});

// POST /api/rooms/:code/start - Start Game (Host only)
app.post('/api/rooms/:code/start', (req, res) => {
  const code = req.params.code;
  const { sessionToken } = req.body;

  if (!sessionToken) {
    return res.status(401).json({ error: 'Session token required.' });
  }

  const result = roomManager.startGame(code, sessionToken);
  if ('error' in result) {
    return res.status(400).json({ error: result.error });
  }

  const { room } = result;

  // Broadcast countdown then game started
  io.to(code.toUpperCase()).emit('game:countdown', { countdownSeconds: 3 });

  setTimeout(() => {
    io.to(code.toUpperCase()).emit('game:started', {
      startedAt: room.startedAt,
      storiesCount: room.storiesCount
    });
  }, 3000);

  return res.json({ success: true, roomStatus: room.status });
});

// GET /api/rooms/:code/leaderboard
app.get('/api/rooms/:code/leaderboard', (req, res) => {
  const code = req.params.code;
  const sessionToken = req.query.sessionToken as string | undefined;

  let currentUserId: string | undefined;
  if (sessionToken) {
    const player = roomManager.getPlayerByToken(sessionToken);
    if (player) currentUserId = player.id;
  }

  const leaderboard = roomManager.getLeaderboard(code, currentUserId);
  const stats = roomManager.getRoomStats(code);

  return res.json({ leaderboard, stats });
});

// GET /api/games/state - Reconnect / Restore State
app.get('/api/games/state', (req, res) => {
  const sessionToken = req.query.sessionToken as string;
  if (!sessionToken) {
    return res.status(400).json({ error: 'Session token required.' });
  }

  const player = roomManager.getPlayerByToken(sessionToken);
  if (!player) {
    return res.status(404).json({ error: 'Player session not found.' });
  }

  const active = roomManager.getPlayerCurrentStoryState(sessionToken);
  if (!active) {
    return res.status(404).json({ error: 'No active game state found.' });
  }

  const room = roomManager.getRoom(player.roomId.replace('room_', ''));
  const leaderboard = roomManager.getLeaderboard(room ? room.code : '', player.id);

  return res.json({
    player,
    story: StoryGenerator.sanitizeStoryForClient(active.story),
    storyState: active.storyState,
    leaderboard
  });
});

// POST /api/games/prompt - Submit Prompt
app.post('/api/games/prompt', async (req, res) => {
  const { sessionToken, prompt } = req.body;

  if (!sessionToken || !prompt) {
    return res.status(400).json({ error: 'Session token and prompt text are required.' });
  }

  const response = await roomManager.submitPrompt(sessionToken, prompt);
  if ('error' in response) {
    return res.status(400).json({ error: response.error });
  }

  const { result, player, storyState, isStoryCompleted, isGameCompleted, leaderboard } = response;

  const roomCode = player.roomId.replace('room_', '');
  const room = roomManager.getRoom(roomCode);

  // Broadcast updated leaderboard to room
  if (room) {
    io.to(room.code.toUpperCase()).emit('leaderboard:updated', { leaderboard });

    if (isGameCompleted) {
      const stats = roomManager.getRoomStats(room.code);
      io.to(room.code.toUpperCase()).emit('game:completed', {
        leaderboard,
        stats
      });
    }
  }

  return res.json({
    result,
    player,
    storyState,
    isStoryCompleted,
    isGameCompleted,
    leaderboard
  });
});

// POST /api/rooms/:code/add-bots - Stress Test / Simulation Feature
app.post('/api/rooms/:code/add-bots', (req, res) => {
  const code = req.params.code;
  const count = Number(req.body.count) || 20;

  const bots = roomManager.addTestBots(code, count);
  const leaderboard = roomManager.getLeaderboard(code);

  io.to(code.toUpperCase()).emit('leaderboard:updated', { leaderboard });

  return res.json({ success: true, addedCount: bots.length, totalPlayers: leaderboard.length });
});

// -------------------------------------------------------------
// WEBSOCKET LOGIC
// -------------------------------------------------------------
io.on('connection', (socket) => {
  socket.on('room:join_socket', ({ roomCode, sessionToken }) => {
    const cleanCode = (roomCode || '').toUpperCase().trim();
    socket.join(cleanCode);

    if (sessionToken) {
      const player = roomManager.getPlayerByToken(sessionToken);
      if (player) {
        player.connected = true;
      }
    }
  });

  socket.on('disconnect', () => {
    // Socket disconnect handling
  });
});

// -------------------------------------------------------------
// VITE / STATIC SERVING
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`AI ESCAPE ROOM Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
