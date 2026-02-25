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

## Stage 5 — Investigation Tracks (Core Feature)

**Status:** Planned

DMs define investigation tracks within a campaign. Players can pursue them during downtime.

**Suggested prompt:**
> "Implement investigation tracks: DMs can create investigation tracks within a campaign, each with a name, description, and progress milestones. Players can spend idle time to advance their progress on a track. Show progress per player per track. This is the core feature — let's design the schema carefully."

**Delivers:**
- Investigation track schema with milestones
- Progress tracking per player per track
- DM track management UI
- Player progress view

---

## Stage 6 — Between-Session Workflow

**Status:** Planned

The full downtime phase lifecycle: open, allocate, resolve, close.

**Suggested prompt:**
> "Build the between-session flow: DMs open a 'downtime phase' for a campaign, players allocate their idle time across available investigation tracks, DM reviews and resolves progress, then closes the phase. Add notifications or status indicators."

**Delivers:**
- Downtime phase lifecycle (open/allocate/resolve/close)
- Time allocation system
- DM review and resolve UI
- Phase history

---

## Stage 7 — Polish & Testing

**Status:** Planned

Comprehensive tests, error boundaries, loading/empty states, auth hardening.

**Suggested prompt:**
> "Add comprehensive tests: API integration tests for all endpoints, component tests for key UI flows, seed data scenarios. Add error boundaries, loading states, and empty states across the frontend. Review and harden auth edge cases."

**Delivers:**
- Full test suite (API + frontend)
- Error boundaries and loading states
- Auth edge case hardening

---

## Stage 8 — Deployment Prep

**Status:** Planned

Production-ready configuration, security, and deployment docs.

**Suggested prompt:**
> "Prepare for deployment: production Docker Compose (or cloud config), environment-specific builds, health checks, CORS config, rate limiting, CSP headers. Update README with deployment instructions."

**Delivers:**
- Production Docker Compose or cloud config
- Security headers (CORS, CSP, rate limiting)
- Deployment documentation

---

## Optional Side Stages (request anytime)

- **Dice roller / random events** — Random outcomes for investigation progress
- **Real-time updates** — WebSockets or SSE for live session tracking
- **Campaign notes** — Session log and note-taking for DMs
- **Player character profiles** — Character sheets linked to campaign membership
