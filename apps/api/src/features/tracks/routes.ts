import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import { db } from '../../db';
import {
  investigationTracks,
  trackMilestones,
  playerTrackProgress,
  campaignMembers,
  users,
} from '../../db/schema';
import { ApiError } from '../../lib/api-error';
import { requireAuth, type AuthEnv } from '../auth/middleware';

const app = new Hono<AuthEnv>();

app.use('*', requireAuth);

// ---------------------------------------------------------------------------
// Helper: verify campaign membership, optionally require DM role
// ---------------------------------------------------------------------------
async function verifyCampaignMember(
  userId: string,
  campaignId: string,
  requireDm = false,
) {
  const conditions = [
    eq(campaignMembers.campaignId, campaignId),
    eq(campaignMembers.userId, userId),
  ];
  if (requireDm) {
    conditions.push(eq(campaignMembers.role, 'dm'));
  }

  const [membership] = await db
    .select()
    .from(campaignMembers)
    .where(and(...conditions))
    .limit(1);

  return membership ?? null;
}

// ---------------------------------------------------------------------------
// POST /api/campaigns/:campaignId/tracks — Create investigation track (DM)
// ---------------------------------------------------------------------------
const createTrackSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  milestones: z
    .array(
      z.object({
        title: z.string().min(1).max(200),
        threshold: z.number().int().min(1),
        description: z.string().max(2000).optional(),
      }),
    )
    .optional(),
});

app.post(
  '/campaigns/:campaignId/tracks',
  zValidator('json', createTrackSchema, (result, c) => {
    if (result.success === false) {
      return c.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid track data',
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
    const campaignId = c.req.param('campaignId');

    const membership = await verifyCampaignMember(user.id, campaignId, true);
    if (!membership) {
      throw new ApiError(403, 'NOT_DM', 'Only the DM can create tracks');
    }

    const { name, description, milestones } = c.req.valid('json');

    const [track] = await db
      .insert(investigationTracks)
      .values({
        campaignId,
        name,
        description: description ?? null,
      })
      .returning();

    // Insert milestones if provided
    let insertedMilestones: typeof trackMilestones.$inferSelect[] = [];
    if (milestones && milestones.length > 0) {
      insertedMilestones = await db
        .insert(trackMilestones)
        .values(
          milestones.map((m) => ({
            trackId: track.id,
            title: m.title,
            threshold: m.threshold,
            description: m.description ?? null,
          })),
        )
        .returning();
    }

    return c.json(
      {
        data: {
          ...track,
          milestones: insertedMilestones,
        },
      },
      201,
    );
  },
);

// ---------------------------------------------------------------------------
// GET /api/campaigns/:campaignId/tracks — List tracks for a campaign
// ---------------------------------------------------------------------------
app.get('/campaigns/:campaignId/tracks', async (c) => {
  const user = c.get('user');
  const campaignId = c.req.param('campaignId');

  const membership = await verifyCampaignMember(user.id, campaignId);
  if (!membership) {
    throw new ApiError(
      404,
      'CAMPAIGN_NOT_FOUND',
      'Campaign not found or you are not a member',
    );
  }

  const tracks = await db
    .select()
    .from(investigationTracks)
    .where(eq(investigationTracks.campaignId, campaignId))
    .orderBy(investigationTracks.createdAt);

  // Get milestone counts and player progress summary per track
  const trackData = await Promise.all(
    tracks.map(async (track) => {
      const milestones = await db
        .select()
        .from(trackMilestones)
        .where(eq(trackMilestones.trackId, track.id))
        .orderBy(trackMilestones.threshold);

      const progress = await db
        .select({
          playerId: playerTrackProgress.playerId,
          progress: playerTrackProgress.progress,
          displayName: users.displayName,
        })
        .from(playerTrackProgress)
        .innerJoin(users, eq(playerTrackProgress.playerId, users.id))
        .where(eq(playerTrackProgress.trackId, track.id));

      return {
        ...track,
        milestoneCount: milestones.length,
        maxThreshold: milestones.length > 0
          ? Math.max(...milestones.map((m) => m.threshold))
          : 0,
        playerProgress: progress,
      };
    }),
  );

  return c.json({ data: trackData });
});

// ---------------------------------------------------------------------------
// GET /api/tracks/:id — Get track details with milestones and progress
// ---------------------------------------------------------------------------
app.get('/tracks/:id', async (c) => {
  const user = c.get('user');
  const trackId = c.req.param('id');

  const [track] = await db
    .select()
    .from(investigationTracks)
    .where(eq(investigationTracks.id, trackId))
    .limit(1);

  if (!track) {
    throw new ApiError(404, 'TRACK_NOT_FOUND', 'Investigation track not found');
  }

  // Verify membership
  const membership = await verifyCampaignMember(user.id, track.campaignId);
  if (!membership) {
    throw new ApiError(404, 'TRACK_NOT_FOUND', 'Investigation track not found');
  }

  const milestones = await db
    .select()
    .from(trackMilestones)
    .where(eq(trackMilestones.trackId, trackId))
    .orderBy(trackMilestones.threshold);

  const progress = await db
    .select({
      playerId: playerTrackProgress.playerId,
      progress: playerTrackProgress.progress,
      updatedAt: playerTrackProgress.updatedAt,
      displayName: users.displayName,
      avatarUrl: users.avatarUrl,
    })
    .from(playerTrackProgress)
    .innerJoin(users, eq(playerTrackProgress.playerId, users.id))
    .where(eq(playerTrackProgress.trackId, trackId));

  return c.json({
    data: {
      ...track,
      role: membership.role,
      milestones,
      playerProgress: progress,
    },
  });
});

// ---------------------------------------------------------------------------
// POST /api/tracks/:id/progress — Update player progress on a track (DM only)
// ---------------------------------------------------------------------------
const updateProgressSchema = z.object({
  playerId: z.string().uuid(),
  progress: z.number().int().min(0),
});

app.post(
  '/tracks/:id/progress',
  zValidator('json', updateProgressSchema, (result, c) => {
    if (result.success === false) {
      return c.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid progress data',
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
    const trackId = c.req.param('id');

    // Get the track to find the campaign
    const [track] = await db
      .select()
      .from(investigationTracks)
      .where(eq(investigationTracks.id, trackId))
      .limit(1);

    if (!track) {
      throw new ApiError(
        404,
        'TRACK_NOT_FOUND',
        'Investigation track not found',
      );
    }

    // Verify caller is DM
    const membership = await verifyCampaignMember(
      user.id,
      track.campaignId,
      true,
    );
    if (!membership) {
      throw new ApiError(
        403,
        'NOT_DM',
        'Only the DM can update player progress',
      );
    }

    const { playerId, progress } = c.req.valid('json');

    // Verify the player is a member of the campaign
    const playerMembership = await verifyCampaignMember(
      playerId,
      track.campaignId,
    );
    if (!playerMembership) {
      throw new ApiError(
        404,
        'PLAYER_NOT_FOUND',
        'Player is not a member of this campaign',
      );
    }

    // Upsert progress
    const [updated] = await db
      .insert(playerTrackProgress)
      .values({
        playerId,
        trackId,
        progress,
      })
      .onConflictDoUpdate({
        target: [playerTrackProgress.playerId, playerTrackProgress.trackId],
        set: {
          progress,
          updatedAt: new Date(),
        },
      })
      .returning();

    return c.json({ data: updated });
  },
);

export default app;
