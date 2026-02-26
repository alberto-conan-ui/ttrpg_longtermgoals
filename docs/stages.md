# Development Roadmap

This document tracks the planned development stages for TTRPG Long-Term Goals. Each stage is designed to be completed in a single focused session.

---

## Stage 1 — Infrastructure & Documentation

**Status:** Done

Set up project foundation: README, SKILLS, docs, Docker Compose, database schema, seed data, env config.

**Delivers:**
- README.md with project vision and getting started guide
- SKILLS.md with coding standards and concrete patterns
- Architecture Decision Records
- Domain model and API route index
- Docker Compose for PostgreSQL
- Drizzle ORM config, initial schema (users + sessions), seed script
- Zod-validated environment config

---

## Stage 2 — Authentication

**Status:** Done

Custom session-based auth (post-Lucia pattern using @oslojs/*), Google & Discord OAuth via Arctic, local username/password (test env only). Session middleware, auth API routes, frontend login/register/dashboard pages with TanStack Router + Query.

**Suggested prompt:**
> "Implement auth: Lucia v3 with Google OAuth, Discord OAuth, and local username/password (test env only). Include the provider-extensible pattern from SKILLS.md. Wire up all auth API routes, session middleware, and a simple test page on the frontend to verify login/logout works."

**Delivers:**
- Auth endpoints (register, login, logout, OAuth flows, /me)
- Session middleware for protected routes
- Provider-extensible OAuth pattern
- Login/Register pages on frontend
- Protected route pattern on frontend

---

## Stage 3 — Campaign CRUD

**Status:** Done

DMs can create campaigns, list their campaigns, and view campaign details. Campaign members table tracks DM and player roles.

**Suggested prompt:**
> "Implement campaign creation and management. A logged-in user can create a campaign (becoming its DM), list their campaigns, and view campaign details. Follow the patterns in SKILLS.md. Update domain-model.md and api-routes.md."

**Delivers:**
- Campaign DB schema + migration
- CRUD endpoints (create, list, get)
- Campaign list and detail pages
- DM role assignment

---

## Stage 4 — Player Invitations

**Status:** Done

DMs generate invite codes for campaigns. Players join via invite code from the campaign list page.

**Suggested prompt:**
> "Implement the invite flow: DMs can generate an invite code for their campaign, other registered users can join via that code. Show campaign members on the detail page. Update docs."

**Delivers:**
- Invite code generation and join-by-code endpoint
- Campaign members list
- Member management UI

---

## Stage 5a — Cleanup & Schema

**Status:** Done

Remove old investigation tracks. Add new Campaign Tree schema: `campaign_parts`, `campaign_sessions`, `lore_fragments`, `lore_fragment_shares`. Add marker + showcase columns to `campaigns`. Update seed with sample parts, sessions, marker, and lore for Curse of Strahd.

**Delivers:**
- Migration dropping old tracks tables, creating new tables + enums
- New Drizzle schema files (`parts.ts`, `lore-fragments.ts`)
- Updated `campaigns` schema with marker + showcase columns
- Seed data with parts, sessions, marker position, and lore fragments
- Updated docs (domain-model, api-routes, stages)

---

## Stage 5b — Parts/Sessions API

**Status:** Done

CRUD endpoints for campaign parts and sessions. DM creates/updates/deletes parts and sessions within a campaign. GET list is visibility-filtered for players based on the campaign marker.

**Delivers:**
- `POST /api/campaigns/:id/parts` — Create part
- `GET /api/campaigns/:id/parts` — List parts with sessions (visibility-filtered)
- `PATCH /api/parts/:id` — Update part
- `DELETE /api/parts/:id` — Delete part
- `POST /api/parts/:id/sessions` — Create session
- `PATCH /api/sessions/:id` — Update session
- `DELETE /api/sessions/:id` — Delete session

---

## Stage 5b.2 — Marker API

**Status:** Done

Endpoint to move the campaign marker. Business logic: setting marker on a session sets it to `played`, setting between requires session already played, bulk-updates prior sessions.

**Delivers:**
- `PATCH /api/campaigns/:id/marker` — Move marker

---

## Stage 5c — Lore Fragments API

**Status:** Done

CRUD + sharing + visibility filtering for lore fragments. Story scope auto-publishes at read time when marker reaches the session.

**Delivers:**
- Lore fragment CRUD endpoints
- Sharing endpoints (add/remove shares)
- Visibility filtering based on scope, marker position, and ownership
- Query params for filtering by attachment point

---

## Stage 5d — Editors & Showcase Pages

**Status:** Planned

Puck page builder + Tiptap rich text editor. Campaign tree sidebar navigation. Showcase pages for all folder nodes. Lore fragment editor. Marker controls.

**Delivers:**
- Puck editor with custom components (Heading, RichText, Image, Divider, LoreFragmentEmbed, LinkCard)
- Tiptap `<RichTextEditor>` and `<RichTextViewer>` components
- Showcase pages for campaign, parts, sessions, player profiles
- Campaign tree sidebar with visibility filtering
- Marker controls ("Mark as played", "Start downtime")
- Lore fragment editor modal

---

## Stage 6 — Idle Tracks

**Status:** Planned

Idle tracks (investigation tracks reborn) available during the "between sessions" downtime phase. Depends on the marker lifecycle from Stage 5b.

**Not yet designed.**

---

## Optional Side Stages (request anytime)

- **Real-time updates** — WebSockets or SSE for live session tracking
- **Campaign notes** — Session log and note-taking for DMs
- **Polish & Testing** — Comprehensive tests, error boundaries, loading/empty states
- **Deployment Prep** — Production config, security headers, deployment docs
