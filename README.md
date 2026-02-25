# TTRPG Long-Term Goals

A campaign management tool for tabletop RPG Dungeon Masters, focused on **between-session downtime**. DMs create campaigns, invite players, and define investigation tracks that players can pursue during idle time between sessions.

## Concept

In many TTRPG campaigns, time passes between sessions. During this "downtime," players can investigate leads, research lore, or pursue personal goals. This app gives DMs a structured way to:

- Define **investigation tracks** with progress milestones
- Let players allocate idle time to tracks between sessions
- Track progress per player per track
- Manage **downtime phases** (open, allocate, resolve, close)

## Architecture

```
ttrpg-longtermgoals/
├── apps/
│   ├── api/          # Hono REST API (Node.js + esbuild)
│   └── web/          # React 19 SPA (Vite)
├── libs/
│   └── shared/       # Shared types, schemas, contracts
├── docs/             # ADRs, domain model, API routes, roadmap
└── docker-compose.yml
```

The monorepo is managed by **Nx** with **pnpm** as the package manager.

## Tech Stack

| Layer | Technology |
|---|---|
| **Monorepo** | Nx 22.5 + pnpm |
| **API** | Hono + @hono/node-server + esbuild |
| **Web** | React 19 + Vite 7 |
| **Database** | PostgreSQL 16 (Docker Compose) |
| **ORM** | Drizzle ORM + drizzle-kit |
| **Auth** | Lucia v3 + Arctic (Google, Discord) + local (test env) |
| **Frontend routing** | TanStack Router |
| **Server state** | TanStack Query |
| **UI** | TailwindCSS v4 + shadcn/ui + Lucide icons |
| **Validation** | Zod |
| **Testing** | Vitest + Testing Library |
| **Code quality** | ESLint 9 (flat config) + Prettier |

For rationale behind these choices, see [docs/adr/001-tech-stack.md](docs/adr/001-tech-stack.md).

## Prerequisites

- **Node.js** >= 20
- **pnpm** >= 9
- **Docker** & Docker Compose (for PostgreSQL)

## Getting Started

```bash
# 1. Clone and install dependencies
pnpm install

# 2. Start PostgreSQL
docker compose up -d

# 3. Copy environment variables and configure
cp .env.example .env
# Edit .env with your values (see Environment Variables below)

# 4. Run database migrations
pnpm db:migrate

# 5. Seed the database with test data
pnpm db:seed

# 6. Start the dev servers (API + Web)
pnpm dev
```

The API runs on `http://localhost:3000` and the web app on `http://localhost:4200`.

## Available Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start API + Web dev servers in parallel |
| `pnpm dev:api` | Start API dev server only |
| `pnpm dev:web` | Start Web dev server only |
| `pnpm build` | Build all projects |
| `pnpm test` | Run all tests |
| `pnpm lint` | Lint all projects |
| `pnpm db:generate` | Generate a new Drizzle migration from schema changes |
| `pnpm db:migrate` | Apply pending database migrations |
| `pnpm db:seed` | Seed the database with test data (idempotent) |

## Environment Variables

All required variables are documented in [`.env.example`](.env.example). Key variables:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `DISCORD_CLIENT_ID` | Discord OAuth client ID |
| `DISCORD_CLIENT_SECRET` | Discord OAuth client secret |
| `SESSION_SECRET` | Secret for signing session cookies |
| `NODE_ENV` | `development`, `test`, or `production` |
| `ENABLE_LOCAL_AUTH` | Enable username/password auth (auto-enabled in non-production) |

## Documentation

- [SKILLS.md](SKILLS.md) — Coding standards and patterns
- [docs/stages.md](docs/stages.md) — Development roadmap
- [docs/adr/](docs/adr/) — Architecture Decision Records
- [docs/domain-model.md](docs/domain-model.md) — Entity-relationship model
- [docs/api-routes.md](docs/api-routes.md) — API route index

## License

MIT
