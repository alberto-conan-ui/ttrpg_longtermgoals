import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users, campaigns, campaignMembers } from './schema';
import { sql, eq } from 'drizzle-orm';

const DATABASE_URL = process.env['DATABASE_URL'];
if (!DATABASE_URL) {
  console.error('DATABASE_URL is required to run the seed script.');
  process.exit(1);
}

const client = postgres(DATABASE_URL);
const db = drizzle(client);

const seedUsers = [
  {
    email: 'dm-alice@test.local',
    username: 'dm_alice',
    displayName: 'Alice the DM',
    hashedPassword: 'seed-not-a-real-hash',
  },
  {
    email: 'dm-bob@test.local',
    username: 'dm_bob',
    displayName: 'Bob the DM',
    hashedPassword: 'seed-not-a-real-hash',
  },
  {
    email: 'dm-carol@test.local',
    username: 'dm_carol',
    displayName: 'Carol the DM',
    hashedPassword: 'seed-not-a-real-hash',
  },
  {
    email: 'player-dave@test.local',
    username: 'player_dave',
    displayName: 'Dave the Player',
    hashedPassword: 'seed-not-a-real-hash',
  },
  {
    email: 'player-eve@test.local',
    username: 'player_eve',
    displayName: 'Eve the Player',
    hashedPassword: 'seed-not-a-real-hash',
  },
  {
    email: 'player-frank@test.local',
    username: 'player_frank',
    displayName: 'Frank the Player',
    hashedPassword: 'seed-not-a-real-hash',
  },
  {
    email: 'player-grace@test.local',
    username: 'player_grace',
    displayName: 'Grace the Player',
    hashedPassword: 'seed-not-a-real-hash',
  },
  {
    email: 'player-hank@test.local',
    username: 'player_hank',
    displayName: 'Hank the Player',
    hashedPassword: 'seed-not-a-real-hash',
  },
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
    dmEmail: 'dm-alice@test.local',
    playerEmails: [
      'player-dave@test.local',
      'player-eve@test.local',
      'player-frank@test.local',
    ],
  },
  {
    name: 'Tomb of Annihilation',
    description:
      'A death-defying adventure through the jungles of Chult to stop the Soulmonger.',
    dmEmail: 'dm-bob@test.local',
    playerEmails: [
      'player-grace@test.local',
      'player-hank@test.local',
      'player-dave@test.local',
    ],
  },
  {
    name: 'Waterdeep Dragon Heist',
    description: 'Urban intrigue in the City of Splendors.',
    dmEmail: 'dm-alice@test.local',
    playerEmails: ['player-eve@test.local', 'player-hank@test.local'],
  },
];

async function seed() {
  console.log('Seeding database...');

  // --- Users ---
  for (const user of seedUsers) {
    await db
      .insert(users)
      .values(user)
      .onConflictDoUpdate({
        target: users.email,
        set: {
          displayName: sql`excluded.display_name`,
          username: sql`excluded.username`,
          updatedAt: sql`now()`,
        },
      });
    console.log(`  Upserted user: ${user.displayName} (${user.email})`);
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

  console.log('Seed complete.');
  await client.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
