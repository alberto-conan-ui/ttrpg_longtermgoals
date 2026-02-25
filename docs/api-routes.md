# API Routes

Living index of all API endpoints. Updated each stage.

---

## Health

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | No | Health check |

## Auth (Stage 2 — implemented)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/auth/google` | No | Initiate Google OAuth |
| GET | `/api/auth/google/callback` | No | Google OAuth callback |
| GET | `/api/auth/discord` | No | Initiate Discord OAuth |
| GET | `/api/auth/discord/callback` | No | Discord OAuth callback |
| POST | `/api/auth/register` | No | Local registration (test env only) |
| POST | `/api/auth/login` | No | Local login (test env only) |
| POST | `/api/auth/logout` | Yes | Invalidate session |
| GET | `/api/auth/me` | Yes | Get current user |
| GET | `/api/auth/providers` | No | List available auth providers |

## Campaigns (Stage 3)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/campaigns` | Yes | Create campaign (caller becomes DM) |
| GET | `/api/campaigns` | Yes | List user's campaigns |
| GET | `/api/campaigns/:id` | Yes | Get campaign details |

## Invitations (Stage 4)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/campaigns/:id/invite` | Yes (DM) | Generate/regenerate invite code |
| POST | `/api/campaigns/:id/join` | Yes | Join campaign via invite code |

## Investigation Tracks (Stage 5)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/campaigns/:id/tracks` | Yes (DM) | Create investigation track |
| GET | `/api/campaigns/:id/tracks` | Yes | List tracks for campaign |
| GET | `/api/tracks/:id` | Yes | Get track details with progress |

## Downtime Phases (Stage 6)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/campaigns/:id/phases` | Yes (DM) | Open a downtime phase |
| PATCH | `/api/phases/:id` | Yes (DM) | Update phase status |
| POST | `/api/phases/:id/allocate` | Yes | Allocate idle time to tracks |
| GET | `/api/phases/:id` | Yes | Get phase details with allocations |
