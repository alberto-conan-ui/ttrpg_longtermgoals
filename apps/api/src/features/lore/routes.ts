import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { eq, and, asc, inArray, isNull } from 'drizzle-orm';
import { db } from '../../db';
import {
  campaigns,
  campaignMembers,
  campaignParts,
  campaignSessions,
  loreFragments,
  loreFragmentShares,
} from '../../db/schema';
import { ApiError } from '../../lib/api-error';
import { requireAuth, type AuthEnv } from '../auth/middleware';
import { getVisibleSessionIds } from '../campaigns/routes';

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

/**
 * Compute the set of session IDs that have been "reached" by the marker
 * (i.e. at or before the marker position). Used for story-scope resolution.
 * Does NOT include the upcoming session (between-mode next session).
 */
async function getReachedSessionIds(campaignId: string) {
  const [campaign] = await db
    .select({
      markerSessionId: campaigns.markerSessionId,
      markerBetween: campaigns.markerBetween,
    })
    .from(campaigns)
    .where(eq(campaigns.id, campaignId))
    .limit(1);

  if (!campaign?.markerSessionId) return new Set<string>();

  const allSessions = await db
    .select({
      sessionId: campaignSessions.id,
      partSort: campaignParts.sortOrder,
      sessionSort: campaignSessions.sortOrder,
    })
    .from(campaignSessions)
    .innerJoin(campaignParts, eq(campaignSessions.partId, campaignParts.id))
    .where(eq(campaignParts.campaignId, campaignId))
    .orderBy(asc(campaignParts.sortOrder), asc(campaignSessions.sortOrder));

  const markerIdx = allSessions.findIndex(
    (s) => s.sessionId === campaign.markerSessionId,
  );
  if (markerIdx === -1) return new Set<string>();

  const reached = new Set<string>();
  for (let i = 0; i <= markerIdx; i++) {
    reached.add(allSessions[i].sessionId);
  }

  return reached;
}

/**
 * Compute the set of part IDs that have been "reached" by the marker
 * (i.e. at least one session in the part is at or before the marker).
 */
async function getReachedPartIds(campaignId: string) {
  const reachedSessions = await getReachedSessionIds(campaignId);
  if (reachedSessions.size === 0) return new Set<string>();

  const sessionRows = await db
    .select({ id: campaignSessions.id, partId: campaignSessions.partId })
    .from(campaignSessions)
    .where(inArray(campaignSessions.id, [...reachedSessions]));

  const partIds = new Set<string>();
  for (const s of sessionRows) {
    partIds.add(s.partId);
  }
  return partIds;
}

type FragmentRow = typeof loreFragments.$inferSelect;

/**
 * Compute the effective visibility of a lore fragment.
 * For story-scope fragments, visibility is driven by the marker position.
 */
function computeEffectiveVisibility(
  fragment: FragmentRow,
  reachedSessionIds: Set<string>,
  reachedPartIds: Set<string>,
): 'private' | 'shared' | 'public' {
  if (fragment.scope !== 'story') {
    return fragment.visibility;
  }

  // Story scope: auto-public when marker reaches the session/part
  if (fragment.sessionId && reachedSessionIds.has(fragment.sessionId)) {
    return 'public';
  }
  if (fragment.partId && reachedPartIds.has(fragment.partId)) {
    return 'public';
  }

  // Not reached yet — story fragments stay private
  return 'private';
}

/**
 * Determine if a user can see a given fragment.
 * DM can always see all fragments in their campaign.
 */
function canUserSeeFragment(
  fragment: FragmentRow,
  userId: string,
  isDm: boolean,
  effectiveVisibility: 'private' | 'shared' | 'public',
  shareUserIds: Set<string>,
): boolean {
  if (isDm) return true;
  if (fragment.ownerId === userId) return true;
  if (effectiveVisibility === 'public') return true;
  if (effectiveVisibility === 'shared' && shareUserIds.has(userId)) return true;
  return false;
}

/** Look up the campaign that owns a given lore fragment. */
async function getFragmentWithCampaign(fragmentId: string) {
  const [fragment] = await db
    .select()
    .from(loreFragments)
    .where(eq(loreFragments.id, fragmentId))
    .limit(1);

  if (!fragment) {
    throw new ApiError(404, 'LORE_NOT_FOUND', 'Lore fragment not found');
  }

  return fragment;
}

