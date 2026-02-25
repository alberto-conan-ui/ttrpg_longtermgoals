import { createMiddleware } from 'hono/factory';
import {
  getSessionIdFromCookie,
  validateSession,
  setSessionCookie,
  type SessionValidationResult,
} from './session';
import { ApiError } from '../../lib/api-error';

export type AuthEnv = {
  Variables: {
    user: NonNullable<SessionValidationResult['user']>;
    sessionId: string;
  };
};

export const requireAuth = createMiddleware<AuthEnv>(async (c, next) => {
  const sessionId = getSessionIdFromCookie(c.req.header('cookie'));

  if (!sessionId) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Authentication required');
  }

  const { session, user } = await validateSession(sessionId);

  if (!session || !user) {
    throw new ApiError(401, 'SESSION_EXPIRED', 'Session has expired');
  }

  // Refresh cookie if session was extended
  setSessionCookie(c.res.headers, session.id, session.expiresAt);

  c.set('user', user);
  c.set('sessionId', session.id);
  await next();
});

export const optionalAuth = createMiddleware<{
  Variables: {
    user: SessionValidationResult['user'];
    sessionId: string | null;
  };
}>(async (c, next) => {
  const sessionId = getSessionIdFromCookie(c.req.header('cookie'));

  if (!sessionId) {
    c.set('user', null);
    c.set('sessionId', null);
    await next();
    return;
  }

  const { session, user } = await validateSession(sessionId);

  if (session) {
    setSessionCookie(c.res.headers, session.id, session.expiresAt);
    c.set('user', user);
    c.set('sessionId', session.id);
  } else {
    c.set('user', null);
    c.set('sessionId', null);
  }

  await next();
});
