import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { hash } from '@node-rs/argon2';
import {
  users,
  campaigns,
  campaignMembers,
  campaignParts,
  campaignSessions,
  loreFragments,
} from './schema';
import { sql, eq } from 'drizzle-orm';

const DATABASE_URL = process.env['DATABASE_URL'];
if (!DATABASE_URL) {
  console.error('DATABASE_URL is required to run the seed script.');
  process.exit(1);
}

const client = postgres(DATABASE_URL);
const db = drizzle(client);

const SEED_PASSWORD = '1234567890';

const seedUserDefs = [
  { username: 'DM1', email: 'dm1@test.local', displayName: 'DM1' },
  { username: 'DM2', email: 'dm2@test.local', displayName: 'DM2' },
  { username: 'DM3', email: 'dm3@test.local', displayName: 'DM3' },
  { username: 'DM4', email: 'dm4@test.local', displayName: 'DM4' },
  { username: 'player1', email: 'player1@test.local', displayName: 'Player 1' },
  { username: 'player2', email: 'player2@test.local', displayName: 'Player 2' },
  { username: 'player3', email: 'player3@test.local', displayName: 'Player 3' },
  { username: 'player4', email: 'player4@test.local', displayName: 'Player 4' },
  { username: 'player5', email: 'player5@test.local', displayName: 'Player 5' },
];

async function getUserIdByEmail(email: string): Promise<string> {
  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return user.id;
}

const seedCampaigns = [
  {
    name: 'Curse of Strahd',
    description:
      'A gothic horror adventure set in the mist-shrouded land of Barovia.',
    dmEmail: 'dm1@test.local',
    playerEmails: [
      'player1@test.local',
      'player2@test.local',
      'player3@test.local',
    ],
  },
  {
    name: 'Tomb of Annihilation',
    description:
      'A death-defying adventure through the jungles of Chult to stop the Soulmonger.',
    dmEmail: 'dm2@test.local',
    playerEmails: [
      'player4@test.local',
      'player5@test.local',
      'player1@test.local',
    ],
  },
  {
    name: 'Waterdeep Dragon Heist',
    description: 'Urban intrigue in the City of Splendors.',
    dmEmail: 'dm1@test.local',
    playerEmails: ['player2@test.local', 'player5@test.local'],
  },
];