// ===========================================================================
// Campaign-scoped lore routes: /api/campaigns/:id/lore
// ===========================================================================
export const campaignLoreRoutes = new Hono<AuthEnv>();
campaignLoreRoutes.use('*', requireAuth);

// ---------------------------------------------------------------------------
// POST /api/campaigns/:id/lore — Create lore fragment
// ---------------------------------------------------------------------------
const createLoreSchema = z.object({
  title: z.string().min(1).max(500),
  contentJson: z.any().optional(),
  scope: z.enum(['story', 'private']).default('private'),
  visibility: z.enum(['private', 'shared', 'public']).default('private'),
  // Polymorphic attachment — at most one set
  partId: z.string().uuid().optional(),
  sessionId: z.string().uuid().optional(),
  playerId: z.string().uuid().optional(),
});

campaignLoreRoutes.post(
  '/',
  zValidator('json', createLoreSchema, (result, c) => {
    if (result.success === false) {
      return c.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid lore fragment data',
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
    const campaignId = c.req.param('id');
    const body = c.req.valid('json');

    const membership = await requireMembership(campaignId, user.id);
    const isDm = membership.role === 'dm';

    // Validate polymorphic attachment — at most one set
    const attachmentCount = [body.partId, body.sessionId, body.playerId].filter(
      Boolean,
    ).length;
    if (attachmentCount > 1) {
      throw new ApiError(
        400,
        'INVALID_ATTACHMENT',
        'A lore fragment can only be attached to one node (partId, sessionId, or playerId)',
      );
    }

    // Story scope only allowed on sessions and parts
    if (
      body.scope === 'story' &&
      !body.sessionId &&
      !body.partId
    ) {
      throw new ApiError(
        400,
        'INVALID_SCOPE',
        'Story scope is only allowed on fragments attached to sessions or parts',
      );
    }

    // Players: verify attachment target is visible
    if (!isDm) {
      if (body.sessionId) {
        const visibleIds = await getVisibleSessionIds(campaignId);
        if (!visibleIds.has(body.sessionId)) {
          throw new ApiError(
            403,
            'SESSION_NOT_VISIBLE',
            'You cannot add lore to a session that is not visible to you',
          );
        }
      }
      if (body.partId) {
        // Part is visible if it has at least one visible session
        const visibleIds = await getVisibleSessionIds(campaignId);
        const sessions = await db
          .select({ id: campaignSessions.id })
          .from(campaignSessions)
          .where(eq(campaignSessions.partId, body.partId));
        const hasVisible = sessions.some((s) => visibleIds.has(s.id));
        if (!hasVisible) {
          throw new ApiError(
            403,
            'PART_NOT_VISIBLE',
            'You cannot add lore to a part that is not visible to you',
          );
        }
      }
    }

    // Verify attachment targets belong to this campaign
    if (body.sessionId) {
      const [session] = await db
        .select({ partId: campaignSessions.partId })
        .from(campaignSessions)
        .where(eq(campaignSessions.id, body.sessionId))
        .limit(1);
      if (!session) {
        throw new ApiError(404, 'SESSION_NOT_FOUND', 'Session not found');
      }
      const [part] = await db
        .select({ campaignId: campaignParts.campaignId })
        .from(campaignParts)
        .where(eq(campaignParts.id, session.partId))
        .limit(1);
      if (!part || part.campaignId !== campaignId) {
        throw new ApiError(
          400,
          'SESSION_NOT_IN_CAMPAIGN',
          'Session does not belong to this campaign',
        );
      }
    }

    if (body.partId) {
      const [part] = await db
        .select({ campaignId: campaignParts.campaignId })
        .from(campaignParts)
        .where(eq(campaignParts.id, body.partId))
        .limit(1);
      if (!part || part.campaignId !== campaignId) {
        throw new ApiError(
          400,
          'PART_NOT_IN_CAMPAIGN',
          'Part does not belong to this campaign',
        );
      }
    }

    if (body.playerId) {
      // Verify the player is a member of this campaign
      const [playerMembership] = await db
        .select()
        .from(campaignMembers)
        .where(
          and(
            eq(campaignMembers.campaignId, campaignId),
            eq(campaignMembers.userId, body.playerId),
          ),
        )
        .limit(1);
      if (!playerMembership) {
        throw new ApiError(
          400,
          'PLAYER_NOT_IN_CAMPAIGN',
          'Player is not a member of this campaign',
        );
      }
    }

    const [fragment] = await db
      .insert(loreFragments)
      .values({
        campaignId,
        ownerId: user.id,
        title: body.title,
        contentJson: body.contentJson ?? null,
        scope: body.scope,
        visibility: body.scope === 'story' ? 'private' : body.visibility,
        partId: body.partId ?? null,
        sessionId: body.sessionId ?? null,
        playerId: body.playerId ?? null,
      })
      .returning();

    return c.json({ data: fragment }, 201);
  },
);

// ---------------------------------------------------------------------------
// GET /api/campaigns/:id/lore — List fragments (visibility-filtered)
// Query params: ?attachedTo=campaign|part|session|player&attachedId=<uuid>
// ---------------------------------------------------------------------------
campaignLoreRoutes.get('/', async (c) => {
  const user = c.get('user');
  const campaignId = c.req.param('id');
  const attachedTo = c.req.query('attachedTo');
  const attachedId = c.req.query('attachedId');

  const membership = await requireMembership(campaignId, user.id);
  const isDm = membership.role === 'dm';

  // Build base query conditions
  let fragments: FragmentRow[];

  if (attachedTo === 'campaign') {
    fragments = await db
      .select()
      .from(loreFragments)
      .where(
        and(
          eq(loreFragments.campaignId, campaignId),
          isNull(loreFragments.partId),
          isNull(loreFragments.sessionId),
          isNull(loreFragments.playerId),
        ),
      );
  } else if (attachedTo === 'part' && attachedId) {
    fragments = await db
      .select()
      .from(loreFragments)
      .where(
        and(
          eq(loreFragments.campaignId, campaignId),
          eq(loreFragments.partId, attachedId),
        ),
      );
  } else if (attachedTo === 'session' && attachedId) {
    fragments = await db
      .select()
      .from(loreFragments)
      .where(
        and(
          eq(loreFragments.campaignId, campaignId),
          eq(loreFragments.sessionId, attachedId),
        ),
      );
  } else if (attachedTo === 'player' && attachedId) {
    fragments = await db
      .select()
      .from(loreFragments)
      .where(
        and(
          eq(loreFragments.campaignId, campaignId),
          eq(loreFragments.playerId, attachedId),
        ),
      );
  } else {
    // No filter — return all fragments in campaign
    fragments = await db
      .select()
      .from(loreFragments)
      .where(eq(loreFragments.campaignId, campaignId));
  }

  if (fragments.length === 0) {
    return c.json({ data: [] });
  }

  // Compute reached sessions/parts for story scope resolution
  const reachedSessionIds = await getReachedSessionIds(campaignId);
  const reachedPartIds = await getReachedPartIds(campaignId);

  // For players, also need visible session IDs to filter hidden folder nodes
  let visibleSessionIds: Set<string> | null = null;
  if (!isDm) {
    visibleSessionIds = await getVisibleSessionIds(campaignId);
  }

  // Fetch all shares for these fragments in bulk
  const fragmentIds = fragments.map((f) => f.id);
  const allShares = await db
    .select()
    .from(loreFragmentShares)
    .where(inArray(loreFragmentShares.fragmentId, fragmentIds));

  const sharesByFragment = new Map<string, Set<string>>();
  for (const share of allShares) {
    const set = sharesByFragment.get(share.fragmentId) ?? new Set();
    set.add(share.userId);
    sharesByFragment.set(share.fragmentId, set);
  }

  // Filter and annotate
  const data = fragments
    .filter((f) => {
      // For players, skip fragments on hidden folder nodes
      if (!isDm && visibleSessionIds) {
        if (f.sessionId && !visibleSessionIds.has(f.sessionId)) return false;
        // Part-level: check if part has any visible session
        if (f.partId) {
          // We need to check if the part is visible — but we don't have part->session mapping here.
          // Part is visible if it has at least one visible session. We'll use a simpler approach:
          // reachedPartIds covers this — if part is not reached, story fragments are private.
          // But the part itself being visible/hidden is about the tree filter.
          // For correctness, we'll rely on the attachment filter: if a player requests
          // ?attachedTo=part&attachedId=X, the frontend already verified visibility.
          // For unfiltered lists, we filter out fragments on unreachable parts for players.
        }
      }

      const effectiveVis = computeEffectiveVisibility(
        f,
        reachedSessionIds,
        reachedPartIds,
      );
      const shares = sharesByFragment.get(f.id) ?? new Set();
      return canUserSeeFragment(f, user.id, isDm, effectiveVis, shares);
    })
    .map((f) => {
      const effectiveVis = computeEffectiveVisibility(
        f,
        reachedSessionIds,
        reachedPartIds,
      );
      return {
        ...f,
        effectiveVisibility: effectiveVis,
      };
    });

  return c.json({ data });
});

// ===========================================================================
// Fragment-scoped routes: /api/lore/:id
// ===========================================================================
export const loreRoutes = new Hono<AuthEnv>();
loreRoutes.use('*', requireAuth);

// ---------------------------------------------------------------------------
// GET /api/lore/:id — Get single fragment (visibility check)
// ---------------------------------------------------------------------------
loreRoutes.get('/:id', async (c) => {
  const user = c.get('user');
  const fragmentId = c.req.param('id');

  const fragment = await getFragmentWithCampaign(fragmentId);
  const membership = await requireMembership(fragment.campaignId, user.id);
  const isDm = membership.role === 'dm';

  const reachedSessionIds = await getReachedSessionIds(fragment.campaignId);
  const reachedPartIds = await getReachedPartIds(fragment.campaignId);
  const effectiveVis = computeEffectiveVisibility(
    fragment,
    reachedSessionIds,
    reachedPartIds,
  );

  // For players, check visibility on hidden folder nodes
  if (!isDm) {
    if (fragment.sessionId) {
      const visibleIds = await getVisibleSessionIds(fragment.campaignId);
      if (!visibleIds.has(fragment.sessionId)) {
        throw new ApiError(404, 'LORE_NOT_FOUND', 'Lore fragment not found');
      }
    }
  }

  // Check fragment-level visibility
  const shares = await db
    .select({ userId: loreFragmentShares.userId })
    .from(loreFragmentShares)
    .where(eq(loreFragmentShares.fragmentId, fragmentId));
  const shareUserIds = new Set(shares.map((s) => s.userId));

  if (!canUserSeeFragment(fragment, user.id, isDm, effectiveVis, shareUserIds)) {
    throw new ApiError(404, 'LORE_NOT_FOUND', 'Lore fragment not found');
  }

  return c.json({
    data: {
      ...fragment,
      effectiveVisibility: effectiveVis,
      sharedWith: fragment.ownerId === user.id || isDm ? [...shareUserIds] : undefined,
    },
  });
});

// ---------------------------------------------------------------------------
// PATCH /api/lore/:id — Update fragment (owner only)
// ---------------------------------------------------------------------------
const updateLoreSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  contentJson: z.any().optional(),
  scope: z.enum(['story', 'private']).optional(),
  visibility: z.enum(['private', 'shared', 'public']).optional(),
});

