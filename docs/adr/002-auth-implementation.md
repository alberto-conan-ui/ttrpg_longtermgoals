# ADR-002: Auth Implementation — Custom Sessions over Lucia v3

**Date:** 2025-02-25
**Status:** Accepted
**Supersedes:** Original plan to use Lucia v3

## Context

The original plan specified Lucia v3 for session management. During implementation, we discovered that Lucia v3 and its adapter packages (`@lucia-auth/adapter-postgresql`, `oslo`) are all deprecated. The author recommends implementing sessions from scratch using `@oslojs/*` packages.

## Decision

We implemented custom session management following the Lucia author's recommended migration pattern:

- **Session generation**: `@oslojs/encoding` for base32 session ID generation
- **Session storage**: Direct Drizzle ORM queries against the `sessions` table
- **Session validation**: Custom `validateSession()` with auto-refresh at 50% expiry
- **Cookie management**: Manual `Set-Cookie` headers with proper attributes (HttpOnly, SameSite=Lax, Secure in production)
- **OAuth**: Arctic v3 for Google and Discord providers
- **Password hashing**: `@node-rs/argon2` (Argon2id, OWASP recommended)

## Consequences

- **More control**: We own the entire auth flow, no library abstractions to work around
- **Less maintenance risk**: No dependency on deprecated packages
- **Slightly more code**: ~120 lines for session management vs. using Lucia's API
- **Same security**: Following the exact pattern recommended by Lucia's author, including session refresh and proper cookie attributes
- **Provider extensibility**: Adding a new OAuth provider means: (1) create a provider file in `features/auth/providers/`, (2) add routes in `features/auth/routes.ts`, (3) add the provider ID column to the users schema
