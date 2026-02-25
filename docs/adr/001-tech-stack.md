# ADR-001: Tech Stack Choices

**Date:** 2025-02-25
**Status:** Accepted

## Context

We are building a campaign management tool for TTRPG DMs, focused on between-session downtime tracking. The app needs:

- A REST API with authentication (multiple OAuth providers)
- A React SPA frontend
- PostgreSQL database with migrations
- A monorepo structure for shared types between frontend and backend

The project started from an Nx workspace with Hono (API), React 19 (Web), and a shared library.

## Decisions

### Monorepo: Nx + pnpm

**Keep existing.** Nx provides task orchestration, caching, and code generation. pnpm is fast and has strict dependency management.

### API: Hono

**Keep existing.** Hono is lightweight, fast, and has a great middleware ecosystem. It supports the Web Standard Request/Response API, making it portable. The `@hono/zod-validator` middleware integrates cleanly with our validation strategy.

### ORM: Drizzle ORM

**Chosen over Prisma.** Drizzle is SQL-first and type-safe without code generation. The schema-as-TypeScript approach means our schema files are the source of truth, and `drizzle-kit` handles migration generation. It's lighter than Prisma, has no engine binary, and produces more predictable SQL.

### Auth: Lucia v3 + Arctic

**Chosen over Auth.js / better-auth.** Lucia is a lightweight session library that doesn't try to own your database schema. It works with any framework and any database. Arctic handles OAuth flows for multiple providers (Google, Discord, etc.) without vendor lock-in. This combination gives us full control over the auth flow while minimizing boilerplate.

Local username/password auth is gated behind `NODE_ENV !== 'production'` for easy testing.

### Frontend Routing: TanStack Router

**Chosen over React Router v7.** TanStack Router provides fully type-safe routing with inferred params and search params. It integrates cleanly with TanStack Query for data loading. The file-based route generation is optional but available.

### Server State: TanStack Query

**Industry standard.** Handles caching, deduplication, background refetching, and optimistic updates. No serious alternatives at this point.

### UI: TailwindCSS v4 + shadcn/ui + Lucide

**TailwindCSS v4** for utility-first styling — fast iteration, no CSS-in-JS runtime cost. **shadcn/ui** provides copy-paste components that we own (not a dependency), built on Radix primitives. **Lucide** for a consistent, modern icon set.

### Validation: Zod

**Used everywhere.** API request validation (via `@hono/zod-validator`), environment variable validation, shared type schemas. Single validation library across the entire stack.

### Password Hashing: @node-rs/argon2

**Chosen over bcrypt.** Argon2id is the current OWASP recommendation for password hashing. The `@node-rs/argon2` package is a Rust-based binding that's faster than pure JS alternatives.

## Consequences

- All team members need to learn Drizzle's API (it's close to raw SQL, so the learning curve is minimal)
- Lucia v3 requires manual session management vs. Auth.js's more batteries-included approach — this is a tradeoff for control
- TanStack Router is newer than React Router, so some patterns may evolve — we pin versions and update deliberately
