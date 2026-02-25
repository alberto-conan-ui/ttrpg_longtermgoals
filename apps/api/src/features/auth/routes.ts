import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import * as arctic from 'arctic';
import { hash, verify } from '@node-rs/argon2';
import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { users } from '../../db/schema';
import { env } from '../../config/env';
import { ApiError } from '../../lib/api-error';
import {
  createSession,
  invalidateSession,
  setSessionCookie,
  deleteSessionCookie,
} from './session';
import { requireAuth } from './middleware';
import { getGoogleProvider, getGoogleUserProfile } from './providers/google';
import {
  getDiscordProvider,
  getDiscordUserProfile,
} from './providers/discord';

const app = new Hono();

// ---------------------------------------------------------------------------
// State store for OAuth flows (in-memory, fine for single-instance dev)
// ---------------------------------------------------------------------------
const oauthStateStore = new Map<
  string,
  { provider: string; codeVerifier?: string; expiresAt: number }
>();

function storeOAuthState(
  state: string,
  provider: string,
  codeVerifier?: string,
): void {
  // Expire after 10 minutes
  oauthStateStore.set(state, {
    provider,
    codeVerifier,
    expiresAt: Date.now() + 10 * 60 * 1000,
  });
}

function consumeOAuthState(
  state: string,
): { provider: string; codeVerifier?: string } | null {
  const stored = oauthStateStore.get(state);
  if (!stored) return null;
  oauthStateStore.delete(state);
  if (Date.now() > stored.expiresAt) return null;
  return stored;
}

// ---------------------------------------------------------------------------
// Helper: find or create user from OAuth profile
// ---------------------------------------------------------------------------
async function findOrCreateOAuthUser(params: {
  providerIdColumn: 'googleId' | 'discordId';
  providerId: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
}) {
  // Check by provider ID first
  const existing = await db
    .select()
    .from(users)
    .where(eq(users[params.providerIdColumn], params.providerId))
    .limit(1);

  if (existing.length > 0) return existing[0];

  // Check by email — link account if exists
  const byEmail = await db
    .select()
    .from(users)
    .where(eq(users.email, params.email))
    .limit(1);

  if (byEmail.length > 0) {
    const [updated] = await db
      .update(users)
      .set({
        [params.providerIdColumn]: params.providerId,
        avatarUrl: byEmail[0].avatarUrl ?? params.avatarUrl,
        updatedAt: new Date(),
      })
      .where(eq(users.id, byEmail[0].id))
      .returning();
    return updated;
  }

  // Create new user
  const [newUser] = await db
    .insert(users)
    .values({
      email: params.email,
      [params.providerIdColumn]: params.providerId,
      displayName: params.displayName,
      avatarUrl: params.avatarUrl,
    })
    .returning();

  return newUser;
}

// ---------------------------------------------------------------------------
// GET /api/auth/me
// ---------------------------------------------------------------------------
app.get('/me', requireAuth, (c) => {
  const user = c.get('user');
  return c.json({ data: user });
});

// ---------------------------------------------------------------------------
// POST /api/auth/logout
// ---------------------------------------------------------------------------
app.post('/logout', requireAuth, async (c) => {
  const sessionId = c.get('sessionId');
  await invalidateSession(sessionId);
  deleteSessionCookie(c.res.headers);
  return c.json({ data: { success: true } });
});

// ---------------------------------------------------------------------------
// Google OAuth
// ---------------------------------------------------------------------------
app.get('/google', (c) => {
  const google = getGoogleProvider();
  if (!google) {
    throw new ApiError(
      501,
      'PROVIDER_NOT_CONFIGURED',
      'Google OAuth is not configured',
    );
  }

  const state = arctic.generateState();
  const codeVerifier = arctic.generateCodeVerifier();
  storeOAuthState(state, 'google', codeVerifier);

  const url = google.createAuthorizationURL(state, codeVerifier, [
    'openid',
    'profile',
    'email',
  ]);

  return c.redirect(url.toString());
});

app.get('/google/callback', async (c) => {
  const google = getGoogleProvider();
  if (!google) {
    throw new ApiError(
      501,
      'PROVIDER_NOT_CONFIGURED',
      'Google OAuth is not configured',
    );
  }

  const { code, state } = c.req.query();
  if (!code || !state) {
    throw new ApiError(400, 'INVALID_CALLBACK', 'Missing code or state');
  }

  const stored = consumeOAuthState(state);
  if (!stored || stored.provider !== 'google') {
    throw new ApiError(400, 'INVALID_STATE', 'Invalid or expired OAuth state');
  }

  const codeVerifier = stored.codeVerifier ?? '';
  const tokens = await google.validateAuthorizationCode(code, codeVerifier);
  const accessToken = tokens.accessToken();
  const profile = await getGoogleUserProfile(accessToken);

  const user = await findOrCreateOAuthUser({
    providerIdColumn: 'googleId',
    providerId: profile.sub,
    email: profile.email,
    displayName: profile.name,
    avatarUrl: profile.picture,
  });

  const session = await createSession(user.id);
  setSessionCookie(c.res.headers, session.id, session.expiresAt);

  return c.redirect(env.WEB_URL);
});

