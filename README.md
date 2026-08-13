# 🧩 AI ESCAPE ROOM — Competitive Multiplayer Prompt Engineering Platform

AI ESCAPE ROOM is a production-ready, highly scalable multiplayer puzzle platform designed for **400–500 simultaneous participants** in competitive rooms.

Unlike static multiple-choice quizzes, players are immersed in interactive AI narrative scenarios. They must use strategic natural-language prompting to negotiate, investigate, and outsmart AI characters and AI systems under a 120-second countdown.

---

## 🌟 Core Features & Capabilities

- **4 Dynamic Themes**:
  - ✈️ **Real World**: Crisis negotiation (Missed flight, Hotel cancellation, High-value package, Insurance claims, Enterprise billing).
  - 🕵️ **The Mystery Files**: Noir detective cases (The Missing Painting, Vanished Witness, Final Suspect, Museum Vault, Poisoned Legacy).
  - 🤖 **Neural Break**: Futuristic cyberpunk (Locked Terminal, Corrupted Memory, Sentry Vault, Rogue Self-Destruct, Cranial BIOS).
  - 🏰 **The Curse of Avaloria**: Fantasy RPG (Forbidden Library, Dragon's Bargain, Runegate Vault, Enchanted Tome, Spectral Sentinel).
- **Theme-Adaptive Visual Engine**: Dynamic UI themes with specialized color palettes, typography, status badges, and terminal styling.
- **Provider-Agnostic AI Architecture**: Supports Gemini (`@google/genai`), OpenAI (`gpt-4o-mini`), and built-in Mock AI Engine (deterministic, zero API key required).
- **Server-Authoritative Game Master & Judge**: Structured JSON evaluation, semantic understanding, prompt injection defense, and speed-bonus scoring.
- **Real-Time WebSockets & Live Leaderboard**: Real-time rank changes across up to 500 concurrent players with Socket.IO.
- **Victory Podium & Detailed Analytics**: 🥇 🥈 🥉 celebration podium with fastest story solver awards, average completion times, and full result export.

---

## 🚀 Quick Start (Docker Compose)

The easiest way to run AI ESCAPE ROOM locally with PostgreSQL and Redis:

```bash
docker compose up --build
```

Access the web app at:
👉 **`http://localhost:3000`**

---

## 🛠️ Environment Variables

Create or edit `.env`:

```env
NODE_ENV=development
PORT=3000

# Database & Cache
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ai_escape_room
REDIS_URL=redis://localhost:6379

# AI Provider Configuration (gemini, openai, mock)
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=

# Game Defaults
MAX_PLAYERS_PER_ROOM=500
DEFAULT_STORIES=3
DEFAULT_STORY_TIME_SECONDS=120
DEFAULT_DIFFICULTY=medium
```

*Note: If `GEMINI_API_KEY` is omitted or unset, the system automatically falls back to `MockAIProvider` so gameplay works immediately!*

---

## 📁 Architecture & Directory Structure

```text
ai-escape-room/
├── server.ts                    # Main Express + Socket.IO server & Vite middleware
├── prisma/
│   └── schema.prisma            # PostgreSQL Prisma schema
├── src/
│   ├── types/
│   │   └── game.ts              # Domain interfaces & theme definitions
│   ├── game-engine/
│   │   ├── aiProvider.ts        # Gemini / OpenAI / Mock provider adapter
│   │   ├── promptDefense.ts     # Injection detection & system prompt safeguard
│   │   ├── scoring.ts           # Speed bonus & score engine
│   │   ├── storyGenerator.ts    # Story sequence & difficulty generator
│   │   └── storyTemplates.ts    # 20+ Seed story templates across 4 themes
│   ├── server/
│   │   └── roomManager.ts       # Room state, player sessions, leaderboard engine
│   ├── components/              # React UI views & theme components
│   ├── App.tsx                  # Main client router & state controller
│   └── index.css                # Tailwind CSS v4 setup
├── docker-compose.yml
├── Dockerfile
├── package.json
└── README.md
```

---

## ⚡ Scaling to 500 Simultaneous Players

To handle 500 concurrent users seamlessly per room:
1. **Stateless Web Nodes**: Server state can be mirrored to Redis using the Socket.IO Redis Adapter.
2. **PostgreSQL Connection Pooling**: Database operations are queued with connection pooling.
3. **In-Memory Cache**: Active room state and conversation streams are held in memory with fast diffing.
4. **Rate Limiting**: Prompts are capped per player per 5-second window to prevent flooding.

---

## 🧪 Testing & Stress-Testing

To test 500-player concurrency:
1. Create a room as Host.
2. Open the Host Lobby.
3. Click **"Add 20 Test Bots"** or **"Add 50 Test Bots"** in the Host Controls.
4. Watch the Live Leaderboard update with real-time rankings!
