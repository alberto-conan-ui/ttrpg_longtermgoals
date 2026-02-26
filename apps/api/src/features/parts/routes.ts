import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import { db } from '../../db';
import {
  campaigns,
  campaignMembers,
  campaignParts,
  campaignSessions,
} from '../../db/schema';
import { ApiError } from '../../lib/api-error';
import { requireAuth, type AuthEnv } from '../auth/middleware';

// ===========================================================================
// Helpers
// ===========================================================================

/** Verify the caller is a campaign member and return the membership row. */
async function requireMembership(campaignId: string, userId: string) {
  const [membership] = await db
    .select()
    .from(campaignMembers)
    .where(
      and(
        eq(campaignMembers.campaignId, campaignId),
        eq(campaignMembers.userId, userId),
      ),
    )
    .limit(1);

  if (!membership) {
    throw new ApiError(
      404,
      'CAMPAIGN_NOT_FOUND',
      'Campaign not found or you are not a member',
    );
  }

  return membership;
}

/** Assert that the membership role is DM; throw 403 otherwise. */
function assertDm(membership: { role: string }) {
  if (membership.role !== 'dm') {
    throw new ApiError(403, 'NOT_DM', 'Only the DM can perform this action');
  }
}

/** Look up the campaign that owns a given part. Returns campaign row. */
async function getCampaignForPart(partId: string) {
  const [part] = await db
    .select({
      id: campaignParts.id,
      campaignId: campaignParts.campaignId,
    })
    .from(campaignParts)
    .where(eq(campaignParts.id, partId))
    .limit(1);

  if (!part) {
    throw new ApiError(404, 'PART_NOT_FOUND', 'Part not found');
  }

  const [campaign] = await db
    .select()
    .from(campaigns)
    .where(eq(campaigns.id, part.campaignId))
    .limit(1);

  if (!campaign) {
    throw new ApiError(404, 'CAMPAIGN_NOT_FOUND', 'Campaign not found');
  }

  return campaign;
}

/** Look up the campaign that owns a given session (via its part). */
async function getCampaignForSession(sessionId: string) {
  const [session] = await db
    .select({
      id: campaignSessions.id,
      partId: campaignSessions.partId,
    })
    .from(campaignSessions)
    .where(eq(campaignSessions.id, sessionId))
    .limit(1);

  if (!session) {
    throw new ApiError(404, 'SESSION_NOT_FOUND', 'Session not found');
  }

  return getCampaignForPart(session.partId);
}

// ===========================================================================
// Part-scoped routes: /api/parts/:id
// ===========================================================================
export const partRoutes = new Hono<AuthEnv>();
partRoutes.use('*', requireAuth);

// ---------------------------------------------------------------------------
// PATCH /api/parts/:id — Update part
// ---------------------------------------------------------------------------
const updatePartSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  sortOrder: z.number().int().min(0).optional(),
});

partRoutes.patch(
  '/:id',
  zValidator('json', updatePartSchema, (result, c) => {
    if (result.success === false) {
      return c.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid part data',
            status: 400,
            details: result.error.issues,
          },
        },
        400,
      );
    }
  }),
  async (c) => {
    const user = c.get('user');
    const partId = c.req.param('id');
    const updates = c.req.valid('json');

    const campaign = await getCampaignForPart(partId);
    const membership = await requireMembership(campaign.id, user.id);
    assertDm(membership);

    const [updated] = await db
      .update(campaignParts)
      .set(updates)
      .where(eq(campaignParts.id, partId))
      .returning();

    if (!updated) {
      throw new ApiError(404, 'PART_NOT_FOUND', 'Part not found');
    }

    return c.json({ data: updated });
  },
);

// ---------------------------------------------------------------------------
// PATCH /api/parts/:id/showcase — Update part showcase
// ---------------------------------------------------------------------------
const updatePartShowcaseSchema = z.object({
  showcaseJson: z.any().optional(),
  allowContributions: z.boolean().optional(),
});

partRoutes.patch(
  '/:id/showcase',
  zValidator('json', updatePartShowcaseSchema, (result, c) => {
    if (result.success === false) {
      return c.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid showcase data',
            status: 400,
            details: result.error.issues,
          },
        },
        400,
      );
    }
  }),
  async (c) => {
    const user = c.get('user');
    const partId = c.req.param('id');
    const body = c.req.valid('json');

    const campaign = await getCampaignForPart(partId);
    const membership = await requireMembership(campaign.id, user.id);

    const [part] = await db
      .select()
      .from(campaignParts)
      .where(eq(campaignParts.id, partId))
      .limit(1);

    if (!part) {
      throw new ApiError(404, 'PART_NOT_FOUND', 'Part not found');
    }

    const isOwner = part.showcaseOwnerId === user.id;
    const isDm = membership.role === 'dm';
    const canEdit = isDm || isOwner || part.allowContributions;
    if (!canEdit) {
      throw new ApiError(
        403,
        'NOT_AUTHORIZED',
        'Only the owner, DM, or contributors can edit this showcase',
      );
    }

    const updates: Record<string, unknown> = {};
    if (body.showcaseJson !== undefined) updates.showcaseJson = body.showcaseJson;
    if (body.allowContributions !== undefined && isDm) {
      updates.allowContributions = body.allowContributions;
    }

    const [updated] = await db
      .update(campaignParts)
      .set(updates)
      .where(eq(campaignParts.id, partId))
      .returning();

    return c.json({ data: updated });
  },
);

