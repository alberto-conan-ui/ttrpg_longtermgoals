import {
  pgTable,
  text,
  timestamp,
  uuid,
  jsonb,
  pgEnum,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { campaigns } from './campaigns';
import { campaignParts, campaignSessions } from './parts';
import { users } from './users';

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------
export const loreScopeEnum = pgEnum('lore_scope', ['story', 'private']);

export const loreVisibilityEnum = pgEnum('lore_visibility', [
  'private',
  'shared',
  'public',
]);

// ---------------------------------------------------------------------------
// Lore Fragments
// ---------------------------------------------------------------------------
export const loreFragments = pgTable('lore_fragments', {
  id: uuid('id').defaultRandom().primaryKey(),
  campaignId: uuid('campaign_id')
    .notNull()
    .references(() => campaigns.id, { onDelete: 'cascade' }),
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  contentJson: jsonb('content_json'),
  scope: loreScopeEnum('scope').default('private').notNull(),
  visibility: loreVisibilityEnum('visibility').default('private').notNull(),
  // Polymorphic attachment — exactly one non-null, or all null for campaign-level
  partId: uuid('part_id').references(() => campaignParts.id, {
    onDelete: 'cascade',
  }),
  sessionId: uuid('session_id').references(() => campaignSessions.id, {
    onDelete: 'cascade',
  }),
  playerId: uuid('player_id').references(() => users.id, {
    onDelete: 'set null',
  }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const loreFragmentsRelations = relations(
  loreFragments,
  ({ one, many }) => ({
    campaign: one(campaigns, {
      fields: [loreFragments.campaignId],
      references: [campaigns.id],
    }),
    owner: one(users, {
      fields: [loreFragments.ownerId],
      references: [users.id],
      relationName: 'ownedLoreFragments',
    }),
    part: one(campaignParts, {
      fields: [loreFragments.partId],
      references: [campaignParts.id],
    }),
    session: one(campaignSessions, {
      fields: [loreFragments.sessionId],
      references: [campaignSessions.id],
    }),
    player: one(users, {
      fields: [loreFragments.playerId],
      references: [users.id],
      relationName: 'playerProfileLoreFragments',
    }),
    shares: many(loreFragmentShares),
  }),
);

// ---------------------------------------------------------------------------
// Lore Fragment Shares
// ---------------------------------------------------------------------------
export const loreFragmentShares = pgTable(
  'lore_fragment_shares',
  {
    fragmentId: uuid('fragment_id')
      .notNull()
      .references(() => loreFragments.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.fragmentId, t.userId] })],
);

export const loreFragmentSharesRelations = relations(
  loreFragmentShares,
  ({ one }) => ({
    fragment: one(loreFragments, {
      fields: [loreFragmentShares.fragmentId],
      references: [loreFragments.id],
    }),
    user: one(users, {
      fields: [loreFragmentShares.userId],
      references: [users.id],
    }),
  }),
);

export type LoreFragment = typeof loreFragments.$inferSelect;
export type NewLoreFragment = typeof loreFragments.$inferInsert;
export type LoreFragmentShare = typeof loreFragmentShares.$inferSelect;
export type NewLoreFragmentShare = typeof loreFragmentShares.$inferInsert;
