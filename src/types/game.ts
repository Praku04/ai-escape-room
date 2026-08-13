export type ThemeType = 'REAL_WORLD' | 'MYSTERY' | 'NEURAL_BREAK' | 'AVALORIA';

export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD';

export type RoomStatus = 'WAITING' | 'STARTING' | 'PLAYING' | 'COMPLETED' | 'ENDED';

export type StoryStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'TIMED_OUT';

export interface CharacterInfo {
  name: string;
  role: string;
  avatar: string;
  personality: string;
}

export interface StoryConfig {
  id: string;
  theme: ThemeType;
  difficulty: DifficultyLevel;
  order: number;
  title: string;
  description: string;
  character: CharacterInfo;
  openingMessage: string;
  hiddenObjective?: string; // Private to server
  requiredFacts?: string[]; // Private to server
  successCriteria?: string[]; // Private to server
  timeLimitSeconds: number;
  clues?: string[];
}

export interface Player {
  id: string;
  roomId: string;
  name: string;
  sessionToken: string;
  isHost: boolean;
  connected: boolean;
  currentStoryIndex: number;
  totalScore: number;
  totalTimeSeconds: number;
  completedStoriesCount: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  isSuccess?: boolean;
}

export interface PlayerStoryState {
  storyId: string;
  startedAt: number;
  deadline: number;
  completedAt?: number;
  status: StoryStatus;
  score: number;
  completionSeconds: number;
  attempts: number;
  conversation: ChatMessage[];
  discoveredFacts: string[];
}

export interface Room {
  id: string;
  code: string;
  hostId: string;
  status: RoomStatus;
  maxPlayers: number;
  theme: ThemeType;
  difficulty: DifficultyLevel;
  storiesCount: number;
  timePerStorySeconds: number;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  stories: StoryConfig[];
}

export interface LeaderboardEntry {
  playerId: string;
  name: string;
  rank: number;
  totalScore: number;
  totalTimeSeconds: number;
  completedStories: number;
  currentStoryIndex: number;
  isCurrentUser?: boolean;
  storyCompletionTimes?: number[];
}

export interface JudgeResult {
  success: boolean;
  confidence: number;
  response: string;
  discoveredFacts: string[];
  reason: string;
  nextAction: 'CONTINUE' | 'UNLOCK_NEXT_STORY' | 'FAIL';
}

export interface RoomStats {
  fastestStoryTimes: Array<{ storyIndex: number; storyTitle: string; playerName: string; timeSeconds: number }>;
  highestScorePlayer: { name: string; score: number };
  averageCompletionTimeSeconds: number;
  totalParticipants: number;
}