// ---------------------------------------------------------------------------
// Discord OAuth
// ---------------------------------------------------------------------------
app.get('/discord', (c) => {
  const discord = getDiscordProvider();
  if (!discord) {
    throw new ApiError(
      501,
      'PROVIDER_NOT_CONFIGURED',
      'Discord OAuth is not configured',
    );
  }

  const state = arctic.generateState();
  storeOAuthState(state, 'discord');

  // Discord confidential client: no PKCE, pass null for codeVerifier
  const url = discord.createAuthorizationURL(state, null, [
    'identify',
    'email',
  ]);

  return c.redirect(url.toString());
});

app.get('/discord/callback', async (c) => {
  const discord = getDiscordProvider();
  if (!discord) {
    throw new ApiError(
      501,
      'PROVIDER_NOT_CONFIGURED',
      'Discord OAuth is not configured',
    );
  }

  const { code, state } = c.req.query();
  if (!code || !state) {
    throw new ApiError(400, 'INVALID_CALLBACK', 'Missing code or state');
  }

  const stored = consumeOAuthState(state);
  if (!stored || stored.provider !== 'discord') {
    throw new ApiError(400, 'INVALID_STATE', 'Invalid or expired OAuth state');
  }

  const tokens = await discord.validateAuthorizationCode(code, null);
  const accessToken = tokens.accessToken();
  const profile = await getDiscordUserProfile(accessToken);

  const avatarUrl = profile.avatar
    ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
    : null;

  const user = await findOrCreateOAuthUser({
    providerIdColumn: 'discordId',
    providerId: profile.id,
    email: profile.email,
    displayName: profile.global_name ?? profile.username,
    avatarUrl: avatarUrl ?? undefined,
  });

  const session = await createSession(user.id);
  setSessionCookie(c.res.headers, session.id, session.expiresAt);

  return c.redirect(env.WEB_URL);
});

// ---------------------------------------------------------------------------
// Local auth (test/dev env only)
// ---------------------------------------------------------------------------
const registerSchema = z.object({
  username: z.string().min(3).max(32),
  password: z.string().min(8).max(128),
  email: z.string().email(),
  displayName: z.string().min(1).max(100),
});

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

function assertLocalAuthEnabled() {
  const enabled = env.ENABLE_LOCAL_AUTH || env.NODE_ENV !== 'production';
  if (!enabled) {
    throw new ApiError(
      403,
      'LOCAL_AUTH_DISABLED',
      'Local authentication is disabled in production',
    );
  }
}

app.post(
  '/register',
  zValidator('json', registerSchema, (result, c) => {
    if (result.success === false) {
      return c.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid registration data',
            status: 400,
            details: result.error.issues,
          },
        },
        400,
      );
    }
  }),
  async (c) => {
    assertLocalAuthEnabled();

    const { username, password, email, displayName } = c.req.valid('json');

    // Check if username or email already exists
    const existingByUsername = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (existingByUsername.length > 0) {
      throw new ApiError(
        409,
        'USERNAME_TAKEN',
        'Username is already taken',
      );
    }

    const existingByEmail = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingByEmail.length > 0) {
      throw new ApiError(
        409,
        'EMAIL_TAKEN',
        'Email is already registered',
      );
    }

    const hashedPassword = await hash(password);

    const [newUser] = await db
      .insert(users)
      .values({
        username,
        hashedPassword,
        email,
        displayName,
      })
      .returning();

    const session = await createSession(newUser.id);
    setSessionCookie(c.res.headers, session.id, session.expiresAt);

    return c.json(
      {
        data: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
          displayName: newUser.displayName,
        },
      },
      201,
    );
  },
);

app.post(
  '/login',
  zValidator('json', loginSchema, (result, c) => {
    if (result.success === false) {
      return c.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid login data',
            status: 400,
            details: result.error.issues,
          },
        },
        400,
      );
    }
  }),
  async (c) => {
    assertLocalAuthEnabled();

    const { username, password } = c.req.valid('json');

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (!user || !user.hashedPassword) {
      throw new ApiError(
        401,
        'INVALID_CREDENTIALS',
        'Invalid username or password',
      );
    }

    const valid = await verify(user.hashedPassword, password);
    if (!valid) {
      throw new ApiError(
        401,
        'INVALID_CREDENTIALS',
        'Invalid username or password',
      );
    }

    const session = await createSession(user.id);
    setSessionCookie(c.res.headers, session.id, session.expiresAt);

    return c.json({
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
      },
    });
  },
);

// ---------------------------------------------------------------------------
// GET /api/auth/providers — list available auth providers
// ---------------------------------------------------------------------------
app.get('/providers', (c) => {
  const providers: string[] = [];
  if (getGoogleProvider()) providers.push('google');
  if (getDiscordProvider()) providers.push('discord');
  if (env.ENABLE_LOCAL_AUTH || env.NODE_ENV !== 'production') {
    providers.push('local');
  }
  return c.json({ data: providers });
});

export default app;
