import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import { db } from '../../db';
import { campaigns, campaignMembers, users } from '../../db/schema';
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

export default app;
