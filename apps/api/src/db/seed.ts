import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users } from './schema';
import { sql } from 'drizzle-orm';

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

async function seed() {
  console.log('Seeding database...');

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

  console.log('Seed complete.');
  await client.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