// ---------------------------------------------------------------------------
// DELETE /api/parts/:id — Delete part (cascades sessions)
// ---------------------------------------------------------------------------
partRoutes.delete('/:id', async (c) => {
  const user = c.get('user');
  const partId = c.req.param('id');

  const campaign = await getCampaignForPart(partId);
  const membership = await requireMembership(campaign.id, user.id);
  assertDm(membership);

  const [deleted] = await db
    .delete(campaignParts)
    .where(eq(campaignParts.id, partId))
    .returning();

  if (!deleted) {
    throw new ApiError(404, 'PART_NOT_FOUND', 'Part not found');
  }

  return c.json({ data: { id: deleted.id } });
});

// ---------------------------------------------------------------------------
// POST /api/parts/:id/sessions — Create session in part
// ---------------------------------------------------------------------------
const createSessionSchema = z.object({
  name: z.string().min(1).max(200),
  sortOrder: z.number().int().min(0),
});

partRoutes.post(
  '/:id/sessions',
  zValidator('json', createSessionSchema, (result, c) => {
    if (result.success === false) {
      return c.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid session data',
            status: 400,
            details: result.error.issues,
          },
        },
        400,
      );
    }
  }),
  async (c) => {
    const user = c.get('user');
    const partId = c.req.param('id');
    const { name, sortOrder } = c.req.valid('json');

    const campaign = await getCampaignForPart(partId);
    const membership = await requireMembership(campaign.id, user.id);
    assertDm(membership);

    const [session] = await db
      .insert(campaignSessions)
      .values({
        partId,
        name,
        sortOrder,
        showcaseOwnerId: user.id,
      })
      .returning();

    return c.json({ data: session }, 201);
  },
);

// ===========================================================================
// Session-scoped routes: /api/sessions/:id
// ===========================================================================
export const sessionRoutes = new Hono<AuthEnv>();
sessionRoutes.use('*', requireAuth);

// ---------------------------------------------------------------------------
// PATCH /api/sessions/:id — Update session
// ---------------------------------------------------------------------------
const updateSessionSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  sortOrder: z.number().int().min(0).optional(),
  status: z.enum(['planned', 'played']).optional(),
});

sessionRoutes.patch(
  '/:id',
  zValidator('json', updateSessionSchema, (result, c) => {
    if (result.success === false) {
      return c.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid session data',
            status: 400,
            details: result.error.issues,
          },
        },
        400,
      );
    }
  }),
  async (c) => {
    const user = c.get('user');
    const sessionId = c.req.param('id');
    const updates = c.req.valid('json');

    const campaign = await getCampaignForSession(sessionId);
    const membership = await requireMembership(campaign.id, user.id);
    assertDm(membership);

    const [updated] = await db
      .update(campaignSessions)
      .set(updates)
      .where(eq(campaignSessions.id, sessionId))
      .returning();

    if (!updated) {
      throw new ApiError(404, 'SESSION_NOT_FOUND', 'Session not found');
    }

    return c.json({ data: updated });
  },
);

// ---------------------------------------------------------------------------
// PATCH /api/sessions/:id/showcase — Update session showcase
// ---------------------------------------------------------------------------
const updateSessionShowcaseSchema = z.object({
  showcaseJson: z.any().optional(),
  allowContributions: z.boolean().optional(),
});

sessionRoutes.patch(
  '/:id/showcase',
  zValidator('json', updateSessionShowcaseSchema, (result, c) => {
    if (result.success === false) {
      return c.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid showcase data',
            status: 400,
            details: result.error.issues,
          },
        },
        400,
      );
    }
  }),
  async (c) => {
    const user = c.get('user');
    const sessionId = c.req.param('id');
    const body = c.req.valid('json');

    const campaign = await getCampaignForSession(sessionId);
    const membership = await requireMembership(campaign.id, user.id);

    const [session] = await db
      .select()
      .from(campaignSessions)
      .where(eq(campaignSessions.id, sessionId))
      .limit(1);

    if (!session) {
      throw new ApiError(404, 'SESSION_NOT_FOUND', 'Session not found');
    }

    const isOwner = session.showcaseOwnerId === user.id;
    const isDm = membership.role === 'dm';
    const canEdit = isDm || isOwner || session.allowContributions;
    if (!canEdit) {
      throw new ApiError(
        403,
        'NOT_AUTHORIZED',
        'Only the owner, DM, or contributors can edit this showcase',
      );
    }

    const updates: Record<string, unknown> = {};
    if (body.showcaseJson !== undefined) updates.showcaseJson = body.showcaseJson;
    if (body.allowContributions !== undefined && isDm) {
      updates.allowContributions = body.allowContributions;
    }

    const [updated] = await db
      .update(campaignSessions)
      .set(updates)
      .where(eq(campaignSessions.id, sessionId))
      .returning();

    return c.json({ data: updated });
  },
);

// ---------------------------------------------------------------------------
// DELETE /api/sessions/:id — Delete session
// ---------------------------------------------------------------------------
sessionRoutes.delete('/:id', async (c) => {
  const user = c.get('user');
  const sessionId = c.req.param('id');

  const campaign = await getCampaignForSession(sessionId);
  const membership = await requireMembership(campaign.id, user.id);
  assertDm(membership);

  const [deleted] = await db
    .delete(campaignSessions)
    .where(eq(campaignSessions.id, sessionId))
    .returning();

  if (!deleted) {
    throw new ApiError(404, 'SESSION_NOT_FOUND', 'Session not found');
  }

  return c.json({ data: { id: deleted.id } });
});
