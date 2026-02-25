import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { eq, and, asc, inArray } from 'drizzle-orm';
import { db } from '../../db';
import {
  campaigns,
  campaignMembers,
  campaignParts,
  campaignSessions,
  users,
} from '../../db/schema';
import { ApiError } from '../../lib/api-error';
import { requireAuth, type AuthEnv } from '../auth/middleware';

const app = new Hono<AuthEnv>();

// All campaign routes require authentication
app.use('*', requireAuth);

// ---------------------------------------------------------------------------
// POST /api/campaigns — Create a campaign
// ---------------------------------------------------------------------------
const createCampaignSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
});

app.post(
  '/',
  zValidator('json', createCampaignSchema, (result, c) => {
    if (result.success === false) {
      return c.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid campaign data',
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
    const { name, description } = c.req.valid('json');

    const [campaign] = await db
      .insert(campaigns)
      .values({
        name,
        description: description ?? null,
        dmId: user.id,
      })
      .returning();

    // Add the DM as a member with 'dm' role
    await db.insert(campaignMembers).values({
      campaignId: campaign.id,
      userId: user.id,
      role: 'dm',
    });

    return c.json(
      {
        data: {
          ...campaign,
          role: 'dm' as const,
          memberCount: 1,
        },
      },
      201,
    );
  },
);

// ---------------------------------------------------------------------------
// GET /api/campaigns — List campaigns for the current user
// ---------------------------------------------------------------------------
app.get('/', async (c) => {
  const user = c.get('user');

  const memberships = await db
    .select({
      campaign: campaigns,
      role: campaignMembers.role,
    })
    .from(campaignMembers)
    .innerJoin(campaigns, eq(campaignMembers.campaignId, campaigns.id))
    .where(eq(campaignMembers.userId, user.id))
    .orderBy(campaigns.updatedAt);

  // Get member counts for each campaign
  const campaignIds = memberships.map((m) => m.campaign.id);

  let memberCountMap: Record<string, number> = {};
  if (campaignIds.length > 0) {
    const counts = await Promise.all(
      campaignIds.map(async (id) => {
        const members = await db
          .select({ userId: campaignMembers.userId })
          .from(campaignMembers)
          .where(eq(campaignMembers.campaignId, id));
        return { id, count: members.length };
      }),
    );
    memberCountMap = Object.fromEntries(counts.map((c) => [c.id, c.count]));
  }

  // Get DM display names
  const dmIds = [...new Set(memberships.map((m) => m.campaign.dmId))];
  let dmNameMap: Record<string, string> = {};
  if (dmIds.length > 0) {
    const dms = await Promise.all(
      dmIds.map(async (id) => {
        const [dm] = await db
          .select({ id: users.id, displayName: users.displayName })
          .from(users)
          .where(eq(users.id, id))
          .limit(1);
        return dm;
      }),
    );
    dmNameMap = Object.fromEntries(dms.map((d) => [d.id, d.displayName]));
  }

  const data = memberships.map((m) => ({
    ...m.campaign,
    role: m.role,
    memberCount: memberCountMap[m.campaign.id] ?? 0,
    dmDisplayName: dmNameMap[m.campaign.dmId] ?? 'Unknown',
  }));

  return c.json({ data });
});

// ---------------------------------------------------------------------------
// GET /api/campaigns/:id — Get campaign details
// ---------------------------------------------------------------------------
app.get('/:id', async (c) => {
  const user = c.get('user');
  const campaignId = c.req.param('id');

  // Verify user is a member
  const [membership] = await db
    .select()
    .from(campaignMembers)
    .where(
      and(
        eq(campaignMembers.campaignId, campaignId),
        eq(campaignMembers.userId, user.id),
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

  const [campaign] = await db
    .select()
    .from(campaigns)
    .where(eq(campaigns.id, campaignId))
    .limit(1);

  if (!campaign) {
    throw new ApiError(404, 'CAMPAIGN_NOT_FOUND', 'Campaign not found');
  }

  // Get all members with user info
  const members = await db
    .select({
      userId: campaignMembers.userId,
      role: campaignMembers.role,
      joinedAt: campaignMembers.joinedAt,
      displayName: users.displayName,
      avatarUrl: users.avatarUrl,
    })
    .from(campaignMembers)
    .innerJoin(users, eq(campaignMembers.userId, users.id))
    .where(eq(campaignMembers.campaignId, campaignId));

  return c.json({
    data: {
      ...campaign,
      role: membership.role,
      members,
    },
  });
});

// ---------------------------------------------------------------------------
// POST /api/campaigns/:id/invite — Generate/regenerate invite code (DM only)
// ---------------------------------------------------------------------------
app.post('/:id/invite', async (c) => {
  const user = c.get('user');
  const campaignId = c.req.param('id');

  // Verify user is the DM
  const [membership] = await db
    .select()
    .from(campaignMembers)
    .where(
      and(
        eq(campaignMembers.campaignId, campaignId),
        eq(campaignMembers.userId, user.id),
        eq(campaignMembers.role, 'dm'),
      ),
    )
    .limit(1);

  if (!membership) {
    throw new ApiError(
      403,
      'NOT_DM',
      'Only the DM can generate invite codes',
    );
  }

  // Generate a short random invite code
  const code = crypto.randomUUID().slice(0, 8).toUpperCase();

  const [updated] = await db
    .update(campaigns)
    .set({ inviteCode: code, updatedAt: new Date() })
    .where(eq(campaigns.id, campaignId))
    .returning();

  if (!updated) {
    throw new ApiError(404, 'CAMPAIGN_NOT_FOUND', 'Campaign not found');
  }

  return c.json({ data: { inviteCode: code } });
});

// ---------------------------------------------------------------------------
// POST /api/campaigns/join — Join a campaign via invite code
// ---------------------------------------------------------------------------
const joinSchema = z.object({
  inviteCode: z.string().min(1),
});

app.post(
  '/join',
  zValidator('json', joinSchema, (result, c) => {
    if (result.success === false) {
      return c.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid join data',
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
    const { inviteCode } = c.req.valid('json');

    // Find campaign by invite code
    const [campaign] = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.inviteCode, inviteCode.toUpperCase()))
      .limit(1);

    if (!campaign) {
      throw new ApiError(
        404,
        'INVALID_INVITE_CODE',
        'No campaign found with that invite code',
      );
    }

    // Check if already a member
    const [existing] = await db
      .select()
      .from(campaignMembers)
      .where(
        and(
          eq(campaignMembers.campaignId, campaign.id),
          eq(campaignMembers.userId, user.id),
        ),
      )
      .limit(1);

    if (existing) {
      throw new ApiError(
        409,
        'ALREADY_MEMBER',
        'You are already a member of this campaign',
      );
    }

    // Add as player
    await db.insert(campaignMembers).values({
      campaignId: campaign.id,
      userId: user.id,
      role: 'player',
    });

    return c.json({
      data: {
        campaignId: campaign.id,
        campaignName: campaign.name,
        role: 'player' as const,
      },
    });
  },
);

// ---------------------------------------------------------------------------
// POST /api/campaigns/:id/parts — Create part (DM only)
// ---------------------------------------------------------------------------
const createPartSchema = z.object({
  name: z.string().min(1).max(200),
  sortOrder: z.number().int().min(0),
});

app.post(
  '/:id/parts',
  zValidator('json', createPartSchema, (result, c) => {
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
    const campaignId = c.req.param('id');
    const { name, sortOrder } = c.req.valid('json');

    // Verify DM
    const [membership] = await db
      .select()
      .from(campaignMembers)
      .where(
        and(
          eq(campaignMembers.campaignId, campaignId),
          eq(campaignMembers.userId, user.id),
          eq(campaignMembers.role, 'dm'),
        ),
      )
      .limit(1);

    if (!membership) {
      throw new ApiError(403, 'NOT_DM', 'Only the DM can create parts');
    }

    const [part] = await db
      .insert(campaignParts)
      .values({
        campaignId,
        name,
        sortOrder,
        showcaseOwnerId: user.id,
      })
      .returning();

    return c.json({ data: part }, 201);
  },
);

// ---------------------------------------------------------------------------
// GET /api/campaigns/:id/parts — List parts with sessions (visibility-filtered)
// ---------------------------------------------------------------------------
app.get('/:id/parts', async (c) => {
  const user = c.get('user');
  const campaignId = c.req.param('id');

  // Verify membership
  const [membership] = await db
    .select()
    .from(campaignMembers)
    .where(
      and(
        eq(campaignMembers.campaignId, campaignId),
        eq(campaignMembers.userId, user.id),
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

  const isDm = membership.role === 'dm';

  // Fetch all parts ordered
  const parts = await db
    .select()
    .from(campaignParts)
    .where(eq(campaignParts.campaignId, campaignId))
    .orderBy(asc(campaignParts.sortOrder));

  if (parts.length === 0) {
    return c.json({ data: [] });
  }

  // Fetch all sessions for these parts
  const partIds = parts.map((p) => p.id);
  const allSessions = await db
    .select()
    .from(campaignSessions)
    .where(inArray(campaignSessions.partId, partIds))
    .orderBy(asc(campaignSessions.sortOrder));

  // Build map: partId → sessions
  const sessionsByPart = new Map<string, (typeof allSessions)[number][]>();
  for (const s of allSessions) {
    const list = sessionsByPart.get(s.partId) ?? [];
    list.push(s);
    sessionsByPart.set(s.partId, list);
  }

  // For players, compute visibility based on marker
  let visibleIds: Set<string> | null = null;
  if (!isDm) {
    visibleIds = await getVisibleSessionIds(campaignId);
  }

  // Assemble response — filter sessions and omit empty parts for players
  const data = parts
    .map((part) => {
      const sessions = sessionsByPart.get(part.id) ?? [];
      const filteredSessions =
        visibleIds === null
          ? sessions
          : sessions.filter((s) => visibleIds.has(s.id));

      return {
        ...part,
        sessions: filteredSessions,
      };
    })
    .filter((part) => {
      // DMs see all parts. Players only see parts with at least one visible session.
      if (isDm) return true;
      return part.sessions.length > 0;
    });

  return c.json({ data });
});

// ---------------------------------------------------------------------------
// Visibility helper — determines which session IDs are visible to a player
// ---------------------------------------------------------------------------
async function getVisibleSessionIds(campaignId: string) {
  const [campaign] = await db
    .select({
      markerSessionId: campaigns.markerSessionId,
      markerBetween: campaigns.markerBetween,
    })
    .from(campaigns)
    .where(eq(campaigns.id, campaignId))
    .limit(1);

  if (!campaign) return new Set<string>();

  // No marker → preparation mode, players see nothing
  if (!campaign.markerSessionId) return new Set<string>();

  // Get all sessions ordered globally (part sortOrder, then session sortOrder)
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

  // Find the marker index
  const markerIdx = allSessions.findIndex(
    (s) => s.sessionId === campaign.markerSessionId,
  );
  if (markerIdx === -1) return new Set<string>();

  // Sessions at or before the marker are visible
  const visible = new Set<string>();
  for (let i = 0; i <= markerIdx; i++) {
    visible.add(allSessions[i].sessionId);
  }

  // If marker is "between", the next session (upcoming) is also visible
  if (campaign.markerBetween && markerIdx + 1 < allSessions.length) {
    visible.add(allSessions[markerIdx + 1].sessionId);
  }

  return visible;
}

export default app;
