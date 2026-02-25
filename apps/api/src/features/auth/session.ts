import { encodeBase32LowerCaseNoPadding } from '@oslojs/encoding';
import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { sessions, users } from '../../db/schema';
import { env } from '../../config/env';
import type { User } from '../../db/schema';

const SESSION_EXPIRES_IN_MS = 1000 * 60 * 60 * 24 * 30; // 30 days
const SESSION_REFRESH_THRESHOLD_MS = SESSION_EXPIRES_IN_MS / 2; // 15 days

export interface SessionValidationResult {
  session: { id: string; userId: string; expiresAt: Date } | null;
  user: Omit<User, 'hashedPassword'> | null;
}

function generateSessionId(): string {
  const bytes = new Uint8Array(25);
  crypto.getRandomValues(bytes);
  return encodeBase32LowerCaseNoPadding(bytes);
}

export async function createSession(userId: string): Promise<{ id: string; expiresAt: Date }> {
  const id = generateSessionId();
  const expiresAt = new Date(Date.now() + SESSION_EXPIRES_IN_MS);

  await db.insert(sessions).values({ id, userId, expiresAt });

  return { id, expiresAt };
}

export async function validateSession(sessionId: string): Promise<SessionValidationResult> {
  const result = await db
    .select({
      session: sessions,
      user: {
        id: users.id,
        email: users.email,
        googleId: users.googleId,
        discordId: users.discordId,
        username: users.username,
        displayName: users.displayName,
        avatarUrl: users.avatarUrl,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      },
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.id, sessionId))
    .limit(1);

  if (result.length === 0) {
    return { session: null, user: null };
  }

  const { session, user } = result[0];
  const now = Date.now();

  if (now >= session.expiresAt.getTime()) {
    await db.delete(sessions).where(eq(sessions.id, session.id));
    return { session: null, user: null };
  }

  // Refresh session if past the halfway point
  if (now >= session.expiresAt.getTime() - SESSION_REFRESH_THRESHOLD_MS) {
    session.expiresAt = new Date(Date.now() + SESSION_EXPIRES_IN_MS);
    await db
      .update(sessions)
      .set({ expiresAt: session.expiresAt })
      .where(eq(sessions.id, session.id));
  }

  return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export async function invalidateAllUserSessions(userId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.userId, userId));
}

const SESSION_COOKIE_NAME = 'session';

export function setSessionCookie(headers: Headers, sessionId: string, expiresAt: Date): void {
  const secure = env.NODE_ENV === 'production';
  const cookie = [
    `${SESSION_COOKIE_NAME}=${sessionId}`,
    'HttpOnly',
    'SameSite=Lax',
    `Expires=${expiresAt.toUTCString()}`,
    'Path=/',
    ...(secure ? ['Secure'] : []),
  ].join('; ');
  headers.append('Set-Cookie', cookie);
}

export function deleteSessionCookie(headers: Headers): void {
  const secure = env.NODE_ENV === 'production';
  const cookie = [
    `${SESSION_COOKIE_NAME}=`,
    'HttpOnly',
    'SameSite=Lax',
    'Max-Age=0',
    'Path=/',
    ...(secure ? ['Secure'] : []),
  ].join('; ');
  headers.append('Set-Cookie', cookie);
}

export function getSessionIdFromCookie(cookieHeader: string | undefined): string | null {
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(';').map((c) => c.trim());
  const sessionCookie = cookies.find((c) => c.startsWith(`${SESSION_COOKIE_NAME}=`));
  if (!sessionCookie) return null;
  const value = sessionCookie.split('=')[1];
  return value || null;
}
