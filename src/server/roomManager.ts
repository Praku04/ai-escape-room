import {
  Room,
  Player,
  PlayerStoryState,
  ThemeType,
  DifficultyLevel,
  LeaderboardEntry,
  RoomStats,
  JudgeResult,
  StoryConfig
} from '../types/game';
import { StoryGenerator } from '../game-engine/storyGenerator';
import { ScoringEngine } from '../game-engine/scoring';
import { AIFactory } from '../game-engine/aiProvider';

export class RoomManager {
  private rooms: Map<string, Room> = new Map(); // Key: code
  private players: Map<string, Player> = new Map(); // Key: sessionToken
  private playerStoryStates: Map<string, PlayerStoryState[]> = new Map(); // Key: sessionToken -> Array of StoryStates

  /**
   * Generates a 5-character alphanumeric room code.
   */
  private generateRoomCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    do {
      code = '';
      for (let i = 0; i < 5; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    } while (this.rooms.has(code));
    return code;
  }

  /**
   * Generates a unique token.
   */
  private generateToken(): string {
    return 'token_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  /**
   * Creates a new room.
   */
  public createRoom(
    hostName: string,
    theme: ThemeType = 'MYSTERY',
    difficulty: DifficultyLevel = 'MEDIUM',
    storiesCount: number = 3,
    timePerStorySeconds: number = 120,
    maxPlayers: number = 500
  ): { room: Room; hostPlayer: Player } {
    const code = this.generateRoomCode();
    const roomId = 'room_' + Date.now().toString(36);
    const hostToken = this.generateToken();
    const hostPlayerId = 'p_host_' + Date.now().toString(36);

    const stories = StoryGenerator.generateStories(theme, difficulty, storiesCount, timePerStorySeconds);

    const hostPlayer: Player = {
      id: hostPlayerId,
      roomId,
      name: hostName.trim() || 'Host',
      sessionToken: hostToken,
      isHost: true,
      connected: true,
      currentStoryIndex: 0,
      totalScore: 0,
      totalTimeSeconds: 0,
      completedStoriesCount: 0
    };

    const room: Room = {
      id: roomId,
      code,
      hostId: hostPlayerId,
      status: 'WAITING',
      maxPlayers,
      theme,
      difficulty,
      storiesCount,
      timePerStorySeconds,
      createdAt: Date.now(),
      stories
    };

    this.rooms.set(code, room);
    this.players.set(hostToken, hostPlayer);
    this.playerStoryStates.set(hostToken, []);

    return { room, hostPlayer };
  }

  /**
   * Finds room by code.
   */
  public getRoom(code: string): Room | undefined {
    return this.rooms.get(code.toUpperCase().trim());
  }

  /**
   * Finds player by token.
   */
  public getPlayerByToken(token: string): Player | undefined {
    return this.players.get(token);
  }

  /**
   * Gets all players in a room.
   */
  public getRoomPlayers(roomId: string): Player[] {
    const result: Player[] = [];
    for (const player of this.players.values()) {
      if (player.roomId === roomId) {
        result.push(player);
      }
    }
    return result;
  }

  /**
   * Joins an existing room.
   */
  public joinRoom(
    code: string,
    playerName: string
  ): { room: Room; player: Player } | { error: string } {
    const cleanCode = code.toUpperCase().trim();
    const room = this.rooms.get(cleanCode);

    if (!room) {
      return { error: 'Room not found. Please check the code.' };
    }

    if (room.status === 'COMPLETED' || room.status === 'ENDED') {
      return { error: 'Game has already ended.' };
    }

    const currentPlayers = this.getRoomPlayers(room.id);
    if (currentPlayers.length >= room.maxPlayers) {
      return { error: `Room is full (max ${room.maxPlayers} players).` };
    }

    // Check for duplicate player name
    const existingName = currentPlayers.find(
      (p) => p.name.toLowerCase() === playerName.toLowerCase().trim()
    );
    if (existingName) {
      // Return existing player session if disconnected or reconnecting
      return { room, player: existingName };
    }

    const sessionToken = this.generateToken();
    const player: Player = {
      id: 'p_' + Math.random().toString(36).substring(2) + Date.now().toString(36),
      roomId: room.id,
      name: playerName.trim(),
      sessionToken,
      isHost: false,
      connected: true,
      currentStoryIndex: 0,
      totalScore: 0,
      totalTimeSeconds: 0,
      completedStoriesCount: 0
    };

    this.players.set(sessionToken, player);
    this.playerStoryStates.set(sessionToken, []);

    return { room, player };
  }

  /**
   * Starts game for all players in a room.
   */
  public startGame(
    code: string,
    hostSessionToken: string
  ): { room: Room; players: Player[] } | { error: string } {
    const host = this.players.get(hostSessionToken);
    const room = this.rooms.get(code.toUpperCase().trim());

    if (!room || !host || room.hostId !== host.id) {
      return { error: 'Unauthorized: Only the room host can start the game.' };
    }

    room.status = 'STARTING';
    room.startedAt = Date.now();

    const roomPlayers = this.getRoomPlayers(room.id);
    const now = Date.now();

    // Initialize story state for each player
    for (const p of roomPlayers) {
      p.currentStoryIndex = 0;
      p.totalScore = 0;
      p.totalTimeSeconds = 0;
      p.completedStoriesCount = 0;

      const firstStory = room.stories[0];
      const deadline = now + firstStory.timeLimitSeconds * 1000;

      const initialStates: PlayerStoryState[] = room.stories.map((s, idx) => ({
        storyId: s.id,
        startedAt: idx === 0 ? now : 0,
        deadline: idx === 0 ? deadline : 0,
        status: idx === 0 ? 'IN_PROGRESS' : 'NOT_STARTED',
        score: 0,
        completionSeconds: 0,
        attempts: 0,
        conversation: [
          {
            id: 'opening_' + idx,
            role: 'assistant',
            content: `${s.character.avatar} ${s.character.name}: "${s.openingMessage}"`,
            timestamp: now
          }
        ],
        discoveredFacts: []
      }));

      this.playerStoryStates.set(p.sessionToken, initialStates);
    }

    room.status = 'PLAYING';
    return { room, players: roomPlayers };
  }

  /**
   * Gets current active story state for a player.
   */
  public getPlayerCurrentStoryState(
    sessionToken: string
  ): { story: StoryConfig; storyState: PlayerStoryState } | null {
    const player = this.players.get(sessionToken);
    if (!player) return null;

    const room = Array.from(this.rooms.values()).find((r) => r.id === player.roomId);
    if (!room || !room.stories[player.currentStoryIndex]) return null;

    const states = this.playerStoryStates.get(sessionToken);
    if (!states || !states[player.currentStoryIndex]) return null;

    return {
      story: room.stories[player.currentStoryIndex],
      storyState: states[player.currentStoryIndex]
    };
  }

  /**
   * Submits a natural-language prompt for AI evaluation.
   */
  public async submitPrompt(
    sessionToken: string,
    promptText: string
  ): Promise<{
    result: JudgeResult;
    player: Player;
    storyState: PlayerStoryState;
    isStoryCompleted: boolean;
    isGameCompleted: boolean;
    leaderboard: LeaderboardEntry[];
  } | { error: string }> {
    const player = this.players.get(sessionToken);
    if (!player) return { error: 'Invalid player session.' };

    const room = Array.from(this.rooms.values()).find((r) => r.id === player.roomId);
    if (!room) return { error: 'Room not found.' };

    const states = this.playerStoryStates.get(sessionToken);
    if (!states || !states[player.currentStoryIndex]) return { error: 'No active story found.' };

    const currentStory = room.stories[player.currentStoryIndex];
    const currentState = states[player.currentStoryIndex];

    const now = Date.now();

    // Check if story timer expired
    if (currentState.status === 'IN_PROGRESS' && now > currentState.deadline) {
      currentState.status = 'TIMED_OUT';
      // Automatically advance if there are remaining stories
      if (player.currentStoryIndex + 1 < room.stories.length) {
        player.currentStoryIndex++;
        const nextStory = room.stories[player.currentStoryIndex];
        states[player.currentStoryIndex] = {
          storyId: nextStory.id,
          startedAt: now,
          deadline: now + nextStory.timeLimitSeconds * 1000,
          status: 'IN_PROGRESS',
          score: 0,
          completionSeconds: 0,
          attempts: 0,
          conversation: [
            {
              id: 'opening_' + player.currentStoryIndex,
              role: 'assistant',
              content: `${nextStory.character.avatar} ${nextStory.character.name}: "${nextStory.openingMessage}"`,
              timestamp: now
            }
          ],
          discoveredFacts: []
        };
      }
      return { error: 'Story time limit expired! Advancing to next story.' };
    }

    if (currentState.status !== 'IN_PROGRESS') {
      return { error: 'Story is not in progress.' };
    }

    currentState.attempts++;

    // Add user message to state
    currentState.conversation.push({
      id: 'msg_u_' + Date.now().toString(36),
      role: 'user',
      content: promptText,
      timestamp: now
    });

    // Evaluate prompt using AI Provider
    const aiProvider = AIFactory.getProvider();
    const evaluation = await aiProvider.evaluatePrompt(
      currentStory,
      currentState.conversation,
      promptText
    );

    // Add AI response to conversation
    currentState.conversation.push({
      id: 'msg_a_' + Date.now().toString(36),
      role: 'assistant',
      content: evaluation.response,
      timestamp: Date.now(),
      isSuccess: evaluation.success
    });

    // Track newly discovered facts
    if (evaluation.discoveredFacts && evaluation.discoveredFacts.length > 0) {
      for (const fact of evaluation.discoveredFacts) {
        if (!currentState.discoveredFacts.includes(fact)) {
          currentState.discoveredFacts.push(fact);
        }
      }
    }

    let isStoryCompleted = false;
    let isGameCompleted = false;

    if (evaluation.success) {
      isStoryCompleted = true;
      currentState.status = 'COMPLETED';
      currentState.completedAt = Date.now();

      const elapsedSeconds = Math.max(1, Math.round((currentState.completedAt - currentState.startedAt) / 1000));
      currentState.completionSeconds = elapsedSeconds;

      const scoreEarned = ScoringEngine.calculateStoryScore(currentStory.timeLimitSeconds, elapsedSeconds);
      currentState.score = scoreEarned;

      player.totalScore += scoreEarned;
      player.totalTimeSeconds += elapsedSeconds;
      player.completedStoriesCount++;

      // Advance to next story or finish game
      if (player.currentStoryIndex + 1 < room.stories.length) {
        player.currentStoryIndex++;
        const nextStory = room.stories[player.currentStoryIndex];
        const nextStartTime = Date.now();
        states[player.currentStoryIndex] = {
          storyId: nextStory.id,
          startedAt: nextStartTime,
          deadline: nextStartTime + nextStory.timeLimitSeconds * 1000,
          status: 'IN_PROGRESS',
          score: 0,
          completionSeconds: 0,
          attempts: 0,
          conversation: [
            {
              id: 'opening_' + player.currentStoryIndex,
              role: 'assistant',
              content: `${nextStory.character.avatar} ${nextStory.character.name}: "${nextStory.openingMessage}"`,
              timestamp: nextStartTime
            }
          ],
          discoveredFacts: []
        };
      } else {
        isGameCompleted = true;
      }
    }

    const leaderboard = this.getLeaderboard(room.code, player.id);

    return {
      result: evaluation,
      player,
      storyState: currentState,
      isStoryCompleted,
      isGameCompleted,
      leaderboard
    };
  }

  /**
   * Returns leaderboard sorted by total score desc, total time asc.
   */
  public getLeaderboard(code: string, currentUserId?: string): LeaderboardEntry[] {
    const room = this.rooms.get(code.toUpperCase().trim());
    if (!room) return [];

    const roomPlayers = this.getRoomPlayers(room.id);

    const sorted = [...roomPlayers].sort((a, b) => {
      if (b.totalScore !== a.totalScore) {
        return b.totalScore - a.totalScore;
      }
      if (a.totalTimeSeconds !== b.totalTimeSeconds) {
        return a.totalTimeSeconds - b.totalTimeSeconds;
      }
      return b.completedStoriesCount - a.completedStoriesCount;
    });

    return sorted.map((p, idx) => {
      const states = this.playerStoryStates.get(p.sessionToken) || [];
      const times = states.map((s) => s.completionSeconds);
      return {
        playerId: p.id,
        name: p.name,
        rank: idx + 1,
        totalScore: p.totalScore,
        totalTimeSeconds: p.totalTimeSeconds,
        completedStories: p.completedStoriesCount,
        currentStoryIndex: p.currentStoryIndex,
        isCurrentUser: p.id === currentUserId,
        storyCompletionTimes: times
      };
    });
  }

  /**
   * Generates room statistics for victory podium.
   */
  public getRoomStats(code: string): RoomStats {
    const room = this.rooms.get(code.toUpperCase().trim());
    if (!room) {
      return {
        fastestStoryTimes: [],
        highestScorePlayer: { name: 'N/A', score: 0 },
        averageCompletionTimeSeconds: 0,
        totalParticipants: 0
      };
    }

    const players = this.getRoomPlayers(room.id);
    const leaderboard = this.getLeaderboard(code);

    const fastestStoryTimes: Array<{ storyIndex: number; storyTitle: string; playerName: string; timeSeconds: number }> = [];

    room.stories.forEach((story, idx) => {
      let fastestPlayer = '';
      let minTime = Infinity;

      players.forEach((p) => {
        const states = this.playerStoryStates.get(p.sessionToken);
        if (states && states[idx] && states[idx].status === 'COMPLETED') {
          if (states[idx].completionSeconds < minTime) {
            minTime = states[idx].completionSeconds;
            fastestPlayer = p.name;
          }
        }
      });

      if (fastestPlayer && minTime !== Infinity) {
        fastestStoryTimes.push({
          storyIndex: idx + 1,
          storyTitle: story.title,
          playerName: fastestPlayer,
          timeSeconds: minTime
        });
      }
    });

    const topPlayer = leaderboard[0];
    const totalTimes = players.reduce((acc, p) => acc + p.totalTimeSeconds, 0);
    const avgTime = players.length > 0 ? Math.round(totalTimes / players.length) : 0;

    return {
      fastestStoryTimes,
      highestScorePlayer: {
        name: topPlayer ? topPlayer.name : 'None',
        score: topPlayer ? topPlayer.totalScore : 0
      },
      averageCompletionTimeSeconds: avgTime,
      totalParticipants: players.length
    };
  }

  /**
   * Stress-testing / demo feature: Generates mock bot players to demonstrate 10-500 participant scaling.
   */
  public addTestBots(code: string, count: number = 20): Player[] {
    const room = this.rooms.get(code.toUpperCase().trim());
    if (!room) return [];

    const names = [
      'Priya', 'Anshika', 'Aman', 'Rahul', 'Neha', 'Rohan', 'Kavya', 'Arjun',
      'Siddharth', 'Divya', 'Vikram', 'MeERA', 'Aditya', 'Pooja', 'Karan', 'Isha',
      'Gaurav', 'Riya', 'Sanjay', 'Tanvi', 'Manish', 'Simran', 'Akash', 'Shruti',
      'Nikhil', 'Sneha', 'Aakash', 'Komal', 'Deepak', 'Tarun', 'Swati', 'Harsh'
    ];

    const added: Player[] = [];
    const now = Date.now();

    for (let i = 0; i < count; i++) {
      if (this.getRoomPlayers(room.id).length >= room.maxPlayers) break;

      const randomName = names[i % names.length] + (i >= names.length ? `_${Math.floor(i / names.length)}` : '');
      const token = this.generateToken();
      const botId = 'p_bot_' + Math.random().toString(36).substring(2);

      const completedCount = Math.floor(Math.random() * (room.storiesCount + 1));
      let totalScore = 0;
      let totalTime = 0;

      const botStates: PlayerStoryState[] = room.stories.map((s, sIdx) => {
        const isCompleted = sIdx < completedCount;
        const timeSpent = isCompleted ? Math.floor(Math.random() * 80) + 15 : 0;
        const score = isCompleted ? ScoringEngine.calculateStoryScore(s.timeLimitSeconds, timeSpent) : 0;

        if (isCompleted) {
          totalScore += score;
          totalTime += timeSpent;
        }

        return {
          storyId: s.id,
          startedAt: now,
          deadline: now + s.timeLimitSeconds * 1000,
          status: isCompleted ? 'COMPLETED' : sIdx === completedCount ? 'IN_PROGRESS' : 'NOT_STARTED',
          score,
          completionSeconds: timeSpent,
          attempts: isCompleted ? Math.floor(Math.random() * 4) + 1 : 0,
          conversation: [],
          discoveredFacts: ['Bot test clue']
        };
      });

      const player: Player = {
        id: botId,
        roomId: room.id,
        name: randomName,
        sessionToken: token,
        isHost: false,
        connected: true,
        currentStoryIndex: Math.min(completedCount, room.storiesCount - 1),
        totalScore,
        totalTimeSeconds: totalTime,
        completedStoriesCount: completedCount
      };

      this.players.set(token, player);
      this.playerStoryStates.set(token, botStates);
      added.push(player);
    }

    return added;
  }
}
