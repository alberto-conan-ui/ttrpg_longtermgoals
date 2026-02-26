# Development Roadmap

This document tracks the development of TTRPG Long-Term Goals.

**Phase 1 (POC)** built the foundational backend and basic UI in vertical slices — schema first, then API, then frontend. This established the technical foundation.

**Phase 2 (current)** is specification and use case definition. We're writing the full product spec (`docs/SPEC.md`) and validating it through user walkthroughs. Each walkthrough tests the spec against a real scenario and refines it where gaps are found.

**Phase 3 (next)** will rebuild the app in horizontal E2E layers. Each layer delivers a thin, working slice of the full experience — a user can perform a complete flow end-to-end. Layers build on each other until the full app is complete. The use cases from Phase 2 become the acceptance criteria for Phase 3 layers. **Every use case must include an automated test suite that proves the flow works. A use case is not complete until its tests pass.**

---

# Phase 1 — POC Foundation

> *Historical record of the proof-of-concept stages. These established the codebase and technical patterns. Some of this work will be reworked or replaced as the spec evolves (e.g., Parts → Folders, Showcase Pages → removed, Lore Fragments → type system rework).*

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

**Status:** Superseded

> *This stage was planned but never started. The spec (v0.8) removed Showcase Pages and the Puck editor entirely. Lore Fragments with rich text are now the only content surface. This stage will be replaced by Phase 3 layers.*

---

## Stage 6 — Idle Tracks

**Status:** Superseded

> *Not yet designed at the POC stage. Now fully specified in SPEC.md §3.4. Will be implemented as a Phase 3 layer.*

---

# Phase 2 — Specification & Use Cases

> *Current phase. We are writing the product spec and validating it by walking through real user scenarios. Each use case tests the spec against a concrete flow, and the spec is updated when gaps are found. When complete, these use cases become the acceptance criteria for Phase 3.*

**Spec:** `docs/SPEC.md` (currently v0.8)
**Journal:** `docs/JOURNAL.md`

| # | Use Case | Status | File |
|---|----------|--------|------|
| UC-001 | DM Onboarding & First Session | In progress | [`docs/use-cases/UC-001-dm-onboarding.md`](use-cases/UC-001-dm-onboarding.md) |
| UC-002 | *(to be defined)* | — | — |

---

# Phase 3 — E2E Layers

> *Not yet started. Each layer is a horizontal slice of the full app that delivers a working end-to-end experience. Layers build on each other. Use cases from Phase 2 define the acceptance criteria.*

*(Layers will be defined once Phase 2 use cases are complete and the spec is stable.)*