async function seed() {
  console.log('Seeding database...');
  console.log('  Hashing seed password...');
  const hashedPassword = await hash(SEED_PASSWORD);

  // --- Users ---
  for (const u of seedUserDefs) {
    await db
      .insert(users)
      .values({ ...u, hashedPassword })
      .onConflictDoUpdate({
        target: users.email,
        set: {
          displayName: sql`excluded.display_name`,
          username: sql`excluded.username`,
          hashedPassword: sql`excluded.hashed_password`,
          updatedAt: sql`now()`,
        },
      });
    console.log(`  Upserted user: ${u.username} (${u.email})`);
  }

  // --- Campaigns ---
  for (const c of seedCampaigns) {
    const dmId = await getUserIdByEmail(c.dmEmail);

    const [campaign] = await db
      .insert(campaigns)
      .values({
        name: c.name,
        description: c.description,
        dmId,
      })
      .onConflictDoNothing()
      .returning();

    // If campaign already existed (name isn't unique so this is just for re-runs)
    if (!campaign) {
      console.log(`  Campaign already exists (skipped): ${c.name}`);
      continue;
    }

    // Add DM as member
    await db
      .insert(campaignMembers)
      .values({ campaignId: campaign.id, userId: dmId, role: 'dm' })
      .onConflictDoNothing();

    // Add players
    for (const playerEmail of c.playerEmails) {
      const playerId = await getUserIdByEmail(playerEmail);
      await db
        .insert(campaignMembers)
        .values({
          campaignId: campaign.id,
          userId: playerId,
          role: 'player',
        })
        .onConflictDoNothing();
    }

    console.log(
      `  Created campaign: ${c.name} (DM: ${c.dmEmail}, ${c.playerEmails.length} players)`,
    );
  }

  // --- Parts, Sessions, Marker & Lore (for Curse of Strahd) ---
  const [strahd] = await db
    .select()
    .from(campaigns)
    .where(eq(campaigns.name, 'Curse of Strahd'))
    .limit(1);

  if (strahd) {
    const existingParts = await db
      .select()
      .from(campaignParts)
      .where(eq(campaignParts.campaignId, strahd.id))
      .limit(1);

    if (existingParts.length === 0) {
      const dmId = await getUserIdByEmail('dm1@test.local');
      const player1Id = await getUserIdByEmail('player1@test.local');
      const player2Id = await getUserIdByEmail('player2@test.local');

      // Part 1: Death House
      const [part1] = await db
        .insert(campaignParts)
        .values({
          campaignId: strahd.id,
          name: 'Part 1: Death House',
          sortOrder: 1,
          showcaseOwnerId: dmId,
        })
        .returning();

      // Part 2: Vallaki
      const [part2] = await db
        .insert(campaignParts)
        .values({
          campaignId: strahd.id,
          name: 'Part 2: Vallaki',
          sortOrder: 2,
          showcaseOwnerId: dmId,
        })
        .returning();

      // Sessions for Part 1
      const [session1] = await db
        .insert(campaignSessions)
        .values({
          partId: part1.id,
          name: 'Arrival at the Village',
          status: 'played',
          sortOrder: 1,
          showcaseOwnerId: dmId,
        })
        .returning();

      const [session2] = await db
        .insert(campaignSessions)
        .values({
          partId: part1.id,
          name: 'Exploring Death House',
          status: 'played',
          sortOrder: 2,
          showcaseOwnerId: dmId,
        })
        .returning();

      // Sessions for Part 2
      await db.insert(campaignSessions).values([
        {
          partId: part2.id,
          name: 'Road to Vallaki',
          status: 'planned',
          sortOrder: 1,
          showcaseOwnerId: dmId,
        },
        {
          partId: part2.id,
          name: 'The Festival',
          status: 'planned',
          sortOrder: 2,
          showcaseOwnerId: dmId,
        },
      ]);

      // Set marker: between session 2 and session 3 (downtime active)
      await db
        .update(campaigns)
        .set({
          markerSessionId: session2.id,
          markerBetween: true,
        })
        .where(eq(campaigns.id, strahd.id));

      // Lore fragments — campaign-level
      await db.insert(loreFragments).values({
        campaignId: strahd.id,
        ownerId: dmId,
        title: 'World Map',
        contentJson: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'A detailed map of Barovia and its surrounding regions.' }] }] },
        scope: 'story',
        visibility: 'public',
      });

      // Lore — session-level (story scope, auto-published)
      await db.insert(loreFragments).values({
        campaignId: strahd.id,
        ownerId: dmId,
        title: 'Session 1 Recap',
        contentJson: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'The party arrived at the Village of Barovia under a thick, unnatural fog.' }] }] },
        scope: 'story',
        visibility: 'public',
        sessionId: session1.id,
      });

      // Lore — session-level (private scope, shared with player1)
      await db.insert(loreFragments).values({
        campaignId: strahd.id,
        ownerId: player2Id,
        title: 'My notes on Rose',
        contentJson: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Rose seemed to know more than she let on about the house.' }] }] },
        scope: 'private',
        visibility: 'shared',
        sessionId: session1.id,
      });

      // Lore — DM private notes
      await db.insert(loreFragments).values({
        campaignId: strahd.id,
        ownerId: dmId,
        title: 'DM prep notes',
        contentJson: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Remember to introduce Strahd in a dramatic fashion during session 3.' }] }] },
        scope: 'private',
        visibility: 'private',
        sessionId: session2.id,
      });

      // Lore — player profile (player1 backstory)
      await db.insert(loreFragments).values({
        campaignId: strahd.id,
        ownerId: player1Id,
        title: 'Backstory',
        contentJson: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Ireena grew up in the village, unaware of the dark curse that binds Barovia.' }] }] },
        scope: 'private',
        visibility: 'public',
        playerId: player1Id,
      });

      console.log('  Created parts, sessions, marker & lore for Curse of Strahd');
    } else {
      console.log('  Parts/sessions already exist (skipped)');
    }
  }

  console.log('Seed complete.');
  console.log('\n  Login credentials (all users): password = 1234567890');
  console.log('  DMs: DM1, DM2, DM3, DM4');
  console.log('  Players: player1, player2, player3, player4, player5\n');
  await client.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
