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

## Campaigns (Stage 3 — implemented)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/campaigns` | Yes | Create campaign (caller becomes DM) |
| GET | `/api/campaigns` | Yes | List user's campaigns |
| GET | `/api/campaigns/:id` | Yes (member) | Get campaign details with members |

## Invitations (Stage 4 — implemented)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/campaigns/:id/invite` | Yes (DM) | Generate/regenerate invite code |
| POST | `/api/campaigns/join` | Yes | Join campaign via invite code |

## Parts & Sessions (Stage 5b — planned)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/campaigns/:id/parts` | Yes (DM) | Create part |
| GET | `/api/campaigns/:id/parts` | Yes (member) | List parts with sessions (visibility-filtered) |
| PATCH | `/api/parts/:id` | Yes (DM) | Update part name/order |
| DELETE | `/api/parts/:id` | Yes (DM) | Delete part + cascade sessions |
| POST | `/api/parts/:id/sessions` | Yes (DM) | Create session in part |
| PATCH | `/api/sessions/:id` | Yes (DM) | Update session name/order/status |
| DELETE | `/api/sessions/:id` | Yes (DM) | Delete session |

## Marker (Stage 5b.2 — planned)

| Method | Path | Auth | Description |
|---|---|---|---|
| PATCH | `/api/campaigns/:id/marker` | Yes (DM) | Move marker (set sessionId + between) |

## Lore Fragments (Stage 5c — planned)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/campaigns/:id/lore` | Yes (member) | Create lore fragment (caller = owner) |
| GET | `/api/campaigns/:id/lore` | Yes (member) | List fragments (filtered by visibility + marker) |
| GET | `/api/lore/:id` | Yes (member) | Get single fragment (visibility check) |
| PATCH | `/api/lore/:id` | Yes (owner) | Update title, content, scope, visibility |
| DELETE | `/api/lore/:id` | Yes (owner/DM) | Delete fragment |
| POST | `/api/lore/:id/share` | Yes (owner) | Share with specific campaign members |
| DELETE | `/api/lore/:id/share/:userId` | Yes (owner) | Revoke share |

## Idle Tracks (Stage 6 — planned)

_Not yet designed. Will use the "between sessions" marker state as the hook for idle track activation._
