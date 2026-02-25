import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { hash } from '@node-rs/argon2';
import {
  users,
  campaigns,
  campaignMembers,
  investigationTracks,
  trackMilestones,
  playerTrackProgress,
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

  // --- Investigation Tracks (for first campaign: Curse of Strahd) ---
  // Find the Curse of Strahd campaign
  const [strahd] = await db
    .select()
    .from(campaigns)
    .where(eq(campaigns.name, 'Curse of Strahd'))
    .limit(1);

  if (strahd) {
    const existingTracks = await db
      .select()
      .from(investigationTracks)
      .where(eq(investigationTracks.campaignId, strahd.id))
      .limit(1);

    if (existingTracks.length === 0) {
      // Track 1: The Amber Temple
      const [track1] = await db
        .insert(investigationTracks)
        .values({
          campaignId: strahd.id,
          name: 'The Amber Temple',
          description:
            'Ancient secrets lie buried in the Amber Temple. Research its location and defenses.',
        })
        .returning();

      await db.insert(trackMilestones).values([
        {
          trackId: track1.id,
          title: 'Heard rumors of the temple',
          threshold: 3,
          description: 'Locals mention an ancient place of power in the mountains.',
        },
        {
          trackId: track1.id,
          title: 'Found a map fragment',
          threshold: 6,
          description: 'A partial map reveals the general location.',
        },
        {
          trackId: track1.id,
          title: 'Decoded the wards',
          threshold: 10,
          description: 'You understand the magical protections and can bypass them.',
        },
      ]);

      // Add some player progress
      const player1Id = await getUserIdByEmail('player1@test.local');
      const player2Id = await getUserIdByEmail('player2@test.local');
      await db.insert(playerTrackProgress).values([
        { playerId: player1Id, trackId: track1.id, progress: 5 },
        { playerId: player2Id, trackId: track1.id, progress: 2 },
      ]);

      // Track 2: Strahd's Weakness
      const [track2] = await db
        .insert(investigationTracks)
        .values({
          campaignId: strahd.id,
          name: "Strahd's Weakness",
          description:
            'Every vampire lord has a weakness. Discover what can be used against Strahd.',
        })
        .returning();

      await db.insert(trackMilestones).values([
        {
          trackId: track2.id,
          title: 'The Sunsword legend',
          threshold: 4,
          description: 'You learn of a legendary weapon that can harm Strahd.',
        },
        {
          trackId: track2.id,
          title: 'The Holy Symbol of Ravenkind',
          threshold: 8,
          description: 'An ancient holy relic that can turn undead.',
        },
      ]);

      await db.insert(playerTrackProgress).values([
        { playerId: player1Id, trackId: track2.id, progress: 4 },
      ]);

      console.log('  Created investigation tracks for Curse of Strahd');
    } else {
      console.log('  Investigation tracks already exist (skipped)');
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