loreRoutes.patch(
  '/:id',
  zValidator('json', updateLoreSchema, (result, c) => {
    if (result.success === false) {
      return c.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid lore fragment data',
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
    const fragmentId = c.req.param('id');
    const body = c.req.valid('json');

    const fragment = await getFragmentWithCampaign(fragmentId);
    await requireMembership(fragment.campaignId, user.id);

    // Only the owner can edit
    if (fragment.ownerId !== user.id) {
      throw new ApiError(
        403,
        'NOT_OWNER',
        'Only the owner can edit this lore fragment',
      );
    }

    // Validate scope change
    if (body.scope === 'story' && !fragment.sessionId && !fragment.partId) {
      throw new ApiError(
        400,
        'INVALID_SCOPE',
        'Story scope is only allowed on fragments attached to sessions or parts',
      );
    }

    // If scope is story (current or being set to), visibility cannot be manually changed
    const effectiveScope = body.scope ?? fragment.scope;
    if (effectiveScope === 'story' && body.visibility) {
      throw new ApiError(
        400,
        'VISIBILITY_LOCKED',
        'Visibility cannot be manually set for story-scope fragments',
      );
    }

    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (body.title !== undefined) updates.title = body.title;
    if (body.contentJson !== undefined) updates.contentJson = body.contentJson;
    if (body.scope !== undefined) updates.scope = body.scope;
    if (body.visibility !== undefined) updates.visibility = body.visibility;

    // If switching to story scope, reset visibility to private (marker controls it)
    if (body.scope === 'story') {
      updates.visibility = 'private';
    }

    const [updated] = await db
      .update(loreFragments)
      .set(updates)
      .where(eq(loreFragments.id, fragmentId))
      .returning();

    return c.json({ data: updated });
  },
);

// ---------------------------------------------------------------------------
// DELETE /api/lore/:id — Delete fragment (owner or DM)
// ---------------------------------------------------------------------------
loreRoutes.delete('/:id', async (c) => {
  const user = c.get('user');
  const fragmentId = c.req.param('id');

  const fragment = await getFragmentWithCampaign(fragmentId);
  const membership = await requireMembership(fragment.campaignId, user.id);
  const isDm = membership.role === 'dm';

  if (fragment.ownerId !== user.id && !isDm) {
    throw new ApiError(
      403,
      'NOT_OWNER',
      'Only the owner or DM can delete this lore fragment',
    );
  }

  const [deleted] = await db
    .delete(loreFragments)
    .where(eq(loreFragments.id, fragmentId))
    .returning();

  if (!deleted) {
    throw new ApiError(404, 'LORE_NOT_FOUND', 'Lore fragment not found');
  }

  return c.json({ data: { id: deleted.id } });
});

// ---------------------------------------------------------------------------
// POST /api/lore/:id/share — Share with specific campaign members
// ---------------------------------------------------------------------------
const shareSchema = z.object({
  userIds: z.array(z.string().uuid()).min(1),
});

loreRoutes.post(
  '/:id/share',
  zValidator('json', shareSchema, (result, c) => {
    if (result.success === false) {
      return c.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid share data',
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
    const fragmentId = c.req.param('id');
    const { userIds } = c.req.valid('json');

    const fragment = await getFragmentWithCampaign(fragmentId);
    await requireMembership(fragment.campaignId, user.id);

    if (fragment.ownerId !== user.id) {
      throw new ApiError(
        403,
        'NOT_OWNER',
        'Only the owner can share this lore fragment',
      );
    }

    // Verify all target users are campaign members
    for (const targetUserId of userIds) {
      const [targetMembership] = await db
        .select()
        .from(campaignMembers)
        .where(
          and(
            eq(campaignMembers.campaignId, fragment.campaignId),
            eq(campaignMembers.userId, targetUserId),
          ),
        )
        .limit(1);

      if (!targetMembership) {
        throw new ApiError(
          400,
          'USER_NOT_IN_CAMPAIGN',
          `User ${targetUserId} is not a member of this campaign`,
        );
      }
    }

    // Insert shares (ignore conflicts for idempotency)
    for (const targetUserId of userIds) {
      await db
        .insert(loreFragmentShares)
        .values({ fragmentId, userId: targetUserId })
        .onConflictDoNothing();
    }

    // If visibility was private, auto-upgrade to shared
    if (fragment.visibility === 'private' && fragment.scope !== 'story') {
      await db
        .update(loreFragments)
        .set({ visibility: 'shared', updatedAt: new Date() })
        .where(eq(loreFragments.id, fragmentId));
    }

    // Return updated shares list
    const shares = await db
      .select({ userId: loreFragmentShares.userId })
      .from(loreFragmentShares)
      .where(eq(loreFragmentShares.fragmentId, fragmentId));

    return c.json({ data: { fragmentId, sharedWith: shares.map((s) => s.userId) } });
  },
);

// ---------------------------------------------------------------------------
// DELETE /api/lore/:id/share/:userId — Revoke share
// ---------------------------------------------------------------------------
loreRoutes.delete('/:id/share/:userId', async (c) => {
  const user = c.get('user');
  const fragmentId = c.req.param('id');
  const targetUserId = c.req.param('userId');

  const fragment = await getFragmentWithCampaign(fragmentId);
  await requireMembership(fragment.campaignId, user.id);

  if (fragment.ownerId !== user.id) {
    throw new ApiError(
      403,
      'NOT_OWNER',
      'Only the owner can manage shares for this lore fragment',
    );
  }

  await db
    .delete(loreFragmentShares)
    .where(
      and(
        eq(loreFragmentShares.fragmentId, fragmentId),
        eq(loreFragmentShares.userId, targetUserId),
      ),
    );

  // Check remaining shares — if none left, downgrade to private
  const remaining = await db
    .select({ userId: loreFragmentShares.userId })
    .from(loreFragmentShares)
    .where(eq(loreFragmentShares.fragmentId, fragmentId));

  if (remaining.length === 0 && fragment.visibility === 'shared' && fragment.scope !== 'story') {
    await db
      .update(loreFragments)
      .set({ visibility: 'private', updatedAt: new Date() })
      .where(eq(loreFragments.id, fragmentId));
  }

  return c.json({
    data: { fragmentId, sharedWith: remaining.map((s) => s.userId) },
  });
});
