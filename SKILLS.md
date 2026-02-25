# SKILLS — Coding Standards & Patterns

This document defines the conventions, patterns, and code style for the TTRPG Long-Term Goals project. All contributors (human and AI) should follow these standards.

---

## TypeScript

- **Strict mode** enabled (`"strict": true` in tsconfig)
- **No `any`** — use `unknown` + type guards or Zod parsing instead
- **Prefer discriminated unions** over boolean flags for state
- **Zod** for all runtime boundaries (API input, env vars, external data)
- **`satisfies`** operator for type-safe object literals with inference

```typescript
// Good: discriminated union
type AuthResult =
  | { success: true; user: User }
  | { success: false; error: string };

// Bad: boolean flag
type AuthResult = { success: boolean; user?: User; error?: string };
```

---

## Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| DB tables | snake_case, plural | `campaign_members` |
| DB columns | snake_case | `created_at`, `dm_id` |
| TS types/interfaces | PascalCase | `CampaignMember` |
| TS variables/functions | camelCase | `getCampaignById` |
| Files | kebab-case | `campaign-members.ts` |
| API routes | kebab-case, plural nouns | `/api/campaigns` |
| Env vars | SCREAMING_SNAKE_CASE | `DATABASE_URL` |
| Zod schemas | camelCase + `Schema` suffix | `createCampaignSchema` |

---

## Project Structure

Feature-based folders within each app. Shared contracts in `libs/shared/`.

```
apps/api/src/
├── config/           # Env validation, app config
│   └── env.ts
├── db/
│   ├── schema/       # Drizzle schema files (one per entity)
│   │   ├── users.ts
│   │   ├── sessions.ts
│   │   └── index.ts  # Barrel export
│   ├── index.ts      # DB connection
│   └── seed.ts       # Idempotent seed script
├── features/
│   ├── auth/
│   │   ├── routes.ts       # Hono route group
│   │   ├── middleware.ts   # Auth middleware
│   │   └── providers/      # One file per OAuth provider
│   │       ├── google.ts
│   │       └── discord.ts
│   └── campaigns/
│       ├── routes.ts
│       └── queries.ts      # DB query functions
├── lib/
│   ├── api-error.ts        # Standardized error class
│   └── error-middleware.ts  # Hono error handler
└── main.ts

apps/web/src/
├── components/       # Shared UI components
│   ├── ui/           # shadcn/ui components
│   └── layout/       # Layout components (nav, sidebar)
├── features/
│   ├── auth/
│   │   ├── components/     # Auth-specific components
│   │   ├── hooks/          # useAuth, useSession, etc.
│   │   └── routes/         # TanStack Router route files
│   └── campaigns/
│       ├── components/
│       ├── hooks/
│       └── routes/
├── lib/              # Utilities, API client
└── main.tsx
```

### What goes where

| Location | Contains |
|---|---|
| `libs/shared/` | API request/response types, shared Zod schemas, domain enums |
| `apps/api/` | DB schema types, middleware types, server-only logic |
| `apps/web/` | Component props, hooks, client-only utilities |

---

## API Route Module Pattern

Every feature's routes live in a single Hono app that gets mounted in `main.ts`.

```typescript
// apps/api/src/features/campaigns/routes.ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createCampaignSchema } from '@ttrpg-longtermgoals/shared';
import { ApiError } from '../../lib/api-error';
import { requireAuth } from '../auth/middleware';
import { db } from '../../db';
import { campaigns } from '../../db/schema';

const app = new Hono();

app.post('/',
  requireAuth,
  zValidator('json', createCampaignSchema),
  async (c) => {
    const userId = c.get('userId');
    const body = c.req.valid('json');

    const [campaign] = await db
      .insert(campaigns)
      .values({ ...body, dmId: userId })
      .returning();

    return c.json({ data: campaign }, 201);
  }
);

export default app;
```

```typescript
// apps/api/src/main.ts — mounting
import campaigns from './features/campaigns/routes';
app.route('/api/campaigns', campaigns);
```

---

## Error Handling

All API errors use a consistent shape:

```typescript
// apps/api/src/lib/api-error.ts
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

// Usage:
throw new ApiError(404, 'CAMPAIGN_NOT_FOUND', `Campaign '${id}' does not exist`);
```

```typescript
// apps/api/src/lib/error-middleware.ts
import { ErrorHandler } from 'hono';
import { ApiError } from './api-error';

export const errorHandler: ErrorHandler = (err, c) => {
  if (err instanceof ApiError) {
    return c.json(
      { error: { code: err.code, message: err.message, status: err.status } },
      err.status as any,
    );
  }

  console.error('Unhandled error:', err);
  return c.json(
    { error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred', status: 500 } },
    500,
  );
};
```

Response shape (always):

```json
{
  "error": {
    "code": "CAMPAIGN_NOT_FOUND",
    "message": "Campaign 'abc' does not exist",
    "status": 404
  }
}
```

Zod validation errors are caught by `@hono/zod-validator` and formatted into this same shape via a custom error hook.

---

## Drizzle Schema Pattern

One file per entity. Use `pgTable`, define relations separately, export inferred types.

```typescript
// apps/api/src/db/schema/users.ts
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { sessions } from './sessions';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  googleId: text('google_id').unique(),
  discordId: text('discord_id').unique(),
  username: text('username').unique(),
  hashedPassword: text('hashed_password'),
  displayName: text('display_name').notNull(),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

---

## React Feature Folder Pattern

Each feature groups its components, hooks, and routes together.

```typescript
// apps/web/src/features/campaigns/hooks/use-campaigns.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api-client';
import type { Campaign } from '@ttrpg-longtermgoals/shared';

export function useCampaigns() {
  return useQuery({
    queryKey: ['campaigns'],
    queryFn: () => api.get<Campaign[]>('/api/campaigns'),
  });
}
```

```tsx
// apps/web/src/features/campaigns/components/campaign-list.tsx
import { useCampaigns } from '../hooks/use-campaigns';

export function CampaignList() {
  const { data, isLoading, error } = useCampaigns();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data?.map((campaign) => (
        <li key={campaign.id}>{campaign.name}</li>
      ))}
    </ul>
  );
}
```

---

## Env Management

Environment variables are validated at startup with Zod. The app fails fast if anything is missing.

```typescript
// apps/api/src/config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  SESSION_SECRET: z.string().min(32),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  DISCORD_CLIENT_ID: z.string().optional(),
  DISCORD_CLIENT_SECRET: z.string().optional(),
  ENABLE_LOCAL_AUTH: z
    .enum(['true', 'false'])
    .default('false')
    .transform((v) => v === 'true'),
});

export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;
```

Every env var must be documented in `.env.example` with a comment explaining its purpose.

---

## Testing

- **Unit tests** — Vitest, co-located as `*.spec.ts` / `*.spec.tsx`
- **API integration tests** — Vitest, using Hono's `app.request()` for in-process testing
- **Component tests** — Vitest + Testing Library
- **Test database** — Separate Postgres DB via Docker (same compose, different `DATABASE_URL`)

```typescript
// API integration test pattern
import { describe, it, expect } from 'vitest';
import app from '../main';

describe('GET /api/health', () => {
  it('returns ok', async () => {
    const res = await app.request('/api/health');
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: 'ok' });
  });
});
```

---

## Code Quality

- **ESLint 9** with flat config (`eslint.config.mjs`)
- **Prettier** for formatting (`.prettierrc`)
- **Conventional Commits** — `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`
- **No barrel re-exports of the entire world** — barrel files export only the public API of a module

---

## Database Workflow

1. **Edit schema** in `apps/api/src/db/schema/`
2. **Generate migration**: `pnpm db:generate`
3. **Review** the generated SQL in `apps/api/drizzle/`
4. **Apply migration**: `pnpm db:migrate`
5. **Update seed** if new tables need test data
6. **Update `docs/domain-model.md`** with the new entity

Never write raw SQL outside of migration files. All application queries go through Drizzle's query builder.

---

## Auth Pattern

Session-based authentication using Lucia v3 with database-backed sessions.

- Sessions are stored in PostgreSQL, referenced by a secure httpOnly cookie
- OAuth providers are extensible: add a new file in `features/auth/providers/`
- Local username/password auth is available when `NODE_ENV !== 'production'` or `ENABLE_LOCAL_AUTH` is `true`
- Password hashing uses `@node-rs/argon2`

Adding a new OAuth provider:

1. Create `apps/api/src/features/auth/providers/<provider>.ts`
2. Add env vars for client ID/secret
3. Add routes for `/api/auth/<provider>` and `/api/auth/<provider>/callback`
4. Add the provider's ID column to the `users` schema
5. Generate and apply the migration
